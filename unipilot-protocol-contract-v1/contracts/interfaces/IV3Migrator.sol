pragma solidity >=0.7.6;

interface IV3Migrator {
    struct MigrateParams {
        bool refundAsETH;
        address exchangeAddress;
        address sender;
        address pair; // the Uniswap v2-compatible pair
        address recipient;
        address token0;
        address token1;
        uint256 deadline;
        uint256 liquidityToMigrate; // expected to be balanceOf(msg.sender)
        uint8 percentageToMigrate; // represented as a numerator over 100
        uint160 sqrtPriceX96;
        uint24 fee;
        uint256 tokenId;
        uint256 amount0Min; // must be discounted by percentageToMigrate
        uint256 amount1Min; // must be discounted by percentageToMigrate
    }
}
