// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "../interfaces/IPriceFeeds.sol";

interface IDIAOracle {
    function getValue(string memory key) external view returns (uint128, uint128);
}

/*
*   Wrapper contract to get the price feeds from oracles and provide it to other contracts
*/
contract DIAPriceFeed is IPriceFeeds{

    IDIAOracle private immutable ref;

    /**
     *  0x35b49eddb46dbc33336f3a0410008b7be98d4a3a - BSC
     * */
    constructor() {
        ref = IDIAOracle(0x35B49eDdB46dbc33336F3A0410008B7be98D4A3a);
    }

    /**
     *  Returns the price using 8 decimals
     * */
    function getThePrice() external view override returns (uint){
        (uint value, ) = ref.getValue("DAFI/USD");
        return value;
    }
}