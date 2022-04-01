const { expect } = require("chai");
const {network,waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const Web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack, parseUnits , AbiCoder, parseEther, mnemonicToEntropy, poll } = require("ethers/lib/utils");
const { Console, count } = require("console");
const { BigNumberish, Signer , constants, Wallet} = require("ethers");
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
const { monitorEventLoopDelay } = require("perf_hooks");
let abiCoder = new AbiCoder();
var web3 = new Web3(provider);
const V3PositionManager = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');
const V3Factory = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
const V3pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")
const Swaprouter = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json');


describe("Simulations", async function () {

 
   //const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
    let uStrategy;
    let uVault;
    let uniswapV3PositionManager;
    let uniswapV3Factory
    let walletAddress;
    let v3pool;
    let Swaping;
    let tokenA;
    let tokenB;
    let tokenC;
    let tokenD;
    let tokenE;
    let counter = 0 ;
    let owner ;
    let aFactory;
    let gov = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";

beforeEach("Preparing Contracts", async function () {

    let Strategy = await ethers.getContractFactory("UnipilotStrategy");
    uStrategy = await Strategy.deploy("0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1");
    await uStrategy.deployed();

    let Factory0 = await ethers.getContractFactory("UnipilotActiveFactory");
    aFactory = await Factory0.deploy(
        "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" ,  //v3factory
        "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1" ,  // wallet gov
        uStrategy.address , 
        "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1" , //indexfund wallet
        "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab", // weth
        "10"
    );
    await aFactory.deployed();

   

    let TokenA = await ethers.getContractFactory("TestERC20");
    tokenA = await TokenA.deploy(ethers.utils.parseEther("1000000000"));
    await tokenA.deployed(); 

    let TokenB = await ethers.getContractFactory("TestERC20");
    tokenB = await TokenB.deploy(ethers.utils.parseEther("100000"));
    await tokenB.deployed();
    
    let TokenC = await ethers.getContractFactory("TestERC20");
    tokenC = await TokenC.deploy(ethers.utils.parseEther("100000"));
    await tokenC.deployed(); 

    let TokenD = await ethers.getContractFactory("TestERC20");
    tokenD = await TokenD.deploy(ethers.utils.parseEther("100000"));
    await tokenD.deployed(); 

    let TokenE = await ethers.getContractFactory("TestERC20");
    tokenE = await TokenE.deploy(ethers.utils.parseEther("100000"));
    await tokenE.deployed(); 

});

let vaults = [] ;

async function ExactSwap(token0 , token1 , amount , recipient) {
    
    Swaping = await ethers.getContractAt(Swaprouter.abi , "0xCfEB869F69431e42cdB54A4F4f105C19C080A601");

    const SwapParams = {
        tokenIn : token0,
        tokenOut : token1,
        fee : 3000,
        recipient : recipient,
        deadline : (Date.now()+900),
        amountIn : ethers.utils.parseEther(amount),
        amountOutMinimum : ethers.utils.parseEther('0'),
        sqrtPriceLimitX96 : '0'
        }
    
    await Swaping.exactInputSingle(SwapParams);
}

async function CreateVaultActive(token0 , token1) {
    uniswapV3Factory = await ethers.getContractAt(V3Factory.abi , "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" );
    
    //creating Data
    let fees = BigNumber("3000").toString();
    let amount0 = BigNumber("1").toString();
    let amount1 = BigNumber("2").toString();
    let sqrtPrice = BigNumber(
        new bn(amount0.toString())
        .div(amount1.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    ).toFixed()

    //uniswap methods
    let pool = await uniswapV3Factory.callStatic.createPool(token0 , token1 , "3000");
    await uniswapV3Factory.createPool(token0 , token1 ,fees);
    v3pool = await ethers.getContractAt(V3pool.abi , pool);
    await v3pool.initialize(sqrtPrice);
    //await uStrategy.setBaseTicks([pool], [1800]);

    console.log("here");
    //deploying vault using uniswap pool
    let Vault = await ethers.getContractFactory("UnipilotActiveVault");
    uVault = await Vault.deploy(pool , aFactory.address , "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab" , "vault"+counter , "VAULT"+counter);
    await uVault.deployed();
    vaults[counter] = uVault;
    await uVault.connect(owner).init();
    counter++;

}

// async function CreateVaultPassive(token0 , token1) {
//     uniswapV3PositionManager = await ethers.getContractAt(V3PositionManager.abi , "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb");
//     uniswapV3Factory = await ethers.getContractAt(V3Factory.abi , "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" );
    
//     //creating Data
//     let fee = BigNumber("3000").toString();
//     let amount0 = BigNumber("1").toString();
//     let amount1 = BigNumber("1").toString();
//     let sqrtPrice = BigNumber(
//         new bn(amount0.toString())
//         .div(amount1.toString())
//         .sqrt()
//         .multipliedBy(new bn(2).pow(96))
//         .integerValue(3)
//         .toString()
//     ).toFixed()

//     //uniswap methods
//     pool = await uniswapV3Factory.callStatic.createPool(token0 , token1 ,fee);
//     await uniswapV3Factory.createPool(token0 , token1 ,fee);
//     v3pool = await ethers.getContractAt(V3pool.abi , pool);
//     await v3pool.initialize(sqrtPrice);
//     await uStrategy.setBaseTicks([v3pool.address], [1800]);
//     await uStrategy.setRangeTicks(1800);

//     //deploying vault using uniswap pool
//     let Vault = await ethers.getContractFactory("UnipilotVault");
//     uVault = await Vault.deploy(pool , uFactory.address , "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab" , "vault"+counter , "VAULT"+counter);
//     await uVault.deployed();
//     vaults[counter] = uVault;
//     // await vaults[counter].init();
//     counter++;
// }

async function DepositEth(amount0 , amount1, vaultContract , recipient) {
     //deposite in vault
     const resultDeposit = await uVault.callStatic.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1));
     await vaultContract.connect(owner).deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1), recipient ,{value : web3.utils.toWei(amount0, "ether")});
     console.log("LP Shares :",web3.utils.fromWei((resultDeposit.lpShares).toString()));
     let value = web3.utils.fromWei(resultDeposit.lpShares.toString());
     return value;
}

async function Deposit(amount0 , amount1, vaultContract , recipient) {
    //deposite in vault
    const resultDeposit = await uVault.callStatic.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1));
    await vaultContract.connect(owner).deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1), recipient);
    console.log("LP Shares :",web3.utils.fromWei((resultDeposit.lpShares).toString()));
    let value = web3.utils.fromWei(resultDeposit.lpShares.toString());
    return value;
}

async function Withdraw (amountIn , Wallet , vaultContract) {
    let withdrawal  = await vaultContract.callStatic.withdraw(ethers.utils.parseEther(amountIn) , Wallet , false);
    await vaultContract.withdraw(ethers.utils.parseEther(amountIn) , Wallet , false);
    console.log("amount 0 :",web3.utils.fromWei(withdrawal.amount0.toString()) , "amount 1 :", web3.utils.fromWei(withdrawal.amount1.toString()));
}

async function Readjust(vaultContract) {
    await vaultContract.readjustLiquidity();
}

async function PullLiq(vaultContract) {
    await vaultContract.pullLiquidity();
}

it("83" , async function() {
    let UniswapV3Factory = await ethers.getContractAt(V3Factory.abi , "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" );

    let fees = BigNumber("3000").toString();
    let amount0 = BigNumber("1").toString();
    let amount1 = BigNumber("2").toString();
    let sqrtPrice = BigNumber(
        new bn(amount0.toString())
        .div(amount1.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    ).toFixed()
    await UniswapV3Factory.createPool(tokenA.address , tokenB.address , fees);
    // await Deposit("100" , "100" , vaults[0], gov);
    
})

it("test" , async function(){
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: ["0x358825f22b41Ff1470D0d748C9c7e7D41512A490"],
        });
    
    owner = await ethers.getSigner('0x358825f22b41Ff1470D0d748C9c7e7D41512A490');

    await CreateVaultActive("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", tokenA.address );
    await tokenA.transfer(owner.address , ethers.utils.parseEther("100000"));
    await Deposit("3" , "3000" , vaults[0] , owner.address);

    let tx = {
        to: vaults[0].address,
        value: ethers.utils.parseEther("3")
    }
    owner.sendTransaction(tx)

    const balance = await provider.getBalance(vaults[0].address);
    console.log(balance.toString())

    await DepositEth("2" , "2000" , vaults[0] , owner.address);
    
    let _balance = await provider.getBalance(vaults[0].address);
    console.log(_balance.toString())
    web3.eth.sendTransaction({from: owner.address,to: vaults[0].address, value: web3.utils.toWei("3", "ether")});

})




})

