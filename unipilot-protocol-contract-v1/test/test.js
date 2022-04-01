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
const assert = require("assert");
const { Contract, ContractFactory } = require ("@ethersproject/contracts");
const { MaxUint256 } = require ("@ethersproject/constants");
const { AbiItem } = require ("web3-utils");
const { encodeSqrtRatioX96, SwapRouter } = require ('@uniswap/v3-sdk')
const { getMaxTick, getMinTick } = require('./ticks')
const { FeeAmount, TICK_SPACINGS } = require('./constants')



describe("Testing Deployment For Echidna-Tester", async function () {
  this.beforeAll("Preparing Contracts", async function () {
//    let nonce = await provider.getTransactionCount(owner.address);
  
    // contractFact = await ethers.getContractFactory("UnipilotUser");
    // contractInst = await contractFact.deploy();
    // await contractInst.deployed();

    // contractFact1 = await ethers.getContractFactory("Setup");
    // contractInst1 = await contractFact1.deploy();
    // await contractInst1.deployed();

    contractFact2 = await ethers.getContractFactory("E2E");
    contractInst2 = await contractFact2.deploy();
    await contractInst2.deployed();
  });

    it("test created user", async function () {
    // let cpair = await contractInst.createpair();
    // console.log("cpair ok");
    // let dep = await contractInst.depositT();
    // console.log("dep ok")
    // let swap = await contractInst.swapNigga(9);
    // console.log("swap ok");
    // let rebase = await contractInst.shouldrebase(3000);
    // console.log("rebase needed :", rebase);
    // let rebaseActual = await contractInst.rebase();
    // console.log("rebase done", rebaseActual);
    // let bal0b = await contractInst.balance0()
    // console.log("b0 : ",bal0b.toString());
    // let bal1b = await contractInst.balance1()
    // console.log("b1 : ",bal1b.toString());

    // let col = await contractInst.collectO();
    // console.log("col ok");
    // let withd = await contractInst.withdrawal();
    // console.log("withd ok");

    // let bal0a = await contractInst.balance0()
    // console.log("b0 : ",bal0a.toString());
    // let bal1a = await contractInst.balance1()
    // console.log("b1 : ",bal1a.toString());
    // //console.log("after swap : ",bal1.toString() - bal0.toString());
    let seed = BigNumber("100").toString();
    //let createuser = contractInst2.createUser();
    let dep = await contractInst2.deposite_init();
    let swapping = await contractInst2.dwap();

    let withd = await contractInst2.withdraw_test();
    let bal = await contractInst2.balancePool();
    let bal2 = await contractInst2.balance();
    let ulm = await contractInst2.balanceULM();
    console.log(dep);
    console.log(swapping);
    console.log(withd);
    console.log(bal2.toString());
    console.log(bal.toString());
    console.log(ulm.toString());

    })

});