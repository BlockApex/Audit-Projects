// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import "./PositionKey.sol";
import "./LiquidityAmounts.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

/// @title Liquidity amount functions
/// @notice Provides functions for computing liquidity amounts from token amounts and prices
library LiquidityReserves {
    function position(
        address contractAddress,
        int24 tickLower,
        int24 tickUpper,
        IUniswapV3Pool pool
    )
        internal
        view
        returns (
            uint128 _liquidity,
            uint256 feeGrowthInside0LastX128,
            uint256 feeGrowthInside1LastX128,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        )
    {
        bytes32 positionKey = PositionKey.compute(contractAddress, tickLower, tickUpper);
        return pool.positions(positionKey);
    }

    function getLiquidityAmounts(
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidityDesired,
        uint256 amount0Desired,
        uint256 amount1Desired,
        IUniswapV3Pool pool
    )
        internal
        view
        returns (
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
        uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower);
        uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper);
        if (liquidityDesired > 0) {
            (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
                sqrtPriceX96,
                sqrtRatioAX96,
                sqrtRatioBX96,
                liquidityDesired
            );
        } else {
            liquidity = LiquidityAmounts.getLiquidityForAmounts(
                sqrtPriceX96,
                sqrtRatioAX96,
                sqrtRatioBX96,
                amount0Desired,
                amount1Desired
            );
        }
    }

    function getPositionTokenAmounts(
        address contractAddress,
        int24 tickLower,
        int24 tickUpper,
        IUniswapV3Pool pool
    )
        internal
        view
        returns (
            uint256 amount0,
            uint256 amount1,
            uint256 fees0,
            uint256 fees1
        )
    {
        (uint128 liquidity, , , uint128 tokensOwed0, uint128 tokensOwed1) = position(
            contractAddress,
            tickLower,
            tickUpper,
            pool
        );
        (, amount0, amount1) = LiquidityReserves.getLiquidityAmounts(
            tickLower,
            tickUpper,
            liquidity,
            0,
            0,
            pool
        );
        fees0 = tokensOwed0;
        fees1 = tokensOwed1;
    }
}
