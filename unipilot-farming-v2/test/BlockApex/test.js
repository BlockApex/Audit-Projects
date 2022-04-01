const { expect } = require("chai");
const {network,waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const Web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack, parseUnits , AbiCoder, parseEther } = require("ethers/lib/utils");
const { Console, count } = require("console");
const { BigNumberish, Signer , constants} = require("ethers");
const { SignerWithAddress } = require ("@nomiclabs/hardhat-ethers/signers");
var Eth = require('web3-eth');
var RLP = require("rlp");
var {BigNumber} = require('bignumber.js')
var bn = require('bignumber.js');
const { connect } = require("http2");
const hre = require("hardhat");
const { ecsign } = require("ethereumjs-util");
const assert = require("assert");
const { Contract, ContractFactory } = require ("@ethersproject/contracts");
const { AbiItem } = require ("web3-utils");
let abiCoder = new AbiCoder();
var web3 = new Web3(provider);

describe("Game Begins", async function () {

    async function advanceBlock() {
        return ethers.provider.send("evm_mine", [])
      }
    async function advanceBlockTo(blockNumber) {
        for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i++) {
          await advanceBlock()
        }
    }

 
    const [Me, User1, User2, User3, User4, User5] = provider.getWallets();

    let lp1;
    let lp2;
    let lp3;
    let vault1;
    let vault2;
    let vault3;
    let pilot;
    let alt;
    let farming;
    let partner;
    let usdt;
    let decimalToken;
    
    beforeEach("Preparing Contracts", async function () {


    let LP1 = await ethers.getContractFactory("TestERC20");
    lp1 = await LP1.deploy(ethers.utils.parseEther("600000"));
    await lp1.deployed();  

    let LP2 = await ethers.getContractFactory("TestERC20");
    lp2 = await LP2.deploy(ethers.utils.parseEther("600000"));
    await lp2.deployed();

    let LP3 = await ethers.getContractFactory("TestERC20");
    lp3 = await LP3.deploy(ethers.utils.parseEther("600000"));
    await lp3.deployed();

    let Pilot = await ethers.getContractFactory("TestERC20");
    pilot = await Pilot.deploy(ethers.utils.parseEther("100000"));
    await pilot.deployed();

    let DecimalToken = await ethers.getContractFactory("ERC20T");
    decimalToken = await DecimalToken.deploy("Test", "TEST" , "8");
    await decimalToken.deployed();

    let USDT = await ethers.getContractFactory("TestERC20");
    usdt = await USDT.deploy(ethers.utils.parseEther("100000"));
    await usdt.deployed();

    let Alt = await ethers.getContractFactory("TestERC20");
    alt = await Alt.deploy(ethers.utils.parseEther("100000"));
    await alt.deployed();

    let Partner = await ethers.getContractFactory("TestERC20");
    partner = await Partner.deploy(ethers.utils.parseEther("100000"));
    await partner.deployed();

    let Farming = await ethers.getContractFactory("UnipilotFarm");
    farming = await Farming.deploy(Me.address , pilot.address , ethers.utils.parseEther("1"));
    await farming.deployed();  

    await lp1.transfer(User1.address , ethers.utils.parseEther("100000"));
    await lp1.transfer(User2.address , ethers.utils.parseEther("100000"));
    await lp1.transfer(User3.address , ethers.utils.parseEther("100000"));
    await lp1.transfer(User4.address , ethers.utils.parseEther("100000"));
    await lp1.transfer(User5.address , ethers.utils.parseEther("100000"));
    await lp2.transfer(User1.address , ethers.utils.parseEther("100000"));
    await lp2.transfer(User2.address , ethers.utils.parseEther("100000"));
    await lp2.transfer(User3.address , ethers.utils.parseEther("100000"));
    await lp2.transfer(User4.address , ethers.utils.parseEther("100000"));
    await lp2.transfer(User5.address , ethers.utils.parseEther("100000"));
    await lp3.transfer(User1.address , ethers.utils.parseEther("100000"));
    await lp3.transfer(User2.address , ethers.utils.parseEther("100000"));
    await lp3.transfer(User3.address , ethers.utils.parseEther("100000"));
    await lp3.transfer(User4.address , ethers.utils.parseEther("100000"));
    await lp3.transfer(User5.address , ethers.utils.parseEther("100000"));
    await pilot.transfer(farming.address , ethers.utils.parseEther("100000"));
    await alt.transfer(farming.address , ethers.utils.parseEther("100000"));

    await decimalToken.approve(farming.address , ethers.utils.parseEther("100000000"));
    await decimalToken.transfer(farming.address , ethers.utils.parseUnits("10000000" , 4));


    await partner.transfer(farming.address , ethers.utils.parseEther("100000"));

    let balcon = await decimalToken.balanceOf(farming.address);
    console.log(ethers.utils.formatUnits(balcon.toString(), 8).toString());



    vault1 = lp1.address;
    vault2 = lp2.address;
    vault3 = lp3.address;
 
});

// it("update reward type ", async function(){
//     await farming.initializer([vault1] , [ethers.utils.parseEther("0.1")], ["2"] , [alt.address]);
//     await farming.updateMultiplier(vault1, ethers.utils.parseEther("0.2"));
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("3.5"));
//     await advanceBlockTo(300);
//     await farming.blacklistVaults([vault1]);
//     await farming.claimReward(vault1);
//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());

// })

// it("less reward token", async function(){
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["1"] , [partner.address]);
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await advanceBlockTo(500);
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     // await farming.claimReward(vault1);
//     let altbal = await partner.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());

// })

// it("simulating partner reward for a month", async function(){

//     await farming.initializer([vault3],[ethers.utils.parseEther("1")],["2"],[partner.address]);
//     await farming.updateAltMultiplier(vault3, ethers.utils.parseEther("5"));

    
//         // await farming.stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User1).stakeLp(vault3 , ethers.utils.parseEther("100")); //5
//         console.log(await ethers.provider.getBlockNumber());

//         await farming.connect(User2).stakeLp(vault3 , ethers.utils.parseEther("100")); //7.5 //2.5
//         console.log(await ethers.provider.getBlockNumber());

//         await farming.connect(User3).stakeLp(vault3 , ethers.utils.parseEther("100")); //9.1 //4.1 //1.6 
//         console.log(await ethers.provider.getBlockNumber());

//         await farming.connect(User4).stakeLp(vault3 , ethers.utils.parseEther("100")); //10.35 //5.35 //2.85 //1.25
//         console.log(await ethers.provider.getBlockNumber());

//         await farming.connect(User5).stakeLp(vault3 , ethers.utils.parseEther("100")); //11.35 //6.35 //3.85 //2.25 //1
//         console.log(await ethers.provider.getBlockNumber());

//         await farming.updateFarmingLimit(336); //12.35 //7.35 //4.85 //3.25 //2 
//         console.log(await ethers.provider.getBlockNumber());
//         await advanceBlockTo(1329); //13.35 //8.35 //5.85 //4.25 //3
//         console.log(await ethers.provider.getBlockNumber());

//         // await farming.claimReward(vault3);
//         await farming.connect(User1).claimReward(vault3);
//         await farming.connect(User2).claimReward(vault3);
//         await farming.connect(User3).claimReward(vault3);
//         await farming.connect(User4).claimReward(vault3);
//         await farming.connect(User5).claimReward(vault3);

//         // let remaining = await partner.balanceOf(farming.address);
//         // console.log(web3.utils.fromWei(remaining.toString()).toString());
//         // await farming.migrateFunds(Me.address , partner.address , remaining.toString());

//         // let receivedback = await partner.balanceOf(Me.address);
//         // console.log(web3.utils.fromWei(receivedback.toString()).toString());

//         // await farming.blacklistVaults([vault3]);
//         // await expect(farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.revertedWith("LA");

//         let puser1 = await partner.balanceOf(User1.address);
//         let puser2 = await partner.balanceOf(User2.address);
//         let puser3 = await partner.balanceOf(User3.address);
//         let puser4 = await partner.balanceOf(User4.address);
//         let puser5 = await partner.balanceOf(User5.address);

//         console.log(web3.utils.fromWei(puser1.toString()).toString());
//         console.log(web3.utils.fromWei(puser2.toString()).toString());
//         console.log(web3.utils.fromWei(puser3.toString()).toString());
//         console.log(web3.utils.fromWei(puser4.toString()).toString());
//         console.log(web3.utils.fromWei(puser5.toString()).toString());


// })

it ("deposit lp , forword 10 block and unstake" , async function () {
    await farming.initializer([vault1] , [ethers.utils.parseUnits("1" , 8)], ["1"] , [decimalToken.address]);
    console.log(await ethers.provider.getBlockNumber());
    await farming.connect(User1).stakeLp(vault1 , ethers.utils.parseEther("100"));
    await advanceBlockTo(40);
    console.log(await ethers.provider.getBlockNumber());
    await farming.connect(User1).unstakeLp(vault1 , ethers.utils.parseEther("100"));
    let balance = await decimalToken.balanceOf(User1.address);
    //console.log(balance);
    console.log(ethers.utils.formatUnits(balance.toString(), 8).toString()); 

});

// it ("deposit lp , forword 10 block and unstake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["0"] , [alt.address]);
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await advanceBlockTo(34);
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());

// });

// it ("deposit lp and unstake , multiplier set to 1" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["0"] , [alt.address]);
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
// });

// it ("deposit lp and unstake, multiplier set to 2" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("2")], ["0"] , [alt.address]);
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
// });

// it ("deposit lp and unstake, multiplier set to 5" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("5")], ["0"] , [alt.address]);
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
// });

// it ("deposit lp and unstake, multiplier set to 0" , async function () {
//     try {
//         await farming.initializer([vault1] , [ethers.utils.parseEther("0")], ["0"] , [alt.address]);
//     } catch (error) {
//         console.log("reason : IV ");
//     }
// });

// it ("send invalid vault address, should be fail" , async function () {
//    await farming.initializer([Me.address] , [ethers.utils.parseEther("1")],["0"] , [alt.address])
// });

// it ("first blacklist a whitelist pool then stake , should be reverted" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")] , ["0"] , [alt.address]);
//     let block = await ethers.provider.getBlockNumber();
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await advanceBlockTo(190);
//     //console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     //let balance = await pilot.balanceOf(Me.address);
//     //console.log(balance.toString());
//     await farming.blacklistVaults([vault1]);
//     await expect(farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.revertedWith("TNL");
// });

// it ("first blacklist a whitelist pool and again whitelist the blacklist pool then stake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     // let block = await ethers.provider.getBlockNumber();
//     await farming.stakeLp(vault1 , ethers.utils.parseEther("100"));
//     await advanceBlockTo(230);
//     // console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     // let balance = await pilot.balanceOf(Me.address);
//     // console.log(balance.toString());
//     await farming.blacklistVaults([vault1]);
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.ok;
// });

// it ("check only pilot reward" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     await farming.stakeLp(vault2 , ethers.utils.parseEther("100"));
//     await farming.unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
// });

// it ("check only Alt reward" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1"),], ["1"] , [alt.address]);
//     // await farming.updateRewardType(vault2 , "1" , alt.address);
//     await farming.stakeLp(vault2 , ethers.utils.parseEther("100"));
//     await farming.unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     let balance = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// });

// it ("check only Alt reward" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1")],["1"] , [alt.address]);
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.connect(User1).stakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await advanceBlockTo(316)
//     await farming.connect(User1).unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     let balance = await pilot.balanceOf(User1.address);
//     console.log(web3.utils.fromWei(balance.toString()).toString());
//     let altbal = await alt.balanceOf(User1.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// });

// it ("check reward ,convert it to dual" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1")],["2"] , [alt.address]);
//     console.log(await ethers.provider.getBlockNumber());    
//     await farming.connect(User1).stakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await advanceBlockTo(353)
//     await farming.connect(User1).unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     let balancePilot = await pilot.balanceOf(User1.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(User1.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// });

// it ("check reward , first convert it to only alt then convert it to dual" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("2")],["0"] , [alt.address]);
//     // await farming.initializer([vault2] , [ethers.utils.parseEther("2")],["2"] , [alt.address]);

//     await farming.updateRewardType(vault2 , "0" , alt.address);
//     await farming.updateAltMultiplier(vault2 , ethers.utils.parseEther("2"));
    
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.stakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.connect(User1).stakeLp(vault2 , ethers.utils.parseEther("100"));
//     // await advanceBlockTo(390)
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.connect(User1).unstakeLp(vault2 , ethers.utils.parseEther("100"));
    
//     let balancePilot1 = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot1.toString()).toString());
//     let altbal1 = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal1.toString()).toString());
//     let balancePilot = await pilot.balanceOf(User1.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(User1.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());

   
// });

// it("convert vault to alt then convert it to pilot then stake" , async function () {
//     await farming.initializer([vault3] , [ethers.utils.parseEther("1")], ["1"] , [alt.address]);
//     await farming.updateRewardType(vault3 , "1" , alt.address);
//     await farming.updateAltMultiplier(vault3 , ethers.utils.parseEther("1"));
//     await farming.updateRewardType(vault3 , "0" , alt.address);

//     console.log(await ethers.provider.getBlockNumber());
//     await farming.stakeLp(vault3 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.connect(User1).stakeLp(vault3 , ethers.utils.parseEther("100"));
//     // await advanceBlockTo(390)
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault3 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.connect(User1).unstakeLp(vault3 , ethers.utils.parseEther("100"));
    
//     let balancePilot1 = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot1.toString()).toString());
//     let altbal1 = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal1.toString()).toString());
//     let balancePilot = await pilot.balanceOf(User1.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(User1.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());


//     // try {
//     //     await farming.stakeLp(vault3 , ethers.utils.parseEther("100"))

//     // } catch (error) {
//     //     console.log("error");
//     // }
// })

// it("change reward type to dual and then change it back to only pilot" , async function () {
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1")],["2"] , [alt.address]);
//     await farming.updateRewardType(vault2 , "0" , alt.address);

//     console.log(await ethers.provider.getBlockNumber());    

//     await farming.stakeLp(vault2 , ethers.utils.parseEther("100"));
//     await farming.connect(User1).stakeLp(vault2 , ethers.utils.parseEther("100"));
    
//     console.log(await ethers.provider.getBlockNumber());
//     //await advanceBlockTo(346)
    
//     await farming.unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     await farming.connect(User1).unstakeLp(vault2 , ethers.utils.parseEther("100"));

//     console.log(await ethers.provider.getBlockNumber());

//     let balancePilot = await pilot.balanceOf(User1.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(User1.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
//     let balancePilot1 = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot1.toString()).toString());
//     let altbal1 = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal1.toString()).toString());
// })

// it("only dual reward" , async function(){
//     await farming.initializer([vault2] , [ethers.utils.parseEther("1")],["2"] , [alt.address]);
//     await farming.stakeLp(vault2 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());
//     // await advanceBlockTo(470)
//     await farming.unstakeLp(vault2 , ethers.utils.parseEther("100"));
//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// })



// it("Blacklist vault then try to stake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["1"] , [alt.address]);
//     await farming.blacklistVaults([vault1]);
//     await expect(farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.revertedWith("TNL");
// })

// it("Blacklist only alt vault then try to stake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     await farming.updateRewardType(vault1 , "1" , alt.address);
//     await farming.updateAltMultiplier(vault1 , ethers.utils.parseEther("2"));
//     await farming.blacklistVaults([vault1]);
//     await expect(farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.revertedWith("TNL");
// })

// it("Blacklist dual vault then try to stake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     await farming.updateRewardType(vault1 , "2" , alt.address);
//     await farming.updateAltMultiplier(vault1 , ethers.utils.parseEther("1"));
//     await farming.blacklistVaults([vault1]);
//     await expect(farming.stakeLp(vault2 , ethers.utils.parseEther("100"))).to.be.revertedWith("TNL");
// })

// it("Blacklist vault whitelist again then try to stake" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["0"] , [alt.address]);
//     await farming.blacklistVaults([vault1]);
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.ok;
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
// })

// it("Blacklist vault whitelist again then try to stake , dual" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     await farming.blacklistVaults([vault1]);
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["2"] , [alt.address]);
//     expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.ok;
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// })

// it("Blacklist vault whitelist again then try to stake , pilot" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["0"] , [alt.address]);
//     await farming.blacklistVaults([vault1]);
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")],["1"] , [alt.address]);
//     expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.ok;
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// })

// it("deposit in loop, withdraw in one, pilot" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["0"] , [alt.address]);

//     console.log(await ethers.provider.getBlockNumber());

//     for (let index = 0; index < 10; index++) {
        
//         expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("10"))).to.be.ok;
        
//         console.log(await ethers.provider.getBlockNumber());
        
//         let balancePilot = await pilot.balanceOf(Me.address);
//         console.log(web3.utils.fromWei(balancePilot.toString()).toString());
        
//         let altbal = await alt.balanceOf(Me.address)
//         console.log(web3.utils.fromWei(altbal.toString()).toString());

//     }
//     console.log(await ethers.provider.getBlockNumber());
//     await farming.unstakeLp(vault1 , ethers.utils.parseEther("100"));
    
// })

// it("deposit in one, withdraw in loop, pilot" , async function () {
//     await farming.initializer([vault1] , [ethers.utils.parseEther("1")], ["0"] , [alt.address]);
//     expect(await farming.stakeLp(vault1 , ethers.utils.parseEther("100"))).to.be.ok;
    
//     for (let index = 0; index < 10; index++) {
//         await farming.unstakeLp(vault1 , ethers.utils.parseEther("10"));
//         let balancePilot = await pilot.balanceOf(Me.address);
//         console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//         let altbal = await alt.balanceOf(Me.address)
//         console.log(web3.utils.fromWei(altbal.toString()).toString());
//     }
// })

// it("update reward per block for pilot" , async function () {
//     await farming.initializer([vault3] , [ethers.utils.parseEther("1")], ["2"] , [alt.address]);
//     expect(await farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.ok;
//     console.log(await ethers.provider.getBlockNumber());

//     //1
//     expect(await farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.ok;
//     console.log(await ethers.provider.getBlockNumber());
//     //1
//     expect(await farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.ok;
//     console.log(await ethers.provider.getBlockNumber());

//     //1
//     await farming.updateRewardPerBlock(ethers.utils.parseEther("2"));
//     console.log(await ethers.provider.getBlockNumber());

//     //2
//     expect(await farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.ok;
//     console.log(await ethers.provider.getBlockNumber());

//     //2
//     await farming.unstakeLp(vault3 , ethers.utils.parseEther("100"));
//     console.log(await ethers.provider.getBlockNumber());

//     let balancePilot = await pilot.balanceOf(Me.address);
//     console.log(web3.utils.fromWei(balancePilot.toString()).toString());
//     let altbal = await alt.balanceOf(Me.address)
//     console.log(web3.utils.fromWei(altbal.toString()).toString());
// })

// it("simulating partner reward for a month", async function(){

//     await farming.initializer([vault3],[ethers.utils.parseEther("1")],["2"],[partner.address]);

//         await farming.stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User1).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User2).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User3).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User4).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User5).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         console.log(await ethers.provider.getBlockNumber());
//         await advanceBlockTo(7300);
//         await farming.updateFarmingLimit(7301);
//         console.log(await ethers.provider.getBlockNumber());
//         await farming.unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User1).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User2).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User3).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User4).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User5).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         let remaining = await partner.balanceOf(farming.address);
//         console.log(web3.utils.fromWei(remaining.toString()).toString());
//         await farming.migrateFunds(Me.address , partner.address , remaining.toString());

//         let receivedback = await partner.balanceOf(Me.address);
//         console.log(web3.utils.fromWei(receivedback.toString()).toString());
//         await farming.blacklistVaults([vault3]);
//         await expect(farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.revertedWith("LA");


// })

// it("simulating partner reward for a month", async function(){

//     await farming.initializer([vault3],[ethers.utils.parseEther("1")],["2"],[partner.address]);

//         await farming.stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User1).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User2).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User3).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User4).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User5).stakeLp(vault3 , ethers.utils.parseEther("100"));
//         console.log(await ethers.provider.getBlockNumber());
//         await advanceBlockTo(14000);
//         await farming.updateFarmingLimit(14002);
//         console.log(await ethers.provider.getBlockNumber());
//         await farming.unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User1).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User2).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User3).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User4).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         await farming.connect(User5).unstakeLp(vault3 , ethers.utils.parseEther("100"));
//         let remaining = await partner.balanceOf(farming.address);
//         console.log(web3.utils.fromWei(remaining.toString()).toString());
//         await farming.migrateFunds(Me.address , partner.address , remaining.toString());

//         let receivedback = await partner.balanceOf(Me.address);
//         console.log(web3.utils.fromWei(receivedback.toString()).toString());
//         await farming.blacklistVaults([vault3]);
//         await farming.initializer([vault3],[ethers.utils.parseEther("1")],["0"],[partner.address])
//         await farming.updateFarmingLimit(0);
//         // await expect(farming.stakeLp(vault3 , ethers.utils.parseEther("100"))).to.be.revertedWith("LA");
//         await farming.stakeLp(vault3 , ethers.utils.parseEther("100"));


// })

// it("passing wrong alt reward token address while init vault", async function(){
//     await expect(farming.initializer(
//                     [vault3],
//                     [ethers.utils.parseEther("1")],
//                     ["2"],
//                     [usdt.address]
//                 )
//                 ).to.be.revertedWith("NEB");

// })

// it("passing wrong alt reward token address while changing reward type", async function(){
//     await farming.initializer([vault3],[ethers.utils.parseEther("1")],["2"],[alt.address]);
//     await expect(farming.updateRewardType(vault3 , "2" , usdt.address)).to.be.revertedWith("NEB");

// })

})
