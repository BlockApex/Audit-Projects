/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IUnipilotMigrator,
  IUnipilotMigratorInterface,
} from "../IUnipilotMigrator";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "LiquidityMigratedFromV2",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "LiquidityMigratedFromV3",
    type: "event",
  },
];

export class IUnipilotMigrator__factory {
  static readonly abi = _abi;
  static createInterface(): IUnipilotMigratorInterface {
    return new utils.Interface(_abi) as IUnipilotMigratorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUnipilotMigrator {
    return new Contract(address, _abi, signerOrProvider) as IUnipilotMigrator;
  }
}