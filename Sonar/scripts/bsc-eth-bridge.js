const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3('wss://eth.getblock.io/testnet/?api_key=f7993ddb-e3b4-485c-b6b2-ef29bb5360e0');
const web3Bsc = new Web3('https://bsc.getblock.io/testnet/?api_key=f7993ddb-e3b4-485c-b6b2-ef29bb5360e0');

const privKey = process.env.privateKey;

const { address: admin } = web3Eth.eth.accounts.wallet.add(privKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);


const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);

//BSC bridge
bridgeBsc.events.Transfer(
    {fromBlock: 0, step: 0}
  )
  .on('data', async event => {
   // console.log("I am here");
    const { from, to, amount, date, nonce, signature } = event.returnValues;
  
    const tx = bridgeEth.methods.mint(from, to, amount, nonce, signature);
    const [gasPrice, gasCost] = await Promise.all([
      web3Eth.eth.getGasPrice(),
      tx.estimateGas({from: admin}),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeEth.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Eth.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
      Processed transfer:
      - from ${from} 
      - to ${to} 
      - amount ${amount} tokens
      - date ${date}
      - nonce ${nonce}
    `);
  
  })
  
  