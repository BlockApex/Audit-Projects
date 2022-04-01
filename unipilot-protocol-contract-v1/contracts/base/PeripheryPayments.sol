// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

import "../interfaces/external/IERC20.sol";
import "../interfaces/external/IWETH9.sol";
import "../libraries/TransferHelper.sol";

abstract contract PeripheryPayments {
    address internal constant DAI = 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735;
    address internal constant PILOT = 0x39491EE11ECAe251e9649Af6635bc23F13BEfE63;
    address internal constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address internal constant USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
    address internal constant USDT = 0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02;

    receive() external payable {}

    fallback() external payable {}

    /// @notice Unwraps the contract's WETH9 balance and sends it to recipient as ETH.
    /// @dev The amountMinimum parameter prevents malicious contracts from stealing WETH9 from users.
    /// @param amountMinimum The minimum amount of WETH9 to unwrap
    /// @param recipient The address receiving ETH
    function unwrapWETH9(uint256 amountMinimum, address recipient) internal {
        uint256 balanceWETH9 = IWETH9(WETH).balanceOf(address(this));
        require(balanceWETH9 >= amountMinimum, "Insufficient WETH9");

        if (balanceWETH9 > 0) {
            IWETH9(WETH).withdraw(balanceWETH9);
            TransferHelper.safeTransferETH(recipient, balanceWETH9);
        }
    }

    /// @notice Transfers the full amount of a token held by this contract to recipient
    /// @dev The amountMinimum parameter prevents malicious contracts from stealing the token from users
    /// @param token The contract address of the token which will be transferred to `recipient`
    /// @param amountMinimum The minimum amount of token required for a transfer
    /// @param recipient The destination address of the token
    function sweepToken(
        address token,
        uint256 amountMinimum,
        address recipient
    ) internal {
        uint256 balanceToken = IERC20(token).balanceOf(address(this));
        require(balanceToken >= amountMinimum, "Insufficient token");
        if (balanceToken > 0) {
            TransferHelper.safeTransfer(token, recipient, balanceToken);
        }
    }

    /// @notice Refunds any ETH balance held by this contract to the `msg.sender`
    /// @dev Useful for bundling with mint or increase liquidity that uses ether, or exact output swaps
    /// that use ether for the input amount
    function refundETH() internal {
        if (address(this).balance > 0)
            TransferHelper.safeTransferETH(msg.sender, address(this).balance);
    }

    /// @param token The token to pay
    /// @param payer The entity that must pay
    /// @param recipient The entity that will receive payment
    /// @param value The amount to pay
    function pay(
        address token,
        address payer,
        address recipient,
        uint256 value
    ) internal {
        if (token == WETH && address(this).balance >= value) {
            // pay with WETH9
            IWETH9(WETH).deposit{ value: value }(); // wrap only what is needed to pay
            IWETH9(WETH).transfer(recipient, value);
        } else if (payer == address(this)) {
            // pay with tokens already in the contract (for the exact input multihop case)
            TransferHelper.safeTransfer(token, recipient, value);
        } else {
            // pull payment
            TransferHelper.safeTransferFrom(token, payer, recipient, value);
        }
    }
}
