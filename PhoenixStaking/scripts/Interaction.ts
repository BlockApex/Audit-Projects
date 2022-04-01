import { Contract, ContractFactory } from "ethers";
import DaoStakingArtifact from "../artifacts/contracts/DaoSmartContract.sol/DaoSmartContract.json";


import { ethers } from "hardhat";

async function main(): Promise<void> {

    const [signer] = await ethers.getSigners()
  const DaoStaking: ContractFactory = new ContractFactory(DaoStakingArtifact.abi, DaoStakingArtifact.bytecode,signer );

  const DaoStakingInstance = DaoStaking.attach("0xF4909924430e2c71276a552AFC6D5194912fAF12")
  // let val = await DaoStakingInstance.addOwner("0x015CadF4ea1806582F7098e72af296795Bde1710")
  // val = await val.wait()
  let val2 = await DaoStakingInstance.daoStakeContract()
  console.log(val2)


// let value = await DaoStakingInstance.getTotalrewardTokens();



}


main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
