const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3('https://ropsten.infura.io/v3/a547668bb2f943a8b6120ec123b08df9');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

const privKey = "";

const { address: admin } = web3Bsc.eth.accounts.wallet.add(privKey);
const { address: adminEth } = web3Eth.eth.accounts.wallet.add(privKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['3'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);

const express = require('express')
const cors = require('cors');
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.post('/ethbridge', async (req, res) => {
  const { from, to, amount, nonce, signature } = req.body;

  const tx = bridgeBsc.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);  
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gasPrice: gasPrice,
    gasLimit: gasCost,
  };

  //TODO: catch and refund if transaction fails
  try {
    const receipt = await web3Bsc.eth.sendTransaction(txData);
    console.log('Transfer Completed');

    res.send({
      status: "success",
      data: {
        txData,
        txHash: receipt.transactionHash
      }
    });
  } catch (error) {
    console.log('===err: ', error);
    res.send({
      status: "error"
    });
  }
})

app.post('/bscbridge', async (req, res) => {
  const { from, to, amount, nonce, signature } = req.body;
 
  const tx = bridgeEth.methods.mint(from, to, amount, nonce, signature);
  const [gasPrice, gasCost] = await Promise.all([
    web3Eth.eth.getGasPrice(),
    tx.estimateGas({from: adminEth}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: adminEth,
    to: bridgeEth.options.address,
    data,
    gas: gasCost,
    gasPrice
  };

  try {
    const receipt = await web3Eth.eth.sendTransaction(txData);
    console.log('Transfer Completed');

    res.send({
      status: "success",
      data: {
        txData,
        txHash: receipt.transactionHash
      }
    });
  } catch (error) {
    console.log('===err: ', error);
    res.send({
      status: "error"
    });
  }
})

app.listen(port, () => {
  console.log(`Bridge Server listening at http://localhost:${port}`)
})