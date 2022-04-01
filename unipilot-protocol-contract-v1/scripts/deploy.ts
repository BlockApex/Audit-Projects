import { Contract, ContractFactory } from "@ethersproject/contracts";
import { MaxUint256 } from "@ethersproject/constants";
// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import ERC20Artifact from "@openzeppelin/contracts/build/contracts/ERC20.json";
import UnipilotArtifact from "../artifacts/contracts/Unipilot.sol/Unipilot.json";
import UnipilotStrategyArtifact from "../artifacts/contracts/UniStrategy.sol/UniStrategy.json";
import UniswapLiquidityManagerArtifact from "../artifacts/contracts/base/UniswapLiquidityManager.sol/UniswapLiquidityManager.json";
import V3OracleStrategyArtifact from "../artifacts/contracts/V3Oracle.sol/V3Oracle.json";
import ULMStateArtifacts from "../artifacts/contracts/base/ULMState.sol/ULMState.json";
import LiquidityMigratorArtifacts from "../artifacts/contracts/LiquidityMigrator.sol/LiquidityMigrator.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Bytes, formatUnits, parseUnits, AbiCoder } from "ethers/lib/utils";
import { BigNumberish } from "ethers";
import { parentPort } from "worker_threads";

const DAI_TOKEN_ADDRESS = "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735";
const USDT_TOKEN_ADDRESS = "0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02";
const USDC_TOKEN_ADDRESS = "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b";
const WETH_TOKEN_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
const UNI_TOKEN_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const PILOT_TOKEN_ADDRESS = "0xb993eF69AD143B9DAdc417374d9Be7c4e6E3acBE";
const PILOT_COMP_NEW = "0x8526828f5ADd87cFE77D8053Cc95d1Fc9f7bA79B";
const PILOT2_TOKEN_ADDRESS = "0xb993eF69AD143B9DAdc417374d9Be7c4e6E3acBE";
const ANS2_TOKEN_ADDRESS = "0xF08fF5D10C650E6796d29D24ac7FBD766e3Bb505";
const TKN1_TOKEN_ADDRESS = "0x6df730f6e52c57be77db98a65116d2c38ec2be2b"; // DST
const TKN2_TOKEN_ADDRESS = "0xdf98809bbaee8d72ba88a80bc99308e30e04e4ab";
const LMO = "0xBCddF4E2aFb846486a253C920442aBC69Ac98f9b";
const MKR = "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85";
const ethDaiSushiswap = "0xD08fEEaFD3559658Da770B8377D6b40016E0b773";
const ethDaiUniswap = "0x8B22F85d0c844Cf793690F6D9DFE9F11Ddb35449";

const TTC33 = "0xB6118140b5Ad8A1449D1FeF850dA49eE4677D77A";
const TTC99 = "0xEc025986c17b4476dB7D3F3A6065f757C56f9CAe";

const pool = "0x2c028E572c5e8708aA6264a0E87396e36E477DD0"; // TTCC99 & TKN5
const daiEThPAir = "0x0f04024bdA15F6e5D48Ed92938654a6449F483ed";
const daiEthPair1 = "0xAD24b6AC28bF47A04a72952945E2Ff486C0D6C7A"; // 10000
const uniEThPAir = "0x7b2A5f8956fF62b26aC87F22165F75185e2aD639";
const uniDaiPAir = "0x536b5cD0E89B9088d89a91Dd0297E1308aA65BDA";

const web3 = new Web3("https://rinkeby.infura.io/v3/98d49364a6d6475e842e7a63341ca0bf");
const contract = new web3.eth.Contract(
  UniswapLiquidityManagerArtifact.abi as AbiItem[],
  "0xac1876627e5dcd833887b11b053aa03dbe96c80d",
);

const contractUnipilot = new web3.eth.Contract(
  UnipilotArtifact.abi as AbiItem[],
  "0xEed6501178521845d28EE0d1a9E214f6cD7979A1",
);

let wallet: SignerWithAddress;
let unipilotContractInstance: Contract;
let uniStrategyContractInstance: Contract;
let v3OracleContractInstance: Contract;
let liquidityManagerInstance: Contract;
let liquidityMigratorInstance: Contract;
let ulmStateInstance: Contract;
async function updateStateVariables(): Promise<void> {
  const [_wallet] = await ethers.getSigners();
  wallet = _wallet;
}

async function initializeLiquidityManagerFromAddress(
  liquidityManagerAddress: string,
): Promise<void> {
  const uniswapLiquidityManagerContract = new ContractFactory(
    UniswapLiquidityManagerArtifact.abi,
    UniswapLiquidityManagerArtifact.bytecode,
    wallet,
  );
  liquidityManagerInstance = uniswapLiquidityManagerContract.attach(
    liquidityManagerAddress,
  );
}

async function initializeUnipilotFromAddress(unipilotAddress: string): Promise<void> {
  const unipilotContract = new ContractFactory(
    UnipilotArtifact.abi,
    UnipilotArtifact.bytecode,
    wallet,
  );
  unipilotContractInstance = unipilotContract.attach(unipilotAddress);
}

async function initializeLiquidityMigratorFromAddress(
  liquidityMigratorAddress: string,
): Promise<void> {
  const uniswapLiquidityMigratorContract = new ContractFactory(
    LiquidityMigratorArtifacts.abi,
    LiquidityMigratorArtifacts.bytecode,
    wallet,
  );
  liquidityMigratorInstance = uniswapLiquidityMigratorContract.attach(
    liquidityMigratorAddress,
  );
}

async function initializeUnipilotStrategyFromAddress(
  unipilotAddress: string,
): Promise<void> {
  const uniStrategyContract = new ContractFactory(
    UnipilotStrategyArtifact.abi,
    UnipilotStrategyArtifact.bytecode,
    wallet,
  );
  uniStrategyContractInstance = uniStrategyContract.attach(unipilotAddress);
}

async function initializeV3OracleFromAddress(unipilotAddress: string): Promise<void> {
  const v3OracleContract = new ContractFactory(
    V3OracleStrategyArtifact.abi,
    V3OracleStrategyArtifact.bytecode,
    wallet,
  );
  v3OracleContractInstance = v3OracleContract.attach(unipilotAddress);
}

async function initializeULMStateFromAddress(ulmAddress: string): Promise<void> {
  const instance = new ContractFactory(
    ULMStateArtifacts.abi,
    ULMStateArtifacts.bytecode,
    wallet,
  );
  ulmStateInstance = instance.attach(ulmAddress);
}

async function deployUnipilot(liquidityManagerAddres: string): Promise<void> {
  const [wallet, wallet1] = await ethers.getSigners();
  const Unipilot: ContractFactory = await ethers.getContractFactory("Unipilot");
  const unipilot: Contract = await Unipilot.deploy(liquidityManagerAddres);
  await unipilot.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("Wallet Address -> ", wallet1.address);
  console.log("Unipilot deployed to -> ", unipilot.address);
  unipilotContractInstance = unipilot;
}

async function deployUniStrategy(): Promise<void> {
  const [wallet] = await ethers.getSigners();
  const UniStrategy: ContractFactory = await ethers.getContractFactory("UniStrategy");
  const uniStrategy: Contract = await UniStrategy.deploy();
  await uniStrategy.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("UniStrategy deployed to -> ", uniStrategy.address);
  uniStrategyContractInstance = uniStrategy;
}

async function deployULMState(): Promise<void> {
  const [wallet] = await ethers.getSigners();
  const ULMState: ContractFactory = await ethers.getContractFactory("ULMState");
  const ulmState: Contract = await ULMState.deploy();
  await ulmState.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("UniStrategy deployed to -> ", ulmState.address);
  ulmStateInstance = ulmState;
}

async function deployLiquidityManager(
  oracle: string,
  ulmState: string,
  indexFund: string,
  uniStrategy: string,
  unipilotAddress: string,
): Promise<void> {
  const [wallet] = await ethers.getSigners();
  const LiquidityManager: ContractFactory = await ethers.getContractFactory(
    "UniswapLiquidityManager",
  );
  const liquidityManager: Contract = await LiquidityManager.deploy(
    oracle,
    ulmState,
    indexFund,
    uniStrategy,
    unipilotAddress,
  );
  await liquidityManager.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("LiquidityManager deployed to -> ", liquidityManager.address);
  liquidityManagerInstance = liquidityManager;
}

async function deployLiquidityMigrator(): Promise<void> {
  const [wallet] = await ethers.getSigners();
  const LiquidityMigrator: ContractFactory = await ethers.getContractFactory(
    "LiquidityMigrator",
  );
  const liquidityMigrator: Contract = await LiquidityMigrator.deploy();
  await liquidityMigrator.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("LiquidityManager deployed to -> ", liquidityMigrator.address);
  liquidityMigratorInstance = liquidityMigrator;
}

async function deployV3Oracle(ulmState: string): Promise<void> {
  const [wallet] = await ethers.getSigners();
  const V3Oracle: ContractFactory = await ethers.getContractFactory("V3Oracle");
  const v3Oracle: Contract = await V3Oracle.deploy(ulmState);
  await v3Oracle.deployed();

  console.log("Wallet Address -> ", wallet.address);
  console.log("V3Oracle deployed to -> ", v3Oracle.address);
  v3OracleContractInstance = v3Oracle;
}

async function getERC20Approval(
  tokenAddress: string,
  spenderAddress: string,
): Promise<void> {
  const tokenContract = new ContractFactory(
    ERC20Artifact.abi,
    ERC20Artifact.bytecode,
    wallet,
  );

  const tokenContractInstance = tokenContract.attach(tokenAddress);

  const approval = await tokenContractInstance.approve(spenderAddress, MaxUint256, {
    gasLimit: "10000000",
    gasPrice: "1500226581",
  });
  console.log("getERC20Approval -> ", approval.hash);
}

async function balanceOf(tokenAddress: string): Promise<void> {
  const tokenContract = new ContractFactory(
    ERC20Artifact.abi,
    ERC20Artifact.bytecode,
    wallet,
  );

  const tokenContractInstance = tokenContract.attach(tokenAddress);

  const balance = await tokenContractInstance.balanceOf(tokenAddress);
  console.log("Token balance -> ", balance.toString());
}

// async function deposit(
//   token0: string,
//   token1: string,
//   fee: BigNumberish,
//   amount0Desired: BigNumberish,
//   amount1Desired: BigNumberish,
//   tokenId: BigNumberish = "0",
//   // data: string
//   // value: BigNumberish = "100000000000000000",
// ): Promise<void> {
//   const [_token0, _token1, _amount0Desired, _amount1Desired] =
//     token0.toLowerCase() < token1.toLowerCase()
//       ? [token0, token1, amount0Desired, amount1Desired]
//       : [token1, token0, amount1Desired, amount0Desired];

//   const _deposit = await unipilotContractInstance.deposit(
//     [_token0, _token1, fee, _amount0Desired, _amount1Desired, tokenId],
//     // data,
//     {
//       gasLimit: "10000000",
//       // value: ethers.utils.parseEther("0.1"),
//     },
//   );
//   console.log("deposit -> ", _deposit.hash);
// }

async function deposit(
  sender: string,
  token0: string,
  token1: string,
  fee: BigNumberish,
  amount0Desired: BigNumberish,
  amount1Desired: BigNumberish,
  tokenId: BigNumberish = "0",
  // data: string
  // value: BigNumberish = "100000000000000000",
): Promise<void> {
  const abiCoder = new AbiCoder();
  const data = abiCoder.encode(["uint24", "uint256"], [fee, tokenId]);
  const LiquidityManagerAddress = "0xac1876627e5dcd833887b11b053aa03dbe96c80d";
  const [_token0, _token1, _amount0Desired, _amount1Desired] =
    token0.toLowerCase() < token1.toLowerCase()
      ? [token0, token1, amount0Desired, amount1Desired]
      : [token1, token0, amount1Desired, amount0Desired];

  const _deposit = await unipilotContractInstance.deposit(
    [sender, LiquidityManagerAddress, _token0, _token1, _amount0Desired, _amount1Desired],
    data,
    {
      gasLimit: "10000000",
      gasPrice: "1500226581",
      // value: ethers.utils.parseEther("0.1"),
    },
  );
  console.log("deposit -> ", _deposit.hash);
}

async function createPoolAndDeposit(
  sender: string,
  token0: string,
  token1: string,
  fee: BigNumberish,
  amount0: BigNumberish,
  amount1: BigNumberish,
  tokenId: BigNumberish,
  sqrtPrice: BigNumberish,
): Promise<void> {
  const abiCoder = new AbiCoder();
  const data0 = abiCoder.encode(["uint24", "uint160"], [fee, sqrtPrice]);
  const data1 = abiCoder.encode(["uint24", "uint256"], [fee, tokenId]);
  const LiquidityManagerAddress = "0xac1876627e5dcd833887b11b053aa03dbe96c80d";
  const result = await unipilotContractInstance.createPoolAndDeposit(
    [sender, LiquidityManagerAddress, token0, token1, amount0, amount1],
    [data0, data1],
    {
      gasLimit: "26940870",
      // value: ethers.utils.parseEther("0.1"),
    },
  );
  console.log("PoolHash -> ", result.hash);
}

async function migrateV3(
  token0: string,
  token1: string,
  fee: BigNumberish,
  percentageToMigrate: BigNumberish,
  uniswapTokenId: BigNumberish,
  unipilotTtokenId: BigNumberish = "0",
  refundAsETH: boolean,
): Promise<void> {
  const abiCoder = new AbiCoder();
  const data = abiCoder.encode(["uint24", "uint256"], [fee, unipilotTtokenId]);
  const LiquidityManagerAddress = "0xac1876627e5dcd833887b11b053aa03dbe96c80d";
  const UnipilotAddress = "0xEed6501178521845d28EE0d1a9E214f6cD7979A1";
  const [_token0, _token1] =
    token0.toLowerCase() < token1.toLowerCase() ? [token0, token1] : [token1, token0];

  const _migrate = await liquidityMigratorInstance.migrateV3Liquidity(
    [
      LiquidityManagerAddress,
      UnipilotAddress,
      _token0,
      _token1,
      fee,
      percentageToMigrate,
      uniswapTokenId,
      unipilotTtokenId,
      refundAsETH,
    ],
    {
      gasLimit: "10000000",
      gasPrice: "1500226581",
      // value: ethers.utils.parseEther("0.1"),
    },
  );
  console.log("migrateV3 -> ", _migrate.hash);
}

async function migrateV2(
  pair: string,
  token0: string,
  token1: string,
  fee: BigNumberish,
  percentageToMigrate: BigNumberish,
  liquidityToMigrate: BigNumberish,
  sqrtPriceX96: BigNumberish,
  unipilotTokenId: BigNumberish,
  refundAsETH: boolean,
): Promise<void> {
  const LiquidityManagerAddress = "0xac1876627e5dcd833887b11b053aa03dbe96c80d";
  const UnipilotAddress = "0xEed6501178521845d28EE0d1a9E214f6cD7979A1";
  const [_token0, _token1] =
    token0.toLowerCase() < token1.toLowerCase() ? [token0, token1] : [token1, token0];

  const _migrate = await liquidityMigratorInstance.migrateV2Liquidity(
    [
      pair,
      LiquidityManagerAddress,
      UnipilotAddress,
      _token0,
      _token1,
      fee,
      percentageToMigrate,
      liquidityToMigrate,
      sqrtPriceX96,
      unipilotTokenId,
      refundAsETH,
    ],
    {
      gasLimit: "10000000",
      gasPrice: "1500226581",
      // value: ethers.utils.parseEther("0.1"),
    },
  );
  console.log("migrateV3 -> ", _migrate.hash);
}

// async function collect(
//   pilotToken: boolean,
//   wethToken: boolean,
//   recipient: string,
//   exchangeAddress: string,
//   tokenId: BigNumberish,
//   data: string,
// ): Promise<void> {
//   const _collect = await unipilotContractInstance.collect(
//     pilotToken,
//     recipient,
//     tokenId,
//     exchangeAddress,
//     data,
//     {
//       gasLimit: "10000000",
//     },
//   );
//   console.log("collect -> ", _collect.hash);
// }

async function collect(
  pilotToken: boolean,
  wethToken: boolean,
  exchangeAddress: string,
  recipient: string,
  tokenId: BigNumberish,
): Promise<void> {
  const data = new AbiCoder().encode(["address"], [recipient]);
  const _collect = await unipilotContractInstance.collect(
    [pilotToken, wethToken, exchangeAddress, tokenId],
    data,
    {
      gasLimit: "10000000",
    },
  );
  console.log("collect -> ", _collect.hash);
}

// async function withdraw(
//   pilotToken: boolean,
//   wethToken: boolean,
//   exchangeAddress: string,
//   recipient: string,
//   tokenId: BigNumberish,
//   liquidity: BigNumberish,
//   data: string,
// ): Promise<void> {
//   const _collect = await unipilotContractInstance.withdraw(
//     pilotToken,
//     wethToken,
//     exchangeAddress,
//     recipient,
//     tokenId,
//     liquidity,
//     data,
//     {
//       gasLimit: "10000000",
//     },
//   );
//   console.log("withdraw -> ", _collect.hash);
// }

async function withdraw(
  pilotToken: boolean,
  wethToken: boolean,
  exchangeAddress: string,
  recipient: string,
  tokenId: BigNumberish,
  liquidity: BigNumberish,
): Promise<void> {
  const abiCoder = new AbiCoder();
  const data = abiCoder.encode(["address"], [recipient]);
  const _collect = await unipilotContractInstance.withdraw(
    [pilotToken, wethToken, exchangeAddress, liquidity, tokenId],
    data,
    {
      gasLimit: "10000000",
    },
  );
  console.log("withdraw -> ", _collect.hash);
}

async function wethPairsAndLiquidity(token: string): Promise<void> {
  // const result = await unipilotContractInstance.getTotalAmounts(pool);
  const resul1 = await v3OracleContractInstance.checkWethPairsAndLiquidity(token);
  console.log("Best WETH Pair -> ", resul1.toString());
}

async function checkPoolValidation(
  token0: string,
  token1: string,
  amount0: BigNumberish,
  amount1: BigNumberish,
): Promise<void> {
  const _collect = await liquidityManagerInstance.checkPoolValidation(
    token0,
    token1,
    amount0,
    amount1,
  );
  console.log("Pool Validation -> ", _collect.toString());
}

async function rebase(token0: string, token1: string, fee: BigNumberish): Promise<void> {
  const result = await liquidityManagerInstance.readjustLiquidity(token0, token1, fee, {
    gasLimit: "10000000",
  });
  console.log("Rebase Hash -> ", result.hash);
}

async function createPool(
  token0: string,
  token1: string,
  fee: BigNumberish,
): Promise<void> {
  const result = await unipilotContractInstance._createPair(token0, token1, fee, {
    gasLimit: "10000000",
  });
  console.log("PoolHash -> ", result.hash);
}

async function collectFees(
  pilotToken: boolean,
  recipient: string,
  nftId: BigNumberish,
): Promise<void> {
  const result = await unipilotContractInstance.collect(pilotToken, recipient, nftId, {
    gasLimit: "10000000",
  });
  console.log("TxHash -> ", result.hash);
}

async function setCoreAddresses(
  oracle: string,
  ulmState: string,
  indexFund: string,
  uniStrategy: string,
): Promise<void> {
  const result = await liquidityManagerInstance.updateCoreAddresses(
    oracle,
    ulmState,
    indexFund,
    uniStrategy,
    {
      gasLimit: "10000000",
    },
  );
  console.log("TxHash -> ", result.hash);
}

async function getPair(token0: string, token1: string, fee: BigNumberish): Promise<void> {
  const pair = await ulmStateInstance.getPoolAddress(token0, token1, fee);
  console.log("Pair Address -> ", pair.toString());
}

async function getShares(
  reserve0: BigNumberish,
  reserve1: BigNumberish,
  totalLiquidity: BigNumberish,
  amount0Desired: BigNumberish,
  amount1Desired: BigNumberish,
): Promise<void> {
  const shares = await unipilotContractInstance.getSharesAndAmounts(
    reserve0,
    reserve1,
    totalLiquidity,
    amount0Desired,
    amount1Desired,
  );
  console.log("Shares -> ", shares.toString());
}

async function getPoolDetails(pool: string): Promise<void> {
  const pair = await ulmStateInstance.getPoolDetails(pool);
  console.log("Pair Address -> ", pair.toString());
}

async function getTotalAmounts(pool: string, nftId: BigNumberish): Promise<string> {
  // const result = await unipilotContractInstance.getTotalAmounts(pool);
  const resul1 = await liquidityManagerInstance.liquidityPositions(pool);
  const resul12 = await liquidityManagerInstance.positions(nftId);
  console.log("Pool details -> ", resul1.toString());
  console.log("Pool details2 -> ", resul12.toString());
  return "resul1[resul1.length -1].toString()";
}

async function getTokenAmounts(pool: string): Promise<void> {
  // const result = await unipilotContractInstance.getTotalAmounts(pool);
  const resul1 = await liquidityManagerInstance.getTotalAmounts(pool);
  console.log("Token Amounts -> ", resul1.toString());
}

async function getPilotAmount(
  tokenAlt: string,
  altAmount: BigNumberish,
  wethAmount: BigNumberish,
): Promise<void> {
  // const result = await unipilotContractInstance.getTotalAmounts(pool);
  const resul1 = await v3OracleContractInstance.getPilotAmountWethPair(
    tokenAlt,
    altAmount,
    wethAmount,
  );
  console.log("Pilot Amounts -> ", resul1.toString());
}

async function getFees(pool: string): Promise<void> {
  const result = await contract.methods.updatePositionTotalAmounts(pool).call();
  console.log("Fees Amount -> ", result);
}

async function getUserFees(tokenId: BigNumberish): Promise<void> {
  const result = await contract.methods.getUserFees(tokenId).call();
  console.log("User Fees Amount -> ", result);
}

async function getLiquidityRatio(
  pool: string,
  lowerTick: BigNumberish,
  upperTick: BigNumberish,
): Promise<void> {
  const result = await ulmStateInstance.getLiquidityRatios(pool, lowerTick, upperTick);
  console.log("User Fees Amount -> ", result.toString());
}

async function setUnipilot(address: string): Promise<void> {
  const result = await unipilotContractInstance.setUnipilot(address, {
    gasLimit: "10000000",
    value: ethers.utils.parseEther("0.1"),
  });
  console.log("TxHash -> ", result.hash);
}

async function shouldReadjust(pair: string, managerAddress: string): Promise<void> {
  const resul1 = await ulmStateInstance.shouldReadjust(pair, managerAddress);
  console.log("Should Rebase -> ", resul1.toString());
}

async function main(): Promise<void> {
  await updateStateVariables();
  // await deployULMState();
  // await deployUnipilot("0xac1876627e5dcd833887b11b053aa03dbe96c80d");
  // await deployLiquidityManager(
  //   "0x2435089F41282875f104edA1Aa4F366a50b35457",
  //   "0x93f4e5466417FcB20952e5B254028DC3258f20b8",
  //   "0xBb9997d7D49fB3827b061D5C391f9817eC8f7097",
  //   "0xF6029ECA17db8eB6d9DD34C5a79c9a984b634fc6",
  //   "0xEed6501178521845d28EE0d1a9E214f6cD7979A1"
  // );
  // await deployV3Oracle("0x93f4e5466417FcB20952e5B254028DC3258f20b8");
  // await deployUniStrategy();
  // await deployLiquidityMigrator();
  await initializeUnipilotFromAddress("0xEed6501178521845d28EE0d1a9E214f6cD7979A1");
  await initializeLiquidityManagerFromAddress(
    "0xac1876627e5dcd833887b11b053aa03dbe96c80d",
  );
  // await initializeUnipilotStrategyFromAddress("0xF6029ECA17db8eB6d9DD34C5a79c9a984b634fc6"); // newAddress: 0x24607fdC0d480797DD37c8C8Fb60ebEfF32f5679, oldWorking: 0x3CaeBd0718Fbc3397ED047f1660A6E0A977a954E
  // await initializeV3OracleFromAddress("0x2435089F41282875f104edA1Aa4F366a50b35457");
  // await initializeULMStateFromAddress("0x93f4e5466417FcB20952e5B254028DC3258f20b8");
  await initializeLiquidityMigratorFromAddress(
    "0x476848Afba4e4fB7B6A05C985fDc47aAeb99D3BD",
  );

  // await getERC20Approval(PILOT_COMP_NEW, unipilotContractInstance.address);
  // await getERC20Approval(LMO, unipilotContractInstance.address);
  // await setTTT("0xEed6501178521845d28EE0d1a9E214f6cD7979A1");
  // await setCoreAddresses(
  //   "0x2435089F41282875f104edA1Aa4F366a50b35457",
  //   "0x93f4e5466417FcB20952e5B254028DC3258f20b8",
  //   "0xBb9997d7D49fB3827b061D5C391f9817eC8f7097",
  //   "0xF6029ECA17db8eB6d9DD34C5a79c9a984b634fc6",
  // );
  // await setLiquidityManager("0xac1876627e5dcd833887b11b053aa03dbe96c80d");
  // await getERC20Approval(WETH_TOKEN_ADDRESS, unipilotContractInstance.address);
  // await getERC20Approval(UNI_TOKEN_ADDRESS, unipilotContractInstance.address);
  // await balanceOf("0x0000000000000000000000000000000000000000");
  // await test(TKN1_TOKEN_ADDRESS, TKN2_TOKEN_ADDRESS, 3000, parseUnits("1", 18), parseUnits("0.1", 18));
  // await test(DAI_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS, 3000, parseUnits("10", 18),s parseUnits("0.1", 18));
  // await deposit(wallet.address, TKN2_TOKEN_ADDRESS, TTC99, 3000, parseUnits("10", 18), parseUnits("10", 18), 0);
  // await refundETH();
  // await deposit(wallet.address,WETH_TOKEN_ADDRESS, UNI_TOKEN_ADDRESS, 3000, parseUnits("2", 18), parseUnits("2", 18), 0);
  // await rebase(TTC99, TKN2_TOKEN_ADDRESS, 3000);
  // await createPoolAndDeposit(wallet.address, TKN2_TOKEN_ADDRESS, TTC99, 500, parseUnits("10", 18), parseUnits("10", 18), 0, "79228162514264337593543950336");
  // await migrateV3(DAI_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS, 3000, 100, 7295, 0, true);
  await migrateV2(
    "0x3F17B6351F1e0bAC1baC40f24E1A52E65A653e3F",
    TKN2_TOKEN_ADDRESS,
    TTC99,
    3000,
    100,
    "246305418719211822659",
    "79228162514264337593543950336",
    0,
    true,
  );
  // await getPool(pool);
  // await wethPairsAndLiquidity(TTC99);
  // await stablePairsAndLiquidity(LMO);
  // await shouldReadjust("0xbc80FF998a5465F96e81166bA57aa7930f342812", "0xac1876627e5dcd833887b11b053aa03dbe96c80d");
  // await checkPoolValidation(TKN2_TOKEN_ADDRESS, LMO, parseUnits("0", 18), parseUnits("0.009", 18));
  // await getPoolLiquidity(TTC33, LMO, parseUnits("1", 18), parseUnits("1", 18));
  // await getUSDAmount(uniDaiPAir, parseUnits("1", 18));
  // await getWETHAmount(uniEThPAir, parseUnits("1", 18));
  // await setLiquidityManager("0xdB50F46CCCA8Ba1Dce3a4af9EC92a46c798404A1");
  // await getPoolDetails("0x7ffa8d777c60f8c2b0d602307b6c5c8b21ee8b52");
  // await getPoolDetails("0xc34f3d0f0534e27079c5cb4fb2ba02709fb0b81b");
  // await getTotalAmounts("0x2b8908af5268f4cfbfeab65eb2415f97150f34d8", 3);
  // await getPair("0x7E7b5f8F8DF342e5d31BE5397C8222282bF7B3e1", "0xaB311d1A59F4e753406C4895e4681Fbd15D4dCbC", 3000);
  // await getTicks();
  // await getFees(pool);
  // await getTotalAmounts(pool, 2);
  // await getTotalAmounts(pool, 22);
  // await getPoolDetails("0x92c4d042fc4d87ee70095f0985f1d3076fdbdad2");
  // await getLiquidityRatio(daiEThPAir, -887220, 887220);
  // await getShares("92725641", 0, "46736247036622575185", "43036157846441782345206", parseUnits("0", 18));
  // await getShares(parseUnits("20", 18), parseUnits("20", 18), 4472135954, parseUnits("20", 18), parseUnits("20", 18));
  // await getShares(parseUnits("0", 18), parseUnits("20", 18), 4472135954, parseUnits("20", 18), parseUnits("20", 18));
  // await getShares(parseUnits("20", 18), parseUnits("0", 18), 4472135954, parseUnits("20", 18), parseUnits("20", 18));
  // await getUserFees(15);
  // await getPilotAmount("0x023eca468e70818a3a94d4cdffd6e5d1a3707812", 0, "299999999");
  // await getOraclePrices(TKN2_TOKEN_ADDRESS, 3000, parseUnits("1", 18));
  // await getPrices(TTC33, DAI_TOKEN_ADDRESS, 3000, parseUnits("1", 18));
  // await createPoolAndDeposit("0xac1876627e5dcd833887b11b053aa03dbe96c80d", TTC99, DAI_TOKEN_ADDRESS, 500, parseUnits("10", 18), parseUnits("0.1", 18), 0, "79228162514264337593543950336");
  // await getTokenAmounts(daiEThPAir);
  // await withdraw(true, false, "0xac1876627e5dcd833887b11b053aa03dbe96c80d", wallet.address, 1, "4472135954");
  // await withdraw(true, false, "0xac1876627e5dcd833887b11b053aa03dbe96c80d", wallet.address, 2, "4472135954");
  // await withdraw(true, false, "0xac1876627e5dcd833887b11b053aa03dbe96c80d", wallet.address, 3, "4472135954");
  // await withdraw(true, wallet.address, 1, "10000000000000000000");
  // await unwrapWETH("9999999999999998", wallet.address); // for multicall
  // await sweepTokens(DAI_TOKEN_ADDRESS, 0, wallet.address); // for multicall
  // await withdrawForETH(false, false, wallet.address, wallet.address, 2, "10000000000000000000", "0x0000000000000000000000000000000000000000");
  // await collectFeesForWETHPairs(true, false, wallet.address, wallet.address, 2,"0x0000000000000000000000000000000000000000");
  // await collect(true, false, "0xac1876627e5dcd833887b11b053aa03dbe96c80d", wallet.address, 1);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

// TKN5 tokenIn > increase fees0
// TTCC99 tokenIn > increase fees1
