
const { expect } = require("chai");
const { waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
// require('chai');




describe("DaoStaking", function() {
    let daoStake;
    let erc20;
    
    const [owner, addr1] = provider.getWallets();
    beforeEach(async () => {
       
        
        const ERC20= await ethers.getContractFactory("ERC20Kaif");
        erc20 = await ERC20.deploy("phnx","PHNX");
        await erc20.deployed();
        console.log("Minting")
        await erc20._mint(owner.address,web3.utils.toWei('100'));
        console.log("Minting Done")


        const DaoStake = await ethers.getContractFactory("DaoStakeContract");
        daoStake= await DaoStake.deploy(erc20.address);
        await daoStake.deployed();

        await erc20.approve(daoStake.address,web3.utils.toWei('50'));
        await erc20.transfer(daoStake.address,web3.utils.toWei('10'));
        balance =await erc20.balanceOf(daoStake.address) 
        // console.log(balance)

      });



  it("Check whether reward calculated is correct and is being transferd correctly", async function() {
    let balance = await erc20.balanceOf(owner.address)
    console.log("User Balance before staking",balance.toString())
    await daoStake.stakeALT(web3.utils.toWei('10'),864000);
    expect(await erc20.balanceOf(owner.address)).to.equal('80068493150684931506');
  });


  it("Check whether Right amount is beind decudted after staking and unstaking", async function() {

    let tx = await daoStake.stakeALT(web3.utils.toWei('10'),864000);
    let receipt = await provider.getTransaction(tx.hash)

    let block = await provider.getBlock(String(receipt.blockHash))
    console.log(block.timestamp)
    var message = keccak256(
      defaultAbiCoder.encode(["uint256", "address", "uint256"], [block.timestamp, owner.address,web3.utils.toWei('10')]),
    );
    let totalStake = await daoStake.totalStakedTokens();
    let balance = await erc20.balanceOf(daoStake.address)
    // console.log("balance before unstake",balance.toString())
    console.log(totalStake.toString())
    await daoStake.unstakeALT([message],web3.utils.toWei('10'));
    //  balance =await erc20.balanceOf(daoStake.address)
     totalStake = await daoStake.totalStakedTokens();
     expect(totalStake).to.equal('0');
     console.log(totalStake.toString())
      // tx = await daoStake.stakeALT(web3.utils.toWei('100'),864000);

    // console.log("balance After unstake",balance.toString())
    
  });

  it("Check Whether Burn Amount is Correct when staking for complete period", async function(){
    let tx = await daoStake.stakeALT(web3.utils.toWei('10'),864000);
    let receipt = await provider.getTransaction(tx.hash)
    let stakerBalance = await daoStake.stakerBalance(owner.address);
    console.log("User Staked ",stakerBalance.toString());
    let block = await provider.getBlock(String(receipt.blockHash))
    console.log(block.timestamp)
    var message = keccak256(
      defaultAbiCoder.encode(["uint256", "address", "uint256"], [block.timestamp, owner.address,web3.utils.toWei('10')]),
    );

    await provider.send("evm_setNextBlockTimestamp", [block.timestamp+864000])
    let balance1 = await erc20.balanceOf(owner.address)
    await daoStake.unstakeALT([message],web3.utils.toWei('10'));
    let balance2 = await erc20.balanceOf(owner.address)
    expect(balance2.sub(balance1)).to.equal(web3.utils.toWei('10').toString())

});

it("Check Whether Burn Amount is Correct when staking for partial period", async function(){
  let tx = await daoStake.stakeALT(web3.utils.toWei('10'),864000);
  let receipt = await provider.getTransaction(tx.hash)
  let stakerBalance = await daoStake.stakerBalance(owner.address);
  console.log("User Staked ",stakerBalance.toString());
  let block = await provider.getBlock(String(receipt.blockHash))
  console.log(block.timestamp)
  var message = keccak256(
    defaultAbiCoder.encode(["uint256", "address", "uint256"], [block.timestamp, owner.address,web3.utils.toWei('10')]),
  );

  await provider.send("evm_setNextBlockTimestamp", [block.timestamp+432000])
  let balance1 = await erc20.balanceOf(owner.address)
  await daoStake.unstakeALT([message],web3.utils.toWei('10'));
  let balance2 = await erc20.balanceOf(owner.address)
  expect(balance2.sub(balance1)).to.equal(web3.utils.toWei('5').toString())

});


it("Check whether Right amount is beind decudted after double staking", async function() {

    let tx = await daoStake.stakeALT(web3.utils.toWei('10'),864000);
    let receipt = await provider.getTransaction(tx.hash)

    let block1 = await provider.getBlock(String(receipt.blockHash))
    // console.log(block.timestamp)
    var message1 = keccak256(
      defaultAbiCoder.encode(["uint256", "address", "uint256"], [block1.timestamp, owner.address,web3.utils.toWei('10')]),
    );

    let tx2 = await daoStake.stakeALT(web3.utils.toWei('20'),864000);
    let receipt2 = await provider.getTransaction(tx2.hash)

    let block2 = await provider.getBlock(String(receipt2.blockHash))
    // console.log(block2.timestamp)
    var message2 = keccak256(
      defaultAbiCoder.encode(["uint256", "address", "uint256"], [block2.timestamp, owner.address,web3.utils.toWei('20')]),
    );
    let totalStake = await daoStake.totalStakedTokens();
    let balance =await erc20.balanceOf(daoStake.address)
    // console.log("balance before unstake",balance.toString())
    console.log(totalStake.toString())
    await daoStake.unstakeALT([message1,message2],web3.utils.toWei('30'));
    //  balance =await erc20.balanceOf(daoStake.address)
     totalStake = await daoStake.totalStakedTokens();
     expect(totalStake).to.equal('0');
     console.log(totalStake.toString())
      // tx = await daoStake.stakeALT(web3.utils.toWei('100'),864000);

    // console.log("balance After unstake",balance.toString())
    
  });
})
