// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import '/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/access/Ownable.sol';
// import "openzeppelin-solidity/contracts/access/Ownable.sol";
import '../interfaces/IRebaseEngine.sol';
import '../interfaces/INetworkDemand.sol';
import '../StakingDatabase.sol';

// import "../../blockapex/dapping/lib/ds-test/src/test.sol";

contract RebaseEngine is IRebaseEngine, Ownable {
    INetworkDemand public networkDemand;
    StakingDatabase public database;

    uint256 constant EIGHT_DECIMALS = 100000000;
    bool INITIALIZED;

    mapping(address => bool) public whitelists; // The accounts which can access this Rebase Engine

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], 'Not authoriused to access the rebase engine');
        _;
    }

    function initialize(INetworkDemand _networkDemand, StakingDatabase _database) external onlyOwner {
        require(!INITIALIZED, 'Rebase Engine already initialized');
        networkDemand = _networkDemand;
        database = _database;
        INITIALIZED = true;
    }

    constructor(StakingDatabase _db) {
        database = _db;
    }

    function updateNetworkDemand(INetworkDemand _networkDemand) external onlyWhitelist {
        networkDemand = _networkDemand;
    }

    function updateDatabase(StakingDatabase _database) external onlyWhitelist {
        database = _database;
    }

    /*
     * This method rebases the pool as well as the user's stake
     */
    function rebase(address user) external override onlyWhitelist {
        _rebasePool();
        _rebaseStake(user);
    }

    function rebasePool() external override onlyWhitelist {
        _rebasePool();
    }

    /*
     * This method calculates pool weight from the last time it got updated to the current time
     */
    uint256 public MAX_DAFI;
    uint256 public totaldDAFIDistributed;
    event Property1Log(string, uint256, uint256);

    uint256 public currentFeeWeight;
    uint256 public currentPoolWeight;

    function _rebasePool() internal {
        Pool memory pool = database.getPool();
        uint256 maxTimestampForCalc;

        uint256 programEndedAt = database.getStakingStartTime() + database.getProgramDuration() - 1;

        if (pool.lastUpdatedOn >= programEndedAt) {
            return;
        } else if (pool.lastUpdatedOn < programEndedAt && block.timestamp > programEndedAt) {
            maxTimestampForCalc = programEndedAt;
        } else {
            maxTimestampForCalc = block.timestamp;
        }

        emit Property1Log(
            'The check fails at ProgDur being less than the difference',
            database.getProgramDuration(),
            (maxTimestampForCalc - database.getStakingStartTime())
        );
        assert(database.getProgramDuration() >= (maxTimestampForCalc - database.getStakingStartTime()));

        uint256 elapsedTime = pool.lastUpdatedOn == 0 ? 0 : maxTimestampForCalc - pool.lastUpdatedOn;

        MAX_DAFI = database.getMaxDAFI();

        uint256 MDI = MAX_DAFI / database.getProgramDuration();

        uint256 dDAFIDistributedCurrent = MDI * elapsedTime;

        totaldDAFIDistributed = database.getdDAFIDistributed() + dDAFIDistributedCurrent;

        database.setdDAFIDistributed(totaldDAFIDistributed);

        uint256 MDICurrent = (MAX_DAFI - totaldDAFIDistributed) /
            (database.getProgramDuration() - (maxTimestampForCalc - database.getStakingStartTime()));

        database.setDistributePerSecond(MDICurrent);

        uint256 totalStaked = database.getTotalStaked();

        currentPoolWeight = totalStaked > 0 ? ((MDICurrent * elapsedTime * EIGHT_DECIMALS) / totalStaked) : 0;

        currentFeeWeight = totalStaked > 0 ? ((database.getFeesDeposited() * EIGHT_DECIMALS) / totalStaked) : 0;

        database.setFeesDeposited(0); // Setting it zero as fees deposited is incorporated in Fee Weight

        database.addAccumulatedWeight(currentPoolWeight, currentFeeWeight);
    }

    /*
     * This method calculates the user reward generated till now based on current accumulated pool weight and user staked amount
     */
    function _rebaseStake(address user) internal {
        Stake memory stake = database.getUserStake(user);

        uint256 currentAccumulatedWeight = database.getAccumulatedPoolWeight();
        uint256 lastAccumulatedWeight = stake.lastStakingAccumulatedWeight;

        uint256 newReward = ((currentAccumulatedWeight - lastAccumulatedWeight) * (stake.amount)) / EIGHT_DECIMALS;

        uint256 currentAccumulatedFeeWeight = database.getAccumulatedFeeWeight();
        uint256 lastAccumulatedFeeWeight = stake.lastAccumulatedFeeWeight;

        uint256 newFee = ((currentAccumulatedFeeWeight - lastAccumulatedFeeWeight) * stake.amount) / EIGHT_DECIMALS;

        database.updateUserStake(user, newReward, currentAccumulatedWeight, newFee, currentAccumulatedFeeWeight);
    }

    function addWhitelist(address account) external onlyOwner {
        require(account != address(0));
        whitelists[account] = true;
    }

    function removeWhitelist(address account) external onlyOwner {
        require(account != address(0));
        require(whitelists[account], 'Account doesnt exist in whitelist');
        whitelists[account] = false;
    }
}
