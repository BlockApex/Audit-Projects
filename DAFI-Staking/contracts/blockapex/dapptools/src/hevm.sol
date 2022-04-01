// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.0;
import "../lib/ds-test/src/test.sol";

abstract contract Hevm {
    // sets the block timestamp to x
    function warp(uint x) public virtual;
    // sets the block number to x
    function roll(uint x) public virtual;
    // sets the slot loc of contract c to val
    function sstore(address c, bytes32 loc, bytes32 val) public virtual;
    // reads the slot loc of contract c
    function store(address c, bytes32 loc, bytes32 val) public virtual;

    function setOriginOwner() public view returns (address caller){
        caller = tx.origin;
    }
}