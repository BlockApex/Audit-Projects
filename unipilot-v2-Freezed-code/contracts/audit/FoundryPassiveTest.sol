// // SPDX-License-Identifier: MIT
// pragma solidity 0.7.6;
// pragma abicoder v2;

// import "./UnipilotSetupTest.sol";
// import "../test/TestERC20.sol";
// import { encodePriceSqrt } from "./utils/Math.sol";
// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";

// interface Vm {
//     function expectEmit(
//         bool,
//         bool,
//         bool,
//         bool
//     ) external;

//     function expectRevert(bytes memory) external;

//     function prank(address) external;

//     function warp(uint256) external;

//     function startPrank(address) external;

//     function stopPrank() external;

//     function deal(address, uint256) external;

//     function addr(uint256) external returns (address);

//     function getCode(string calldata) external returns (bytes memory);
// }

// contract Test {
//     Vm public constant vm =
//         Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

//     function deployCode(string memory what) public returns (address addr) {
//         bytes memory bytecode = vm.getCode(what);
//         assembly {
//             addr := create(0, add(bytecode, 0x20), mload(bytecode))
//         }
//     }
// }

// contract PassiveTesting is Test {
//     TestERC20 token0;
//     TestERC20 token1;

//     UnipilotSetup setup;

//     address governance = vm.addr(1);
//     address indexFund = vm.addr(2);
//     address newGov = vm.addr(3);
//     address newIF = vm.addr(4);

//     address user1 = vm.addr(5);

//     function setUp() public {
//         setup = new UnipilotSetup();
//         setup.setUp(governance, indexFund);

//         token0 = new TestERC20(1e12 ether);
//         token1 = new TestERC20(1e12 ether);

//         token0.transfer(user1, 100 ether);
//         token1.transfer(user1, 100 ether);

//     }

//     // =====================================PASSIVE FACTORY & VAULT TESTING ==========================

    


//     //     address user2 = vm.addr(6);
//     // address user3 = vm.addr(7);
//     // address user4 = vm.addr(8);
//     // address user5 = vm.addr(9);

//     //     token0.transfer(user2, 100 ether);
//     //     token1.transfer(user2, 100 ether);

//     //     token0.transfer(user3, 100 ether);
//     //     token1.transfer(user3, 100 ether);

//     //     token0.transfer(user4, 100 ether);
//     //     token1.transfer(user4, 100 ether);

//     //     token0.transfer(user5, 100 ether);
//     //     token1.transfer(user5, 100 ether);


//     // function testDepositMultipleTimesAndUsersThenPLThenDepositThenCheckDust()
//     //     public
//     // {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     vm.prank(user1);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user1);

//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user2);

//     //     vm.prank(user3);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user3);

//     //     vm.prank(user4);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user4);

//     //     vm.prank(user5);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user5);

//     //     vm.prank(governance);
//     //     IUnipilotVault(vault0).pullLiquidity();
        
//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));

//     //     vm.prank(user1);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user1);

//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user2);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));
//     // }

//     // function testSpecialDepositWithDifferentUsers() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     vm.prank(user1);
//     //     IUnipilotVault(vault0).deposit(10000000, 10000000, user1);

//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).deposit(10000000, 10000000, user2);

//     //     vm.prank(user3);
//     //     IUnipilotVault(vault0).deposit(10000000, 10000000, user3);

//     //     vm.warp(10000);
//     //     vm.prank(user1);
//     //     IUnipilotVault(vault0).withdraw(10000000, user1, false);

//     //     vm.warp(100000);
//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).withdraw(10000001, user2, false);

//     //     vm.warp(1000000);
//     //     vm.prank(user3);
//     //     IUnipilotVault(vault0).withdraw(10000001, user3, false);

//     //     token0.balanceOf(user1);
//     //     token1.balanceOf(user1);

//     //     token0.balanceOf(user2);
//     //     token1.balanceOf(user2);

//     //     token0.balanceOf(user3);
//     //     token1.balanceOf(user3);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));

//     // }

//     // function testDepositMultipleTimesThenPullLiquidityThenDepositThenCheckDust() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     vm.startPrank(user1);

//     //     token0.balanceOf(user1);
//     //     token1.balanceOf(user1);

//     //     IUnipilotVault(vault0).deposit(10, 10, user1);
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);

//     //     vm.prank(governance);
//     //     IUnipilotVault(vault0).pullLiquidity();

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));

//     //     IUnipilotVault(vault0).deposit(10, 10, user1);
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);

//     //     vm.stopPrank();

//     //     token0.balanceOf(user1);
//     //     token1.balanceOf(user1);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));
//     // }

//     // function testDepositWithAZeroAmount() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     vm.startPrank(user1);

//     //     IUnipilotVault(vault0).deposit(10, 10, user1);
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);

//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).deposit(10, 10, user2);

//     //     vm.prank(user2);
//     //     IUnipilotVault(vault0).deposit(10, 10, user2);

//     //     vm.prank(user3);
//     //     IUnipilotVault(vault0).deposit(10, 10, user3);

//     //     vm.prank(user3);
//     //     IUnipilotVault(vault0).deposit(10, 10, user3);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));

//     //     vm.stopPrank();
//     // }

//     // function testDepositTwiceWith1To2() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     vm.startPrank(user1);

//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user1);
//     //     vm.warp(100000);
//     //     IUnipilotVault(vault0).deposit(10 ether, 10 ether, user1);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));
//     //     vm.stopPrank();
//     // }

//     // function testDepositOnceWith1To2() public {
//     //     vm.startPrank(user1);

//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         2,
//     //         "v0",
//     //         "V0"
//     //     );
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);

//     //     token0.balanceOf(user1);
//     //     token1.balanceOf(user1);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));
//     // }

//     // function testDepositOnceWith1To1() public {
//     //     vm.startPrank(user1);

//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         1,
//     //         "v0",
//     //         "V0"
//     //     );
//     //     IUnipilotVault(vault0).deposit(10, 10, user1);
//     // }

//     // TestERC20 token2;
//     // TestERC20 token3;
//     // TestERC20 token4;
//     // TestERC20 token5;
//     // TestERC20 token6;
//     // TestERC20 token7;
//     // TestERC20 token8;
//     // TestERC20 token9;

//     // token2 = new TestERC20(1e12 ether);
//     // token3 = new TestERC20(1e12 ether);
//     // token4 = new TestERC20(1e12 ether);
//     // token5 = new TestERC20(1e12 ether);
//     // token6 = new TestERC20(1e12 ether);
//     // token7 = new TestERC20(1e12 ether);
//     // token8 = new TestERC20(1e12 ether);
//     // token9 = new TestERC20(1e12 ether);

//     // function testCreateVaultWithDifferentFees() public {
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         1,
//     //         "v0",
//     //         "V0"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token2),
//     //         3000,
//     //         1,
//     //         "v1",
//     //         "V1"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token3),
//     //         3000,
//     //         1,
//     //         "v2",
//     //         "V2"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token4),
//     //         3000,
//     //         1,
//     //         "v3",
//     //         "V3"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token5),
//     //         3000,
//     //         1,
//     //         "v4",
//     //         "V4"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token6),
//     //         3000,
//     //         1,
//     //         "v5",
//     //         "V5"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token7),
//     //         3000,
//     //         1,
//     //         "v6",
//     //         "V6"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token8),
//     //         3000,
//     //         1,
//     //         "v7",
//     //         "V7"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token9),
//     //         3000,
//     //         1,
//     //         "v8",
//     //         "V8"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token1),
//     //         address(token2),
//     //         3000,
//     //         1,
//     //         "v9",
//     //         "V9"
//     //     );
//     //     setup.setupPassiveVault(
//     //         address(token1),
//     //         address(token3),
//     //         3000,
//     //         1,
//     //         "v10",
//     //         "V10"
//     //     );
//     // }

//     // function testCreateVaultWithAZeroToken() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(0),
//     //         3000,
//     //         1,
//     //         "v0",
//     //         "V0"
//     //     );
//     //     require(vault0 != address(0), "failed to create vault");
//     // }

//     // function testCreateVaultWithSameTokens() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token0),
//     //         3000,
//     //         1,
//     //         "v0",
//     //         "V0"
//     //     );

//     //     require(vault0 != address(0), "failed to create vault");
//     // }

//     // function testCreateVaultWithLigitValues() public {
//     //     address vault0 = setup.setupPassiveVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         1,
//     //         "v0",
//     //         "V0"
//     //     );
//     //     require(vault0 != address(0), "failed to create vault");
//     // }

//     // function testCallSetUnipilotDetailsWithNewDetails() public {
//     //     setUp();

//     //     vm.startPrank(governance);
//     //     setup.init(newGov, newIF);
//     //     setup.upf().setUnipilotDetails(
//     //         address(setup.us()),
//     //         setup.indexFund(),
//     //         10
//     //     );
//     //     vm.stopPrank();
//     // }

//     // function testCallSetUnipilotDetailsWithOldDetails() public {
//     //     vm.startPrank(governance);
//     //     setup.upf().setUnipilotDetails(
//     //         address(setup.us()),
//     //         setup.indexFund(),
//     //         10
//     //     );
//     //     vm.stopPrank();
//     // }

//     // function testCallSetUnipilotDetailsFromNewOwner() public {
//     //     vm.startPrank(governance);
//     //     setup.upf().setGovernance(newGov);
//     //     vm.startPrank(newGov);
//     //     setup.upf().setUnipilotDetails(
//     //         address(setup.us()),
//     //         setup.indexFund(),
//     //         10
//     //     );
//     //     vm.stopPrank();
//     // }

//     // function testCallSetUnipilotDetailsFromOldOwner() public {
//     //     vm.startPrank(governance);
//     //     setup.upf().setGovernance(newGov);
//     //     setup.upf().setUnipilotDetails(address(setup.us()), setup.indexFund(), 10);
//     //     vm.stopPrank();
//     // }

//     // function testCallSetGovernanceFromOldOwner() public {
//     //     vm.startPrank(governance);
//     //     setup.upf().setGovernance(newGov);
//     //     setup.upf().setGovernance(governance);
//     //     vm.stopPrank();
//     // }

//     // function testSetGovernanceToNewOwner() public {
//     //     vm.startPrank(governance);
//     //     setup.upf().setGovernance(newGov);
//     //     vm.stopPrank();
//     // }

//     //===========================================================================================================

//     // function testDepositOnceWith1To1() public {
//     //     vm.startPrank(governance);

//     //     address vault0 = setup.uaf().createVault(
//     //         address(token0),
//     //         address(token1),
//     //         3000,
//     //         encodePriceSqrt(1, 1),
//     //         "v0",
//     //         "V0"
//     //     );
//     //     address pool = IUniswapV3Factory(setup.v3Factory()).getPool(
//     //         address(token0),
//     //         address(token1),
//     //         3000
//     //     );

//     //     address[1] memory poolArr = [pool];
//     //     int24[1] memory tickArr = [int24(600)];

//     //     // poolArr[0] = pool;
//     //     // tickArr[0] = int24(600);

//     //     setup.us().setBaseTicks(poolArr, tickArr);
//     //     IUnipilotActiveVault(vault0).init();
//     //     IUnipilotActiveVault(vault0).deposit(10, 10, user1);

//     //     token0.balanceOf(user1);
//     //     token1.balanceOf(user1);

//     //     token0.balanceOf(address(vault0));
//     //     token1.balanceOf(address(vault0));
//     // }
// }
