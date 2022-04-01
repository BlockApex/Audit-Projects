// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

interface ITVLFeeds {

    function getTheTVL() external view returns (uint);
}