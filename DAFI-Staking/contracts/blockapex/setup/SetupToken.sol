// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import './TestERC20.sol';

contract SetupToken {
    TestERC20 public token;

    constructor() {
        token = new TestERC20();
    }

    function mintToAddr(address mintTo) public {
        token._mint(mintTo, 1e20 ether);
    }

    function getBalanceOf(address sender) public view returns (uint256 bal) {
        bal = token.balanceOf(sender);
    }
}
