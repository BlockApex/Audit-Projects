import { Signer } from "@ethersproject/abstract-signer";
import { parseUnits } from "@ethersproject/units";
import { deployContract } from "ethereum-waffle";
import { BigNumber, Contract } from "ethers";
import Erc20Artifact from "../../artifacts/contracts/test/ERC20.sol/ERC20.json";
import PilotArtifact from "../../artifacts/contracts/test/PilotToken.sol/Pilot.json";

export async function deployToken(
  deployer: Signer,
  name: String,
  symbol: String,
  decimal: string,
): Promise<Contract> {
  let token: any = await deployContract(deployer, Erc20Artifact, [
    name,
    symbol,
    decimal,
  ]);
  return token as Contract;
}

export async function deployPilot(deployer: Signer): Promise<Contract> {
  let pilot: any = await deployContract(deployer, PilotArtifact, [
    deployer.getAddress(),
    [deployer.getAddress()],
    [parseUnits("50000", "18")],
  ]);
  return pilot as Contract;
}
