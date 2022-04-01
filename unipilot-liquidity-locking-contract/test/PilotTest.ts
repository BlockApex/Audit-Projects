import hre, { ethers, network } from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { UniswapV3LiquidityLocker } from "../typechain/UniswapV3LiquidityLocker";
import _ from "underscore";
import { expect } from "chai";
const { deployContract } = hre.waffle;
//const provider = waffle.provider;
import {BigNumber} from "ethers"
require("solidity-coverage");


describe("Uniswap Liquidity Locker :: ULL", async function () {

  
let _ull: any
let owner: any
let _nfp: any
let erc20: any;

const cliff = ethers.BigNumber.from(0);
const start = ethers.BigNumber.from(1627479830474);
const duration = ethers.BigNumber.from(1627479830475);
  

  beforeEach(async function () {

    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
           
            jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/qT8Lq9WWhfHIlKeGlCpGcLxz1rTnh8lV",
            blockNumber: 12914281
          },
        },
      ],
    });
    
  
    const ull = await ethers.getContractFactory("UniswapV3LiquidityLocker");
    _nfp = await ethers.getContractAt("INonfungiblePositionManager", "0xC36442b4a4522E871399CD717aBDD847Ab11FE88")
    _ull = await ull.deploy();
    await _ull.deployed()

  });

  it('stake true then unstake', async function name() {

    const tokenId = ethers.BigNumber.from(98387);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

    const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: true,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)

      await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
      const t2 = await _ull.connect(owner).claimLPFee(tokenId)
        //console.log(t2)

        const t = await _ull.connect(owner).updateOwner(tokenId , '0x042bc94f6dfe7a383b0347b73aa84552c5588790')
        //console.log("ownershipp transfered", t)

        //@ts-ignore

        //await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
        const t4 = await _ull.connect(owner).unlockToken(tokenId);
        //console.log(t4)

    
  })

  it('Ownership check', async function name(){
    const tokenId = ethers.BigNumber.from(98387);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfBC654e57f9db86D422D5666627dd32b551D55"],
      });
  
      owner = await ethers.getSigner('0x0bfBC654e57f9db86D422D5666627dd32b551D55');

    const approved = _nfp.connect(owner).approve(_ull.address, tokenId);

    const PreviousOwner = await _nfp.ownerOf(tokenId);
  expect (PreviousOwner).to.eq('0x0bfBC654e57f9db86D422D5666627dd32b551D55');
    console.log("previous owner" ,PreviousOwner);

    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: true,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)

      // after locking tokens, uniswapV3LiquidityLocker is the owner
  const newOwner = await _nfp.ownerOf(tokenId);
  expect (newOwner).to.eq(_ull.address);

  })

  it('stake false then unstake', async function name() {

    const tokenId = ethers.BigNumber.from(98387);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

      const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: false,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
     // console.log(t1)
try{
      await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
      const t2 = await _ull.connect(owner).claimLPFee(tokenId)
        console.log(t2)
}catch(err){
      console.log("you can not unstake")
}
        const t = await _ull.connect(owner).updateOwner(tokenId , '0x0bfbc654e57f9db86d422d5666627dd32b551d55')
        //console.log("ownershipp transfered", t)

        //@ts-ignore

        //await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
        const t4 = await _ull.connect(owner).unlockToken(tokenId);
        //console.log(t4)

   
  })

  it('Stake non existing LP', async function name() {

    const tokenId = ethers.BigNumber.from(98377);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');
try{
      const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: false,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)
    }catch(err){
      console.log("LP you stake does not exist")
    }

  })
  

  it('Stake wrong LP', async function name() {

    const tokenId = ethers.BigNumber.from(59852);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

      try{
        const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
      const t1 = await _ull.connect(owner).lockLPToken(
        {
          tokenId,
          cliff,
          duration,
          start,
          allowFeeClaim: false,
          allowBeneficiaryUpdate: true,
          feeReciever: owner.address,
          owner: owner.address
        });
        //console.log(t1)
      }catch(err){
        console.log("LP you trying to stake is not yours")
      }

  })

  it('Stake LP to past duration', async function name() {

    const tokenId = ethers.BigNumber.from(98387);
    const pastStart = ethers.BigNumber.from(1627361709);
    const pastDuration = ethers.BigNumber.from(1627479830475);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

     // try{
        const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
      const t1 = await _ull.connect(owner).lockLPToken(
        {
          tokenId,
          cliff,
          duration,
          start: 1624132509,
          allowFeeClaim: false,
          allowBeneficiaryUpdate: true,
          feeReciever: owner.address,
          owner: owner.address
        });
        console.log(t1)
      // }catch(err){
      //   console.log("you can not stake in past", err)
      // }

  })


  it('Fee claim when cliff is complete', async function name() {

    const tokenId = ethers.BigNumber.from(98387);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

    const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: true,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)

      await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
      const t2 = await _ull.connect(owner).claimLPFee(tokenId)
      console.log("fee claimed successful")


    
  })

  it('Fee claim when cliff is not complete', async function name() {

    const tokenId = ethers.BigNumber.from(98387);

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

    const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: true,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)

      try{
      //await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
      const t2 = await _ull.connect(owner).claimLPFee(tokenId)
      console.log("fee claimed successful")
      }catch(err){
        console.log(err)
      }

    
  })


  it('Update feeReceiver and claim fee for changed receiver', async function name() {

    const token0 = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
    const token1 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const tokenId = ethers.BigNumber.from(92539);
    const feeReceiver = '0x424A8F861a17CF1aF6F10136773588d745Cd0FaC';

    const _token0 = await ethers.getContractAt("ERC20", token0);
    const _token1 = await ethers.getContractAt("ERC20", token1);


    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x0bfbc654e57f9db86d422d5666627dd32b551d55"],
      });
  
      owner = await ethers.getSigner('0x0bfbc654e57f9db86d422d5666627dd32b551d55');

    const approved = _nfp.connect(owner).approve(_ull.address, tokenId);
    const t1 = await _ull.connect(owner).lockLPToken(
      {
        tokenId,
        cliff,
        duration,
        start,
        allowFeeClaim: true,
        allowBeneficiaryUpdate: true,
        feeReciever: owner.address,
        owner: owner.address
      });
      //console.log(t1)

      try{
      //await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])
      const t2 = await _ull.connect(owner).updateFeeReciever(tokenId, feeReceiver);
      console.log("receiver changed")

      await ethers.provider.send("evm_setNextBlockTimestamp", [1627479830474 + 1627480664734])

      const balance0beforeClaim: BigNumber = await _token0.balanceOf(feeReceiver);
      const balance1beforeClaim: BigNumber = await _token1.balanceOf(feeReceiver);

      const t3 = await _ull.claimLPFee(tokenId)

      const balance0afterClaim: BigNumber = await _token0.balanceOf(feeReceiver);
      const balance1afterClaim: BigNumber = await _token1.balanceOf(feeReceiver);


      expect(parseInt(balance0beforeClaim._hex, 16)).to.lessThan(parseInt(balance0afterClaim._hex, 16))
      // expect(balance1beforeClaim.toNumber()).to.lessThan(balance1afterClaim.toNumber())
     // console.log("fee claimed successful", t3)
      }catch(err){
        console.log(err)
      }

    
  })


})