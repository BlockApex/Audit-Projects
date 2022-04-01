// // SPDX-License-Identifier: MIT
// pragma solidity 0.7.6;
// pragma abicoder v2;

// import "./UnipilotSetupTest.sol";

// contract SwapFormulaTester is TestingSetup {
//     // address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;    
//     // address usdt = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
//     // address whale = 0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9;
    
//     address user1impersonator = 0x00926e7ebC1791bbebAC76564B48fbeA3F5F27EC;
    
//     function setUp() public override {
//         super.setUp();
        
//         token0.transfer(user1impersonator, 100000 ether);
//         token1.transfer(user1impersonator, 100000 ether);
//     }

//     function testSomething() public {
//         address _pool = createPoolInV3(address(token0), address(token1), 3000);
        
//         //0x4e68ccd3e89f51c3074ca5072bbac773960dfa36 // weth:usdt pool at v3
        
//         vm.prank(user1impersonator);
//         token0.balanceOf(user1impersonator);
//         token1.balanceOf(user1impersonator);
        
//         swapInV3Pool(address(token0), address(token1), 100 ether, 3000);

//         vm.prank(user1impersonator);
//         mintInV3Pool(user1impersonator, _pool, 10 ether, user1impersonator);
        

//         token0.balanceOf(pool);
//         token1.balanceOf(pool);

//         require(_pool != address(0));
//     }
// }
