// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;
pragma abicoder v2;

import "./BlockTimestamp.sol";
import "../interfaces/IUniStrategy.sol";
import "../interfaces/uniswap/IULMState.sol";
import "../interfaces/uniswap/IUniswapLiquidityManager.sol";
import "../libraries/LiquidityReserves.sol";

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/FullMath.sol";
import "@uniswap/v3-core/contracts/libraries/SqrtPriceMath.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";

contract ULMState is IULMState, BlockTimestamp {
    using LowGasSafeMath for uint256;

    address internal governance;
    uint256 internal feesPercentageIndexFund;

    address internal constant UNISWAP_FACTORY =
        0x1F98431c8aD98523631AE4a59f267346ea31F984;

    modifier onlyGovernance() {
        require(msg.sender == governance);
        _;
    }

    constructor() {
        governance = msg.sender;
        feesPercentageIndexFund = 2;
    }

    function setFeesPercentageIndexFund(uint8 newPercentage) external onlyGovernance {
        require(newPercentage > 0, "PTS");
        require(newPercentage <= 100, "PTL");
        feesPercentageIndexFund = newPercentage;
    }

    function getPoolAddress(
        address token0,
        address token1,
        uint24 fee
    ) public view override returns (address) {
        return IUniswapV3Factory(UNISWAP_FACTORY).getPool(token0, token1, fee);
    }

    function getTokensOwedAmount(
        address liquidityManager,
        address pool,
        uint256 userLiquidity,
        uint256 feeGrowth0,
        uint256 feeGrowth1
    )
        external
        view
        override
        returns (
            uint256 tokensOwed0,
            uint256 tokensOwed1,
            uint256 feeGrowthGlobal0,
            uint256 feeGrowthGlobal1
        )
    {
        (, , , , , , , , feeGrowthGlobal0, feeGrowthGlobal1, ) = IUniswapLiquidityManager(
            liquidityManager
        ).liquidityPositions(pool);

        tokensOwed0 = FullMath.mulDiv(
            feeGrowthGlobal0.sub(feeGrowth0),
            userLiquidity,
            1e18
        );
        tokensOwed1 = FullMath.mulDiv(
            feeGrowthGlobal1.sub(feeGrowth1),
            userLiquidity,
            1e18
        );
    }

    function getPositionDetails(uint256 tokenId, address liquidityManagerAddress)
        external
        view
        override
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
        )
    {
        IUniswapLiquidityManager liquidityManager = IUniswapLiquidityManager(
            liquidityManagerAddress
        );
        (, pool, liquidity, , , , ) = liquidityManager.positions(tokenId);
        (fee0, fee1, amount0, amount1, totalLiquidity) = liquidityManager.getTotalAmounts(
            pool
        );
        (token0, token1, fee, , , , currentTick) = getPoolDetails(pool);
    }

    /// @inheritdoc IULMState
    function shouldReadjust(address pool, address liquidityManagerAddress)
        external
        view
        override
        returns (bool readjust)
    {
        (
            int24 baseTickLower,
            int24 baseTickUpper,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,

        ) = IUniswapLiquidityManager(liquidityManagerAddress).liquidityPositions(pool);
        int24 tickSpacing = IUniswapV3Pool(pool).tickSpacing();
        (, , , , , , int24 currentTick) = getPoolDetails(pool);
        int24 thershold = tickSpacing; // will increase thershold for mainnet

        if (
            (currentTick < (baseTickLower + thershold)) ||
            (currentTick > (baseTickUpper - thershold))
        ) {
            readjust = true;
        } else {
            readjust = false;
        }
    }

    function calculateShare(uint256 amount, uint256 percentageShare)
        external
        pure
        override
        returns (uint256 share)
    {
        share = FullMath.mulDiv(amount, percentageShare, 1e18);
    }

    function getUserAndIndexShares(uint256 _tokensOwed0, uint256 _tokensOwed1)
        external
        view
        override
        returns (
            uint256 indexAmount0,
            uint256 indexAmount1,
            uint256 userAmount0,
            uint256 userAmount1
        )
    {
        indexAmount0 = FullMath.mulDiv(_tokensOwed0, feesPercentageIndexFund, 100);
        indexAmount1 = FullMath.mulDiv(_tokensOwed1, feesPercentageIndexFund, 100);

        userAmount0 = _tokensOwed0.sub(indexAmount0);
        userAmount1 = _tokensOwed1.sub(indexAmount1);
    }

    function getPoolDetails(address pool)
        public
        view
        override
        returns (
            address token0,
            address token1,
            uint24 fee,
            uint16 poolCardinality,
            uint128 liquidity,
            uint160 sqrtPriceX96,
            int24 currentTick
        )
    {
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
      // require(false, "you cant go further");

        token0 = uniswapPool.token0();
        token1 = uniswapPool.token1();
        fee = uniswapPool.fee();
        liquidity = uniswapPool.liquidity();
        (sqrtPriceX96, currentTick, , poolCardinality, , , ) = uniswapPool.slot0();
    }
}
