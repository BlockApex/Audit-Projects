import { deployContract } from "./utils";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { task } from "hardhat/config";
// import predictAddress from "../scripts/predictAddress.js";

// import { TASK_ACCOUNTS } from "./task-names";

// task("deploy-Pilot", "deploy Pilot Contract").setAction( async(cliArgs, { ethers, run, network })=>{
//   await run("compile");

//   const signer = (await ethers.getSigners())[0];
//   console.log("Signer");

//   console.log("  at", signer.address);
//   console.log("  ETH", formatEther(await signer.getBalance()));

//   console.log("Network");
//   console.log("   ", network.name);

//   await deployContract("Pilot",await ethers.getContractFactory("Pilot"),signer,[

//   ])

// })

task("deploy-UnipilotFarm", "Deploy UnipilotFarm Contract").setAction(
  async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");

    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = [
      "0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F",
      "0xdB3C70be87586Cf814DAeC0E534813529a6Ea1d4",
      "1000000000000000000",
    ];

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotFarm = await deployContract(
      "UnipilotFarm",
      await ethers.getContractFactory("UnipilotFarm"),
      signer,
      [
        args[0], //Gov
        args[1], //Pilot
        args[2], //rewardPerBlock
      ],
    );

    await unipilotFarm.deployTransaction.wait(5);
    delay(60000);

    console.log("Verifying Smart Contract ...");

    await run("verify:verify", {
      address: unipilotFarm.address,
      constructorArguments: [
        args[0], //Gov
        args[1], //Pilot
        args[2], //rewardPerBlock
      ],
    });
  },
);

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
