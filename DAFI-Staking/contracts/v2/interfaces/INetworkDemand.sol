// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

interface INetworkDemand {

    function calculateNetworkDemand() external returns (uint);
}