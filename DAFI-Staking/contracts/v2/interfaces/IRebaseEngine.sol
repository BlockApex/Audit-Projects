// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

interface IRebaseEngine {
    function rebase(address user) external;
    function rebasePool() external;
}