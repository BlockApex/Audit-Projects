import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/accounts";
import "./tasks/clean";
import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
import "@nomiclabs/hardhat-etherscan";
dotenvConfig({ path: resolve(__dirname, "./.env") });
const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  bsctestnet: 97,
  mumbai: 80001,
};
// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}
let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}
function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  if (network == "bsctestnet") {
    const url: string = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    return {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url,
    };
  } else if (network == "mumbai") {
    const url: string = "https://rpc-mumbai.maticvigil.com";
    return {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url,
    };
  } else {
    const url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;
    return {
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url,
    };
  }
}
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
    bsctestnet: createTestnetConfig("bsctestnet"),
    mumbai: createTestnetConfig("mumbai"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "I7G1DAJN1QR2J8JDEAASRDNQD7FQBIF9DJ"
  },
  solidity: {
    version: "0.6.0",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};
export default config;
