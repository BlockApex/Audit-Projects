// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../interfaces/IPriceFeeds.sol";

/*
*   Wrapper contract to get the price feeds from oracles and provide it to other contracts
*/
contract MockPriceFeeds is IPriceFeeds{
    uint price;

    constructor() {}

    function setPrice(uint _price) external {
        price = _price;
    }

    /**
     * Returns the latest price
     */
    function getThePrice() public view override returns (uint) {
        return price;
    }
}