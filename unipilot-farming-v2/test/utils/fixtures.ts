import { Fixture } from "ethereum-waffle";
import { BigNumber, Contract, Wallet } from "ethers";
import { ethers, waffle } from "hardhat";
import { deployToken } from "../TokenDeployer/TokenStubs";
import { UnipilotFarm } from "../../typechain";

interface TEST_ERC20 {
  DAI: Contract;
  USDT: Contract;
  PILOT: Contract;
  SHIB: Contract;
}

type MAIN = TEST_ERC20;

interface UNIPILOT_FARM_FIXTURE extends MAIN {
  createUnipilotFarm(
    governance: string,
    pilot: string,
    rewardPerBlock: BigNumber,
  ): Promise<UnipilotFarm>;
}

export const unipilotFarmFixture: Fixture<UNIPILOT_FARM_FIXTURE> =
  async function (): Promise<UNIPILOT_FARM_FIXTURE> {
    const [wallet] = waffle.provider.getWallets();
    const DAI = await deployToken(wallet, "Dai Stablecoin", "DAI", "18");
    const USDT = await deployToken(wallet, "Tether Stable", "USDT", "18");
    const PILOT = await deployToken(wallet, "Pilot", "PILOT", "18");
    const SHIB = await deployToken(wallet, "Shiba Inu", "SHIB", "18");
    const unipilotFarmDep = await ethers.getContractFactory("UnipilotFarm");

    return {
      DAI,
      USDT,
      PILOT,
      SHIB,
      createUnipilotFarm: async (governance, pilot, rewardPerBlock) => {
        return (await unipilotFarmDep.deploy(
          governance,
          pilot,
          rewardPerBlock,
        )) as UnipilotFarm;
      },
    };
  };
