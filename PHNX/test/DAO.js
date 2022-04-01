const { expect } = require("chai");
const { waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
const { Wallet } = require("ethers");
const { Console, count } = require("console");


let contractDao;
let contractPHNX;
const proposalID = ["0", "1", "2", "3" , "4"];


const issueFunds = web3.utils.toWei('500');


describe ("PhoenixDaoTesting" , function(){
  
    
    const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
    before(async () => {
       
        //Deploying PHNX token
        const ERC20 = await ethers.getContractFactory("ERC20Kaif");
        contractPHNX = await ERC20.deploy("phnx","PHNX");
        await contractPHNX.deployed();
        console.log("Minting")
        await contractPHNX._mint(owner.address,web3.utils.toWei('1000000'));
        console.log("Minting Done")

        //Deploying DaoContract
        const PhoenixDaoContract = await ethers.getContractFactory("DaoSmartContract");
        contractDao = await PhoenixDaoContract.deploy();
        await contractDao.deployed();

        //Approving tokens
        await contractPHNX.approve(contractDao.address,web3.utils.toWei('1000000'));
        //await contractPHNX.transfer(contractDao.address, web3.utils.toWei('100000'))
        balance = await contractPHNX.balanceOf(contractDao.address) 
        console.log(balance.toString())

        //initializeing contract 
        await contractDao.initialize(contractPHNX.address, owner.address);


      });

    it("transfer phnx to DAO", async () => {
        await contractPHNX.transfer(contractDao.address, web3.utils.toWei('100000'))
        balance = await contractPHNX.balanceOf(contractDao.address) 
        expect(balance).to.equal(web3.utils.toWei('100000').toString())
        console.log('Balance in contract' ,web3.utils.fromWei(balance.toString()).toString())
    });

    it("Submit proposal", async () => {
        
        const fundsRequested = web3.utils.toWei('100');
        const endTime = 1625900400;
        const collAmount = web3.utils.toWei('100');
        const milestonesTotal = (2);

        (await contractDao.connect(addr1).submitProposal(fundsRequested, endTime, collAmount, milestonesTotal, proposalID[0]));
        (await contractDao.connect(addr2).submitProposal(fundsRequested, endTime, collAmount, milestonesTotal, proposalID[1]));
        (await contractDao.connect(addr3).submitProposal(fundsRequested, endTime, collAmount, milestonesTotal, proposalID[2]));
        (await contractDao.connect(addr4).submitProposal(fundsRequested, endTime, collAmount, milestonesTotal, proposalID[3]));
        (await contractDao.connect(addr5).submitProposal(fundsRequested, endTime, collAmount, milestonesTotal, proposalID[4]));


        expect(true).to.equal(true);
    })

    it("Approve Funds", async() => {
        await contractPHNX.connect(addr1).approve(contractDao.address, web3.utils.toWei('1000000'))
        await contractPHNX.connect(addr2).approve(contractDao.address, web3.utils.toWei('1000000'))
        await contractPHNX.connect(addr3).approve(contractDao.address, web3.utils.toWei('1000000'))
        await contractPHNX.connect(addr4).approve(contractDao.address, web3.utils.toWei('1000000'))
        await contractPHNX.connect(addr5).approve(contractDao.address, web3.utils.toWei('1000000'))


    })
    it("Update proposal Status" , async() => {
        await contractPHNX.transfer(addr1.address , web3.utils.toWei('1000'))
        await contractPHNX.transfer(addr2.address , web3.utils.toWei('1000'))
        await contractPHNX.transfer(addr3.address , web3.utils.toWei('1000'))
        await contractPHNX.transfer(addr4.address , web3.utils.toWei('1000'))
        await contractPHNX.transfer(addr5.address , web3.utils.toWei('1000'))

        
        //Creating Admin
        await contractDao.addOwner(owner.address)

        //changing ststus of proposal

        var counter = 0;
        var count = 1;
        while(count<5){
            
            await contractDao.updateProposalStatus(proposalID[counter], count)
            console.log("proposal id right now is ", counter);
            console.log("Proposal status" , count);
           
            
            if(count == 4 && counter<3){
                count=1;
                counter++;
            }
            else{
                count++;
            }
            //console.log(count,counter)
        }
        // await contractDao.updateProposalStatus(proposalID[0], 1)
        // await contractDao.updateProposalStatus(proposalID[0], 2)
        // await contractDao.updateProposalStatus(proposalID[0], 3)
        // await contractDao.updateProposalStatus(proposalID[0], 4)

        // console.log("Proposal 1 Accepted")

        // await contractDao.updateProposalStatus(proposalID[1], 1)
        // await contractDao.updateProposalStatus(proposalID[1], 2)
        // await contractDao.updateProposalStatus(proposalID[1], 3)
        // await contractDao.updateProposalStatus(proposalID[1], 4)
        
        // console.log("Proposal 2 Accepted")

        // await contractDao.updateProposalStatus(proposalID[2], 1)
        // await contractDao.updateProposalStatus(proposalID[2], 2)
        // await contractDao.updateProposalStatus(proposalID[2], 3)
        // await contractDao.updateProposalStatus(proposalID[2], 4)

        // console.log("Proposal 3 Accepted")

        // await contractDao.updateProposalStatus(proposalID[3], 1)
        // await contractDao.updateProposalStatus(proposalID[3], 2)
        // await contractDao.updateProposalStatus(proposalID[3], 3)
        // await contractDao.updateProposalStatus(proposalID[3], 4)

        // console.log("Proposal 4 Accepted")

        //leaving ststus to just accepted
        await contractDao.updateProposalStatus(proposalID[4], 1)

        console.log("proposal 5 is just accepted")

    })

    it("withdraw colletral", async() => {
        let amount = await contractDao.collateralAmount()
        console.log("Colletral amount present in contract ",web3.utils.fromWei(amount.toString()).toString());

        var mybalance = await contractPHNX.balanceOf(addr1.address) ;

        console.log("My balance before exploit",web3.utils.fromWei(mybalance.toString()).toString())

        try{
        for(i=0;i<4;i++){
            await contractDao.withdrawCollateral(proposalID[0]);
        }}catch(err){
            console.log("you cant withdraw baby");
        }

        mybalance = await contractPHNX.balanceOf(addr1.address) ;

        console.log("My balance after exploit",web3.utils.fromWei(mybalance.toString()).toString())
        
    })

    // it("Try to withdraw colleteral when proposal status is just accepted", async()=>{
        
    //     let amount = await contractDao.collateralAmount()
    //     console.log(web3.utils.fromWei(amount.toString()).toString());

    //     var mybalance = await contractPHNX.balanceOf(addr1.address) ;

    //     console.log("My balance before exploit",web3.utils.fromWei(mybalance.toString()).toString())
    //     try {
    //     for(i=0;i<4;i++){
    //         await contractDao.withdrawCollateral(proposalID[4]);
    //     }}catch(err){
    //         console.log("you cant withdraw while proposal just accepted")
    //     }

    //     mybalance = await contractPHNX.balanceOf(addr1.address) ;

    //     console.log("My balance after exploit",web3.utils.fromWei(mybalance.toString()).toString())
        

    // })

})