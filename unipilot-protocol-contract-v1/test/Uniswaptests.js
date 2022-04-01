const { expect } = require("chai");
const {network,waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const Web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack, parseUnits , AbiCoder } = require("ethers/lib/utils");
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
const nfm = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');
const v3f = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');
const sr = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')


module.exports = async (pools, swap) => {

  let token = ["tokenA","tokenB","tokenC","tokenD","tokenE","tokenF","tokenG","tokenH","tokenI","tokenJ"];

  const tokenFactory = ["tokenFactory1","tokenFactory2","tokenFactory3","tokenFactory4","tokenFactory5","tokenFactory6","tokenFactory7","tokenFactory8","tokenFactory9","tokenFactory10"];

  let NonfungiblePositionManager;
  let IUniswapV3Factory;
  let SwapRouter;
  let createPool;
  let amount0 = BigNumber("1").toString();
  let amount1 = BigNumber("1").toString();
  let amount2 = BigNumber("1").toString();
  let amount3 = BigNumber("1").toString();
  let amount4 = BigNumber("1").toString();
  let amount5 = BigNumber("1").toString();
  let amount6 = BigNumber("1").toString();
  let amount7 = BigNumber("1").toString();
  let amount8 = BigNumber("1").toString();
  let amount9 = BigNumber("1").toString();
  const liquidity = 1000000;

const amount = [amount0,amount1,amount2,amount3,amount4,amount5,amount6,amount7,amount8,amount9];


  const [addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
  var web3 = new Web3(provider);

  let sender1 = addr1;

  const sender = [addr1,addr2,addr3,addr4,addr5]  

  NonfungiblePositionManager = await ethers.getContractAt(nfm.abi , "0xC36442b4a4522E871399CD717aBDD847Ab11FE88")
  IUniswapV3Factory = await ethers.getContractAt(v3f.abi,"0x1F98431c8aD98523631AE4a59f267346ea31F984" )
  SwapRouter = await ethers.getContractAt(sr.abi,"0xe592427a0aece92de3edee1f18e0157c05861564" )

  //deploying and approving anf transfering tokens to other senders
  for(i=0; i<=pools*2; i++){
      tokenFactory[i] = await ethers.getContractFactory("ERC20")
      token[i] = await tokenFactory[i].deploy("test"+[i], "TEST"+[i])
      await token[i].connect(sender1).deployed();

      await token[i].connect(sender1).approve(NonfungiblePositionManager.address, ethers.utils.parseEther('1000000000000000'));      
      await token[i].connect(sender1).approve(IUniswapV3Factory.address, ethers.utils.parseEther('1000000000000000'));
      await token[i].connect(sender1).approve(SwapRouter.address, ethers.utils.parseEther('1000000000000000'));

    for(j=0; j<=3; j++){

        await token[i].connect(sender1).transfer(sender[j+1].address, ethers.utils.parseEther('10000'))
        await token[i].connect(sender[j+1]).approve(NonfungiblePositionManager.address, ethers.utils.parseEther('1000000000000000'));
        await token[i].connect(sender[j+1]).approve(IUniswapV3Factory.address, ethers.utils.parseEther('1000000000000000'));
        await token[i].connect(sender[j+1]).approve(SwapRouter.address, ethers.utils.parseEther('1000000000000000'));
    }
      console.log("token", token[i].address, "deployed")
  }

//creating pools
for(i=0; i<pools; i++){
  if (token[2*i].address.toLowerCase() > token[(2*i)+1].address.toLowerCase()){
          let temp = token[2*i];
          token[2*i] = token[(2*i)+1];
          token[(2*i)+1] = temp;
  }

    let sqrtPrice = BigNumber(
                    new bn(amount[2*i].toString())
                    .div(amount[(2*i)+1].toString())
                    .sqrt()
                    .multipliedBy(new bn(2).pow(96))
                    .integerValue(3)
                    .toString()
    )               .toFixed()

  
    createPool = await NonfungiblePositionManager.connect(sender[i]).createAndInitializePoolIfNecessary(token[2*i].address ,token[(2*i)+1].address,FeeAmount.MEDIUM,sqrtPrice)
    //console.log(createPool);


    const DepositeParams = {
        token0 : token[2*i].address,
        token1 : token[(2*i)+1].address,
        fee : FeeAmount.MEDIUM,
        tickLower : getMinTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        tickUpper : getMaxTick(TICK_SPACINGS[FeeAmount.MEDIUM]),
        recipient : sender[i].address,
        amount0Desired : ethers.utils.parseEther('1000'),
        amount1Desired : ethers.utils.parseEther('1000'),
        amount0Min : ethers.utils.parseEther('0'),
        amount1Min : ethers.utils.parseEther('0'),
        deadline : (Date.now()+900)
    }

    //console.log(params);

  //const dep = await NonfungiblePositionManager.mint(tokenA.address,tokenB.address,fee,tickLower,tickUpper,amount0Desired,amount1Desired,amount0Min,amount1Min,recipient,deadline)
    const dep = await NonfungiblePositionManager.connect(sender[i]).mint(DepositeParams)

    //console.log(dep)
    const pool = await IUniswapV3Factory.connect(sender[i]).getPool(token[2*i].address,token[(2*i)+1].address,FeeAmount.MEDIUM)
    console.log("pool address",i, ":  ", pool)
   //const getBalanceA = await token[i+1].connect(sender[i]).balanceOf(pool);
   //const getBalanceB = await token[(2*i)+1].connect(sender[i]).address.balanceOf(pool);
   //console.log("pool balance  A", getBalanceA.toString() ,"pool Balance B", getBalanceB.toString())
      
  
}
for(i=0; i <swap; i++){

  const SwapParams = {
    tokenIn : token[2*i].address,
    tokenOut : token[(2*i)+1].address,
    fee : FeeAmount.MEDIUM,
    recipient : sender[i].address,
    deadline : (Date.now()+900),
    amountIn : ethers.utils.parseEther('100'),
    amountOutMinimum : ethers.utils.parseEther('0'),
    sqrtPriceLimitX96 : '0'
    }

    const swap = await SwapRouter.connect(sender[i]).exactInputSingle(SwapParams);
    console.log(swap);


   
  }

  for(i=0; i <swap; i++){

    const SwapParams = {
      tokenIn : token[(2*i)+1].address,
      tokenOut : token[2*i].address,
      fee : FeeAmount.MEDIUM,
      recipient : sender[i].address,
      deadline : (Date.now()+900),
      amountIn : ethers.utils.parseEther('100'),
      amountOutMinimum : ethers.utils.parseEther('0'),
      sqrtPriceLimitX96 : '0'
      }
  
      const swap = await SwapRouter.connect(sender[i]).exactInputSingle(SwapParams);
      console.log(swap);
  
  
     
    }
}


