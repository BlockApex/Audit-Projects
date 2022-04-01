// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

async function main(): Promise<void> {
  // Hardhat always runs the compile task when running scripts through it.
  // If this runs in a standalone fashion you may want to call compile manually
  // to make sure everything is compiled
  // await run("compile");

  // const DaoStakeContract: ContractFactory = await ethers.getContractFactory("DaoStakeContract");
  // const daoStakeContract: Contract = await DaoStakeContract.deploy("0xfe1b6ABc39E46cEc54d275efB4b29B33be176c2A");
  // await daoStakeContract.deployed();
  // console.log("daoStakeContract deployed Address:", daoStakeContract.address);

  const DaoSmartContract: ContractFactory = await ethers.getContractFactory("DaoSmartContract");
  const daoSmartContract: Contract = await DaoSmartContract.deploy();
  await daoSmartContract.deployed();
  await daoSmartContract.initialize("0xfe1b6ABc39E46cEc54d275efB4b29B33be176c2A","0x015CadF4ea1806582F7098e72af296795Bde1710")
  // await daoSmartContract.addOwner("0x015CadF4ea1806582F7098e72af296795Bde1710")
  // await daoSmartContract.setStakeContract("0xc5e8C777304177DEBc0cCb87d333AF17BF01A404")
  console.log("daoSmartContract deployed Address:", daoSmartContract.address);

  // const DaoSmartContract: ContractFactory = await ethers.getContractFactory("DaoSmartContract");
  // const daoSmartContract: Contract = await upgrades.deployProxy(
  //   DaoSmartContract,
  //   [
  //     "0xfe1b6ABc39E46cEc54d275efB4b29B33be176c2A",
  //     "0x51a73C48c8A9Ef78323ae8dc0bc1908A1C49b6c6",
  //     daoStakeContract.address,
  //   ],
  //   {
  //     initializer: "initialize",
  //   },
  // );
  // await daoSmartContract.deployed();
  // console.log("daoSmartContract-upgradeable deployed Address:", daoSmartContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
