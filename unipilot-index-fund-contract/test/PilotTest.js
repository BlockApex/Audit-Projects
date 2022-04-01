const { expect } = require("chai");
const { waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
//const { SignerWithAddress } = require ("@nomiclabs/hardhat-ethers/dist/src/signer-with-address");
const { Wallet, BigNumber, utils } = require("ethers");
//import { BigNumber, utils } from "ethers";
const { Console, count } = require("console");
const ERC20Artifact = require ("../artifacts/contracts/test/ERC20.sol/DERC20.json");
const PilotTokenArtifact = require ("./PilotTokenArtifact/Pilot.json");
const { SignerWithAddress } = require ("@nomiclabs/hardhat-ethers/signers");
const IndexFundArtifact = require ("../artifacts/contracts/IndexFund.sol/IndexFund.json");



describe ("PilotTesting" , function(){

    let contractUsdt;
    let contractPilot;
    let contractUni;
    let contractLockFunds;
    let IndexFundContract;
    let pilotToken;
    let uniToken;
    let linkToken;

  
    
    const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
    beforeEach(async () => {
       
        //Deploying tokens

        const pilotFactory = await ethers.getContractFactory("Pilot");
        pilotToken = await pilotFactory.deploy(owner.address, [addr1.address], [addr2.address]);
        await pilotToken.deployed();

        const uniFactory = await ethers.getContractFactory("Uni");
        uniToken = await uniFactory.deploy(owner.address, owner.address, web3.utils.toWei("10000"));
        await uniToken.deployed();

        const linkFactory = await ethers.getContractFactory("LinkToken");
        linkToken = await linkFactory.deploy();
        await linkToken.deployed();

        ERC20 = await ethers.getContractFactory("DERC20");
        contractUsdt = await ERC20.deploy("usdt","USDT");
        await contractUsdt.deployed();
        //console.log("Minting")
        await contractUsdt.mint(owner.address,web3.utils.toWei('10000000'));
        //console.log("USDT Minting Done")

        ERC20 = await ethers.getContractFactory("DERC20");
        contractPilot = await ERC20.deploy("pilot","PILOT");
        await contractPilot.deployed();
        //console.log("Minting")
        await contractPilot.mint(owner.address,web3.utils.toWei('10000000'));
        //console.log("PILOT Minting Done")

        ERC20 = await ethers.getContractFactory("DERC20");
        contractUni = await ERC20.deploy("usdt","USDT");
        await contractUni.deployed();
        //console.log("Minting")
        await contractUni.mint(owner.address,web3.utils.toWei('10000000'));
        //console.log("UNI Minting Done")

        ERC20 = await ethers.getContractFactory("DERC20");
        contractLockFunds = await ERC20.deploy("usdt","USDT");
        await contractLockFunds.deployed();
        //console.log("Minting")
        await contractLockFunds.mint(owner.address,web3.utils.toWei('10000000'));
        //console.log("UNI Minting Done")

        // const contractIndexFund = await ethers.getContractFactory("IndexFund");
        // IndexFundContract = await contractIndexFund.deploy(owner.address, [contractLockFunds.address], contractPilot.address);
        // await IndexFundContract.deployed();
        // console.log("contract deployed")

        // await contractUsdt.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        // await contractUni.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        // await contractPilot.approve(IndexFundContract.address,web3.utils.toWei('2000000'));
        // await contractPilot.approve(owner.address,web3.utils.toWei('2000000'));
        // console.log("all tokens approved")

      });

  

    // it("Transfering fund to contract", async()=>{

    //     //transfer USDT
    //     await contractUsdt.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
    //     balance = await contractUsdt.balanceOf(IndexFundContract.address) 
    //     expect(balance).to.equal(web3.utils.toWei('10000').toString())
    //     console.log('USDT in contract' ,web3.utils.fromWei(balance.toString()).toString())
    //     //Transfer UNI
    //     await contractUni.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
    //     balance = await contractUni.balanceOf(IndexFundContract.address) 
    //     expect(balance).to.equal(web3.utils.toWei('10000').toString())
    //     console.log('UNI in contract' ,web3.utils.fromWei(balance.toString()).toString())

    //     await contractPilot.transfer(contractLockFunds.address, web3.utils.toWei('10000'))
    //     balance = await contractPilot.balanceOf(contractLockFunds.address) 
    //     expect(balance).to.equal(web3.utils.toWei('10000').toString())
    //     console.log('pilot transferred to Owner wallet' ,web3.utils.fromWei(balance.toString()).toString())

    // })

    it("Migrate Funds using UNI contract", async()=>{
        const bal = await uniToken.balanceOf(owner.address);
        console.log("uni bal of owner: ", bal.toString());

        const IndexFactory = await ethers.getContractFactory("IndexFund");
        const indexFund = await IndexFactory.deploy(owner.address, [pilotToken.address], pilotToken.address);
        await indexFund.deployed();

        await uniToken.transfer(indexFund.address, web3.utils.toWei("1000"));
       // await linkToken.transfer(indexFund.address, web3.utils.toWei("1000"));

        const balUni = await uniToken.balanceOf(indexFund.address);
        console.log("bal of uni: ", balUni.toString());

        await indexFund.migrateFunds(addr3.address, [uniToken.address]);

        console.log("balance of wallet3: ", (await uniToken.balanceOf(addr3.address)).toString());

    })

    it("Migrate Funds using LINK contract", async()=>{
        try{
        const bal = await linkToken.balanceOf(owner.address);
        console.log("link bal of owner: ", bal.toString());

        const IndexFactory = await ethers.getContractFactory("IndexFund");
        const indexFund = await IndexFactory.deploy(owner.address, [pilotToken.address], pilotToken.address);
        await indexFund.deployed();

        await linkToken.transfer(indexFund.address, web3.utils.toWei("1000"));
       // await linkToken.transfer(indexFund.address, web3.utils.toWei("1000"));

        const balLink = await uniToken.balanceOf(indexFund.address);
        console.log("bal of link: ", balLink.toString());

        await indexFund.migrateFunds(addr3.address, [linkToken.address]);

        console.log("balance of wallet3: ", (await linkToken.balanceOf(addr3.address)).toString());
        }catch(err){
           // console.error("Link token needs approval when migraring from contract, False implementation of safeTransferFrom ")
           // console.error('%c Link token needs approval when migraring from contract, False implementation of safeTransferFrom ! ', 'background: #222; color: #bada55');
            console.error('\x1b[31m%s\x1b[0m', 'Link token needs approval when migraring from contract, False implementation of safeTransferFrom');
        }

    })

    it("Withdraw pilots from contract", async()=>{

        const contractIndexFund = await ethers.getContractFactory("IndexFund");
        IndexFundContract = await contractIndexFund.deploy(owner.address, [contractLockFunds.address], contractPilot.address);
        await IndexFundContract.deployed();
        console.log("contract deployed")

        await contractUsdt.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractUni.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractPilot.approve(IndexFundContract.address,web3.utils.toWei('2000000'));
        await contractPilot.approve(owner.address,web3.utils.toWei('2000000'));
        console.log("all tokens approved")

        try{
            // bal of indexFund in usdt; BUSDT
            await contractUsdt.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
            balance1 = await contractUsdt.balanceOf(IndexFundContract.address) 
            expect(balance1).to.equal(web3.utils.toWei('10000').toString())
            console.log('USDT in contract' ,web3.utils.fromWei(balance1.toString()).toString())

            // bal of indexFund in UNI; BUNI
            await contractUni.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
            balance2 = await contractUni.balanceOf(IndexFundContract.address) 
            expect(balance2).to.equal(web3.utils.toWei('10000').toString())
            console.log('UNI in contract' ,web3.utils.fromWei(balance2.toString()).toString())

            // circulationg supply
            const supply = await IndexFundContract.circulatingSupply();
            console.log("supply ", supply.toString())

            const precision = BigNumber.from("1000000000000000000");
            // pilotTokenPercenatge = amount/circulationgSupply
            const pilotTokenPercenatge = BigNumber.from(web3.utils.toWei('1000')).mul(precision).div(supply)
            console.log("PilottokenPercentage", web3.utils.fromWei(pilotTokenPercenatge.toString()));

            USDTbalanceBefore = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT before' ,web3.utils.fromWei(USDTbalanceBefore.toString()).toString())
            UNIbalanceBefore = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI before' ,web3.utils.fromWei(UNIbalanceBefore.toString()).toString())

            const test  = await IndexFundContract.withdraw([contractUsdt.address,contractUni.address] , web3.utils.toWei('2000000'))

            USDTbalanceafter = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT after' ,web3.utils.fromWei(USDTbalanceafter.toString()).toString())
            UNIbalanceafter = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI after' ,web3.utils.fromWei(UNIbalanceafter.toString()).toString())

            const NewBalUsdt = USDTbalanceafter.sub( USDTbalanceBefore).toString();
            const NewBalUni = UNIbalanceafter.sub( UNIbalanceBefore).toString();
            var verifyUSDT = NewBalUsdt == balance1.mul( pilotTokenPercenatge).div(precision).toString();
            var verifyUNI = NewBalUni == balance2.mul( pilotTokenPercenatge).div(precision).toString();
            console.log("NEW UDST bal: ", NewBalUsdt.toString(), " New UNI Bal: ", NewBalUni.toString(), " pilot token Percent: ", pilotTokenPercenatge.div(precision).toString());
            expect(verifyUSDT).to.be.false;
            expect(verifyUNI).to.be.false;

            // verify that user have BUNI * pilotTokenPercent;
            

            //console.log(test);

        }catch(err){
            console.log(err);
        }
    })

    it("Withdraw pilots from empty contract", async()=>{

        const contractIndexFund = await ethers.getContractFactory("IndexFund");
        IndexFundContract = await contractIndexFund.deploy(owner.address, [contractLockFunds.address], contractPilot.address);
        await IndexFundContract.deployed();
        console.log("contract deployed")

        await contractUsdt.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractUni.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractPilot.approve(IndexFundContract.address,web3.utils.toWei('2000000'));
        await contractPilot.approve(owner.address,web3.utils.toWei('2000000'));
        console.log("all tokens approved")

        try{
           
            // circulationg supply
            const supply = await IndexFundContract.circulatingSupply();
            console.log("supply ", supply.toString())

            const precision = BigNumber.from("1000000000000000000");
            // pilotTokenPercenatge = amount/circulationgSupply
            const pilotTokenPercenatge = BigNumber.from(web3.utils.toWei('1000')).mul(precision).div(supply)
            console.log("PilottokenPercentage", web3.utils.fromWei(pilotTokenPercenatge.toString()));

            USDTbalanceBefore = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT before' ,web3.utils.fromWei(USDTbalanceBefore.toString()).toString())
            UNIbalanceBefore = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI before' ,web3.utils.fromWei(UNIbalanceBefore.toString()).toString())

            const test  = await IndexFundContract.withdraw([contractUsdt.address,contractUni.address] , web3.utils.toWei('1000'))

            //console.log(test);


            USDTbalanceafter = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT after' ,web3.utils.fromWei(USDTbalanceafter.toString()).toString())
            UNIbalanceafter = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI after' ,web3.utils.fromWei(UNIbalanceafter.toString()).toString())

            const NewBalUsdt = USDTbalanceafter.sub( USDTbalanceBefore).toString();
            const NewBalUni = UNIbalanceafter.sub( UNIbalanceBefore).toString();
            var verifyUSDT = NewBalUsdt == balance1.mul( pilotTokenPercenatge).div(precision).toString();
            var verifyUNI = NewBalUni == balance2.mul( pilotTokenPercenatge).div(precision).toString();
            console.log("NEW UDST bal: ", NewBalUsdt.toString(), " New UNI Bal: ", NewBalUni.toString(), " pilot token Percent: ", pilotTokenPercenatge.div(precision).toString());
            expect(verifyUSDT).to.be.false;
            expect(verifyUNI).to.be.false;

            // verify that user have BUNI * pilotTokenPercent;
            console.log('\x1b[31m%s\x1b[0m', 'Transaction should get reverted because contract has zero balance');
            

            //console.log(test);

        }catch(err){
            console.log(err);
        }
    })

    it("Sending Same token multiple times and Withdraw pilots from contract", async()=>{

        const contractIndexFund = await ethers.getContractFactory("IndexFund");
        IndexFundContract = await contractIndexFund.deploy(owner.address, [contractLockFunds.address], contractPilot.address);
        await IndexFundContract.deployed();
        console.log("contract deployed")

        await contractUsdt.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractUni.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        await contractPilot.approve(IndexFundContract.address,web3.utils.toWei('2000000'));
        await contractPilot.approve(owner.address,web3.utils.toWei('2000000'));
        console.log("all tokens approved")

        try{
            // bal of indexFund in usdt; BUSDT
            await contractUsdt.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
            balance1 = await contractUsdt.balanceOf(IndexFundContract.address) 
            expect(balance1).to.equal(web3.utils.toWei('10000').toString())
            console.log('USDT in contract' ,web3.utils.fromWei(balance1.toString()).toString())

            // bal of indexFund in UNI; BUNI
            await contractUni.transfer(IndexFundContract.address, web3.utils.toWei('10000'))
            balance2 = await contractUni.balanceOf(IndexFundContract.address) 
            expect(balance2).to.equal(web3.utils.toWei('10000').toString())
            console.log('UNI in contract' ,web3.utils.fromWei(balance2.toString()).toString())

            // circulationg supply
            const supply = await IndexFundContract.circulatingSupply();
            console.log("supply ", supply.toString())

            const precision = BigNumber.from("1000000000000000000");
            // pilotTokenPercenatge = amount/circulationgSupply
            const pilotTokenPercenatge = BigNumber.from(web3.utils.toWei('1000')).mul(precision).div(supply)
            console.log("PilottokenPercentage", web3.utils.fromWei(pilotTokenPercenatge.toString()));

            USDTbalanceBefore = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT before' ,web3.utils.fromWei(USDTbalanceBefore.toString()).toString())
            UNIbalanceBefore = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI before' ,web3.utils.fromWei(UNIbalanceBefore.toString()).toString())

            const test  = await IndexFundContract.withdraw([contractUsdt.address,contractUsdt.address,contractUsdt.address,contractUsdt.address,contractUni.address] , web3.utils.toWei('2000000'))

            USDTbalanceafter = await contractUsdt.balanceOf(owner.address)
            console.log('owner USDT after' ,web3.utils.fromWei(USDTbalanceafter.toString()).toString())
            UNIbalanceafter = await contractUni.balanceOf(owner.address)  
            console.log('owner UNI after' ,web3.utils.fromWei(UNIbalanceafter.toString()).toString())

            const NewBalUsdt = USDTbalanceafter.sub( USDTbalanceBefore).toString();
            const NewBalUni = UNIbalanceafter.sub( UNIbalanceBefore).toString();
            var verifyUSDT = NewBalUsdt == balance1.mul( pilotTokenPercenatge).div(precision).toString();
            var verifyUNI = NewBalUni == balance2.mul( pilotTokenPercenatge).div(precision).toString();
            console.log("NEW UDST bal: ", NewBalUsdt.toString(), " New UNI Bal: ", NewBalUni.toString(), " pilot token Percent: ", pilotTokenPercenatge.div(precision).toString());
            expect(verifyUSDT).to.be.false;
            expect(verifyUNI).to.be.false;

            // verify that user have BUNI * pilotTokenPercent;
            console.log('\x1b[31m%s\x1b[0m', 'User have withdrawn same funds multiple times ');

            

            //console.log(test);

        }catch(err){
            console.log(err);
        }
    })


})
