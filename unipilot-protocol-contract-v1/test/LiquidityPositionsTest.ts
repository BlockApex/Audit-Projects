import { Contract, ContractFactory } from "@ethersproject/contracts";
import { MaxUint256 } from "@ethersproject/constants";
import { ethers } from "hardhat";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import ERC20Artifact from "@openzeppelin/contracts/build/contracts/ERC20.json";
import UniswapLiquidityManagerArtifact from "../artifacts/contracts/base/UniswapLiquidityManager.sol/UniswapLiquidityManager.json";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Bytes, formatUnits, parseUnits, AbiCoder } from "ethers/lib/utils";
import { BigNumberish } from "ethers";
import { parentPort } from "worker_threads";

const web3 = new Web3("https://eth-rinkeby.alchemyapi.io/v2/RsmAzmnpGeosUaH8DrX-O8RW7cUiFiTG");
const contract = new web3.eth.Contract(
  UniswapLiquidityManagerArtifact.abi as AbiItem[],
  "0xf6DADD823C7b5219785Ec2F8fe11c8FBCb99C6E6",
);

let wallet: SignerWithAddress;
let unipilotContractInstance: Contract;
let uniStrategyContractInstance: Contract;
let v3OracleContractInstance: Contract;
let liquidityManagerInstance: Contract;
let ulmStateInstance: Contract;


async function CheckLiquidityManager(): Promise<void>  {
    let UniswapLiquidityManager = await ethers.getContractAt(UniswapLiquidityManagerArtifact.abi , "0xf6DADD823C7b5219785Ec2F8fe11c8FBCb99C6E6");


}

async function main(): Promise<void> {

    await CheckLiquidityManager ();
}