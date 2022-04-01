// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

interface IOracle {
    function checkPoolValidation(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) external view returns (bool claimPilot);

    function checkPairsAndLiquidity(address token) external view returns (address);

    function checkWethPairsAndLiquidity(address token) external view returns (address);

    function getPilotAmountForTokens(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) external view returns (uint256 total);

    function getPilotAmountWethPair(
        address tokenAlt,
        uint256 altAmount,
        uint256 wethAmount
    ) external view returns (uint256 amount);

    function getPilotAmount(address token, uint256 amount)
        external
        view
        returns (uint256 pilotAmount);

    function assetToEth(
        address token,
        uint24 fees,
        uint256 amountIn
    ) external view returns (uint256 ethAmountOut);

    function ethToAsset(
        address tokenOut,
        uint24 fees,
        uint256 amountIn
    ) external view returns (uint256 amountOut);

    function getPrice(
        address tokenA,
        address tokenB,
        uint24 _poolFee,
        uint256 _amountIn
    ) external view returns (uint256 amountOut);
}
