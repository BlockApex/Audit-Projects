// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

interface IPriceFeeds {

    function getThePrice() external view returns (uint);
}