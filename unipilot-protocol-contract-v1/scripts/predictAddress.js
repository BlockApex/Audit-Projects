const Web3 = require("web3");
const RLP = require("rlp");

const provider = "https://rinkeby.infura.io/v3/98d49364a6d6475e842e7a63341ca0bf";

const web3 = new Web3(provider);
(async () => {
  const sender = "0xa0e9E6B79a3e1AB87FeB209567eF3E0373210a89";
  const nonce = await web3.eth.getTransactionCount(sender);
  const address =
    "0x" +
    web3.utils
      .sha3(RLP.encode([sender, nonce + 1]))
      .slice(12)
      .substring(14);
  console.log(address);
  //   console.log(nonce);
})();
