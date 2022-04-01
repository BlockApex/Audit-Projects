pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "./interfaces/IUniStrategy.sol";

/**
* @title UniStrategy.
* @author Mubashir-ali-baig.
* @notice  
*   This contract calculates suitable tick ranges to fully deposit liquidity asset.
*   It maintains two strategies for unipilot vaults   
*   1) Base order => For depositing in-range liquidity
*   2) Range order => To distribute remaining assets behind or ahead of base order ticks,
*   so that users liquidity does not abruptly goes out of range      

*   @dev These ranges are named as follows.
*   Base => upper and lower ticks for main range to deposit
*   Ask => Upper and lower ticks ahead of the current tick and base upper
*   Bid => Upper and lower ticks behind the current and base lower
**/
contract UniStrategy is IUniStrategy {
    /// @dev governance address is set on deployment for the governance based functions
    address public governance;
    /// @dev rangeMultiplier is multiplied with tick spacing to calculate range order spread
    int24 public rangeMultiplier;
    /// @dev baseMultiplier is multiplied with tick spacing to calculate base order spread
    int24 public baseMultiplier;
    /// @dev rangeOrder is the range calculate the spread behind and ahead of the base range
    int24 private rangeOrder;
    /// @dev maxTwapDeviation is the max time weighted average deviation of price from the normal range in both directions
    int24 private maxTwapDeviation;
    /// @dev twapDuration is the minimum duration in which the diviated price moves
    uint32 private twapDuration;
    /// @dev pricethreshold is the limit to prevent from high readjust slippage.
    uint24 public override pricethreshold;

    constructor() {
        governance = msg.sender;
        maxTwapDeviation = 1200;
        twapDuration = 10;
        pricethreshold = 1e5;
        rangeMultiplier = 4;
        baseMultiplier = 3;
    }

    /// @dev poolStrategy maintains the base,range multipliers and
    ///  twap variations for each pool
    mapping(address => PoolStrategy) internal poolStrategy;

    modifier onlyGovernance() {
        require(msg.sender == governance, "Strategy:: Not governance");
        _;
    }

    /**
     *   @notice This function returns base,ask and bid range ticks for the given pool
     *   - It fetches the current tick and tick spacing of the pool
     *   - Multiples the tick spacing with pools base and range multipliers
     *   - Calculates pools twap and verifies wether it is under the maxtwapdeviation
     *   - If the price is under the deviation limit, it returns the base ranges along with range order ticks
     *   @param _pool: pool address
     **/
    function getTicks(address _pool)
        external
        override
        returns (
            int24 baseLower,
            int24 baseUpper,
            int24 bidLower,
            int24 bidUpper,
            int24 askLower,
            int24 askUpper
        )
    {
        (int24 tick, int24 tickSpacing) = getCurrentTick(_pool);
        if (poolStrategy[_pool].baseThreshold == 0) {
            poolStrategy[_pool].baseThreshold = tickSpacing * baseMultiplier;
            poolStrategy[_pool].rangeMultiplier = rangeMultiplier;
            poolStrategy[_pool].maxTwapDeviation = maxTwapDeviation;
            poolStrategy[_pool].twapDuration = twapDuration;
        }

        rangeOrder = tickSpacing * poolStrategy[_pool].rangeMultiplier;

        int24 maxThreshold = poolStrategy[_pool].baseThreshold > rangeOrder
            ? poolStrategy[_pool].baseThreshold
            : rangeOrder;

        require(tick > TickMath.MIN_TICK + maxThreshold + tickSpacing, "TL");

        require(tick < TickMath.MAX_TICK - maxThreshold - tickSpacing, "TH");

        int24 twap = calculateTwap(_pool);

        int24 deviation = tick > twap ? tick - twap : twap - tick;

        require(deviation <= poolStrategy[_pool].maxTwapDeviation, "MTF");

        int24 tickFloor = _floor(tick, tickSpacing);

        int24 tickCeil = tickFloor + tickSpacing;

        baseLower = tickFloor - poolStrategy[_pool].baseThreshold;
        baseUpper = tickFloor + poolStrategy[_pool].baseThreshold;
        bidLower = tickFloor - rangeOrder;
        bidUpper = tickFloor;
        askLower = tickCeil;
        askUpper = tickCeil + rangeOrder;
    }

    /**
     *   @notice This function updates the global price threshold
     *   @param _priceThreshold: a limit value to prevent from high readjust slippage
     **/
    function setPricethreshold(uint16 _priceThreshold) external onlyGovernance {
        require(
            _priceThreshold < 1e6 && _priceThreshold > 0,
            "UniStrategy:: Invalid Price Impact"
        );
        pricethreshold = _priceThreshold;
    }

    /**
     *   @notice This function sets the global multipier value of the range order
     *   @param _rangeMultiplier: a multiplier value to decide the spread of range order
     **/
    function setRangeMultiplier(int24 _rangeMultiplier) external onlyGovernance {
        require(_rangeMultiplier > 0, "UniStrategy:: INVALID_MULTIPLIER");
        rangeMultiplier = _rangeMultiplier;
    }

    /**
     *   @notice This function updates the base range mutiplier
     *   @param _baseMultiplier: a mutiplier value to decide the spread of base range
     **/
    function setBaseMutiplier(int24 _baseMultiplier) external onlyGovernance {
        require(_baseMultiplier > 0, "UniStrategy:: INVALID_MULTIPLIER");
        baseMultiplier = _baseMultiplier;
    }

    /**
     *   @notice This function updates the deviation limit of tick spread
     *   @param _twapDeviation: a value to decide the maximum price deviation
     **/
    function setMaxTwapDeviation(int24 _twapDeviation) external onlyGovernance {
        maxTwapDeviation = _twapDeviation;
    }

    /**
     *   @notice This function updates the twap duration
     *   @param _twapDuration: a value for the duration of recalbiration of the twap
     **/
    function setTwapDuration(uint32 _twapDuration) external onlyGovernance {
        twapDuration = _twapDuration;
    }

    /**
     *   @notice This function updates the range,base threshold and twap values specific to a pool
     *   @param params: struct values of PoolStrategy struct, the values can be inspected from interface
     *   @param _pool: pool address
     **/
    function changeStrategy(PoolStrategy memory params, address _pool)
        external
        onlyGovernance
    {
        validateStrategy(params.baseThreshold, IUniswapV3Pool(_pool).tickSpacing());
        poolStrategy[_pool].baseThreshold = params.baseThreshold;
        poolStrategy[_pool].rangeMultiplier = params.rangeMultiplier;
        poolStrategy[_pool].maxTwapDeviation = params.maxTwapDeviation;
        poolStrategy[_pool].twapDuration;
    }

    /**
     *   @notice This function calculates the current twap of pool
     *   @param pool: pool address
     **/
    function calculateTwap(address pool) internal view returns (int24 twap) {
        uint128 inRangeLiquidity = IUniswapV3Pool(pool).liquidity();
        if (inRangeLiquidity == 0) {
            (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3Pool(pool).slot0();
            twap = TickMath.getTickAtSqrtRatio(sqrtPriceX96);
        } else {
            twap = getTwap(pool);
        }
    }

    /**
     *   @notice This function fetches the twap of pool from the observation
     *   @param _pool: pool address
     **/
    function getTwap(address _pool) public view returns (int24) {
        uint32[] memory secondsAgo = new uint32[](2);
        secondsAgo[0] = poolStrategy[_pool].twapDuration;
        secondsAgo[1] = 0;
        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(_pool).observe(secondsAgo);
        return
            int24(
                (tickCumulatives[1] - tickCumulatives[0]) /
                    int56(int32(poolStrategy[_pool].twapDuration))
            );
    }

    /**
     *   @notice This function calculates the lower tick value from the current tick
     *   @param tick: current tick of the pool
     *   @param tickSpacing: tick spacing according to the fee tier
     **/
    function _floor(int24 tick, int24 tickSpacing) internal pure returns (int24) {
        int24 compressed = tick / tickSpacing;
        if (tick < 0 && tick % tickSpacing != 0) compressed--;
        return compressed * tickSpacing;
    }

    /**
     *   @notice This function fetches the current tick of the pool
     *   @param pool: pool address
     **/
    function getCurrentTick(address pool)
        internal
        view
        returns (int24 tick, int24 tickSpacing)
    {
        (, tick, , , , , ) = IUniswapV3PoolState(pool).slot0();
        tickSpacing = IUniswapV3Pool(pool).tickSpacing();
    }

    /**
     *   @notice This function validates that the updating strategy of the pool during the update
     *   @param _strategy: a value for baseThreshold
     *   @param _tickSpacing: spacing of tick according to fee tier
     **/
    function validateStrategy(int24 _strategy, int24 _tickSpacing) internal pure {
        require(_strategy > 0, "UniStrategy:: threshold > 0");
        require(_strategy <= TickMath.MAX_TICK, "UniStrategy:: strategy too high");
        require(_strategy % _tickSpacing == 0, "UniStrategy:: strategy % tickSpacing");
    }
}
