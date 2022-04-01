// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
pragma abicoder v2;

interface ILiquidityMigrator {
    struct MigrateV2Params {
        address pair; // the Uniswap v2-compatible pair
        address liquidityManager; // expected to be balanceOf(msg.sender)
        address unipilotAddress;
        address token0;
        address token1;
        uint24 fee;
        uint8 percentageToMigrate; // represented as a numerator over 100
        uint256 liquidityToMigrate; // expected to be balanceOf(msg.sender)
        uint256 sqrtPriceX96;
        uint256 unipilotTokenId;
        bool refundAsETH;
    }

    struct MigrateV3Params {
        address liquidityManager;
        address unipilotAddress;
        address token0;
        address token1;
        uint24 fee;
        uint8 percentageToMigrate;
        uint256 uniswapTokenId;
        uint256 unipilotTokenId;
        bool refundAsETH;
    }

    struct UnipilotAmounts {
        uint256 amount0Base;
        uint256 amount1Base;
        uint256 amount0Range;
        uint256 amount1Range;
    }

    struct UnipilotTicks {
        int24 baseTickLower;
        int24 baseTickUpper;
        int24 rangeTickLower;
        int24 rangeTickUpper;
    }
}
