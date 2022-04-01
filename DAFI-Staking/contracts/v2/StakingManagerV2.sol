// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
// import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
// import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "./interfaces/IStakingManager.sol";
import "./TokenPool.sol";
import "./interfaces/IPriceFeeds.sol";
import "./StakingDatabase.sol";
import "./interfaces/IRebaseEngine.sol";
import "./interfaces/INetworkDemand.sol";

contract StakingManagerV2 is IStakingManager, Ownable, ReentrancyGuard {

    IERC20 public immutable stakingToken;
    StakingDatabase private database;
    IRebaseEngine private rebaseEngine;
    INetworkDemand private networkDemand;

    TokenPool private stakingPool;
    TokenPool private distributionPool;

    bool public STAKING_ON;
    bool UNSTAKING_ON;

    event STAKED(address user, uint amount, uint timestamp, uint currentlStakedAmount, uint lastAccumulatedPoolWeight, uint totalUnclaimed);
    event UNSTAKED(address user, uint amount, uint timestamp, uint currentlStakedAmount, uint lastAccumulatedPoolWeight, uint totalUnclaimed);
    event REWARD_DISBURSED(address user, uint amount, uint timestamp, uint currentlStakedAmount, uint lastAccumulatedPoolWeight, uint totalUnclaimed);

    bool INITIALIZED;

    modifier stakeChecks(address user, uint amount) {
        require(STAKING_ON, "Staking is not allowed right now");
        require(amount > 0, "Invalid amount to stake");
        if (!database.userExists(user)) {// If new user then apply the minimum stake amount rule
            require(amount >= database.getMinimumStakeAmount(), "Please try a higher value to stake");
        }
        _;
    }

    modifier unstakeAndClaimChecks() {
        require(UNSTAKING_ON, "Reward claiming is not allowed right now");
        require(database.userExists(msg.sender), "Invalid User");
        require(block.timestamp - database.getUserStake(msg.sender).createdOn >= database.getMinimumStakePeriod(), "Minimum staking period not completed");

        _;
    }

    // instrumentation in the constructor
    constructor(IERC20 _stakingToken, StakingDatabase _database, IRebaseEngine _rebaseEngine, INetworkDemand _networkDemand, TokenPool _distributionPool) {
        
        stakingToken = _stakingToken;

        database = _database;
        rebaseEngine = _rebaseEngine;
        networkDemand = _networkDemand;
        stakingPool = new TokenPool(_stakingToken);
        stakingPool.addWhitelist(address(this));
        distributionPool = _distributionPool;
    }

    function initialize(StakingDatabase _database, IRebaseEngine _rebaseEngine, INetworkDemand _networkDemand, TokenPool _distributionPool,
        uint _minimumStakeDays, uint _minimumStakeAmount, uint _maxDAFI, uint8 _rewardFee, uint durationInDays) external onlyOwner {

        require(!INITIALIZED, "Staking manager can only be initialized once");

        database = _database;
        stakingPool = new TokenPool(stakingToken);
        stakingPool.addWhitelist(address(this));
        distributionPool = _distributionPool;
        rebaseEngine = _rebaseEngine;
        networkDemand = _networkDemand;
        database.setStakingParams(_minimumStakeDays, _minimumStakeAmount, _maxDAFI, _rewardFee, durationInDays);

        INITIALIZED = true;
    }

    function stake(uint amount) external override nonReentrant stakeChecks(msg.sender, amount) {
        rebaseEngine.rebase(msg.sender);
        // Must execute before stake, unstake and claim

        _stake(msg.sender, amount);

        Stake memory _userStake = database.getUserStake(msg.sender);

        emit STAKED(msg.sender, amount, block.timestamp, _userStake.amount, _userStake.lastStakingAccumulatedWeight,  _userStake.totalUnclaimed);
    }

    function stakeFor(address user, uint amount) external override nonReentrant stakeChecks(user, amount) {
        require(user != address(0));
        rebaseEngine.rebase(user);
        // Must execute before stake, unstake and claim

        _stake(user, amount);

        Stake memory _userStake = database.getUserStake(user);

        emit STAKED(user, amount, block.timestamp, _userStake.amount, _userStake.lastStakingAccumulatedWeight, _userStake.totalUnclaimed);
    }

    function unstake(uint amount) external override nonReentrant unstakeAndClaimChecks {
        uint totalStakedByUser = database.totalStakedFor(msg.sender);

        require(amount <= totalStakedByUser, "Invalid amount");

        rebaseEngine.rebase(msg.sender);
        // Must execute before stake, unstake and claim

        _computeAndDisburseRewards(msg.sender, false, 0);
        _unstake(msg.sender, amount);
        stakingPool.transfer(msg.sender, amount);

        Stake memory _userStake = database.getUserStake(msg.sender);

        emit UNSTAKED(msg.sender, amount, block.timestamp, _userStake.amount, _userStake.lastStakingAccumulatedWeight, _userStake.totalUnclaimed);
    }

    function claimRewards(bool partialClaim, uint amount) external override nonReentrant unstakeAndClaimChecks {
        rebaseEngine.rebase(msg.sender);
        // Must execute before stake, unstake and claim

        uint rewardDisbursed = _computeAndDisburseRewards(msg.sender, partialClaim, amount);

        Stake memory userStake = database.getUserStake(msg.sender);

        emit REWARD_DISBURSED(msg.sender, rewardDisbursed, block.timestamp, userStake.amount, userStake.lastStakingAccumulatedWeight,
            userStake.totalUnclaimed);
    }

    function enableStaking() external onlyOwner {
        STAKING_ON = true;
    }

    function disableStaking() external onlyOwner {
        STAKING_ON = false;
    }

    function enableUnstaking() external onlyOwner {
        UNSTAKING_ON = true;
    }

    function disableUnstaking() external onlyOwner {
        UNSTAKING_ON = false;
    }

    function updateMinimumStakingPeriod(uint noOfDays) external onlyOwner {
        database.setMinimumStakePeriod(noOfDays * 1 days);
    }

    function updateMinimumStakingAmount(uint amount) external onlyOwner {
        database.setMinimumStakeAmount(amount);
    }

    function updateProgramDuration(uint _newDurationInDays) external onlyOwner {
        database.setProgramDuration(_newDurationInDays * 1 days);
    }

    function extendProgram(uint _newDurationInDays, uint _maxDAFI) external onlyOwner {
        // Rebasing the pool before extending the program to make
        // sure users get rewards based on old paramaeters till this time
        rebaseEngine.rebasePool();

        database.setProgramDuration(_newDurationInDays * 1 days);
        database.setMaxDAFI(_maxDAFI);
    }

    function updateRewardFees(uint8 newPercentage) external onlyOwner {
        require(newPercentage <= 100, "Percentage should be less than or equal to 100");
        database.setRewardFee(newPercentage);
    }

    function updateMaxDAFI(uint maxDAFI) external onlyOwner {
        database.setMaxDAFI(maxDAFI);
    }

    function updateNetworkDemand(INetworkDemand _networkDemand) external onlyOwner {
        networkDemand = _networkDemand;
    }

    function updateRebaseEngine(IRebaseEngine _rebaseEngine) external onlyOwner {
        rebaseEngine = _rebaseEngine;
    }

    function updateDistributionPool(TokenPool _pool) external onlyOwner {
        distributionPool = _pool;
    }

    function getProgramDuration() external view returns (uint) {
        return database.getProgramDuration() / 1 days;
    }

    function endProgram() external onlyOwner {
        require(!database.isProgramEnded(), "Program is already ended");

        STAKING_ON = false;
        database.markProgramEnded();
    }

    function _stake(address user, uint amount) internal {
        require(stakingToken.transferFrom(msg.sender, address(stakingPool), amount),
            "Transfer to staking manager failed");
        database.addStake(user, amount);
        database.addPoolTotalStaked(amount);
    }

    function _computeAndDisburseRewards(address user, bool partialClaim, uint amount) internal returns (uint){

        Stake memory userStake = database.getUserStake(user);

        uint rewards = userStake.totalUnclaimed;
        uint rewardsBeingClaimed;

        if (partialClaim) {
            require(amount <= rewards, "Insufficient reward balance");
            rewardsBeingClaimed = amount;
        } else {
            rewardsBeingClaimed = rewards;
        }

        uint rewardDF = (rewardsBeingClaimed * networkDemand.calculateNetworkDemand()) / 100000000;

        uint rewardPlusFeeBal = rewardDF + userStake.feeBalance;

        database.markRewardsClaimed(user, rewardsBeingClaimed);

        uint fee = rewardPlusFeeBal * database.getRewardFee() / 100;

        uint rewardToDisburse = rewardPlusFeeBal - fee;

        database.addToFeesDeposited(fee);
        database.addTodDAFIBurned(rewardDF);

        if (rewardToDisburse > 0) {
            distributionPool.transfer(user, rewardToDisburse);
        }

        return rewardToDisburse;
    }

    function _unstake(address user, uint unStakingAmount) internal {

        Stake memory userStake = database.getUserStake(user);

        database.subPoolTotalStaked(unStakingAmount);
        database.updateStakeAmount(user, userStake.amount - unStakingAmount);
    }
}