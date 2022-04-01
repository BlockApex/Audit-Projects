// SPDX-License-Identifier: MIT

pragma solidity >=0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";

import "../interfaces/IUniStrategy.sol";
import "../interfaces/IUnipilot.sol";
import "../interfaces/uniswap/IUniswapLiquidityManager.sol";
import "../interfaces/uniswap/IULMState.sol";
import "../oracle/interfaces/IOracle.sol";

import "../libraries/LiquidityReserves.sol";

import "./BlockTimestamp.sol";
import "./PeripheryPayments.sol";
import "hardhat/console.sol";


contract UniswapLiquidityManager is
    PeripheryPayments,
    IUniswapLiquidityManager,
    BlockTimestamp
{
    using LowGasSafeMath for uint256;

    //IUnipilot public unipilot;

    /// @dev additional premium of a user as an incentive for optimization of vaults.
    uint256 internal premium;

    /// @dev Uniswap V3 Oracle address for price fetching
    address internal oracle;

    /// @dev Contract that returns getter functions for UniswapLiquidityManager
    address internal ulmState;

    /// @dev Unipilot contract that has rights of minting PILOT & NFT
    address internal unipilot;

    /// @dev UniStrategy contract that returns the updated ticks for base & range positions
    address internal uniStrategy;

    /// @dev IndexFund contract that collects percentage of fees when user collects fees in tokens
    address internal indexFund;

    address internal  UNISWAP_FACTORY =
        0x5b1869D9A4C187F2EAa108f3062412ecf0526b24;

    uint128 internal constant MAX_UINT128 = type(uint128).max;

    uint256 private unlocked = 1;

    /// @dev The token ID position data of the user
    mapping(uint256 => Position) public override positions;

    /// @dev The data of the Unipilot base & range orders
    mapping(address => LiquidityPosition) public override liquidityPositions;

    /// @dev keeps track of count, status and timestamp of readjust function call
    mapping(address => ReadjustFrequency) internal readjustFrequency;

    /// @dev This mapping keeps track of who owns a particular nft
    mapping(address => mapping(address => uint256)) public override addressToNftId;

    /// @dev Get the status of the pool that is eligible to recieve fees in PILOT
    /// @dev Only whitelisted pools can recieve fees in PILOT. Can only be update by the governance.
    mapping(address => bool) internal feesInPilot;

    /// @dev Extra PILOT tokens could be minted into a wallet address.By default, this feature should be off but can be toggled using governance.
    PilotSustainabilityFund internal pilotSustainabilityFund;

    modifier onlyUnipilot() {
        _isUnipilot();
        _;
    }

    modifier onlyGovernance() {
        _isGovernance();
        _;
    }

    modifier nonReentrant() {
        require(unlocked == 1);
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor(
        address oracle_,
        address ulmState_,
        address indexFund_,
        address uniStrategy_,
        address factory
    ) {
        (oracle, ulmState, indexFund, uniStrategy, UNISWAP_FACTORY) = (
            oracle_,
            ulmState_,
            indexFund_,
            uniStrategy_,
            factory
        );
        premium = 5e18;
    }

    function initialize(address _unipilot) public {
        unipilot = _unipilot;
    }

    /// @dev Blacklist/Whitelist pool for recieving fees in PILOT
    function toggleFeesInPilot(address pool) external onlyGovernance {
        feesInPilot[pool] = !feesInPilot[pool];
    }

    function updateNewPremium(uint256 _premium) external onlyGovernance {
        premium = _premium;
    }

    function setPilotProtocolDetails(
        address _recipient,
        uint8 _pilotPercentage,
        bool _status
    ) external onlyGovernance {
        pilotSustainabilityFund = PilotSustainabilityFund({
            recipient: _recipient,
            pilotPercentage: _pilotPercentage,
            status: _status
        });
    }

    function updateCoreAddresses(
        address oracle_,
        address ulmState_,
        address indexFund_,
        address uniStrategy_
    ) external onlyGovernance {
        /// If we only need to change one address then remaining addresses will be same as before
        /// Update of all main addresses into single function due to contract size limit
        (oracle, ulmState, indexFund, uniStrategy) = (
            oracle_,
            ulmState_,
            indexFund_,
            uniStrategy_
        );
    }

    /// @inheritdoc IUniswapLiquidityManager
    function uniswapV3MintCallback(
        uint256 amount0Owed,
        uint256 amount1Owed,
        bytes calldata data
    ) external override {
        address sender = msg.sender;
        MintCallbackData memory decoded = abi.decode(data, (MintCallbackData));
        _verifyCallback(decoded.token0, decoded.token1, decoded.fee);
        if (amount0Owed > 0) pay(decoded.token0, decoded.payer, sender, amount0Owed);
        if (amount1Owed > 0) pay(decoded.token1, decoded.payer, sender, amount1Owed);
    }

    /// @inheritdoc IUniswapLiquidityManager
    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external override {
        address recipient = msg.sender;
        SwapCallbackData memory decoded = abi.decode(data, (SwapCallbackData));
        _verifyCallback(decoded.token0, decoded.token1, decoded.fee);
        if (amount0Delta > 0)
            pay(decoded.token0, address(this), recipient, uint256(amount0Delta));
        if (amount1Delta > 0)
            pay(decoded.token1, address(this), recipient, uint256(amount1Delta));
    }

    /// @inheritdoc IUniswapLiquidityManager
    function getReserves(
        address token0,
        address token1,
        bytes calldata data
    )
        external
        override
        returns (
            uint256 totalAmount0,
            uint256 totalAmount1,
            uint256 totalLiquidity
        )
    {
        (uint24 fee, ) = abi.decode(abi.encodePacked(data), (uint24, uint256));
        address pool = getPoolAddress(token0, token1, fee);
        (, , totalAmount0, totalAmount1, totalLiquidity) = updatePositionTotalAmounts(
            pool
        );
    }

 
    function getUserFees(uint256 tokenId)
        external
        returns (uint256 fees0, uint256 fees1)
    {
        Position storage position = positions[tokenId];
        _collectPositionFees(position.pool);
        (uint256 tokensOwed0, uint256 tokensOwed1, , ) = IULMState(ulmState)
            .getTokensOwedAmount(
                address(this),
                position.pool,
                position.liquidity,
                position.feeGrowth0,
                position.feeGrowth1
            );

        fees0 = position.tokensOwed0.add(tokensOwed0);
        fees1 = position.tokensOwed1.add(tokensOwed1);
    }

    /// @inheritdoc IUniswapLiquidityManager
    function createPair(
        address _token0,
        address _token1,
        bytes memory data
    ) external override returns (address _pool) {
        (uint24 _fee, uint160 _sqrtPriceX96) = abi.decode(
            abi.encodePacked(data),
            (uint24, uint160)
        );

        _pool = IUniswapV3Factory(UNISWAP_FACTORY).createPool(_token0, _token1, _fee);

        IUniswapV3Pool(_pool).initialize(_sqrtPriceX96);

        emit PoolCreated(_token0, _token1, _pool, _fee, _sqrtPriceX96);

    }

    /// @inheritdoc IUniswapLiquidityManager
    function deposit(
        address token0,
        address token1,
        address sender,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 shares,
        bytes memory data
    )
        external
        payable
        override
        onlyUnipilot
        returns (
            uint256 amount0Base,
            uint256 amount1Base,
            uint256 amount0Range,
            uint256 amount1Range,
            uint256 mintedTokenId
        )
    {

        DepositVars memory b;
        (b.fee, b.tokenId) = abi.decode(data, (uint24, uint256));
        b.pool = getPoolAddress(token0, token1, b.fee);
        LiquidityPosition storage poolPosition = liquidityPositions[b.pool];

        // updating the feeGrowthGlobal of pool for new user
        if (poolPosition.totalLiquidity > 0) _collectPositionFees(b.pool);
        

        (amount0Base, amount1Base, amount0Range, amount1Range) = _addLiquidityInManager(
            AddLiquidityManagerParams({
                sender: sender,
                pool: b.pool,
                amount0Desired: amount0Desired,
                amount1Desired: amount1Desired,
                shares: shares
            })
            
        );

        if (b.tokenId > 0) {
            Position storage userPosition = positions[b.tokenId];
            require(addressToNftId[sender][b.pool] == b.tokenId);
            userPosition.tokensOwed0 += FullMath.mulDiv(
                poolPosition.feeGrowthGlobal0 - userPosition.feeGrowth0,
                userPosition.liquidity,
                1e18
            );
            userPosition.tokensOwed1 += FullMath.mulDiv(
                poolPosition.feeGrowthGlobal1 - userPosition.feeGrowth1,
                userPosition.liquidity,
                1e18
            );
            userPosition.liquidity += shares;
            userPosition.feeGrowth0 = poolPosition.feeGrowthGlobal0;
            userPosition.feeGrowth1 = poolPosition.feeGrowthGlobal1;

            emit Deposited(b.pool, b.tokenId, amount0Desired, amount1Desired, shares);
        } else {

            (mintedTokenId) = IUnipilot(unipilot).mintUnipilotNFT(sender);
            addressToNftId[sender][b.pool] = mintedTokenId;
            positions[mintedTokenId] = Position({
                nonce: 0,
                pool: b.pool,
                liquidity: shares,
                feeGrowth0: poolPosition.feeGrowthGlobal0,
                feeGrowth1: poolPosition.feeGrowthGlobal1,
                tokensOwed0: 0,
                tokensOwed1: 0
            });

            emit Deposited(b.pool, mintedTokenId, amount0Desired, amount1Desired, shares);
        }
    }

    /// @inheritdoc IUniswapLiquidityManager
    function withdraw(
        bool pilotToken,
        bool wethToken,
        uint256 liquidity,
        uint256 tokenId,
        bytes memory data
    ) external payable override onlyUnipilot nonReentrant {
        WithdrawVars memory c;
        c.recipient = abi.decode(abi.encodePacked(data), (address));
        Position storage position = positions[tokenId];
        require(position.liquidity >= liquidity);

        (c.amount0Removed, c.amount1Removed) = _removeLiquidityUniswap(
            false,
            position.pool,
            liquidity
        );

        (
            c.userAmount0,
            c.userAmount1,
            c.indexAmount0,
            c.indexAmount1,
            c.pilotAmount
        ) = _distributeFeesAndLiquidity(
            DistributeFeesParams({
                pilotToken: pilotToken,
                wethToken: wethToken,
                pool: position.pool,
                recipient: c.recipient,
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Removed: c.amount0Removed,
                amount1Removed: c.amount1Removed
            })
        );

        emit Withdrawn(
            position.pool,
            c.recipient,
            tokenId,
            c.amount0Removed,
            c.amount1Removed
        );

        emit Collect(
            tokenId,
            c.userAmount0,
            c.userAmount1,
            c.indexAmount0,
            c.indexAmount1,
            c.pilotAmount,
            position.pool,
            c.recipient
        );
    }

    /// @inheritdoc IUniswapLiquidityManager
    function collect(
        bool pilotToken,
        bool wethToken,
        uint256 tokenId,
        bytes memory data
    ) external payable override onlyUnipilot nonReentrant {
        address recipient = abi.decode(abi.encodePacked(data), (address));
        Position storage position = positions[tokenId];
        require(position.liquidity > 0, "NL");

        _collectPositionFees(position.pool);

        (
            uint256 userAmount0,
            uint256 userAmount1,
            uint256 indexAmount0,
            uint256 indexAmount1,
            uint256 pilotAmount
        ) = _distributeFeesAndLiquidity(

                DistributeFeesParams({
                    pilotToken: pilotToken,
                    wethToken: wethToken,
                    pool: position.pool,
                    recipient: recipient,
                    tokenId: tokenId,
                    liquidity: 0,
                    amount0Removed: 0,
                    amount1Removed: 0
                })
            );

        emit Collect(
            tokenId,
            userAmount0,
            userAmount1,
            indexAmount0,
            indexAmount1,
            pilotAmount,
            position.pool,
            recipient
        );
    }


    function readjustLiquidity(
        address token0,
        address token1,
        uint24 fee
    ) external {
        // @dev calculating the gas amount at the begining
        uint256 initialGas = gasleft();
        ReadjustVars memory b;

        b.poolAddress = getPoolAddress(token0, token1, fee);

        if (_blockTimestamp() - readjustFrequency[b.poolAddress].timestamp > 600) {
            readjustFrequency[b.poolAddress].counter = 0;
            readjustFrequency[b.poolAddress].status = false;
        }
        require(readjustFrequency[b.poolAddress].status == false);
        require(IULMState(ulmState).shouldReadjust(b.poolAddress, address(this)));
        readjustFrequency[b.poolAddress].timestamp = _blockTimestamp();

        LiquidityPosition storage position = liquidityPositions[b.poolAddress];
        (, , , , , b.sqrtPriceX96, ) = IULMState(ulmState).getPoolDetails(b.poolAddress);
        (b.amount0, b.amount1) = _removeLiquidityUniswap(
            true,
            b.poolAddress,
            position.totalLiquidity
        );

        if (b.amount0 == 0 || b.amount1 == 0) {
            (b.zeroForOne, b.amountIn) = b.amount0 > 0
                ? (true, b.amount0)
                : (false, b.amount1);
            b.exactSqrtPriceImpact =
                (b.sqrtPriceX96 * (IUniStrategy(uniStrategy).pricethreshold() / 2)) /
                1e6;
            b.sqrtPriceLimitX96 = b.zeroForOne
                ? b.sqrtPriceX96 - b.exactSqrtPriceImpact
                : b.sqrtPriceX96 + b.exactSqrtPriceImpact;

            b.amountIn = FullMath.mulDiv(b.amountIn, 200000000000000000, 1e18);

            (int256 amount0Delta, int256 amount1Delta) = IUniswapV3Pool(b.poolAddress)
                .swap(
                    address(this),
                    b.zeroForOne,
                    int256(b.amountIn),
                    b.sqrtPriceLimitX96,
                    abi.encode(
                        (SwapCallbackData({ token0: token0, token1: token1, fee: fee }))
                    )
                );

            if (amount1Delta < 1) {
                amount1Delta = -amount1Delta;
                b.amount0 = b.amount0.sub(uint256(amount0Delta));
                b.amount1 = b.amount1.add(uint256(amount1Delta));
            } else {
                amount0Delta = -amount0Delta;
                b.amount0 = b.amount0.add(uint256(amount0Delta));
                b.amount1 = b.amount1.sub(uint256(amount1Delta));
            }
        }
        // @dev calculating new ticks for base & range positions
        Tick memory ticks;
        (
            ticks.baseTickLower,
            ticks.baseTickUpper,
            ticks.bidTickLower,
            ticks.bidTickUpper,
            ticks.rangeTickLower,
            ticks.rangeTickUpper
        ) = IUniStrategy(uniStrategy).getTicks(b.poolAddress);

        (b.baseLiquidity, b.amount0Added, b.amount1Added, ) = _addLiquidityUniswap(
            AddLiquidityParams({
                sender: msg.sender,
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: ticks.baseTickLower,
                tickUpper: ticks.baseTickUpper,
                amount0Desired: b.amount0,
                amount1Desired: b.amount1
            })
        );

        (position.baseLiquidity, position.baseTickLower, position.baseTickUpper) = (
            b.baseLiquidity,
            ticks.baseTickLower,
            ticks.baseTickUpper
        );

        uint256 amount0Remaining = b.amount0.sub(b.amount0Added);
        uint256 amount1Remaining = b.amount1.sub(b.amount1Added);

        (uint128 bidLiquidity, , ) = LiquidityReserves.getLiquidityAmounts(
            ticks.bidTickLower,
            ticks.bidTickUpper,
            0,
            amount0Remaining,
            amount1Remaining,
            IUniswapV3Pool(b.poolAddress)
        );
        (uint128 rangeLiquidity, , ) = LiquidityReserves.getLiquidityAmounts(
            ticks.rangeTickLower,
            ticks.rangeTickUpper,
            0,
            amount0Remaining,
            amount1Remaining,
            IUniswapV3Pool(b.poolAddress)
        );

        // @dev adding bid or range order on Uniswap depending on which token is left
        if (bidLiquidity > rangeLiquidity) {
            _addLiquidityUniswap(
                AddLiquidityParams({
                    sender: msg.sender,
                    token0: token0,
                    token1: token1,
                    fee: fee,
                    tickLower: ticks.bidTickLower,
                    tickUpper: ticks.bidTickUpper,
                    amount0Desired: amount0Remaining,
                    amount1Desired: amount1Remaining
                })
            );

            (
                position.rangeLiquidity,
                position.rangeTickLower,
                position.rangeTickUpper
            ) = (bidLiquidity, ticks.bidTickLower, ticks.bidTickUpper);
        } else {
            _addLiquidityUniswap(
                AddLiquidityParams({
                    sender: msg.sender,
                    token0: token0,
                    token1: token1,
                    fee: fee,
                    tickLower: ticks.rangeTickLower,
                    tickUpper: ticks.rangeTickUpper,
                    amount0Desired: amount0Remaining,
                    amount1Desired: amount1Remaining
                })
            );
            (
                position.rangeLiquidity,
                position.rangeTickLower,
                position.rangeTickUpper
            ) = (rangeLiquidity, ticks.rangeTickLower, ticks.rangeTickUpper);
        }

        readjustFrequency[b.poolAddress].counter += 1;
        if (readjustFrequency[b.poolAddress].counter == 2)
            readjustFrequency[b.poolAddress].status = true;

        (, , uint256 amount0, uint256 amount1, ) = getTotalAmounts(b.poolAddress);

        if (IOracle(oracle).checkPoolValidation(token0, token1, amount0, amount1)) {
            b.gasUsed = tx.gasprice.mul(initialGas.sub(gasleft()));
            b.pilotAmount = IOracle(oracle).ethToAsset(PILOT, 3000, b.gasUsed);
            IUnipilot(unipilot).mintPilot(msg.sender, b.pilotAmount.add(premium));
        }

        emit PoolReajusted(
            b.poolAddress,
            position.baseLiquidity,
            position.rangeLiquidity,
            position.baseTickLower,
            position.baseTickUpper,
            position.rangeTickLower,
            position.rangeTickUpper
        );
    }

    /// @notice Returns the status of runnng readjust function, the limit is set to 2 readjusts per day
    /// @param pool Address of the pool
    /// @return status Pool rebase status
    function readjustFrequencyStatus(address pool) external returns (bool status) {
        if (_blockTimestamp() - readjustFrequency[pool].timestamp > 600) {
            readjustFrequency[pool].counter = 0;
            readjustFrequency[pool].status = false;
        }
        status = readjustFrequency[pool].status;
    }

    /// @inheritdoc IUniswapLiquidityManager
    function updatePositionTotalAmounts(address _pool)
        public
        override
        returns (
            uint256 fee0,
            uint256 fee1,
            uint256 amount0,
            uint256 amount1,
            uint256 totalLiquidity
        )
    {
        LiquidityPosition memory position = liquidityPositions[_pool];
        if (position.totalLiquidity > 0) {
            _updatePosition(position.baseTickLower, position.baseTickUpper, _pool);
            _updatePosition(position.rangeTickLower, position.rangeTickUpper, _pool);
            return getTotalAmounts(_pool);
        } else {
            totalLiquidity = 0;
        }
    }

    function getTotalAmounts(address pool)
        public
        view
        override
        returns (
            uint256 fee0,
            uint256 fee1,
            uint256 amount0,
            uint256 amount1,
            uint256 totalLiquidity
        )
    {
        LiquidityPosition memory position = liquidityPositions[pool];
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
        (
            uint256 baseAmount0,
            uint256 baseAmount1,
            uint256 baseFees0,
            uint256 baseFees1
        ) = LiquidityReserves.getPositionTokenAmounts(
                address(this),
                position.baseTickLower,
                position.baseTickUpper,
                uniswapPool
            );
        (
            uint256 rangeAmount0,
            uint256 rangeAmount1,
            uint256 rangeFees0,
            uint256 rangeFees1
        ) = LiquidityReserves.getPositionTokenAmounts(
                address(this),
                position.rangeTickLower,
                position.rangeTickUpper,
                uniswapPool
            );

        amount0 = baseAmount0.add(rangeAmount0);
        amount1 = baseAmount1.add(rangeAmount1);
        totalLiquidity = position.totalLiquidity;
        fee0 = position.fees0.add(baseFees0.add(rangeFees0));
        fee1 = position.fees1.add(baseFees1.add(rangeFees1));
    }

    function _isUnipilot() internal view {
        require(msg.sender == unipilot);
    }

    function _isGovernance() internal view {
        require(msg.sender == IUnipilot(unipilot).governance());
    }

    function getPoolAddress(
        address token0,
        address token1,
        uint24 fee
    ) public view returns (address) {
        return IUniswapV3Factory(UNISWAP_FACTORY).getPool(token0, token1, fee);
    }

    /// @dev Do zero-burns to poke a position on Uniswap so earned fees are
    /// updated. Should be called if total amounts needs to include up-to-date
    /// fees.
    function _updatePosition(
        int24 tickLower,
        int24 tickUpper,
        address pool
    ) private {
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
        (uint128 liquidity, , , , ) = LiquidityReserves.position(
            address(this),
            tickLower,
            tickUpper,
            uniswapPool
        );
        if (liquidity > 0) {
            uniswapPool.burn(tickLower, tickUpper, 0);
        }
    }

    function _addRangeLiquidity(
        address sender,
        address pool,
        uint256 amount0,
        uint256 amount1,
        uint256 shares
    ) private returns (uint256 amount0Range, uint256 amount1Range) {
        RangeLiquidityVars memory b;
        (b.token0, b.token1, b.fee, , , , ) = IULMState(ulmState).getPoolDetails(pool);
        LiquidityPosition storage position = liquidityPositions[pool];

        (b.rangeLiquidity, b.amount0Range, b.amount1Range, ) = _addLiquidityUniswap(
            AddLiquidityParams({
                sender: sender, // unused
                token0: b.token0,
                token1: b.token1,
                fee: b.fee,
                tickLower: position.rangeTickLower,
                tickUpper: position.rangeTickUpper,
                amount0Desired: amount0,
                amount1Desired: amount1
            })
        );

        position.rangeLiquidity += b.rangeLiquidity;
        position.totalLiquidity += shares;
        (amount0Range, amount1Range) = (b.amount0Range, b.amount1Range);
    }


    function _addLiquidityUniswap(AddLiquidityParams memory params)
        private
        returns (
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1,
            IUniswapV3Pool pool
        )
    {
        pool = IUniswapV3Pool(getPoolAddress(params.token0, params.token1, params.fee));
        (liquidity, , ) = LiquidityReserves.getLiquidityAmounts(
            params.tickLower,
            params.tickUpper,
            0,
            params.amount0Desired,
            params.amount1Desired,
            pool
        );

        (amount0, amount1) = pool.mint(
            address(this),
            params.tickLower,
            params.tickUpper,
            liquidity,
            abi.encode(
                (
                    MintCallbackData({
                        payer: address(this),
                        token0: params.token0,
                        token1: params.token1,
                        fee: params.fee
                    })
                )
            )
        );
    }

    function _removeLiquiditySingle(
        int24 tickLower,
        int24 tickUpper,
        uint128 liquidity,
        uint256 liquiditySharePercentage,
        IUniswapV3Pool pool
    ) private returns (RemoveLiquidity memory removedLiquidity) {
        uint256 amount0;
        uint256 amount1;
        uint128 liquidityRemoved = _uint256ToUint128(
            IULMState(ulmState).calculateShare(liquidity, liquiditySharePercentage)
        );
        if (liquidity > 0) {
            (amount0, amount1) = pool.burn(tickLower, tickUpper, liquidityRemoved);
        }

        (uint256 collect0, uint256 collect1) = pool.collect(
            address(this),
            tickLower,
            tickUpper,
            MAX_UINT128,
            MAX_UINT128
        );

        removedLiquidity = RemoveLiquidity(
            amount0,
            amount1,
            liquidityRemoved,
            collect0.sub(amount0),
            collect1.sub(amount1)
        );
    }

    /// @dev Do zero-burns to poke a position on Uniswap so earned fees & feeGrowthGlobal of vault are updated
    function _collectPositionFees(address _pool) private {
        LiquidityPosition storage position = liquidityPositions[_pool];
        IUniswapV3Pool pool = IUniswapV3Pool(_pool);

        _updatePosition(position.baseTickLower, position.baseTickUpper, _pool);
        _updatePosition(position.rangeTickLower, position.rangeTickUpper, _pool);

        (uint256 collect0Base, uint256 collect1Base) = pool.collect(
            address(this),
            position.baseTickLower,
            position.baseTickUpper,
            MAX_UINT128,
            MAX_UINT128
        );

        (uint256 collect0Range, uint256 collect1Range) = pool.collect(
            address(this),
            position.rangeTickLower,
            position.rangeTickUpper,
            MAX_UINT128,
            MAX_UINT128
        );

        position.fees0 = position.fees0.add((collect0Base.add(collect0Range)));
        position.fees1 = position.fees1.add((collect1Base.add(collect1Range)));

        position.feeGrowthGlobal0 += FullMath.mulDiv(
            collect0Base + collect0Range,
            1e18,
            position.totalLiquidity
        );
        position.feeGrowthGlobal1 += FullMath.mulDiv(
            collect1Base + collect1Range,
            1e18,
            position.totalLiquidity
        );
    }

    function _increaseLiquidity(
        address sender,
        address pool,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 shares
    )
        private
        returns (
            uint256 amount0Base,
            uint256 amount1Base,
            uint256 amount0Range,
            uint256 amount1Range
        )
    {
        LiquidityPosition storage position = liquidityPositions[pool];
        IncreaseParams memory a;
        (a.token0, a.token1, a.fee, , , , a.currentTick) = IULMState(ulmState)
            .getPoolDetails(pool);

        if (
            a.currentTick < position.baseTickLower ||
            a.currentTick > position.baseTickUpper
        ) {
            (amount0Range, amount1Range) = _addRangeLiquidity(
                sender,
                pool,
                amount0Desired,
                amount1Desired,
                shares
            );
        } else {
            uint256 liquidityOffset = a.currentTick >= position.rangeTickLower &&
                a.currentTick <= position.rangeTickUpper
                ? 1
                : 0;
            (a.baseLiquidity, a.baseAmount0, a.baseAmount1, ) = _addLiquidityUniswap(
                AddLiquidityParams({
                    sender: sender,
                    token0: a.token0,
                    token1: a.token1,
                    fee: a.fee,
                    tickLower: position.baseTickLower,
                    tickUpper: position.baseTickUpper,
                    amount0Desired: amount0Desired - liquidityOffset,
                    amount1Desired: amount1Desired - liquidityOffset
                })
            );

            (a.rangeLiquidity, a.rangeAmount0, a.rangeAmount1, ) = _addLiquidityUniswap(
                AddLiquidityParams({
                    sender: sender,
                    token0: a.token0,
                    token1: a.token1,
                    fee: a.fee,
                    tickLower: position.rangeTickLower,
                    tickUpper: position.rangeTickUpper,
                    amount0Desired: amount0Desired - a.baseAmount0,
                    amount1Desired: amount1Desired - a.baseAmount1
                })
            );

            position.baseLiquidity += a.baseLiquidity;
            position.rangeLiquidity += a.rangeLiquidity;
            position.totalLiquidity += shares;
            (amount0Base, amount1Base) = (a.baseAmount0, a.baseAmount1);
            (amount0Range, amount1Range) = (a.rangeAmount0, a.rangeAmount1);
        }
    }

    
    function _addLiquidityInManager(AddLiquidityManagerParams memory params)
        private
        returns (
            uint256 amount0Base,
            uint256 amount1Base,
            uint256 amount0Range,
            uint256 amount1Range
        )
    {


        TokenDetails memory tokenDetails;
        (
            tokenDetails.token0,
            tokenDetails.token1,
            tokenDetails.fee,
            tokenDetails.poolCardinality,
            ,
            ,
            tokenDetails.currentTick
        ) = IULMState(ulmState).getPoolDetails(params.pool);
        LiquidityPosition storage position = liquidityPositions[params.pool];
        if (position.totalLiquidity > 0) {
            (amount0Base, amount1Base, amount0Range, amount1Range) = _increaseLiquidity(
                params.sender,
                params.pool,
                params.amount0Desired,
                params.amount1Desired,
                params.shares
            );
        } else {
            if (tokenDetails.poolCardinality == 1)
                IUniswapV3Pool(params.pool).increaseObservationCardinalityNext(80);

            // @dev calculate new ticks for base & range order
            Tick memory ticks;
            (
                ticks.baseTickLower,
                ticks.baseTickUpper,
                ticks.bidTickLower,
                ticks.bidTickUpper,
                ticks.rangeTickLower,
                ticks.rangeTickUpper
            ) = IUniStrategy(uniStrategy).getTicks(params.pool);

            if (position.baseTickLower != 0 && position.baseTickUpper != 0) {
                if (
                    tokenDetails.currentTick < position.baseTickLower ||
                    tokenDetails.currentTick > position.baseTickUpper
                ) {
                    (amount0Range, amount1Range) = _addRangeLiquidity(
                        params.sender,
                        params.pool,
                        params.amount0Desired,
                        params.amount1Desired,
                        params.shares
                    );
                }
            } else {
                (
                    tokenDetails.baseLiquidity,
                    tokenDetails.amount0Added,
                    tokenDetails.amount1Added,

                ) = _addLiquidityUniswap(
                    AddLiquidityParams({
                        sender: params.sender,
                        token0: tokenDetails.token0,
                        token1: tokenDetails.token1,
                        fee: tokenDetails.fee,
                        tickLower: ticks.baseTickLower,
                        tickUpper: ticks.baseTickUpper,
                        amount0Desired: params.amount0Desired,
                        amount1Desired: params.amount1Desired
                    })
                );

                (
                    position.baseLiquidity,
                    position.baseTickLower,
                    position.baseTickUpper
                ) = (
                    tokenDetails.baseLiquidity,
                    ticks.baseTickLower,
                    ticks.baseTickUpper
                );
                {
                    uint256 amount0 = params.amount0Desired.sub(
                        tokenDetails.amount0Added
                    );
                    uint256 amount1 = params.amount1Desired.sub(
                        tokenDetails.amount1Added
                    );

                    (tokenDetails.bidLiquidity, , ) = LiquidityReserves
                        .getLiquidityAmounts(
                            ticks.bidTickLower,
                            ticks.bidTickUpper,
                            0,
                            amount0,
                            amount1,
                            IUniswapV3Pool(params.pool)
                        );
                    (tokenDetails.rangeLiquidity, , ) = LiquidityReserves
                        .getLiquidityAmounts(
                            ticks.rangeTickLower,
                            ticks.rangeTickUpper,
                            0,
                            amount0,
                            amount1,
                            IUniswapV3Pool(params.pool)
                        );

                    // adding bid or range order on Uniswap depending on which token is left // "bug" with seprate positions
                    if (tokenDetails.bidLiquidity > tokenDetails.rangeLiquidity) {
                        (, amount0Range, amount1Range, ) = _addLiquidityUniswap(
                            AddLiquidityParams({
                                sender: params.sender,
                                token0: tokenDetails.token0,
                                token1: tokenDetails.token1,
                                fee: tokenDetails.fee,
                                tickLower: ticks.bidTickLower,
                                tickUpper: ticks.bidTickUpper,
                                amount0Desired: amount0,
                                amount1Desired: amount1
                            })
                        );

                        (
                            position.rangeLiquidity,
                            position.rangeTickLower,
                            position.rangeTickUpper
                        ) = (
                            tokenDetails.bidLiquidity,
                            ticks.bidTickLower,
                            ticks.bidTickUpper
                        );
                        (amount0Base, amount1Base) = (
                            tokenDetails.amount0Added,
                            tokenDetails.amount1Added
                        );
                    } else {
                        (, amount0Range, amount1Range, ) = _addLiquidityUniswap(
                            AddLiquidityParams({
                                sender: params.sender,
                                token0: tokenDetails.token0,
                                token1: tokenDetails.token1,
                                fee: tokenDetails.fee,
                                tickLower: ticks.rangeTickLower,
                                tickUpper: ticks.rangeTickUpper,
                                amount0Desired: amount0,
                                amount1Desired: amount1
                            })
                        );
                        (
                            position.rangeLiquidity,
                            position.rangeTickLower,
                            position.rangeTickUpper
                        ) = (
                            tokenDetails.rangeLiquidity,
                            ticks.rangeTickLower,
                            ticks.rangeTickUpper
                        );
                        (amount0Base, amount1Base) = (
                            tokenDetails.amount0Added,
                            tokenDetails.amount1Added
                        );
                    }
                }
                position.totalLiquidity = position.totalLiquidity.add(params.shares);
            }
        }
    }


    function _distributeFeesInPilot(
        address _recipient,
        address _token0,
        address _token1,
        uint256 _tokensOwed0,
        uint256 _tokensOwed1
    )
        private
        returns (
            uint256 _index0,
            uint256 _index1,
            uint256 _pilotAmount
        )
    {
        // if the incoming pair is weth pair then compute the amount
        // of PILOT w.r.t alt token amount and the weth amount
        if (_token0 == WETH || _token1 == WETH) {
            _pilotAmount = IOracle(oracle).getPilotAmountWethPair(
                _token1,
                _tokensOwed1,
                _tokensOwed0
            );

            if (_pilotAmount > 0) {
                IUnipilot(unipilot).mintPilot(_recipient, _pilotAmount);

                if (pilotSustainabilityFund.status)
                    IUnipilot(unipilot).mintPilot(
                        pilotSustainabilityFund.recipient,
                        FullMath.mulDiv(
                            _pilotAmount,
                            pilotSustainabilityFund.pilotPercentage,
                            100
                        )
                    );
            }

            if (_tokensOwed0 > 0)
                TransferHelper.safeTransfer(_token0, indexFund, _tokensOwed0);
            if (_tokensOwed1 > 0)
                TransferHelper.safeTransfer(_token1, indexFund, _tokensOwed1);
        } else {
            // if the incoming pair is alt pair then compute the amount
            // of PILOT w.r.t both alt tokens amount
            _pilotAmount = IOracle(oracle).getPilotAmountForTokens(
                _token0,
                _token1,
                _tokensOwed0,
                _tokensOwed1
            );
            IUnipilot(unipilot).mintPilot(_recipient, _pilotAmount);

            if (_tokensOwed0 > 0)
                TransferHelper.safeTransfer(_token0, indexFund, _tokensOwed0);
            if (_tokensOwed1 > 0)
                TransferHelper.safeTransfer(_token1, indexFund, _tokensOwed1);
        }
        _index0 = _tokensOwed0;
        _index1 = _tokensOwed1;
    }


    function _distributeFeesInTokens(
        bool wethToken,
        address _recipient,
        address _token0,
        address _token1,
        uint256 _tokensOwed0,
        uint256 _tokensOwed1
    ) private returns (uint256 _index0, uint256 _index1) {
        (
            uint256 _indexAmount0,
            uint256 _indexAmount1,
            uint256 _userBalance0,
            uint256 _userBalance1
        ) = IULMState(ulmState).getUserAndIndexShares(_tokensOwed0, _tokensOwed1);

        if (_tokensOwed0 > 0) {
            if (_token0 == WETH && !wethToken) {
                IWETH9(WETH).withdraw(_userBalance0);
                TransferHelper.safeTransferETH(_recipient, _userBalance0);
            } else {
                TransferHelper.safeTransfer(_token0, _recipient, _userBalance0);
            }
            TransferHelper.safeTransfer(_token0, indexFund, _indexAmount0);
        }
        if (_tokensOwed1 > 0) {
            TransferHelper.safeTransfer(_token1, _recipient, _userBalance1);
            TransferHelper.safeTransfer(_token1, indexFund, _indexAmount1);
        }
        _index0 = _indexAmount0;
        _index1 = _indexAmount1;
    }


    function _transferLiquidity(
        address _token0,
        address _token1,
        bool wethToken,
        address _recipient,
        uint256 amount0Removed,
        uint256 amount1Removed
    ) private {
        if (_token0 == WETH || _token1 == WETH) {
            (
                address tokenAlt,
                uint256 altAmount,
                address tokenWeth,
                uint256 wethAmount
            ) = _token0 == WETH
                    ? (_token1, amount1Removed, _token0, amount0Removed)
                    : (_token0, amount0Removed, _token1, amount1Removed);

            if (wethToken) {
                if (amount0Removed > 0)
                    TransferHelper.safeTransfer(tokenWeth, _recipient, wethAmount);
                if (amount1Removed > 0)
                    TransferHelper.safeTransfer(tokenAlt, _recipient, altAmount);
            } else {
                if (wethAmount > 0) unwrapWETH9(0, _recipient);
                if (altAmount > 0)
                    TransferHelper.safeTransfer(tokenAlt, _recipient, altAmount);
            }
        } else {
            if (amount0Removed > 0)
                TransferHelper.safeTransfer(_token0, _recipient, amount0Removed);
            if (amount1Removed > 0)
                TransferHelper.safeTransfer(_token1, _recipient, amount1Removed);
        }
    }

    function _distributeFeesAndLiquidity(DistributeFeesParams memory params)
        private
        returns (
            uint256 userAmount0,
            uint256 userAmount1,
            uint256 indexAmount0,
            uint256 indexAmount1,
            uint256 pilotAmount
        )
    {
        WithdrawTokenOwedParams memory a;
        LiquidityPosition storage position = liquidityPositions[params.pool];
        Position storage userPosition = positions[params.tokenId];
        (a.token0, a.token1, , , , , ) = IULMState(ulmState).getPoolDetails(params.pool);

        (
            a.tokensOwed0,
            a.tokensOwed1,
            a.feeGrowthGlobal0,
            a.feeGrowthGlobal1
        ) = IULMState(ulmState).getTokensOwedAmount(
            address(this),
            userPosition.pool,
            userPosition.liquidity,
            userPosition.feeGrowth0,
            userPosition.feeGrowth1
        );

        userPosition.tokensOwed0 += a.tokensOwed0;
        userPosition.tokensOwed1 += a.tokensOwed1;
        userPosition.feeGrowth0 = a.feeGrowthGlobal0;
        userPosition.feeGrowth1 = a.feeGrowthGlobal1;

        if (a.token0 == WETH || a.token1 == WETH) {
            (
                address tokenAlt,
                uint256 altAmount,
                address tokenWeth,
                uint256 wethAmount
            ) = a.token0 == WETH
                    ? (
                        a.token1,
                        userPosition.tokensOwed1,
                        a.token0,
                        userPosition.tokensOwed0
                    )
                    : (
                        a.token0,
                        userPosition.tokensOwed0,
                        a.token1,
                        userPosition.tokensOwed1
                    );

            if (
                params.pilotToken &&
                feesInPilot[params.pool] &&
                IOracle(oracle).checkWethPairsAndLiquidity(tokenAlt) != address(0)
            ) {
                (indexAmount0, indexAmount1, pilotAmount) = _distributeFeesInPilot(
                    params.recipient,
                    tokenWeth,
                    tokenAlt,
                    wethAmount,
                    altAmount
                );
            } else {
                (indexAmount0, indexAmount1) = _distributeFeesInTokens(
                    params.wethToken,
                    params.recipient,
                    tokenWeth,
                    tokenAlt,
                    wethAmount,
                    altAmount
                );
            }
        } else {

            address ethToken0Pair = IOracle(oracle).checkWethPairsAndLiquidity(a.token0);
            address ethToken1Pair = IOracle(oracle).checkWethPairsAndLiquidity(a.token1);

            if (
                params.pilotToken &&
                ethToken0Pair != address(0) &&
                ethToken1Pair != address(0)
            ) {
                (indexAmount0, indexAmount1, pilotAmount) = _distributeFeesInPilot(
                    params.recipient,
                    a.token0,
                    a.token1,
                    userPosition.tokensOwed0,
                    userPosition.tokensOwed1
                );
            } else {
                (indexAmount0, indexAmount1) = _distributeFeesInTokens(
                    params.wethToken,
                    params.recipient,
                    a.token0,
                    a.token1,
                    userPosition.tokensOwed0,
                    userPosition.tokensOwed1
                );
            }
        }

        _transferLiquidity(
            a.token0,
            a.token1,
            params.wethToken,
            params.recipient,
            params.amount0Removed,
            params.amount1Removed
        );

        (userAmount0, userAmount1) = (userPosition.tokensOwed0, userPosition.tokensOwed1);
        position.fees0 = position.fees0.sub(userPosition.tokensOwed0);
        position.fees1 = position.fees1.sub(userPosition.tokensOwed1);

        userPosition.tokensOwed0 = 0;
        userPosition.tokensOwed1 = 0;
        userPosition.liquidity = userPosition.liquidity.sub(params.liquidity);
    }

    function _removeLiquidityUniswap(
        bool isRebase,
        address pool,
        uint256 liquidity
    ) private returns (uint256 amount0Removed, uint256 amount1Removed) {
        LiquidityPosition storage position = liquidityPositions[pool];
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);

        uint256 liquiditySharePercentage = FullMath.mulDiv(
            liquidity,
            1e18,
            position.totalLiquidity
        );

        RemoveLiquidity memory bl = _removeLiquiditySingle(
            position.baseTickLower,
            position.baseTickUpper,
            position.baseLiquidity,
            liquiditySharePercentage,
            uniswapPool
        );
        RemoveLiquidity memory rl = _removeLiquiditySingle(
            position.rangeTickLower,
            position.rangeTickUpper,
            position.rangeLiquidity,
            liquiditySharePercentage,
            uniswapPool
        );

        position.fees0 = position.fees0.add(bl.feesCollected0.add(rl.feesCollected0));
        position.fees1 = position.fees1.add(bl.feesCollected1.add(rl.feesCollected1));

        position.feeGrowthGlobal0 += FullMath.mulDiv(
            bl.feesCollected0 + rl.feesCollected0,
            1e18,
            position.totalLiquidity
        );
        position.feeGrowthGlobal1 += FullMath.mulDiv(
            bl.feesCollected1 + rl.feesCollected1,
            1e18,
            position.totalLiquidity
        );

        amount0Removed = bl.amount0.add(rl.amount0);
        amount1Removed = bl.amount1.add(rl.amount1);

        if (!isRebase) {
            position.totalLiquidity = position.totalLiquidity.sub(liquidity);
        }

        position.baseLiquidity = position.baseLiquidity - bl.liquidityRemoved;
        position.rangeLiquidity = position.rangeLiquidity - rl.liquidityRemoved;

        // @dev reseting the positions to initial state if total liquidity of vault gets zero
        /// in order to calculate the amounts correctly from getSharesAndAmounts
        if (position.totalLiquidity == 0) {
            (position.baseTickLower, position.baseTickUpper) = (0, 0);
            (position.rangeTickLower, position.rangeTickUpper) = (0, 0);
        }
    }

    /// @notice Verify that caller should be the address of a valid Uniswap V3 Pool
    /// @param token0 The contract address of token0
    /// @param token1 The contract address of token1
    /// @param fee Fee tier of the pool
    function _verifyCallback(
        address token0,
        address token1,
        uint24 fee
    ) private view {
        require(msg.sender == getPoolAddress(token0, token1, fee));
    }

    function _uint256ToUint128(uint256 value) private pure returns (uint128) {
        assert(value <= type(uint128).max);
        return uint128(value);
    }
}
