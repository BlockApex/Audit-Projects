// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

// import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../../../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../interfaces/ITVLFeeds.sol";

/*
*   Wrapper contract to get the tvl feeds from oracles and provide it to other contracts
*/
contract TVLFeeds is ITVLFeeds, Ownable{

    //TODO Integragtion with Chainlink TVL aggregator when they implement it

    uint private globalTVL;

    constructor() {

    }

    /**
     * Returns the latest tvl
     */
    function getTheTVL() public view override returns (uint) {
        return globalTVL;
    }


    function setGlobalTVL(uint _globalTVL) external onlyOwner{ //TODO Remove it when integrated with Chainlink aggregator
        globalTVL = _globalTVL;
    }
}