import { deployContract } from "./utils";
import { constants, Wallet } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { task } from "hardhat/config";
import { Bytes, formatUnits, parseUnits, AbiCoder } from "ethers/lib/utils";
import { FeeAmount, encodePriceSqrt } from "./shared/utilities";

task("deploy-unipilot", "Deploy all unipilot contracts")
  .addParam("pool", "UniswapV3 Pool")
  .addParam("governance", "governer address")
  .addParam("name", "Unipilot LP Token name")
  .addParam("symbol", "Unipilot LP Token symbol")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      pool: cliArgs.pool,
      router: "0x0000000000000000000000000000000000000000",
      strategy: "0x3DB63a880FFaED0aBfA40496366fcc383256ecCA",
      governance: cliArgs.governance,
      unipilotFactory: "0xcFe7AB2AfB8602A08fE6d05095e1ecf3cAf3D924",
      name: cliArgs.name,
      symbol: cliArgs.symbol,
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotVault = await deployContract(
      "UnipilotVault",
      await ethers.getContractFactory("UnipilotVault"),
      signer,
      [
        args.pool,
        args.router,
        args.strategy,
        args.governance,
        args.unipilotFactory,
        args.name,
        args.symbol,
      ],
    );

    await unipilotVault.deployTransaction.wait(5);

    delay(60000);

    await run("verify:verify", {
      address: unipilotVault.address,
      constructorArguments: [
        args.pool,
        args.router,
        args.strategy,
        args.governance,
        args.unipilotFactory,
        args.name,
        args.symbol,
      ],
    });
  });

task("deploy-unipilotFactory-active", "Deploy unipilot active factory contract")
  .addParam("governance", "governer address")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      uniswapFactory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
      governance: cliArgs.governance,
      uniStrategy: "0x4b6d4d97398aDfE3897E871a94ca8eaf439FeA08",
      indexFund: cliArgs.governance,
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      indexFundPercentage: 10,
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotFactory = await deployContract(
      "UnipilotActiveFactory",
      await ethers.getContractFactory("UnipilotActiveFactory"),
      signer,
      [
        args.uniswapFactory,
        args.governance,
        args.uniStrategy,
        args.indexFund,
        args.WETH,
        args.indexFundPercentage,
      ],
    );

    await unipilotFactory.deployTransaction.wait(5);

    delay(60000);

    await run("verify:verify", {
      address: unipilotFactory.address,
      constructorArguments: Object.values(args),
    });
  });

task(
  "deploy-unipilotFactory-passive",
  "Deploy unipilot passive factory contract",
)
  .addParam("governance", "governer address")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      uniswapFactory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
      governance: cliArgs.governance,
      uniStrategy: "0x4b6d4d97398aDfE3897E871a94ca8eaf439FeA08",
      indexFund: cliArgs.governance,
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      indexFundPercentage: 10,
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotFactory = await deployContract(
      "UnipilotPassiveFactory",
      await ethers.getContractFactory("UnipilotPassiveFactory"),
      signer,
      [
        args.uniswapFactory,
        args.governance,
        args.uniStrategy,
        args.indexFund,
        args.WETH,
        args.indexFundPercentage,
      ],
    );

    await unipilotFactory.deployTransaction.wait(5);

    delay(60000);

    await run("verify:verify", {
      address: unipilotFactory.address,
      constructorArguments: Object.values(args),
    });
  });

task("deploy-vault", "Deploy unipilot vault via the factory")
  .addParam("factory", "the unipilot factory address")
  .addParam("token0", "token0 of pair")
  .addParam("token1", "token1 of pair")
  .addParam("fee", "LOW, MEDIUM, or HIGH")
  .addParam("name", "erc20 name")
  .addParam("symbol", "erc2 symbol")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      factory: cliArgs.factory,
      token0: cliArgs.token0,
      token1: cliArgs.token1,
      fee: FeeAmount[cliArgs.fee],
      sqrtPriceX96: encodePriceSqrt(1, 1),
      name: cliArgs.name,
      symbol: cliArgs.symbol,
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotFactory = await ethers.getContractAt(
      "UnipilotFactory",
      args.factory,
      signer,
    );

    const unipilotVault = await unipilotFactory.createVault(
      args.token0,
      args.token1,
      args.fee,
      args.sqrtPriceX96,
      args.name,
      args.symbol,
    );

    console.log("UnipilotVaultInstance", unipilotVault);
    console.log("Unipilot Vault -> ", unipilotVault.address);
  });

task("verify-active-vault", "Verify unipilot vault contract")
  .addParam("pool", "the uniswap pool address")
  .addParam("factory", "the unipilot factory address")
  .addParam("vault", "the hypervisor to verify")
  .addParam("name", "erc20 name")
  .addParam("symbol", "erc2 symbol")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    console.log("Network");
    console.log("  ", network.name);

    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      pool: cliArgs.pool,
      factory: cliArgs.factory,
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      name: cliArgs.name,
      symbol: cliArgs.symbol,
    };

    console.log("Task Args");
    console.log(args);

    const unipilotVault = await ethers.getContractAt(
      "UnipilotActiveVault",
      cliArgs.vault,
      signer,
    );

    await run("verify:verify", {
      address: unipilotVault.address,
      constructorArguments: Object.values(args),
    });
  });

task("verify-passive-vault", "Verify unipilot vault contract")
  .addParam("pool", "the uniswap pool address")
  .addParam("factory", "the unipilot factory address")
  .addParam("vault", "the hypervisor to verify")
  .addParam("name", "erc20 name")
  .addParam("symbol", "erc2 symbol")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    console.log("Network");
    console.log("  ", network.name);

    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      pool: cliArgs.pool,
      factory: cliArgs.factory,
      WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      name: cliArgs.name,
      symbol: cliArgs.symbol,
    };

    console.log("Task Args");
    console.log(args);

    const unipilotVault = await ethers.getContractAt(
      "UnipilotPassiveVault",
      cliArgs.vault,
      signer,
    );

    await run("verify:verify", {
      address: unipilotVault.address,
      constructorArguments: Object.values(args),
    });
  });

task("deploy-strategy", "Deploy unipilot strategy contract")
  .addParam("governance", "governer address")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");

    const signer = (await ethers.getSigners())[0];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    const args = {
      governance: cliArgs.governance,
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotStrategy = await deployContract(
      "UnipilotStrategy",
      await ethers.getContractFactory("UnipilotStrategy"),
      signer,
      [args.governance],
    );

    await unipilotStrategy.deployTransaction.wait(5);

    delay(60000);

    await run("verify:verify", {
      address: unipilotStrategy.address,
      constructorArguments: [args.governance],
    });
  });

task("deploy-migrator", "Deploy Unipilot Migrator contract")
  // .addParam("position-manager", "address of position manager")
  // .addParam("uniswapfactory", "address of uniswap factory")
  // .addParam("unipilot", "address of unipilot")
  // .addParam("v2Factory", "address of v2Factory")
  // .addParam("ulm", "address of ulm")
  .setAction(async (cliArgs, { ethers, run, network }) => {
    await run("compile");
    const signer = (await ethers.getSigners())[1];
    console.log("Signer");
    console.log("  at", signer.address);
    console.log("  ETH", formatEther(await signer.getBalance()));

    // const args = {
    //   positionManager: cliArgs.positionmanager,
    //   uniswapFactory: cliArgs.uniswapfactory,
    //   unipilot: cliArgs.unipilot,
    //   v2Factory: cliArgs.v2Factory,
    //   ulm: cliArgs.ulm,
    // };

    const args = {
      positionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
      uniswapFactory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      unipilot: "0x7c0C2de74929Fb8cAc9E42dF3594B727b39549Fb",
      ulm: "0x1d85374b386CaBf80cabA0AD58e01B5319149840",
    };

    console.log("Network");
    console.log("   ", network.name);
    console.log("Task Args");
    console.log(args);

    const unipilotMigrator = await deployContract(
      "UnipilotMigrator",
      await await ethers.getContractFactory("UnipilotMigrator"),
      signer,
      [args.positionManager, args.uniswapFactory, args.unipilot, args.ulm],
    );

    delay(60000);

    await run("verify:verify", {
      address: unipilotMigrator.address,
      constructorArguments: [
        args.positionManager,
        args.uniswapFactory,
        args.unipilot,
        args.ulm,
      ],
    });
  });

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
