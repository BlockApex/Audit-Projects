// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../interfaces/IPriceFeeds.sol";

/*
*   Wrapper contract to get the price feeds from oracles and provide it to other contracts
*/
contract PriceFeeds is IPriceFeeds{

    AggregatorV3Interface internal immutable priceFeed;

    /**
     * Network: Rinkeby
     * Aggregator: LINK/USD
     * Address: 0xd8bD0a1cB028a31AA859A21A3758685a95dE4623
     */
    constructor(address aggregator) {
        priceFeed = AggregatorV3Interface(aggregator);
    }

    /**
     * Returns the latest price
     */
    function getThePrice() public view override returns (uint) {
        (
        ,
        int price,
        ,
        ,
        ) = priceFeed.latestRoundData();
        return uint(price);
    }
}