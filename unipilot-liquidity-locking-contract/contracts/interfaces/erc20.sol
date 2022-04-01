// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.4;

interface ERC20 {
    function balanceOf(address user) external view returns(uint256);
}