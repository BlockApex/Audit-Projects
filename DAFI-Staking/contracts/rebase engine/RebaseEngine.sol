// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../interfaces/IRebaseEngine.sol";
import "../interfaces/INetworkDemand.sol";
import "../StakingDatabase.sol";

contract RebaseEngine is IRebaseEngine, Ownable {

    INetworkDemand public networkDemand;
    StakingDatabase public database;

    uint constant EIGHT_DECIMALS = 100000000;
    bool INITIALIZED;

    mapping(address => bool) public whitelists; // The accounts which can access this Rebase Engine

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], "Not authoriused to access the rebase engine");
        _;
    }

    function initialize(INetworkDemand _networkDemand, StakingDatabase _database) external onlyOwner{
        require(!INITIALIZED, "Rebase Engine already initialized");
        networkDemand = _networkDemand;
        database = _database;
        INITIALIZED = true;
    }

    function updateNetworkDemand(INetworkDemand _networkDemand) external onlyWhitelist{
        networkDemand = _networkDemand;
    }

    function updateDatabase(StakingDatabase _database) external onlyWhitelist{
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
    function _rebasePool() internal {

        Pool memory pool = database.getPool();
        uint maxTimestampForCalc;

        if(database.isProgramEnded() && pool.lastUpdatedOn > database.getProgramEndedAt()){
            return;
        } else if(database.isProgramEnded() && pool.lastUpdatedOn < database.getProgramEndedAt()) {
            maxTimestampForCalc = database.getProgramEndedAt();
        }else{
            maxTimestampForCalc = block.timestamp;
        }

        uint demandFactorNew = networkDemand.calculateNetworkDemand();

        database.addDemandFactor(demandFactorNew, maxTimestampForCalc);

        uint MAX_DAFI = database.getMaxDAFI();

        // It calcultes the rewards already distributed(claimed + unclaimed) since the start of staking program
        uint dDAFIDistributed = (MAX_DAFI * (maxTimestampForCalc - database.getStakingStartTime())) / database.getProgramDuration();

        database.setdDAFIDistributed(dDAFIDistributed);

        //Neutralizing the demand factor which was multiplied to fees deposited while calculating the rewards
        uint feesDeposited = database.getFeesDeposited() == 0 || pool.lastDemandFactor == 0 ? 0
        : (database.getFeesDeposited() * EIGHT_DECIMALS) / pool.lastDemandFactor;

        uint poolCurrent = ((MAX_DAFI - dDAFIDistributed + feesDeposited) * demandFactorNew);

        uint distributePerSecond = poolCurrent / database.getProgramDuration();

        database.setDistributePerSecond(distributePerSecond);

        uint elapsedTime = pool.lastUpdatedOn == 0 ? 0 : maxTimestampForCalc - pool.lastUpdatedOn;

        uint totalStaked = database.getTotalStaked();

        uint fixNum = 36679286115784269180494 - 5578883;

        if(database.getAccumulatedPoolWeight() == 0){
            database.addAccumulatedPoolWeight(fixNum);
        }

        uint currentPoolWeight = totalStaked > 0 ? (distributePerSecond * elapsedTime)/ totalStaked : 0;

        database.addAccumulatedPoolWeight(currentPoolWeight);
    }

    /*
    * This method calculates the user reward generated till now based on current accumulated pool weight and user staked amount
    */
    function _rebaseStake(address user) internal {

        Stake memory stake = database.getUserStake(user);

        uint currentAccumulatedWeight = database.getAccumulatedPoolWeight();

        uint fixNum = 36679286115784269180494 - 5578883;

        uint lastAccumulatedWeight = stake.lastStakingAccumulatedWeight;

        uint256 distributedAmount = ((currentAccumulatedWeight - fixNum - lastAccumulatedWeight) * (stake.amount)) / EIGHT_DECIMALS;

        database.updateUserStake(user, distributedAmount, database.getDemandFactorLastest().value, currentAccumulatedWeight);
    }

    function addWhitelist(address account) external onlyOwner {
        require(account != address(0));
        whitelists[account] = true;
    }

    function removeWhitelist(address account) external onlyOwner {
        require(account != address(0));
        require(whitelists[account], "Account doesnt exist in whitelist");
        whitelists[account] = false;
    }
}