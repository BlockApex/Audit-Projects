// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.0;

import './SetupToken.sol';
import '../../../contracts/v2/rebase engine/RebaseEngine.sol';
import '../../../contracts/v2/network demand/NetworkDemand.sol';
import '/home/jariruddin/BlockApex-Linux/dDAFI-testing/contracts/v2/StakingManagerV2.sol';
// import '../../../contracts/v2/StakingManagerV2.sol';

contract SetupContracts {
    PriceFeed public priceFeed;
    TVLFeed public tvlFeed;

    TestERC20 token;

    NetworkDemand public networkDemand;
    StakingDatabase public database;
    RebaseEngine public rebaseEngine;
    StakingManagerV2 public stakingManager;
    TokenPool public distPool;

    constructor(TestERC20 _token) {
        token = _token;
        initAll();
        whiteListing();
        enableAndApprove();
    }

    /**================================== SETUP ==================================*/

    function initAll() internal {
        priceFeed = new PriceFeed();
        tvlFeed = new TVLFeed();

        distPool = new TokenPool(token);
        networkDemand = new NetworkDemand(token, priceFeed, tvlFeed);
        database = new StakingDatabase();
        rebaseEngine = new RebaseEngine(database);
        stakingManager = new StakingManagerV2(token, database, rebaseEngine, networkDemand, distPool);
    }

    function whiteListing() internal {
        distPool.addWhitelist(address(stakingManager));

        networkDemand.addWhitelist(address(stakingManager));
        networkDemand.addWhitelist(address(rebaseEngine));

        database.addWhitelist(address(stakingManager));
        database.addWhitelist(address(rebaseEngine));
        database.addWhitelist(address(this));

        rebaseEngine.addWhitelist(address(stakingManager));
        rebaseEngine.addWhitelist(address(this));
    }

    function enableAndApprove() internal {
        token.approve(address(stakingManager), 1e30 ether);

        stakingManager.enableStaking();
        stakingManager.enableUnstaking();
    }

    function getAddr() public view returns (address) {
        return address(this);
    }

    /**================================== WRAPPERS ==================================*/

    function wrapSetStakingParams(
        uint256 _ms,
        uint256 _md,
        uint32 _pd
    ) public {
        uint256 _minimumStakeDays = 1;
        uint256 minimumStakeAmount = _ms;
        uint256 maxDafi = _md;
        uint8 _rewardFee = 100;
        uint256 programDuration = uint256(_pd);

        database.setStakingParams(_minimumStakeDays, minimumStakeAmount, maxDafi, _rewardFee, programDuration);
    }

    function wrapRebasePool() public {
        rebaseEngine.rebasePool();
    }

    function wrapStake(uint256 _amount) public {
        stakingManager.stake(_amount);
    }

    function wrapClaim(bool partialClaim, uint256 _amount) public {
        stakingManager.claimRewards(partialClaim, _amount);
    }

    function wrapUnstake(uint256 _amount) public {
        database.getUserStake(address(this));
        stakingManager.unstake(_amount);
    }

    function wrapGetWeights()
        public
        view
        returns (
            uint256 currPW,
            uint256 currFW,
            uint256 accPW,
            uint256 accFW
        )
    {
        currPW = rebaseEngine.currentPoolWeight();
        currFW = rebaseEngine.currentFeeWeight();
        accPW = database.getAccumulatedPoolWeight();
        accFW = database.getAccumulatedFeeWeight();
    }
}

contract PriceFeed is IPriceFeeds {
    function getThePrice() external pure override returns (uint256 randomPriceFeed) {
        randomPriceFeed = 159;
    }
}

contract TVLFeed is ITVLFeeds {
    function getTheTVL() external pure override returns (uint256 randomTVLFeed) {
        randomTVLFeed = 278;
    }
}
