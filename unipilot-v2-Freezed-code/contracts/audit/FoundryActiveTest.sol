// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import { encodePriceSqrt } from "./utils/Math.sol";
import "./UnipilotSetupTest.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FoundryActiveTestsOnly is ActiveTesting {
    function setUp() public override {
        super.setUp();
    }

    function testSwapPercentage() public {
        vm.startPrank(governance);

        UnipilotActiveVault vault0 = setupActiveVault(
            address(token0),
            address(token1),
            3000,
            encodePriceSqrt(1, 1),
            "someName",
            "someSymbol"
        );
        vm.warp(100000);

        uaf.toggleWhitelistAccount(address(vault0));

        //deposite to uniswap
        vm.prank(address(vault0));
        mintToV3(userx, pool, 100 ether, userx);

        //deposite in protocol
        vm.warp(100000);
        vm.prank(user1);
        vault0.deposit(100 ether, 100 ether, user1);
        vm.warp(100000);

        //swap
        vm.prank(userx);
        swapFunction(address(token0), address(token1), 1120 ether, 3000);
        vm.warp(100000);

        //pulled
        vm.warp(100000);
        vm.prank(governance);
        vault0.pullLiquidity(address(vault0));
        vm.warp(100000);

        //balance ofvault
        token0.balanceOf(address(vault0));
        token1.balanceOf(address(vault0));

        vm.warp(100000000);
        vault0.readjustLiquidity();

        vm.stopPrank();

    }

    //  function testSixtytwo() public {
    //      vm.startPrank(governance);

    // UnipilotActiveVault vault0 = setupActiveVault(
    //     address(token0),
    //     address(token1),
    //     3000,
    //     encodePriceSqrt(1, 2),
    //     "someName",
    //     "someSymbol"
    // );
    // vm.warp(100000);

    //      vm.prank(address(vault0));
    // mintToV3(userx, pool, 250 ether, userx);

    //      vm.warp(100000);
    // vm.prank(user1);
    // vault0.deposit(0 ether, 0 ether, user1);
    // vm.warp(100000);

    //     //@audit atleast tell me you r not depositing shit

    // }

    // function testSixtythree() public {
    //          vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 2),
    //         "someName",
    //         "someSymbol"
    //     );
    //     vm.warp(100000);

    //          vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //          vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(0 ether, 100 ether, user1);
    //     vm.warp(100000);

    // }

    //  function testSeventyFour() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 2),
    //         "someName",
    //         "someSymbol"
    //     );
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     // token0.balanceOf(user1);
    //     // token1.balanceOf(user1);

    //     // token0.balanceOf(address(vault0));
    //     // token1.balanceOf(address(vault0));

    //     // token0.balanceOf(pool);
    //     // token1.balanceOf(pool);

    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(userx);
    //     swapFunction(address(token0), address(token1), 200 ether, 3000);
    //     vm.warp(100000);
    //     vm.prank(user2);
    //     vault0.deposit(100 ether, 100 ether, user2);
    //     vm.warp(100000);
    //     vm.prank(userx);
    //     swapFunction(address(token1), address(token0), 200 ether, 3000);
    //     vm.warp(100000);
    //     vm.prank(user3);
    //     vault0.deposit(100 ether, 100 ether, user3);
    //     vm.warp(100000);
    //     vm.prank(userx);
    //     swapFunction(address(token0), address(token1), 200 ether, 3000);
    //     vm.warp(100000);
    //     vm.prank(user4);
    //     vault0.deposit(100 ether, 100 ether, user4);
    //     vm.warp(100000);
    //     vm.prank(userx);
    //     swapFunction(address(token1), address(token0), 200 ether, 3000);
    //     vm.warp(100000);
    //     vm.prank(user5);
    //     vault0.deposit(100 ether, 100 ether, user5);
    //     vm.warp(100000);
    //     vm.prank(userx);
    //     swapFunction(address(token0), address(token1), 200 ether, 3000);
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    // vm.warp(100000);
    // vault0.pullLiquidity();
    // vm.warp(100000);

    //     vm.prank(user1);
    //     vault0.withdraw(100000000000000000000, user1, false);
    //     vm.warp(100000);

    //     vm.prank(user2);
    //     vault0.withdraw(66387895586163651690, user1, false);
    //     vm.warp(100000);

    //     vm.prank(user3);
    //     vault0.withdraw(79619315091761327945, user1, false);
    //     vm.warp(100000);

    //     vm.prank(user4);
    //     vault0.withdraw(98643727280849380582, user1, false);
    //     vm.warp(100000);

    //     vm.prank(user5);
    //     vault0.withdraw(76418691774172164336, user1, false);
    //     vm.warp(100000);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.stopPrank();

    //     //@audit token bht bach rahe hayn contract k pas

    // }

    // function testSendLpToVault() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );
    //     vm.warp(100000);

    //     vm.prank(user1);
    //     (uint lp , ,) = vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     IERC20(address(vault0)).approve(address(vault0), 119805497901786913951);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     IERC20(address(vault0)).transfer(address(vault0), 100000000000000000000);
    //     vm.warp(100000);
    //     IERC20(address(vault0)).balanceOf(address(vault0));

    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);

    //     vm.prank(user2);
    //     vault0.deposit(100 ether, 100 ether, user2);
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     vault0.withdraw(100000000000000000000, address(vault0), false);
    //     vm.warp(100000);

    //     vm.prank(user1);
    //     vault0.withdraw(100000000000000000000, user1, false);
    //     vm.warp(100000);

    //     vm.prank(user2);
    //     vault0.withdraw(100000000000000000000, user2, false);
    //     vm.warp(100000);

    //     // vm.prank(user1);
    //     // vault0.deposit(100 ether, 100 ether, user1);
    //     // vm.warp(100000);

    //     // uint256 templp;
    //     // for (uint256 index = 0; index < 5; index++) {
    //     //     vm.warp(100000);
    //     // vm.prank(user1);
    //     // (uint256 llp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //     // vm.warp(100000);
    //     //     templp += llp;
    //     //     vm.prank(userx);
    //     //     swapFunction(address(token0), address(token1), 200 ether, 3000);
    //     //     vm.warp(100000);
    //     // }

    //     // vm.prank(address(vault0));
    //     // mintToV3(userx, pool, 250 ether, userx);

    //     // vm.warp(100000);
    //     // vault0.pullLiquidity(governance);

    //     // for (uint256 index = 0; index < 5; index++) {
    //     //     vm.prank(user1);
    //     //     (uint256 lllp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //     //     templp += lllp;
    //     //     vm.warp(100000);
    //     // }

    //     // vm.warp(100000);
    //     // vm.roll(block.number + 10);
    //     // vm.warp(100000);
    //     // vm.warp(100000);
    //     // vm.warp(100000);
    //     // vm.warp(100000);
    //     // vm.roll(block.number + 10);
    //     // vm.warp(100000);
    //     // vm.warp(100000);

    //     // vm.prank(user1);
    //     // vault0.withdraw(100 ether, user1, true);

    //     // token0.balanceOf(pool);
    //     // token1.balanceOf(pool);

    //     // vm.warp(100000);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.stopPrank();

    //     // //@audit token bht bach rahe hayn contract k pas
    // }

    // function testSeventyFiveOptimized() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     uint256 templp;
    //     for (uint256 index = 0; index < 5; index++) {
    //         vm.warp(100000);
    //         vm.prank(user1);
    //         (uint256 llp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //         vm.warp(100000);
    //         templp += llp;
    //         vm.prank(userx);
    //         swapFunction(address(token0), address(token1), 200 ether, 3000);
    //         vm.warp(100000);
    //     }

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     vm.warp(100000);
    //     vault0.pullLiquidity(governance);

    //     for (uint256 index = 0; index < 5; index++) {
    //         vm.prank(user1);
    //         (uint256 lllp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //         templp += lllp;
    //         vm.warp(100000);
    //     }

    //     vm.warp(100000);
    //     vm.roll(block.number + 10);
    //     vm.warp(100000);
    //     vm.warp(100000);
    //     vm.warp(100000);
    //     vm.warp(100000);
    //     vm.roll(block.number + 10);
    //     vm.warp(100000);
    //     vm.warp(100000);

    //     vm.prank(user1);
    //     vault0.withdraw(100 ether, user1, true);

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.stopPrank();

    //     //@audit token bht bach rahe hayn contract k pas
    // }

    // function testSeventyFive() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     uint256 templp;
    //     for (uint256 index = 0; index < 5; index++) {
    //         vm.warp(100000);
    //         vm.prank(user1);
    //         (uint256 llp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //         vm.warp(100000);
    //         templp += llp;
    //         vm.prank(userx);
    //         swapFunction(address(token0), address(token1), 200 ether, 3000);
    //         vm.warp(100000);
    //     }

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     vm.warp(100000);
    //     vault0.pullLiquidity(governance);

    //     for (uint256 index = 0; index < 5; index++) {
    //         vm.prank(user1);
    //         (uint256 lllp, , ) = vault0.deposit(100 ether, 100 ether, user1);
    //         templp += lllp;
    //         vm.warp(100000);
    //     }

    //     vm.warp(100000);
    //     vm.warp(100000);
    //     vm.roll(block.number + 10);

    //     vm.prank(user1);
    //     vault0.withdraw(100 ether, user1, true);

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.stopPrank();

    //     //@audit token bht bach rahe hayn contract k pas
    // }

    // function testeightytwo() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    // vm.prank(user1);
    // vault0.deposit(100 ether, 100 ether, user1);
    // vm.warp(100000);
    // vm.prank(user1);
    // vault0.deposit(100 ether, 100 ether, user1);
    // vm.warp(100000);
    // vm.prank(user1);
    // vault0.deposit(100 ether, 100 ether, user1);
    // vm.warp(100000);
    // vm.prank(user1);
    // vault0.deposit(100 ether, 100 ether, user1);
    // vm.warp(100000);
    // vm.prank(user1);
    // vault0.deposit(100 ether, 100 ether, user1);
    // vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    // vm.prank(user1);
    // swapFunction(address(token0), address(token1), 2000 ether, 3000);

    // vm.warp(100000);
    // vault0.pullLiquidity();

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000000);
    //     vault0.readjustLiquidity();

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.warp(100000000);

    //     vm.prank(user1);
    //     swapFunction(address(token0), address(token1), 200 ether, 3000);
    //     vm.warp(100000000);
    //     vm.prank(user2);
    //     swapFunction(address(token1), address(token0), 200 ether, 3000);
    //     vm.warp(100000000);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000000);
    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     vm.warp(100000000);

    // vm.prank(user1);
    // vault0.withdraw(700000000000000000000, user1, false);
    // vm.warp(100000000);
    // vm.stopPrank();
    // }

    // function testeightythree() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user2);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user3);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user4);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user5);
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 10 ether, userx);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    //     vm.prank(user1);
    //     swapFunction(address(token0), address(token1), 2000 ether, 3000);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000000);
    //     vault0.readjustLiquidity();
    //     vm.stopPrank();
    // }

    // function testeightytwo() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 1),
    //         "someName",
    //         "someSymbol"
    //     );

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);
    //     vm.prank(user1);
    //     vault0.deposit(100 ether, 100 ether, user1);
    //     vm.warp(100000);

    //     vm.prank(address(vault0));
    //     mintToV3(userx, pool, 250 ether, userx);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    //     vm.prank(user1);
    //     swapFunction(address(token0), address(token1), 2000 ether, 3000);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000000);
    //     vault0.readjustLiquidity();
    //     vm.stopPrank();
    // }

    // function testFiftySix() public {
    //     vm.startPrank(governance);

    //     UnipilotActiveVault vault0 = setupActiveVault(
    //         address(token0),
    //         address(token1),
    //         3000,
    //         encodePriceSqrt(1, 2),
    //         "someName",
    //         "someSymbol"
    //     );

    //     vm.prank(user1);
    //     vault0.deposit(10 ether, 10 ether, user1);
    //     vm.prank(user2);
    //     vault0.deposit(10 ether, 10 ether, user2);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.warp(100000);

    //     vm.prank(user1);
    //     vault0.withdraw(10000000000000000000, user1, false);

    //     token0.balanceOf(user1);
    //     token1.balanceOf(user1);

    //     token0.balanceOf(address(vault0));
    //     token1.balanceOf(address(vault0));

    //     token0.balanceOf(pool);
    //     token1.balanceOf(pool);

    //     vm.stopPrank();

    //     require(address(vault0) != address(0), "not good");
    // }
}
