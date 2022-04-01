// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "./oracle/libraries/SafeUint128.sol";
import "./oracle/libraries/OracleLibrary.sol";
import "./oracle/interfaces/IOracle.sol";

import "./interfaces/IUnipilot.sol";
import "./interfaces/uniswap/IULMState.sol";

//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

contract V3Oracle is IOracle {
    using SafeMath for uint256;

    address public governance;

    address internal ulmState;
    address internal constant WETH = 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab;
    address internal constant DAI = 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735;
    address internal constant PILOT = 0x39491EE11ECAe251e9649Af6635bc23F13BEfE63;
    address internal constant USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
    address internal constant USDT = 0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02;
    uint256 internal constant LIQUIDITY_VALIDATION_AMOUNT = 100000000000000000000000;
    address internal constant UNISWAP_FACTORY =
        0x5b1869D9A4C187F2EAa108f3062412ecf0526b24;

    modifier onlyGovernance() {
        require(msg.sender == governance);
        _;
    }

    constructor(address _ulmState) {
        governance = msg.sender;
        ulmState = _ulmState;
    }

    function setUlmState(address _ulmState) external onlyGovernance {
        ulmState = _ulmState;
    }

    function getPoolAddress(
        address token0,
        address token1,
        uint24 fee
    ) internal view returns (address) {
        return IUniswapV3Factory(UNISWAP_FACTORY).getPool(token0, token1, fee);
    }

    /**
     *   @notice This function validates if total liquidity is over Validation amount
     *   @param token0: address of token0
     *   @param token1: address of token1
     *   @param amount0: amount of token0
     *   @param amount1: amount of token1
     *   @return claimPilot bool
     **/
    function checkPoolValidation(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) public view override returns (bool claimPilot) {
        uint256 totalLiquidity = checkPoolLiquidity(token0, token1, amount0, amount1);
        claimPilot = totalLiquidity > LIQUIDITY_VALIDATION_AMOUNT ? true : false;
    }

    /**
     *   @notice This function returns the usd price of the token from price oracle
     *   @param pool: pool address
     *   @param amount: amount in wei
     *   @return usdAmount Amount in USD
     **/
    function getUSDAmount(address pool, uint256 amount)
        internal
        view
        returns (uint256 usdAmount)
    {
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
        (address token0, address token1, uint24 fee) = (
            uniswapPool.token0(),
            uniswapPool.token1(),
            uniswapPool.fee()
        );
        (address tokenIn, address tokenOut, uint256 amountIn) = (token0 == USDT ||
            token0 == DAI ||
            token0 == USDC)
            ? (token1, token0, amount)
            : (token0, token1, amount);
        usdAmount = getPrice(tokenIn, tokenOut, fee, amountIn);
    }

    /**
     *   @notice This function reuturns the weth price of a token provided
     *   @param pool: pool address
     *   @param amount: amount in wei
     *   @return wethAmount uint256
     **/
    function getWETHAmount(address pool, uint256 amount)
        internal
        view
        returns (uint256 wethAmount)
    {
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
        (address token0, address token1, uint24 fee) = (
            uniswapPool.token0(),
            uniswapPool.token1(),
            uniswapPool.fee()
        );
        (address tokenIn, address tokenOut, uint256 amountIn) = (token0 == WETH)
            ? (token1, token0, amount)
            : (token0, token1, amount);
        wethAmount = getPrice(tokenIn, tokenOut, fee, amountIn);
    }

    /**
     *   @notice This function returns a pair of the given token with the stable tokens which
     *   has the maximum liquidity among all fee tiers.
     *   @param token: token address
     *   @return address pair
     **/
    function checkPairsAndLiquidity(address token)
        public
        view
        override
        returns (address)
    {

        address pair;
        uint256 liquidity;
        address[3] memory tokens = [DAI, USDT, USDC];
        uint16[3] memory feeTier = [3000, 500, 10000];
        uint256 maxLiquidity;
        address tempPair = address(0);

        for (uint8 i = 0; i < tokens.length; i++) {
            for (uint8 tierIndex = 0; tierIndex < feeTier.length; tierIndex++) {
                pair = getPoolAddress(token, tokens[i], feeTier[tierIndex]);
                if (pair != address(0)) {
                    liquidity = IUniswapV3Pool(pair).liquidity();
                    if (liquidity > maxLiquidity) {
                        maxLiquidity = liquidity;
                        tempPair = pair;
                    }
                }
            }
        }

        return tempPair;
    }

    /**
     *   @notice This function returns a pool address of the given token with WETH
     *   which has the maximum liquidity among all fee tiers
     *   @param token: address of token
     *   @return address: pair
     **/
    function checkWethPairsAndLiquidity(address token)
        public
        view
        override
        returns (address)
    {
        address pair;
        uint256 liquidity;
        uint16[3] memory feeTier = [3000, 500, 10000];
        uint256 maxLiquidity;
        address tempPair = address(0);
        for (uint8 tierIndex = 0; tierIndex < feeTier.length; tierIndex++) {
            pair = getPoolAddress(token, WETH, feeTier[tierIndex]);
            if (pair != address(0)) {
                liquidity = IUniswapV3Pool(pair).liquidity();
                if (liquidity > maxLiquidity) {
                    maxLiquidity = liquidity;
                    tempPair = pair;
                }
            }
        }

        return tempPair;
    }

    function checkPoolLiquidity(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) internal view returns (uint256 totalUSDAmount) {
        address wethToken0Pair = checkWethPairsAndLiquidity(token0);
        address wethToken1Pair = checkWethPairsAndLiquidity(token1);

        address stableToken0Pair = checkPairsAndLiquidity(token0);
        address stableToken1Pair = checkPairsAndLiquidity(token1);

        if (wethToken0Pair != address(0) && wethToken1Pair != address(0)) {
            uint256 wethAmount0 = getWETHAmount(wethToken0Pair, amount0);
            uint256 wethAmount1 = getWETHAmount(wethToken1Pair, amount1);
            uint256 totalWethAmount = wethAmount0.add(wethAmount1);

            address wethUSDPair = checkPairsAndLiquidity(WETH);
            totalUSDAmount = getUSDAmount(wethUSDPair, totalWethAmount);
        } else if (stableToken0Pair != address(0) && stableToken1Pair != address(0)) {
            uint256 usdAmount0 = getUSDAmount(stableToken0Pair, amount0);
            uint256 usdAmount1 = getUSDAmount(stableToken1Pair, amount1);
            totalUSDAmount = usdAmount0.add(usdAmount1);
        } else {
            totalUSDAmount = 0;
        }
    }

    /**
     *   @notice This function returns the pilot amount equivalent to the liquidity
     *   provided in the tokens. It is used when the user chooses to collect fees
     *   in $PILOT
     *   @param token0: address of token0
     *   @param token1: address of token1
     *   @param amount0: amount of token0
     *   @param amount1: amount of token1
     *   @return total uint256
     **/
    function getPilotAmountForTokens(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    ) public view override returns (uint256 total) {
        amount0 = getPilotAmount(token0, amount0);
        amount1 = getPilotAmount(token1, amount1);
        total = amount0.add(amount1);
    }

    /**
     *   @notice This function returns pilot amount equivalent to the liqudity
     *   provided in the WETH pairs.
     *   @param tokenAlt: address of alt token
     *   @param altAmount: amount of alt token
     *   @param wethAmount: amount of weth token
     **/
    function getPilotAmountWethPair(
        address tokenAlt,
        uint256 altAmount,
        uint256 wethAmount
    ) public view override returns (uint256 amount) {
        uint256 pilotAmount0 = ethToAsset(PILOT, 3000, wethAmount);
        uint256 pilotAmount1 = getPilotAmount(tokenAlt, altAmount);
        amount = pilotAmount0.add(pilotAmount1);
    }

    /**
     *   @notice This function returns the pilot amount equivalent to the
     *   token value provided
     *   @param token: address of token
     *   @param amount: amount of token
     *   @return pilotAmount uint256
     **/
    function getPilotAmount(address token, uint256 amount)
        public
        view
        override
        returns (uint256 pilotAmount)
    {
        address wethToken = checkWethPairsAndLiquidity(token);
        (, , uint24 tokenFee, , , , ) = IULMState(ulmState).getPoolDetails(wethToken);
        uint256 ethAmount = assetToEth(token, tokenFee, amount);
        pilotAmount = ethToAsset(PILOT, 3000, ethAmount);
    }

    /**
     *   @notice This function returns the price of an asset into eth value
     *   @param token: address of the token
     *   @param fees: fee tier
     *   @param amountIn: amount of provided token
     *   @return ethAmountOut uint256
     **/
    function assetToEth(
        address token,
        uint24 fees,
        uint256 amountIn
    ) public view override returns (uint256 ethAmountOut) {
        // uint8 decimals = IERC20(token).decimals();
        return getPrice(token, WETH, fees, amountIn);
    }

    /**
     *   @notice This function returns the price of eth into a desired asset
     *   @param tokenOut: address of desired token
     *   @param fees: fee tier
     *   @param amountIn: amount of eth provided
     *   @return amountOut uint256
     **/
    function ethToAsset(
        address tokenOut,
        uint24 fees,
        uint256 amountIn
    ) public view override returns (uint256 amountOut) {
        return getPrice(WETH, tokenOut, fees, amountIn);
    }

    /**
     *   @notice This function returns the price of a token equivalent
     *   to the price of the other token in a pool
     *   @param tokenA: address of tokenA
     *   @param tokenB: address of tokenB
     *   @param _poolFee: fee tier of the intended pool
     *   @param _amountIn: amount of tokenIn
     *   @return amountOut uint256
     **/
    function getPrice(
        address tokenA,
        address tokenB,
        uint24 _poolFee,
        uint256 _amountIn
    ) public view override returns (uint256 amountOut) {
        address pool = PoolAddress.computeAddress(
            UNISWAP_FACTORY,
            PoolAddress.getPoolKey(tokenA, tokenB, _poolFee)
        );
        (uint32 lastTimeStamp, , , ) = IUniswapV3Pool(pool).observations(0);
        int256 twapTick = OracleLibrary.consult(
            pool,
            uint32(block.timestamp) - lastTimeStamp
        );
        return
            OracleLibrary.getQuoteAtTick(
                int24(twapTick),
                SafeUint128.toUint128(_amountIn),
                tokenA,
                tokenB
            );
    }
}
