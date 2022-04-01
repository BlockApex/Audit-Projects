const { expect } = require("chai");
const { waffle,ethers } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;
//const web3 = require("web3");
const { defaultAbiCoder, hexlify, keccak256, toUtf8Bytes, solidityPack } = require("ethers/lib/utils");
const { Wallet, BigNumber, utils } = require("ethers");
const { Console, count, timeStamp } = require("console");

const  web3 = require('@nomiclabs/hardhat-web3')



describe ("SonerTesting" , function(){

    let sonerERC;
    let sonerBSC;
    let contractETH;
    let contractBSC;
    let Sig;
    
    const [owner, addr1,addr2,addr3,addr4,addr5] = provider.getWallets();
    beforeEach(async () => {
       
        //Deploying tokens

        const tokenERCFactory = await ethers.getContractFactory("TokenEth");
        sonerERC = await tokenERCFactory.deploy();
        await sonerERC.deployed();
        await sonerERC.mint(owner.address,web3.utils.toWei('10000000'));

        const tokenBSCFactory = await ethers.getContractFactory("TokenBsc");
        sonerBSC = await tokenBSCFactory.deploy();
        await sonerBSC.deployed();
        await sonerBSC.mint(owner.address,web3.utils.toWei('10000000'));

        // deploying bridge

        const contractERCFactory = await ethers.getContractFactory("BridgeEth");
        contractETH = await contractERCFactory.deploy(sonerERC.address);
        await contractETH.deployed();

        const contractBSCFactory = await ethers.getContractFactory("BridgeEth");
        contractBSC = await contractBSCFactory.deploy(sonerBSC.address);
        await contractBSC.deployed();

      
         await sonerERC.approve(owner.address,web3.utils.toWei('1000000'));
         await sonerBSC.approve(owner.address,web3.utils.toWei('1000000'));
         await sonerERC.approve(contractETH.address,web3.utils.toWei('1000000'));
         await sonerBSC.approve(contractBSC.address,web3.utils.toWei('1000000'));
        // await contractUni.approve(IndexFundContract.address,web3.utils.toWei('1000000'));
        // await contractPilot.approve(IndexFundContract.address,web3.utils.toWei('2000000'));
        // await contractPilot.approve(owner.address,web3.utils.toWei('2000000'));
        // console.log("all tokens approved")


      });

  

    it("Transfer ERC to BSC", async()=>{
            const from = owner.address;
            const to = owner.address;
            const nonce = 1;
            const amount = 80;
        //     const privKey = process.env.privateKey;
        //     console.log(privKey)


//             console.log(nonce, amount)

//         const msgStr = from+to+amount+nonce;
//        // console.log(msgStr)
//         const kack = keccak256(Buffer.from(msgStr));
//         const prefixStr =  "\x19Ethereum Signed Message:\n32";
//         const hash = keccak256(Buffer.from(prefixStr+kack));
//         console.log(hash)
//         // const sig = owner.signMessage(hash)
//         // console.log(sig , hash)


        
  const accounts = owner.address;

  const message = web3.utils.soliditySha3(
    {t: 'address', v: owner.address},
    {t: 'address', v: owner.address},
    {t: 'uint256', v: amount},
    {t: 'uint256', v: nonce},
  ).toString('hex');

  console.log(message)
  
//   const { signature } = //web3.eth.accounts.sign(
//     message, 
//     privKey
//   ); 

  console.log(signature);
  const { signature } = web3.eth.accounts.sign(message,);


})

})