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
const nfm = require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json');
const v3f = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json');
const sr = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')
const Uniswap = require('./Uniswaptests.js')


describe ("UnipilotTesting" , function(){

    let wethToken;
    let reflectToken;
    let pilotToken;
    let Unipilot;
    let UniswapLiquidityManager;
    let UniStrategy;
    let V3Oracle;
    let tokenA;
    let tokenB;
    let tokenC;
    let tokenD;
    let ULMState;
    let IndexFund;
    const weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    let IUniswapV3Factory;


    const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
    var web3 = new Web3(provider);

    before(async () => {

      //reset forking
      await network.provider.request({
        method: "hardhat_reset",
        params: [
          {
            forking: {
              //jsonRpcUrl: "https://eth-rinkeby.alchemyapi.io/v2/RsmAzmnpGeosUaH8DrX-O8RW7cUiFiTG",
              jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/qT8Lq9WWhfHIlKeGlCpGcLxz1rTnh8lV",
              blockNumber: 9407561
            },
          },
        ],
      });


      IndexFund = addr2.address
        //get nonce of wallet
        // var nonce = await provider.getTransactionCount(owner.address);   
        // console.log(nonce)  
        // var predictAddress =     "0x" + web3.utils.sha3(RLP.encode([owner.address, nonce+1])).slice(12).substring(14)
        // console.log(predictAddress)

        //Deploying tokens

        IUniswapV3Factory = await ethers.getContractAt(v3f.abi,"0x1F98431c8aD98523631AE4a59f267346ea31F984" )

        const ULMStateFactory = await ethers.getContractFactory("ULMState")
        ULMState = await ULMStateFactory.deploy();
        await ULMState.deployed()

        const V3OFactory = await ethers.getContractFactory("V3Oracle")
        V3Oracle = await V3OFactory.deploy(ULMState.address);
        await V3Oracle.deployed()
    
        const USFactory = await ethers.getContractFactory("UniStrategy")
        UniStrategy = await USFactory.deploy();
        await UniStrategy.deployed()

        const ULLFactory = await ethers.getContractFactory("UniswapLiquidityManager")
        UniswapLiquidityManager = await ULLFactory.deploy(UniStrategy.address , V3Oracle.address, ULMState.address, IndexFund, IUniswapV3Factory.address);
        await UniswapLiquidityManager.deployed()

        const pilotFactory = await ethers.getContractFactory("Unipilot");
        Unipilot = await pilotFactory.deploy(UniswapLiquidityManager.address);
        await Unipilot.deployed();

        await UniswapLiquidityManager.initialize(Unipilot.address)
        await Unipilot.setGovernance(owner.address)

        pilot = await ethers.getContractAt("ERC20", "0x37C997B35C619C21323F3518B9357914E8B99525")
        usdc = await ethers.getContractAt("ERC20", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
        usdt = await ethers.getContractAt("ERC20", "0xdAC17F958D2ee523a2206206994597C13D831ec7")
       // usdt = await ethers.getContractAt("ERC20", "0xdAC17F958D2ee523a2206206994597C13D831ec7")

        
        console.log("pass 1")

        
  
    });
  

    it("deploying tokens", async()=>{

      var poolss = 5;
      var swapss = 5;

      //var fc = await Uniswap(poolss,swapss);
      //console.log(fc );


        const tokenAFactory = await ethers.getContractFactory("ERC20")
        tokenA = await tokenAFactory.deploy("a", "A")
        await tokenA.deployed()

        const tokenBFactory = await ethers.getContractFactory("ERC20")
        tokenB = await  tokenBFactory.deploy("b", "B")
        await tokenB.deployed()

        const tokenCFactory = await ethers.getContractFactory("ERC20")
        tokenC = await tokenCFactory.deploy("c", "C")
        await tokenC.deployed()

        const tokenDFactory = await ethers.getContractFactory("ERC20")
        tokenD = await tokenDFactory.deploy("d", "D")
        await tokenD.deployed()

        // const pilottFactory = await ethers.getContractFactory("ERC20");
        // pilotToken = await pilottFactory.deploy();
        // await pilotToken.deployed();

        await tokenB._mint(owner.address, web3.utils.toWei('1000000'))
        await tokenC._mint(owner.address, web3.utils.toWei('1000000'))
        await tokenA._mint(owner.address, web3.utils.toWei('1000000'))
        await tokenD._mint(owner.address, web3.utils.toWei('1000000'))

        await tokenB.approve(Unipilot.address, web3.utils.toWei('10000000000'));
        await tokenC.approve(Unipilot.address, web3.utils.toWei('10000000000'))
        await tokenA.approve(Unipilot.address, web3.utils.toWei('10000000000'));
        await tokenD.approve(Unipilot.address, web3.utils.toWei('10000000000'))

        console.log("pass 2")

        

    })

   // it("Create pool and deposite", async()=>{

 
      //   let exchangeAddress = UniswapLiquidityManager.address;
      //   let token0 = tokenA.address;
      //   let token1 = tokenB.address;
      //   let fee = BigNumber("3000").toString();
      //   let amount0 = BigNumber("100").toString();
      //   let amount1 = BigNumber("100").toString();
      //   let amount2 = BigNumber("100").toString();
      //   let amount3 = BigNumber("100").toString();
      //   let shares =  BigNumber("1000000000000000000").toString();
      //   let tokenId = BigNumber("0").toString()
      //   let sqrtPrice = 
      //   BigNumber(
      //       new bn(amount1.toString())
      //       .div(amount0.toString())
      //       .sqrt()
      //       .multipliedBy(new bn(2).pow(96))
      //       .integerValue(3)
      //       .toString()
      //       // "7.9228162514264337593543950336e+28"
      //   ).toFixed()

      //   console.log("my sqrt bn :", sqrtPrice);

        

      //   const abiCoder = new AbiCoder();
      //   const data0 = abiCoder.encode(["uint24", "uint160"], [fee, sqrtPrice]);
      //   const data1 = abiCoder.encode(["uint24", "uint256"], [fee, tokenId]);
      //   console.log(exchangeAddress , tokenB.address, tokenC.address, data0, data1, amount0.toString(), amount1.toString())

      // //  const result1 = await UniswapLiquidityManager.createPair(tokenB.address,tokenC.address, data0);
      // //   console.log(result1)
          
      // //   const dep = await UniswapLiquidityManager.deposit(token0,token1,owner.address,amount2,amount3,shares,data1)
      // //   console.log(dep)
      //    const result = await Unipilot.createPoolAndDeposit([exchangeAddress,token0,token1,amount2,amount3],[data0, data1]);
      //    console.log(result);
      //     let token = await Unipilot.tokenOfOwnerByIndex(owner.address,0)
      //     console.log(token)

      //   
   // })






      //   it("Manipulate deposite by NFT", async()=>{

      //     //data
      //   let exchangeAddress = UniswapLiquidityManager.address;
      //   let token1 = weth;
      //   let token0 = pilot.address;
      //   let token2 = usdt.address
      //   let fee = BigNumber("3000").toString();
      //   let amount1 = web3.utils.toWei("0.1");;
      //   let amount0 = web3.utils.toWei("79.4");
      //   let amount3 = web3.utils.toWei("0.01");;
      //   let amount2 = ethers.utils.parseUnits("33.91", '6');;
      //   let shares =  BigNumber("1000000000000000000").toString();
      //   let tokenId = BigNumber("0").toString()
      
      //   const abiCoder = new AbiCoder();
      //   const data1 = abiCoder.encode(["uint24", "uint256"], [fee, tokenId]);
      //   //console.log(data1)

      //   //impersonating account
      //   await hre.network.provider.request({
      //     method: "hardhat_impersonateAccount",
      //     params: ["0xe02A1070699632B1A7a8bDF68C95C2bA79014AE0"],
      //     });
      //   const Isigner = await ethers.getSigner('0xe02A1070699632B1A7a8bDF68C95C2bA79014AE0');
      //   await pilot.connect(Isigner).approve(Unipilot.address, web3.utils.toWei('10000000000000000000000000000000'))
        

      //   //check allowance
      //   console.log("allowance: ",
      //   web3.utils.fromWei((await pilot.connect(Isigner).allowance(Isigner.address, Unipilot.address)).toString()),
      //   " bal: ",
      //   web3.utils.fromWei((await pilot.connect(Isigner).balanceOf(Isigner.address)).toString())
      //   )
        
      //   // deposit in WETH/PILOT
      //   const Depo = await Unipilot.connect(Isigner).deposit([exchangeAddress, token0, token1, amount0, amount1],data1, {value: amount1})
      //   //console.log("deposite  : " , Depo)
      //   let token = await Unipilot.tokenOfOwnerByIndex(Isigner.address,0)
      //   console.log(token)

      //   //tokenowed
      //   const positions  = await UniswapLiquidityManager.positions(token.toString())
      //   console.log("Positions: ", positions)
      //   const liquidityPosition = await UniswapLiquidityManager.liquidityPositions((positions.pool).toString())
      //   console.log("liquidityPositions pool : ", liquidityPosition)

      //   //impersonating account
      //   await hre.network.provider.request({
      //     method: "hardhat_impersonateAccount",
      //     params: ["0x59a2720f6da97cBf980A7DAFF1635875c75Bd5eF"],
      //     });
      //   const Isigner1 = await ethers.getSigner('0x59a2720f6da97cBf980A7DAFF1635875c75Bd5eF');

      //   //sending some balance
      //  const depp = await Isigner.sendTransaction({
      //     to: Isigner1.address,
      //     value: ethers.utils.parseEther('10')
      //   })
      //   //console.log("depp   : " , depp)

      //   //const ethbal = await ethers.provider.getBalance(Isigner1.address)
      //   //console.log("eth bal of Isigner1", ethbal)


      //   await usdt.connect(Isigner1).approve(Unipilot.address, web3.utils.toWei('10000000000000000000000000000000'))

      //   //check allowance
      //   console.log("allowance: ",
      //   web3.utils.fromWei((await usdt.allowance(Isigner1.address, Unipilot.address)).toString()),
      //   " bal in USDT: ",
      //   ethers.utils.parseUnits((await usdt.balanceOf(Isigner1.address)).toString(),'6').toString()
      //   )

      //   //deposite again using previous tx NFT
      //   const data2 = abiCoder.encode(["uint24", "uint256"], [fee, token]);
      //   const Depo1 = await Unipilot.connect(Isigner1).deposit([exchangeAddress, token1, token2, amount3, amount2],data2, {value: amount3})
      //   console.log("deposite  : " , Depo1)
      //   // let tokenn = await Unipilot.tokenOfOwnerByIndex(Isigner1.address,0)
      //   // console.log(tokenn)

      //   const positions1  = await UniswapLiquidityManager.positions(token.toString())
      //   console.log("Postions1: ", positions1)
      //   const liquidityPosition1 = await UniswapLiquidityManager.liquidityPositions("0x4e68ccd3e89f51c3074ca5072bbac773960dfa36")
      //   console.log("liquidityPositions1 pool : ", liquidityPosition1)

      //   })

      it("end to end", async()=>{

             //data
        let exchangeAddress = UniswapLiquidityManager.address;
        let token0 = tokenA.address;
        let token1 = tokenB.address;
     //   let token2 = usdt.address
        let fee = BigNumber("3000").toString();
        let amount0 = web3.utils.toWei("100");;
        let amount1 = web3.utils.toWei("100");
        let amount2 = web3.utils.toWei("1");;
        let amount3 = ethers.utils.parseUnits("33.91", '6');;
        let shares =  BigNumber("1000000000000000000").toString();
        let tokenId = BigNumber("0").toString()

        if (token0.toLowerCase() > token1.toLowerCase()){
          let temp = token0;
          token0 = token1;
          token1 = temp;
        }

        const E2EFactory = await ethers.getContractFactory("E2E_Deposit_Withdraw")
        const E2E = await E2EFactory.deploy();
        await E2E.deployed()

          let sqrtPrice = BigNumber(
            new bn(amount0.toString())
            .div(amount1.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
)               .toFixed()


        const abiCoder = new AbiCoder();
        const data0 = abiCoder.encode(["uint24", "uint160"], [fee, sqrtPrice]);

        let seed = BigNumber("10").toString();
            await E2E.deposit(seed , amount0, amount1, tokenId)
      
      })

})


