// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import 'openzeppelin-solidity/contracts/access/Ownable.sol';

struct DemandFactor {
    uint256 value;
    uint256 timestamp;
}

struct Stake {
    uint256 amount;
    uint256 createdOn;
    uint256 lastUpdatedOn;
    uint256 lastStakingAccumulatedWeight;
    uint256 totalUnclaimed;
    uint256 lastDemandFactor;
}

struct Pool {
    uint256 currentAccumulatedWeight;
    uint256 totalStaked;
    uint256 lastUpdatedOn;
    uint256 lastDemandFactor;
    uint256 currentPoolWeight;
}

contract StakingDatabase is Ownable {
    mapping(address => bool) public whitelists; // The accounts which can access this database

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], 'Not authoriused to access the database');
        _;
    }

    mapping(address => Stake) public userStakes;

    address[] stakers;

    DemandFactor[] public demandFactorHistory;
    Pool private pool;

    uint256 MAX_DAFI; // The maximum DAFI allotment for reward distribution
    uint256 dDAFIBurned; // dDAFI already claimed by users
    uint256 feesDeposited;
    uint8 REWARD_FEE;
    uint256 minimumStakeAmount;
    uint256 minimumStakePeriod;
    uint256 stakingStartTime;
    uint256 programDuration;
    uint256 dDAFIDistributed; // It will hold the most recent value of dDAFI distributed
    uint256 distributePerSecond; // It will hold the most recent value of dDAFI to be distributed per second
    bool programEnded;
    uint256 programEndedAt;

    function setStakingParams(
        uint256 _minimumStakeDays,
        uint256 _minimumStakeAmount,
        uint256 _maxDAFI,
        uint8 _rewardFee,
        uint256 durationInDays
    ) external onlyWhitelist {
        setMinimumStakePeriod(_minimumStakeDays * 1 days);
        setStakingStartTime();
        setMinimumStakeAmount(_minimumStakeAmount);
        setMaxDAFI(_maxDAFI);
        setRewardFee(_rewardFee);
        setProgramDuration(durationInDays * 1 days);
    }

    function markProgramEnded() external onlyWhitelist {
        programEnded = true;
        programEndedAt = block.timestamp;
    }

    function getProgramEndedAt() external view returns (uint256) {
        return programEndedAt;
    }

    function isProgramEnded() external view onlyWhitelist returns (bool) {
        return programEnded;
    }

    function addDemandFactor(uint256 _value, uint256 _timestamp) external onlyWhitelist {
        DemandFactor memory df = DemandFactor(_value, _timestamp);
        demandFactorHistory.push(df);
    }

    function addAccumulatedPoolWeight(uint256 _currentWeight) external onlyWhitelist {
        pool.currentAccumulatedWeight = pool.currentAccumulatedWeight + _currentWeight;
        pool.lastDemandFactor = getDemandFactorLastest().value;
        pool.lastUpdatedOn = block.timestamp;
        pool.currentPoolWeight = _currentWeight;
    }

    function getAccumulatedPoolWeight() external view onlyWhitelist returns (uint256) {
        return pool.currentAccumulatedWeight;
    }

    function getPoolLastUpdatedOn() external view onlyWhitelist returns (uint256) {
        return pool.lastUpdatedOn;
    }

    function setdDAFIDistributed(uint256 _distributed) external onlyWhitelist {
        dDAFIDistributed = _distributed;
    }

    function getdDAFIDistributed() external view returns (uint256) {
        return dDAFIDistributed;
    }

    function setDistributePerSecond(uint256 _distributePerSec) external onlyWhitelist {
        distributePerSecond = _distributePerSec;
    }

    function getDistributePerSecond() external view returns (uint256) {
        return distributePerSecond;
    }

    function addStake(address user, uint256 amount) external onlyWhitelist {
        Stake storage stake = userStakes[user];

        if (stake.createdOn == 0) {
            stake.createdOn = block.timestamp;
            stakers.push(user);
        }

        stake.amount += amount;
    }

    function updateUserStake(
        address user,
        uint256 newReward,
        uint256 lastDemandFactor,
        uint256 currentAccumulatedWeight
    ) external onlyWhitelist {
        Stake storage stake = userStakes[user];
        stake.lastStakingAccumulatedWeight = currentAccumulatedWeight;
        stake.lastDemandFactor = lastDemandFactor;
        stake.totalUnclaimed += newReward;
        stake.lastUpdatedOn = block.timestamp;
    }

    function updateStakeAmount(address user, uint256 amount) external onlyWhitelist {
        Stake storage stake = userStakes[user];
        stake.amount = amount;
    }

    function addPoolTotalStaked(uint256 amountToAdd) external onlyWhitelist {
        pool.totalStaked = pool.totalStaked + amountToAdd;
    }

    function subPoolTotalStaked(uint256 amountToSub) external onlyWhitelist {
        pool.totalStaked = pool.totalStaked - amountToSub;
    }

    function getPool() external view returns (Pool memory) {
        return pool;
    }

    function getUserStake(address user) external view returns (Stake memory) {
        return userStakes[user];
    }

    function markRewardsClaimed(address user, uint256 rewardsBeingClaimed) external onlyWhitelist {
        Stake storage stake = userStakes[user];
        stake.totalUnclaimed = stake.totalUnclaimed - rewardsBeingClaimed;
        stake.lastStakingAccumulatedWeight = pool.currentAccumulatedWeight;
    }

    function getDemandFactor(uint256 index) external view onlyWhitelist returns (DemandFactor memory) {
        return demandFactorHistory[index];
    }

    function setMaxDAFI(uint256 amount) public onlyWhitelist {
        MAX_DAFI = amount;
    }

    function getMaxDAFI() external view returns (uint256) {
        return MAX_DAFI;
    }

    function addTodDAFIBurned(uint256 amount) external onlyWhitelist {
        dDAFIBurned = dDAFIBurned + amount;
    }

    function getdDAFIBurned() external view returns (uint256) {
        return dDAFIBurned;
    }

    function addToFeesDeposited(uint256 amount) external onlyWhitelist {
        feesDeposited = feesDeposited + amount;
    }

    function getFeesDeposited() external view returns (uint256) {
        return feesDeposited;
    }

    function setRewardFee(uint8 percentage) public onlyWhitelist {
        REWARD_FEE = percentage;
    }

    function getRewardFee() external view returns (uint8) {
        return REWARD_FEE;
    }

    function getDemandFactorLastest() public view returns (DemandFactor memory) {
        return demandFactorHistory[demandFactorHistory.length - 1];
    }

    function getUserCount() external view returns (uint256) {
        return stakers.length;
    }

    function totalStakedFor(address addr) external view returns (uint256) {
        return userStakes[addr].amount;
    }

    function getTotalStaked() external view returns (uint256) {
        return pool.totalStaked;
    }

    function addWhitelist(address account) external onlyOwner {
        require(account != address(0));
        whitelists[account] = true;
    }

    function getMinimumStakeAmount() external view returns (uint256) {
        return minimumStakeAmount;
    }

    function setMinimumStakeAmount(uint256 _minimumStakeAmount) public onlyWhitelist {
        minimumStakeAmount = _minimumStakeAmount;
    }

    function getMinimumStakePeriod() external view returns (uint256) {
        return minimumStakePeriod;
    }

    function setMinimumStakePeriod(uint256 _minimumStakePeriod) public onlyWhitelist {
        minimumStakePeriod = _minimumStakePeriod;
    }

    function userExists(address user) external view returns (bool) {
        return userStakes[user].createdOn > 0 ? true : false;
    }

    function setStakingStartTime() public onlyWhitelist {
        stakingStartTime = block.timestamp;
    }

    function getStakingStartTime() external view returns (uint256) {
        return stakingStartTime;
    }

    function setProgramDuration(uint256 _duration) public onlyWhitelist {
        programDuration = _duration;
    }

    function getProgramDuration() external view returns (uint256) {
        return programDuration;
    }

    function removeWhitelist(address account) external onlyOwner {
        require(account != address(0));
        require(whitelists[account], 'Account doesnt exist in whitelist');
        whitelists[account] = false;
    }
}
