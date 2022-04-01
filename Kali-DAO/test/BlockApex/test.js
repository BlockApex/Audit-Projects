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

async function forwordTime(time) {
    await ethers.provider.send("evm_increaseTime", [time])
  }

describe("LexDAO Simulations", function () {

    let lexdao;
    let lexlocker;
    let crowdsale;
    let whitelistmamager;

    const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();


beforeEach("Preparing Contracts", async function () {

    LexDAO = await ethers.getContractFactory("KaliDAO");
    lexdao = await LexDAO.deploy();
    await lexdao.deployed();

    WhiteListManager = await ethers.getContractFactory("KaliWhitelistManager");
    whitelistmamager = await WhiteListManager.deploy();
    await whitelistmamager.deployed();

    Token = await ethers.getContractFactory("TestERC20");
        token = await Token.deploy();
        await token.deployed();

    CrowdSale = await ethers.getContractFactory("KaliDAOcrowdsale");
    crowdsale = await CrowdSale.deploy(whitelistmamager.address);
    await crowdsale.deployed();

    await lexdao.init(
        "KALI", 
        "KALI", 
        "DOCS", 
        false, 
        [owner.address , addr4.address], 
        [owner.address , addr5.address, lexdao.address],
        [BigNumber("50").toString(),BigNumber("50").toString(), BigNumber("5000000").toString()], 
        BigNumber("30").toString(), 
        [30, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    )

});


it("Bypassing whitelisting can lead to unautherized transfers " , async function() {
    // Data for crowdsale Extension
    const data = abiCoder.encode(
        ["uint256" , "address" , "uint8" , "uint96" , "uint32"] , 
        [0 , token.address , 1, BigNumber("100000").toString() , BigNumber("1640838044").toString()]);
    //transfering funds to address 3
    await token.transfer(addr3.address , BigNumber("100").toString());
    //checking balance before
    console.log(await token.balanceOf(addr3.address));
    console.log(await token.balanceOf(addr4.address));
    //approving funds by address 3 to crowdsale contract
    await token.connect(addr3).approve(crowdsale.address , BigNumber("100").toString());
    //set extension using address 4
    await crowdsale.connect(addr4).setExtension(data);
    //call extension using address 4
    await crowdsale.connect(addr4).callExtension(addr3.address, BigNumber("100").toString());
    //checking balance after
    console.log(await token.balanceOf(addr3.address));
    console.log(await token.balanceOf(addr4.address));

})



it("create proposal without extension and process", async function () {

    await lexdao.propose(0, "TEST", [owner.address] , [1], [0x00]);
    //await lexdao.vote(0,true);
    await forwordTime(40);
    try {
        await lexdao.processProposal(0);
    } catch (error) {
        console.log("FAIL : should not call the extension");
    }
    
});

it("create proposal and execute using extension", async function () {

    const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);

    await lexdao.propose(0, "TEST", [crowdsale.address], [BigNumber("10").toString()], [msg]);
    await lexdao.vote(0,true);
    await forwordTime(40);
    await lexdao.processProposal(0);
});

it("create proposal and cancel", async function () {

    const amountsArray = [BigNumber("1000").toString(),BigNumber("100").toString()];
    const adder = [addr1.address, owner.address]

    await lexdao.connect(addr1).propose(0, "TEST", adder , amountsArray, [0x00 , 0x01]);
    //await lexdao.vote(1,true);
    //await forwordTime(4);
    await lexdao.connect(addr1).cancelProposal(0);
});

it("create proposal and sponser", async function () {

    const amountsArray = [BigNumber("1000").toString(),BigNumber("100").toString()];
    const adder = [addr1.address, addr2.address]

    await lexdao.connect(addr1).propose(1, "TEST", adder , amountsArray, [0x00 , 0x01]);
    //await lexdao.vote(1,true);
    //await forwordTime(4);
    await lexdao.sponsorProposal(0);
});


//we assume that if the proposal is not sponsered user is unable to vote 
//beacuse if proposal is not sponsered and proposal got votes and if somebody come to sponser the proposal it will make voting back to zero again
it("create proposal,vote and sponser", async function () {

    const amountsArray = [BigNumber("1000").toString(),BigNumber("100").toString()];
    const adder = [addr1.address, addr2.address]

    await lexdao.connect(addr1).propose(1, "TEST", adder , amountsArray, [0x00 , 0x01]);
    try {
        await lexdao.vote(0,true);
        await forwordTime(4);
        await lexdao.sponsorProposal(0);
    } catch (error) {
        console.log("FAIL : user can not vote if proposal is not sponsered");
    }
    
});

it("create proposal,vote and sponser", async function () {

    const amountsArray = [BigNumber("1000").toString(),BigNumber("100").toString()];
    const adder = [addr1.address, addr2.address]

    await lexdao.connect(addr3).propose(1, "TEST", adder , amountsArray, [0x00 , 0x01]);
    try {
        await forwordTime(40);
        await lexdao.sponsorProposal(0);
        await lexdao.vote(0,true);
    } catch (error) {
        console.log("FAIL : user can not vote after proposal is sponsered");      
    }
    
});

it("just vote on random proposal", async function () {
    try {
        await lexdao.vote(0,true);

    } catch (error) {
        console.log("FAIL : no proposal exist error should be display");
    }
});

it("create proposal type Mint", async function () {

    const addr = [addr3.address]
    const balbe = await lexdao.balanceOf(addr3.address);

    await lexdao.propose(BigNumber("0").toString(), "TEST", addr , [BigNumber("100000").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);

    await lexdao.processProposal(0);

    const balaf = await lexdao.balanceOf(addr3.address);
    assert(balbe < balaf);
});

it("create proposal type BURN", async function () {

    const addr = [owner.address]
    const balbe = await lexdao.balanceOf(owner.address);

    await lexdao.propose(BigNumber("1").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);

    const balaf = await lexdao.balanceOf(owner.address);
    assert(balbe > balaf);
});

it("create proposal type CALL", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("2").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type PERIOD", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("3").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type QUORUM", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("4").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type SUPERMAJORITY", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("5").toString(), "TEST", addr , [BigNumber("70").toString()], [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type TYPE", async function () {

    const addr = [owner.address, addr1.address]
    const amountsArray = [BigNumber("9").toString(),BigNumber("3").toString()];
    await lexdao.propose(BigNumber("6").toString(), "TEST", addr ,amountsArray, [0x00 , 0x01]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type PAUSE", async function () {

    const addr = [owner.address, addr1.address]
    const amountsArray = [BigNumber("9").toString(),BigNumber("3").toString()];
    await lexdao.propose(BigNumber("7").toString(), "TEST", addr ,amountsArray, [0x00 , 0x01]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type EXTENSION", async function () {

    const addr = [crowdsale.address]
    const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("9").toString()];
    await lexdao.propose(BigNumber("8").toString(), "TEST", addr ,amountsArray, [msg]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type EXTENSION without calling extension", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("9").toString()];
    await lexdao.propose(BigNumber("8").toString(), "TEST", addr ,amountsArray, [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("create proposal type ESCAPE", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("1000").toString()];
    await lexdao.propose(BigNumber("9").toString(), "TEST", addr ,amountsArray, [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});


it("create proposal type DOCS", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("1000").toString()];
    await lexdao.propose(BigNumber("10").toString(), "TEST", addr ,amountsArray, [0x00]);

    await lexdao.vote(0,true);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

it("Vote by Signature", async function () {

    const addr = [owner.address]
    const amountsArray = [BigNumber("1000").toString()];
    await lexdao.propose(BigNumber("10").toString(), "TEST", addr ,amountsArray, [0x00]);

    var voteHash = await lexdao.VOTE_HASH() ;
    //console.log(voteHash) ; 
    var messagehash = keccak256(
        defaultAbiCoder.encode(
          [ "bytes32", "address", "uint256" , "bool"],[ voteHash ,owner.address , 0 , true ])
      )
      const domainSaperator = await lexdao.DOMAIN_SEPARATOR();
      var final = keccak256(solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"],["0x19","0x01", domainSaperator ,messagehash]))
      const { v, r, s } = ecsign(Buffer.from(final.slice(2), "hex"), Buffer.from(owner.privateKey.slice(2), "hex"));
    await lexdao.voteBySig(owner.address , 0 , true , v ,r ,s);
    await forwordTime(20000000);
    await lexdao.processProposal(0);
});

//..............................................NEGATIVE................................................//

it("create proposal type Mint", async function () {

    const addr = [addr3.address]
    const balbe = await lexdao.balanceOf(addr3.address);
    console.log("balance before",balbe.toString());

    await lexdao.propose(BigNumber("0").toString(), "TEST", addr , [BigNumber("100000").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
    

    const balaf = await lexdao.balanceOf(addr3.address);
    console.log("balance after",balaf.toString());
});

it("create proposal type BURN", async function () {

    const addr = [owner.address]
    const balbe = await lexdao.balanceOf(owner.address);
    console.log("balance before",balbe.toString());

    await lexdao.propose(BigNumber("1").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }

    const balaf = await lexdao.balanceOf(owner.address);
    console.log("balance after",balaf.toString());
});

it("create proposal type CALL", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("2").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type PERIOD", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("3").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type QUORUM", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("4").toString(), "TEST", addr , [BigNumber("50").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type SUPERMAJORITY", async function () {

    const addr = [owner.address]
    await lexdao.propose(BigNumber("5").toString(), "TEST", addr , [BigNumber("70").toString()], [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type TYPE", async function () {

    const addr = [owner.address, addr1.address]
    const amountsArray = [BigNumber("9").toString(),BigNumber("3").toString()];
    await lexdao.propose(BigNumber("6").toString(), "TEST", addr ,amountsArray, [0x00 , 0x01]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type PAUSE", async function () {

    const addr = [owner.address, addr1.address]
    const amountsArray = [BigNumber("9").toString(),BigNumber("3").toString()];
    await lexdao.propose(BigNumber("7").toString(), "TEST", addr ,amountsArray, [0x00 , 0x01]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type EXTENSION", async function () {

    const addr = [crowdsale.address]
    const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("9").toString()];
    await lexdao.propose(BigNumber("8").toString(), "TEST", addr ,amountsArray, [msg]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type EXTENSION without calling extension", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("9").toString()];
    await lexdao.propose(BigNumber("8").toString(), "TEST", addr ,amountsArray, [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("create proposal type ESCAPE", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("1000").toString()];
    await lexdao.propose(BigNumber("9").toString(), "TEST", addr ,amountsArray, [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});


it("create proposal type DOCS", async function () {

    const addr = [owner.address]
    //const msg = abiCoder.encode(["uint256", "address", "uint8", "uint96", "uint32"] , [1, addr2.address, 1, 100, 3]);
    const amountsArray = [BigNumber("1000").toString()];
    await lexdao.propose(BigNumber("10").toString(), "TEST", addr ,amountsArray, [0x00]);

    try {
        await lexdao.vote(0,true);
    await lexdao.processProposal(0);
    } catch (error) {
        console.log("Wait for the voting to be ended");
    }
});

it("Process proposal without processing previous proposals", async function () {

    //proposal 0
    await lexdao.propose(0, "TEST", [owner.address] , [1], [0x00]);
    //proposal 1
    await lexdao.propose(0, "TEST", [owner.address] , [1], [0x00]);
    //proposal 2 by non-menber
    await lexdao.connect(addr3).propose(0, "TEST", [owner.address] , [1], [0x00]);
    //sponsor by member
    await lexdao.sponsorProposal(2);
    await forwordTime(40);
    try {
        //process Proposal without process previous proposals
        await lexdao.processProposal(3);
    } catch (error) {
        console.log(error);
    }
});

it("proposal type call , using arbitrary calls to call transfer and transferFrom function of kalidao token ", async function () {

    // hex data for payload
    const tranferFromCall = lexdao.interface.encodeFunctionData("transferFrom", [owner.address,addr3.address, 25]);
    
    // any approved users balance for lexDAO
    await lexdao.approve(lexdao.address , 1000000000);

    const ownerPreBal = await lexdao.balanceOf(owner.address);

    // proposalType.CALL, accounts = [lexdaoAddress], value = 0 ether, call = transferFromCall data
    await lexdao.propose(2, "TEST", [lexdao.address] , [0], [tranferFromCall]);
    await lexdao.vote(0,true); // votecount check
    await forwordTime(40); // vote ended, ignore typo :)
    await lexdao.processProposal(0); // process proposal
    
    // after balances
    const add3AftBal = await lexdao.balanceOf(addr3.address);
    const ownerAftBal = await lexdao.balanceOf(owner.address);

    // balances tranferred
    expect(add3AftBal.toNumber()).not.eq(0); // tranferFrom call executed
    expect(ownerAftBal.toNumber()).lessThanOrEqual(ownerPreBal.toNumber());
    
});

})


/* MINT, // add membership
BURN, // revoke membership
CALL, // call contracts
PERIOD, // set `votingPeriod`
QUORUM, // set `quorum`
SUPERMAJORITY, // set `supermajority`
TYPE, // set `VoteType` to `ProposalType`
PAUSE, // flip membership transferability
EXTENSION, // flip `extensions` whitelisting
ESCAPE, // delete pending proposal in case of revert
DOCS // amend org docs*/
