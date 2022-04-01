// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

interface IStakingManager {
    function stake(uint amount) external;
    function stakeFor(address user, uint amount) external;
    function unstake(uint amount) external;
    function claimRewards(bool partialClaim, uint amount) external;
}