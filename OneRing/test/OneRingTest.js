const { expect } = require("chai");
const { waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
const { Wallet } = require("ethers");
const { Console, count } = require("console");

let contractOneRing;
let tokenOnering;
let contractStorage;
let contractStrategy;


const issueFunds = web3.utils.toWei('500');

describe ("OneRingTesting" , function(){
      
    const [owner] = provider.getWallets();
    before (async () => {
       
       // Deploying tokens for OneRing
        let ERC20 = await ethers.getContractFactory("ERC20Kaif");
        tokenOnering = await ERC20.deploy("1ring","1RING");
        await tokenOnering.deployed();
        console.log("Minting")
        await tokenOnering._mint(owner.address,web3.utils.toWei('1000000'));
        console.log("Minting Done")
        
      //  Deploying OneRingContract
        const OneRingContract = await ethers.getContractFactory("OneRingVault");
        contractOneRing = await OneRingContract.deploy();
        await contractOneRing.deployed();

        // //deploy storage contract
        const StorageContract = await ethers.getContractFactory("Storage");
        contractStorage = await StorageContract.deploy();
        await contractStorage.deployed();

        await contractOneRing.initializeVault(contractStorage.address, "0x6b175474e89094c44da98b954eedeac495271d0f");


        //Approving tokens
        await tokenOnering.approve(contractOneRing.address,web3.utils.toWei('1000000'));
        console.log("Approve done");
        await tokenOnering.transfer(contractOneRing.address,web3.utils.toWei('100000'));
        console.log("Transfer done");
        balance = await tokenOnering.balanceOf(contractOneRing.address) 
        expect(balance).to.equal(web3.utils.toWei('100000').toString())
        console.log('Balance in contract' ,web3.utils.fromWei(balance.toString()).toString())       

        //Deploying Strategy contract
        const StrategyContract = await ethers.getContractFactory("IdleStrategyDAIMainnet");
        await (contractStrategy = await StrategyContract.deploy(contractStorage.address,contractOneRing.address)).done();
        await(await contractStrategy.deployed()).done();
    
       
    });

    it("Checking Underlying Balance" , async()=> {
       const underlyingBalance = await contractOneRing.underlyingBalanceInVault()
       console.log('Underlying Balance' ,web3.utils.fromWei(underlyingBalance.toString()).toString()) 
    })

    it("Impersonation" , async()=> {
      const signer = await ethers.provider.getSigner("0x73865aB70431b874619AB8Fe36bb2c292A643B2f");
      const tx = signer.sendTransaction({
        to: "0xE6FF9251aB84ddb26be9d7AF2F028ABD0AF75507",
        value: ethers.utils.parseEther("1.0")
      })
      console.log(tx); 
   })

});


