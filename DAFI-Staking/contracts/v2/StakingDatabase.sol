// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
// import "openzeppelin-solidity/contracts/access/Ownable.sol";

    struct DemandFactor {
        uint value;
        uint timestamp;
    }

    struct Stake {
        uint amount;
        uint createdOn;
        uint lastUpdatedOn;
        uint lastStakingAccumulatedWeight;
        uint totalUnclaimed;
        uint lastAccumulatedFeeWeight;
        uint feeBalance;
    }

    struct Pool {
        uint currentAccumulatedWeight;
        uint totalStaked;
        uint lastUpdatedOn;
        uint lastDemandFactor;
        uint currentPoolWeight;
        uint accumulatedFeeWeight;
        uint currentFeeWeight;
    }

contract StakingDatabase is Ownable{

    mapping(address => bool) public whitelists; // The accounts which can access this database

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], "Not authoriused to access the database");
        _;
    }

    mapping(address => Stake) public userStakes;

    address[] stakers;

    DemandFactor[] public demandFactorHistory;
    Pool private pool;

    uint MAX_DAFI; // The maximum DAFI allotment for reward distribution
    uint dDAFIBurned; // dDAFI already claimed by users
    uint feesDeposited;
    uint8 REWARD_FEE;
    uint minimumStakeAmount;
    uint minimumStakePeriod;
    uint stakingStartTime;
    uint programDuration;
    uint dDAFIDistributed; // It will hold the most recent value of dDAFI distributed
    uint distributePerSecond; // It will hold the most recent value of dDAFI to be distributed per second
    bool programEnded;
    uint programEndedAt;
    uint totalStakedSinceLastClaim;

    function setStakingParams(uint _minimumStakeDays, uint _minimumStakeAmount, uint _maxDAFI, uint8 _rewardFee, uint durationInDays) external onlyWhitelist {
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

    function getProgramEndedAt() external view returns(uint) {
        return programEndedAt;
    }

    function isProgramEnded() external view onlyWhitelist returns(bool) {
        return programEnded;
    }

    function addDemandFactor(uint _value, uint _timestamp) external onlyWhitelist {
        DemandFactor memory df = DemandFactor(_value, _timestamp);
        demandFactorHistory.push(df);
    }

    function addAccumulatedWeight(uint _currentPoolWeight, uint _currentFeeWeight) external onlyWhitelist {
        pool.lastUpdatedOn = block.timestamp;
        pool.currentAccumulatedWeight = pool.currentAccumulatedWeight + _currentPoolWeight;
        pool.currentPoolWeight = _currentPoolWeight;
        pool.accumulatedFeeWeight = pool.accumulatedFeeWeight + _currentFeeWeight;
        pool.currentFeeWeight = _currentFeeWeight;
    }

    function getAccumulatedPoolWeight() external view onlyWhitelist returns (uint){
        return pool.currentAccumulatedWeight;
    }

    function getAccumulatedFeeWeight() external view onlyWhitelist returns(uint) {
        return pool.accumulatedFeeWeight;
    }

    function getPoolLastUpdatedOn() external view onlyWhitelist returns (uint){
        return pool.lastUpdatedOn;
    }

    function setdDAFIDistributed(uint _distributed) external onlyWhitelist {
        dDAFIDistributed = _distributed;
    }

    function getdDAFIDistributed() external view returns(uint){
        return dDAFIDistributed;
    }

    function setDistributePerSecond(uint _distributePerSec) external onlyWhitelist {
        distributePerSecond = _distributePerSec;
    }

    function getDistributePerSecond() external view returns (uint) {
        return distributePerSecond;
    }

    function addStake(address user, uint amount) external onlyWhitelist {
        Stake storage stake = userStakes[user];

        if(stake.createdOn == 0) {
            stake.createdOn = block.timestamp;
            stakers.push(user);
        }

        stake.amount += amount;
    }

    function updateUserStake(address user, uint newReward, uint currentAccumulatedWeight, uint newFee, uint currentAccumulatedFeeWeight) external onlyWhitelist {
        Stake storage stake = userStakes[user];
        stake.lastStakingAccumulatedWeight = currentAccumulatedWeight;
        stake.totalUnclaimed += newReward;
        stake.lastUpdatedOn = block.timestamp;
        stake.feeBalance += newFee;
        stake.lastAccumulatedFeeWeight = currentAccumulatedFeeWeight;
    }

    function updateStakeAmount(address user, uint amount) external onlyWhitelist{
        Stake storage stake = userStakes[user];
        stake.amount = amount;
    }

    function addPoolTotalStaked(uint amountToAdd) external onlyWhitelist{
        pool.totalStaked = pool.totalStaked + amountToAdd;
    }

    function subPoolTotalStaked(uint amountToSub) external onlyWhitelist{
        pool.totalStaked = pool.totalStaked - amountToSub;
    }

    function getPool() external view returns (Pool memory) {
        return pool;
    }

    function getUserStake(address user) external view returns(Stake memory){
        return userStakes[user];
    }

    function markRewardsClaimed(address user, uint rewardsBeingClaimed) external onlyWhitelist {
        Stake storage stake = userStakes[user];
        stake.totalUnclaimed = stake.totalUnclaimed - rewardsBeingClaimed;
        stake.lastStakingAccumulatedWeight = pool.currentAccumulatedWeight;
        stake.feeBalance = 0;
    }

    function getDemandFactor(uint index) external view onlyWhitelist returns(DemandFactor memory) {
        return demandFactorHistory[index];
    }

    function setMaxDAFI(uint amount) public onlyWhitelist{
        MAX_DAFI = amount;
    }

    function getMaxDAFI() external view returns(uint){
        return MAX_DAFI;
    }

    function addTodDAFIBurned(uint amount) external onlyWhitelist {
        dDAFIBurned = dDAFIBurned + amount;
    }

    function getdDAFIBurned() external view returns(uint) {
        return dDAFIBurned;
    }

    function addToFeesDeposited(uint amount) external onlyWhitelist {
        feesDeposited = feesDeposited + amount;
    }

    function getFeesDeposited() external view returns(uint) {
        return feesDeposited;
    }

    function setFeesDeposited(uint _feesDeposited) external onlyWhitelist {
        feesDeposited = _feesDeposited;
    }

    function setRewardFee(uint8 percentage) public onlyWhitelist {
        REWARD_FEE = percentage;
    }

    function getRewardFee() external view returns(uint8) {
        return REWARD_FEE;
    }

    function getDemandFactorLastest() public view returns(DemandFactor memory){
        return demandFactorHistory[demandFactorHistory.length -1];
    }

    function getUserCount() external view returns(uint) {
        return stakers.length;
    }

    function totalStakedFor(address addr) external view returns (uint256) {
        return userStakes[addr].amount;
    }

    function getTotalStaked() external view returns(uint) {
        return pool.totalStaked;
    }

    function addWhitelist(address account) external onlyOwner {
        require(account != address(0));
        whitelists[account] = true;
    }

    function getMinimumStakeAmount() external view returns(uint) {
        return minimumStakeAmount;
    }

    function setMinimumStakeAmount(uint _minimumStakeAmount) onlyWhitelist public {
        minimumStakeAmount = _minimumStakeAmount;
    }

    function getMinimumStakePeriod() external view returns(uint) {
        return minimumStakePeriod;
    }

    function setMinimumStakePeriod(uint _minimumStakePeriod) onlyWhitelist public {
        minimumStakePeriod = _minimumStakePeriod;
    }

    function userExists(address user) external view returns(bool) {
        return userStakes[user].createdOn > 0 ? true : false;
    }

    function setStakingStartTime() public onlyWhitelist{
        stakingStartTime = block.timestamp;
    }

    function getStakingStartTime() external view returns(uint){
        return stakingStartTime;
    }

    function setProgramDuration(uint _duration) public onlyWhitelist{
        programDuration = _duration;
    }

    function getProgramDuration() external view returns (uint) {
        return programDuration;
    }

    function removeWhitelist(address account) external onlyOwner {
        require(account != address(0));
        require(whitelists[account], "Account doesnt exist in whitelist");
        whitelists[account] = false;
    }
}