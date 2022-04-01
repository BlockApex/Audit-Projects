// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./interfaces/IUnipilot.sol";
import "./interfaces/ILiquidityMigrator.sol";
import "./libraries/LiquidityReserves.sol";
import "./interfaces/uniswap/IULMState.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "./interfaces/uniswap/IUniswapLiquidityManager.sol";
import "./interfaces/external/IWETH9.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "./libraries/TransferHelper.sol";
import "./libraries/LiquidityAmounts.sol";

/// @title Uniswap V2,V3 & Sushiswap Liquidity Migrator
contract LiquidityMigrator is ILiquidityMigrator, IERC721Receiver, Context {
    using LowGasSafeMath for uint256;

    address private constant WETH9 = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address internal constant ULM_STATE = 0x93f4e5466417FcB20952e5B254028DC3258f20b8;
    address private constant POSITION_MANAGER =
        0xC36442b4a4522E871399CD717aBDD847Ab11FE88;

    fallback() external payable {}

    receive() external payable {}

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC721Receiver(0).onERC721Received.selector;
    }

    function migrateV2Liquidity(MigrateV2Params calldata params) external {
        require(params.percentageToMigrate > 0, "Percentage too small");
        require(params.percentageToMigrate <= 100, "Percentage too large");

        IUniswapV2Pair(params.pair).transferFrom(
            _msgSender(),
            params.pair,
            params.liquidityToMigrate
        );

        (uint256 amount0V2, uint256 amount1V2) = IUniswapV2Pair(params.pair).burn(
            address(this)
        );

        uint256 amount0ToMigrate = amount0V2.mul(params.percentageToMigrate) / 100;
        uint256 amount1ToMigrate = amount1V2.mul(params.percentageToMigrate) / 100;

        TransferHelper.safeApprove(
            params.token0,
            params.unipilotAddress,
            amount0ToMigrate
        );
        TransferHelper.safeApprove(
            params.token1,
            params.unipilotAddress,
            amount1ToMigrate
        );

        address pair = IULMState(ULM_STATE).getPoolAddress(
            params.token0,
            params.token1,
            params.fee
        );

        UnipilotAmounts memory v;
        if (pair != address(0)) {
            bytes memory data = abi.encode(params.fee, params.unipilotTokenId);
            (v.amount0Base, v.amount1Base, v.amount0Range, v.amount1Range, ) = IUnipilot(
                params.unipilotAddress
            ).deposit(
                    IHandler.DepositParams({
                        sender: _msgSender(),
                        exchangeAddress: params.liquidityManager,
                        token0: params.token0,
                        token1: params.token1,
                        amount0Desired: amount0ToMigrate,
                        amount1Desired: amount1ToMigrate
                    }),
                    data
                );
        } else {
            bytes[2] memory data = [
                abi.encode(params.fee, params.sqrtPriceX96),
                abi.encode(params.fee, 0)
            ];
            (v.amount0Base, v.amount1Base, v.amount0Range, v.amount1Range, ) = IUnipilot(
                params.unipilotAddress
            ).createPoolAndDeposit(
                    IHandler.DepositParams({
                        sender: _msgSender(),
                        exchangeAddress: params.liquidityManager,
                        token0: params.token0,
                        token1: params.token1,
                        amount0Desired: amount0ToMigrate,
                        amount1Desired: amount1ToMigrate
                    }),
                    data
                );
        }

        uint256 amount0V3 = v.amount0Base + v.amount0Range;
        uint256 amount1V3 = v.amount1Base + v.amount1Range;

        if (amount0V3 < amount0V2) {
            if (amount0V3 < amount0ToMigrate) {
                TransferHelper.safeApprove(params.token0, params.unipilotAddress, 0);
            }

            uint256 refund0 = amount0V2 - amount0V3;
            if (params.refundAsETH && params.token0 == WETH9) {
                IWETH9(WETH9).withdraw(refund0);
                TransferHelper.safeTransferETH(_msgSender(), refund0);
            } else {
                TransferHelper.safeTransfer(params.token0, _msgSender(), refund0);
            }
        }

        if (amount1V3 < amount1V2) {
            if (amount1V3 < amount1ToMigrate) {
                TransferHelper.safeApprove(params.token1, params.unipilotAddress, 0);
            }

            uint256 refund1 = amount1V2 - amount1V3;
            if (params.refundAsETH && params.token1 == WETH9) {
                IWETH9(WETH9).withdraw(refund1);
                TransferHelper.safeTransferETH(_msgSender(), refund1);
            } else {
                TransferHelper.safeTransfer(params.token1, _msgSender(), refund1);
            }
        }
    }

    function migrateV3Liquidity(MigrateV3Params calldata params) external {
        require(params.percentageToMigrate > 0, "Percentage too small");
        require(params.percentageToMigrate <= 100, "Percentage too large");

        UnipilotAmounts memory a;

        INonfungiblePositionManager positionManager = INonfungiblePositionManager(
            POSITION_MANAGER
        );

        positionManager.safeTransferFrom(
            _msgSender(),
            address(this),
            params.uniswapTokenId
        );

        (, , , , , , , uint128 liquidityV3, , , , ) = INonfungiblePositionManager(
            POSITION_MANAGER
        ).positions(params.uniswapTokenId);

        positionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: params.uniswapTokenId,
                liquidity: liquidityV3,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp + 120
            })
        );

        // returns the total amount of Liquidity with collected fees to user
        (uint256 amount0V3, uint256 amount1V3) = positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: params.uniswapTokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        uint256 amount0ToMigrate = amount0V3.mul(params.percentageToMigrate) / 100;
        uint256 amount1ToMigrate = amount1V3.mul(params.percentageToMigrate) / 100;

        // approve the Unipilot up to the maximum token amounts
        TransferHelper.safeApprove(
            params.token0,
            params.unipilotAddress,
            amount0ToMigrate
        );
        TransferHelper.safeApprove(
            params.token1,
            params.unipilotAddress,
            amount1ToMigrate
        );

        bytes memory data = abi.encode(params.fee, params.unipilotTokenId);
        (a.amount0Base, a.amount1Base, a.amount0Range, a.amount1Range, ) = IUnipilot(
            params.unipilotAddress
        ).deposit(
                IHandler.DepositParams({
                    sender: _msgSender(),
                    exchangeAddress: params.liquidityManager,
                    token0: params.token0,
                    token1: params.token1,
                    amount0Desired: amount0ToMigrate,
                    amount1Desired: amount1ToMigrate
                }),
                data
            );

        uint256 amount0Unipilot = a.amount0Base + a.amount0Range;
        uint256 amount1Unipilot = a.amount1Base + a.amount1Range;

        if (amount0Unipilot < amount0V3) {
            if (amount0Unipilot < amount0ToMigrate) {
                TransferHelper.safeApprove(params.token0, params.unipilotAddress, 0);
            }

            uint256 refund0 = amount0V3 - amount0Unipilot;
            if (params.refundAsETH && params.token0 == WETH9) {
                IWETH9(WETH9).withdraw(refund0);
                TransferHelper.safeTransferETH(_msgSender(), refund0);
            } else {
                TransferHelper.safeTransfer(params.token0, _msgSender(), refund0);
            }
        }

        if (amount1Unipilot < amount1V3) {
            if (amount1Unipilot < amount1ToMigrate) {
                TransferHelper.safeApprove(params.token1, params.unipilotAddress, 0);
            }

            uint256 refund1 = amount1V3 - amount1Unipilot;
            if (params.refundAsETH && params.token1 == WETH9) {
                IWETH9(WETH9).withdraw(refund1);
                TransferHelper.safeTransferETH(_msgSender(), refund1);
            } else {
                TransferHelper.safeTransfer(params.token1, _msgSender(), refund1);
            }
        }
    }
}
