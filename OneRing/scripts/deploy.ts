// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import { IdleStrategyDAIMainnet, IdleStrategyDAIMainnet__factory, IStrategy, IStrategy__factory, OneRingVault, OneRingVault__factory, Storage, Storage__factory } from "../typechain";

async function main(): Promise<void> {
  const StorageC: Storage__factory = await ethers.getContractFactory("Storage");
  const storage: Storage = await StorageC.deploy();
  await storage.deployed();

  const OneRing: OneRingVault__factory = await ethers.getContractFactory("OneRingVault");
  const onering: OneRingVault = await OneRing.deploy();
  await onering.deployed();

  const IStrategy: IdleStrategyDAIMainnet__factory = await ethers.getContractFactory("IdleStrategyDAIMainnet");
  const istrategy: IdleStrategyDAIMainnet = await IStrategy.deploy(storage.address,onering.address);
  await istrategy.deployed();

  await onering.initializeVault(storage.address, "0x6b175474e89094c44da98b954eedeac495271d0f")
  console.log(storage.address, onering.address)
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
