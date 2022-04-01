const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
require("ethers/lib/utils");
const { ecsign } = require("ethereumjs-util");
const { Wallet } = require("ethers");
const { appendFile } = require("fs");

describe("DaoStaking", function () {
  let daoStake;
  let dao;
  let erc20;

  const [owner, addr1] = provider.getWallets();
  before(async () => {
    const ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.deploy("phnx", "PHNX");
    // console.log(erc20)
    await erc20.deployed();
    console.log("Minting");
    await erc20._mint(owner.address, web3.utils.toWei("100000000000000000000"));

    console.log("Minting Done");

    const DaoStake = await ethers.getContractFactory("DaoStakeContract");
    daoStake = await DaoStake.deploy(erc20.address);
    await daoStake.deployed();


    const Dao = await ethers.getContractFactory("DaoSmartContract");
    dao = await Dao.deploy();

    await dao.initialize(erc20.address, owner.address);
   // await dao.setStakeContract(daoStake.address);

    await erc20.approve(daoStake.address, web3.utils.toWei("50"));
    await erc20.approve(dao.address, web3.utils.toWei("10000000000000"));
    await erc20.transfer(daoStake.address, web3.utils.toWei("100000000000"));
    await erc20.transfer(dao.address, web3.utils.toWei("100000000000"));

    balance = await erc20.balanceOf(daoStake.address);
    
     console.log(balance.toString());
  });

  it ("submit and update proposal", async function () {
    const submitp = await dao.submitProposal(web3.utils.toWei("100"),web3.utils.toWei("600"),web3.utils.toWei("1000000"),web3.utils.toWei("3"),"100");
   // console.log(submitp);
   //updating status
   // const updateStatus0 = await dao.updateProposalStatus("100", "0");
    const updateStatus1 = await dao.updateProposalStatus("100", "1");
    const updateStatus2 = await dao.updateProposalStatus("100", "2");
    //const updateStatus3 = await dao.updateProposalStatus("100", "3");
    // console.log(updateStatus3);
    // const updateProposal = await dao.updateProposal(web3.utils.toWei("1000"),web3.utils.toWei("600"),web3.utils.toWei("10"),web3.utils.toWei("3"),"100");
    // console.log(updateProposal);
   // const updateStatus4 = await dao.updateProposalStatus("100", "4");
    //console.log(updateStatus4);
    
  })

  it("withdraw exploit ", async function(){
     //attack scenario
     var messagehash = keccak256(
      defaultAbiCoder.encode(
        ["string", "address"],["100", owner.address])
    )
    const domainSaperator = keccak256(defaultAbiCoder.encode(["string", "address"],["0x01", dao.address]));
    var final = keccak256(solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"],["0x19","0x01", domainSaperator, messagehash]))
    const { v, r, s } = ecsign(Buffer.from(final.slice(2), "hex"), Buffer.from(owner.privateKey.slice(2), "hex"));
    const before = await erc20.balanceOf(owner.address)
    console.log(before.toString());
    const withdraw = await dao.withdrawCollateral("100", v, r , s);
    //console.log(withdraw);
    const after = await erc20.balanceOf(owner.address)
    console.log(after.toString());

  })

  it ("submit and update proposal exploit", async function () {
    const submitp = await dao.submitProposal(web3.utils.toWei("100"),web3.utils.toWei("600"),web3.utils.toWei("1000000"),web3.utils.toWei("3"),"101");
   // console.log(submitp);
   //updating status
   try {
     
   
    const updateStatus0 = await dao.updateProposalStatus("100", "0");
    const updateStatus1 = await dao.updateProposalStatus("100", "1");
    const updateStatus2 = await dao.updateProposalStatus("100", "2");
    const updateStatus3 = await dao.updateProposalStatus("100", "3");
    // console.log(updateStatus3);
     const updateProposal = await dao.updateProposal(web3.utils.toWei("1000"),web3.utils.toWei("600"),web3.utils.toWei("10"),web3.utils.toWei("3"),"101");
    // console.log(updateProposal);
    const updateStatus4 = await dao.updateProposalStatus("100", "4");
    console.log(updateStatus4);
   }
    catch (error) {
     console.log("proposal status cant be change beacuse it reverted to 0 again)")
    }
  })

});
