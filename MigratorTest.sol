// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import "./UnipilotSetupTest.sol";
import "../UnipilotMigrator.sol";

contract MigratorTest is TestingSetup, IUnipilotMigrator {
    UnipilotMigrator uniMigrator;

    address popsicleUSDTWETH = 0x96B02776aE0Ebb8DEb33a75035FAb5b5d6Bbb43E;
    //0x4F65c0F7285D647e3b156C73CC5EBdC393d5AAd6;

    address WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address usdt = 0xdAC17F958D2ee523a2206206994597C13D831ec7;

    address impersonatorboi = 0xcF3F5b3Fc1c4abefFfAdbA2BD18F533FfA2a6724;

    address nftPosMgr = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    address uniboi = 0xde5bF92E3372AA59C73Ca7dFc6CEc599E1B2b08C;
    address ulm = 0xA7979d0592ecfC59b082552828FF36209ec94B11;

    function setUp() public override {
        super.setUp();
        uniMigrator = new UnipilotMigrator(nftPosMgr, uniboi, ulm);
    }

    //============================================================HELPER============================================================

    // function _sortWethAmount(
    //     address _token0,
    //     address _token1,
    //     uint256 _amount0,
    //     uint256 _amount1
    // )
    //     private
    //     view
    //     returns (
    //         address tokenAlt,
    //         uint256 altAmount,
    //         address tokenWeth,
    //         uint256 wethAmount
    //     )
    // {
    //     // (
    //     //     address tokenA,
    //     //     address tokenB,
    //     //     uint256 amountA,
    //     //     uint256 amountB
    //     // ) = _token0 == WETH
    //     //         ? (_token0, _token1, _amount0, _amount1)
    //     //         : (_token0, _token1, _amount1, _amount0);

    //     (tokenAlt, altAmount, tokenWeth, wethAmount) = _token0 == WETH
    //         ? (_token1, _amount1, _token0, _amount0)
    //         : (_token0, _amount0, _token1, _amount1);
    //         // : (tokenA, amountA, tokenB, amountB);
    // }

    //============================================================TESTCASES============================================================

    function testMigrationToPopsicle() public {
        UnipilotActiveVault vault0 = setupCreateVault(
            weth,
            usdt,
            500,
            "weth usdt vault on unipilot",
            "wethusdtUniActive"
        );

        vm.prank(impersonatorboi);
        uint256 shahrukhsuggestion = IERC20(popsicleUSDTWETH).balanceOf(impersonatorboi);

        MigrateV2Params memory params = MigrateV2Params({
            pair: popsicleUSDTWETH,
            vault: address(vault0),
            token0: usdt,
            token1: weth,
            percentageToMigrate: 100,
            liquidityToMigrate: shahrukhsuggestion, //7640125693633358136
            refundAsETH: false
        });

        vm.roll(1000);
        vm.prank(impersonatorboi);
        IERC20(params.pair).approve(
            address(uniMigrator),
            7640125693633358136000000000000000000000
        );

        // vm.prank(impersonatorboi);
        // IERC20(params.pair).approve(address(this), 7640125693633358136);

        // vm.prank(impersonatorboi);
        // IERC20(params.pair).approve(governance, 7640125693633358136);
        vm.roll(10000);
        vm.prank(impersonatorboi);
        IPopsicleV3Optimizer(0x96B02776aE0Ebb8DEb33a75035FAb5b5d6Bbb43E).withdraw(
            shahrukhsuggestion,
            impersonatorboi
        );
        // uniMigrator.migratePopsicleLiquidity(params);
    }

    // function testSort() public view {
    //     address _token0 = WETH;
    //     address _token1 = 0x3391D492c80198847DaA9fDEefc521b1487EC0fD;
    //     uint256 _amount0 = 10;
    //     uint256 _amount1 = 20;

    //     (,,address res,uint256 amWeth) = _sortWethAmount(_token1, _token0, _amount0, _amount1);
    //     require(res == WETH,"doesnt work");
    //     require(amWeth == 20,"amount broken");
    // }
}
