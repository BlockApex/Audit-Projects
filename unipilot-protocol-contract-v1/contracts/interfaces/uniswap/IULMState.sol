pragma solidity >=0.7.6;

interface IULMState {
    struct TokenDetails {
        int24 baseTickLower;
        int24 baseTickUpper;
        int24 rangeTickLower;
        int24 rangeTickUpper;
        uint256 fees0;
        uint256 fees1;
        uint256 totalLiquidity;
        uint256 baseAmount0;
        uint256 baseAmount1;
        uint256 baseFees0;
        uint256 baseFees1;
        uint256 rangeAmount0;
        uint256 rangeAmount1;
        uint256 rangeFees0;
        uint256 rangeFees1;
    }

    function calculateShare(uint256 amount, uint256 percentageShare)
        external
        pure
        returns (uint256 share);

    /// @notice Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist
    /// @dev tokenA and tokenB may be passed in either token0/token1 or token1/token0 order
    /// @param token0 The contract address of token0
    /// @param token1 The contract address of token1
    /// @param fee Fee Tier of the pool
    /// @return pool The pool address
    function getPoolAddress(
        address token0,
        address token1,
        uint24 fee
    ) external view returns (address);

    function getPoolDetails(address pool)
        external
        view
        returns (
            address token0,
            address token1,
            uint24 fee,
            uint16 poolCardinality,
            uint128 liquidity,
            uint160 sqrtPriceX96,
            int24 currentTick
        );

    function getPositionDetails(uint256 tokenId, address liquidityManagerAddress)
        external
        view
        returns (
            address pool,
            address token0,
            address token1,
            int24 currentTick,
            uint24 fee,
            uint256 liquidity,
            uint256 fee0,
            uint256 fee1,
            uint256 amount0,
            uint256 amount1,
            uint256 totalLiquidity
        );

    /// @notice Returns the status of the pool that needs rebasing or not
    /// @param pool Address of the pool
    /// @param liquidityManagerAddress Address of the Unipilot liquidity manager
    function shouldReadjust(address pool, address liquidityManagerAddress)
        external
        view
        returns (bool);

    /// @notice
    function getUserAndIndexShares(uint256 _tokensOwed0, uint256 _tokensOwed1)
        external
        view
        returns (
            uint256 indexAmount0,
            uint256 indexAmount1,
            uint256 userAmount0,
            uint256 userAmount1
        );

    function getTokensOwedAmount(
        address liquidityManager,
        address pool,
        uint256 userLiquidity,
        uint256 feeGrowth0,
        uint256 feeGrowth1
    )
        external
        view
        returns (
            uint256 tokensOwed0,
            uint256 tokensOwed1,
            uint256 feeGrowthGlobal0,
            uint256 feeGrowthGlobal1
        );
}
