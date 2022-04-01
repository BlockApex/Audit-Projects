const { expect } = require("chai");
const {network,waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const Web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack, parseUnits , AbiCoder, parseEther, mnemonicToEntropy } = require("ethers/lib/utils");
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
const IpVault = require('../../artifacts/contracts/UnipilotPassiveVault.sol/UnipilotPassiveVault.json');
const IaVault = require('../../artifacts/contracts/UnipilotActiveVault.sol/UnipilotActiveVault.json')

//weth9                │ 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
//factory              │ 0x5b1869D9A4C187F2EAa108f3062412ecf0526b24
//router               │ 0xCfEB869F69431e42cdB54A4F4f105C19C080A601
//nftDescriptorLibrary │ 0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B
//positionDescriptor   │ 0xC89Ce4735882C9F0f0FE26686c53074E09B0D550 
//positionManager      │ 0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb 
//owner                | 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1
//user1                | 0xffcf8fdee72ac11b5c542428b35eef5769c409f0
//user2                | 0x22d491bde2303f2f43325b2108d26f1eaba1e32b
//user3                | 0xe11ba2b4d45eaed5996cd0823791e0c93114882d
//user4                | 0xd03ea8624c8c5987235048901fb614fdca89b117
//user5                | 0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc


describe("Simulations", async function () {

 
    const [owner, addr1,addr2,addr3,addr4,addr5] = 
    [
        "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
        "0xffcf8fdee72ac11b5c542428b35eef5769c409f0",
        "0x22d491bde2303f2f43325b2108d26f1eaba1e32b",
        "0xe11ba2b4d45eaed5996cd0823791e0c93114882d",
        "0xd03ea8624c8c5987235048901fb614fdca89b117",
        "0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc"
    ]
    let aFactory;
    let pFactory;
    let uStrategy;
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
    let counter0 = 0 ;
    let counter1 = 0 ;
    let PassiveVaults = [] ;
    let ActiveVaults = [] ;

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

    let Factory1 = await ethers.getContractFactory("UnipilotPassiveFactory");
    pFactory = await Factory1.deploy(
        "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" ,  //v3factory
        "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1" ,  // wallet gov
        uStrategy.address , 
        "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1" , //indexfund wallet
        "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab", // weth
        "10"
    );
    await pFactory.deployed();

    let TokenA = await ethers.getContractFactory("TestERC20");
    tokenA = await TokenA.deploy(ethers.utils.parseEther("100000000000"));
    await tokenA.deployed(); 

    let TokenB = await ethers.getContractFactory("TestERC20");
    tokenB = await TokenB.deploy(ethers.utils.parseEther("100000000000"));
    await tokenB.deployed();
    
    let TokenC = await ethers.getContractFactory("TestERC20");
    tokenC = await TokenC.deploy(ethers.utils.parseEther("100000000000"));
    await tokenC.deployed(); 

    let TokenD = await ethers.getContractFactory("TestERC20");
    tokenD = await TokenD.deploy(ethers.utils.parseEther("100000000000"));
    await tokenD.deployed(); 

    let TokenE = await ethers.getContractFactory("TestERC20");
    tokenE = await TokenE.deploy(ethers.utils.parseEther("100000000000"));
    await tokenE.deployed(); 

});


async function ExactSwap(token0 , token1 , amount, recipient) {
    
    Swaping = await ethers.getContractAt(Swaprouter.abi , "0xCfEB869F69431e42cdB54A4F4f105C19C080A601");
   // walletAddress = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";

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

async function CreateVaultActive(token0 , token1 , fee , ratio) {
    uniswapV3Factory = await ethers.getContractAt(V3Factory.abi , "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" );
    
    //creating Data
    let fees = BigNumber(fee).toString();
    let amount0 = BigNumber("1").toString();
    let amount1 = BigNumber(ratio).toString();
    let sqrtPrice = BigNumber(
        new bn(amount0.toString())
        .div(amount1.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    ).toFixed()

    let aVault = await aFactory.createVault(token0 , token1 , fees , sqrtPrice ,  "vault"+counter0 , "VAULT"+counter0)
         //console.log(IUnipilotVault);
    let IUnipilotVault = await ethers.getContractAt(IaVault.abi , aVault.toString());
    console.log("1");
    let pool = await uniswapV3Factory.getPool(token0, token1 , fees);
    console.log("1");
    await uStrategy.setBaseTicks([pool], [600]);
    console.log("1");
     //console.log(IUnipilotVault);
    // ActiveVaults[counter0] = IUnipilotVault;
    // console.log("1");
    //await IUnipilotVault.init();
    // await IUnipilotVault._balance0();
    // console.log("1");
    counter0++;

}

async function CreateVaultPassive(token0 , token1 , fee , ratio) {
    // uniswapV3PositionManager = await ethers.getContractAt(V3PositionManager.abi , "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb");
    // uniswapV3Factory = await ethers.getContractAt(V3Factory.abi , "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24" );
    
    //creating Data
    let fees = BigNumber(fee.toString()).toString();
    let amount0 = BigNumber("1").toString();
    let amount1 = BigNumber(ratio.toString()).toString();
    let sqrtPrice = BigNumber(
        new bn(amount0.toString())
        .div(amount1.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    ).toFixed()

    let pVault = await pFactory.createVault(token0 , token1 , fees , sqrtPrice ,  "vault"+counter1 , "VAULT"+counter1)
    let IUnipilotVault = await ethers.getContractAt(IpVault.abi , pVault);
    PassiveVaults[counter1] = IUnipilotVault;
    counter1++;
}

async function DepositEth(amount0 , amount1, vaultContract , recipient) {
     //deposite in vault
    const resultDeposit = await vaultContract.callStatic.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1) , recipient);
     await vaultContract.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1),recipient, {value : web3.toWei(amount0, "ether")});
    console.log("LP Shares :",web3.utils.fromWei((resultDeposit.lpShares).toString()));
    let value = web3.utils.fromWei(resultDeposit.lpShares.toString());
    return value;
}

async function Deposit(amount0 , amount1, vaultContract , recipient) {
    //deposite in vault
   const resultDeposit = await vaultContract.callStatic.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1) , recipient);
    await vaultContract.deposit(ethers.utils.parseEther(amount0),ethers.utils.parseEther(amount1),recipient);
   console.log("LP Shares :",web3.utils.fromWei((resultDeposit.lpShares).toString()));
   let value = web3.utils.fromWei(resultDeposit.lpShares.toString());
   return value;
}

async function Withdraw (liquidity , recipient , vaultContract , refundAsEth) {
    let withdrawal  = await vaultContract.callStatic.withdraw(ethers.utils.parseEther(liquidity) , recipient , refundAsEth);
    await vaultContract.withdraw(ethers.utils.parseEther(liquidity) , recipient , refundAsEth);
    console.log("amount 0 :",web3.utils.fromWei(withdrawal.amount0.toString()) , "amount 1 :", web3.utils.fromWei(withdrawal.amount1.toString()));
}

async function readjustLiquidity (vaultContract) {
    await vaultContract.readjustLiquidity();
    await getBalances(vaultContract);
}

async function getBalances(vaultContract) {
    let bal0 = await vaultContract._balance0();
    let bal1 = await vaultContract._balance1();
    console.log("Balance 0",web3.utils.fromWei(bal0.toString()).toString(), "\n", "Balance 1", web3.utils.fromWei(bal1.toString()).toString());
}



it("forge" , async function () {
    console.log("hhehehe");
    await CreateVaultActive("0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab", tokenA.address , "3000" , "3000");
    // await tokenA.transfer(owner , ethers.utils.parseEther("100000"));
    // await DepositEth("3" , "3000" , ActiveVaults[0] , owner);

    // let tx = {
    //     to: ActiveVaults[0].address,
    //     value: ethers.utils.parseEther("3")
    // }
    // owner.sendTransaction(tx)

    // const balance = await provider.getBalance(ActiveVaults[0].address);
    // console.log(balance.toString())

    // await Deposit("2" , "2000" , ActiveVaults[0] , owner.address);
    
    // let _balance = await provider.getBalance(ActiveVaults[0].address);
    // console.log(_balance.toString())

})


})

