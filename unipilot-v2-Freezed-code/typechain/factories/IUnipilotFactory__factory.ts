/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IUnipilotFactory,
  IUnipilotFactoryInterface,
} from "../IUnipilotFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_oldGovernance",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_newGovernance",
        type: "address",
      },
    ],
    name: "GovernanceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint24",
        name: "_fee",
        type: "uint24",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_vault",
        type: "address",
      },
    ],
    name: "VaultCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "_fee",
        type: "uint24",
      },
      {
        internalType: "uint160",
        name: "_sqrtPriceX96",
        type: "uint160",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    name: "createVault",
    outputs: [
      {
        internalType: "address",
        name: "_vault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getUnipilotDetails",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IUnipilotFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IUnipilotFactoryInterface {
    return new utils.Interface(_abi) as IUnipilotFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IUnipilotFactory {
    return new Contract(address, _abi, signerOrProvider) as IUnipilotFactory;
  }
}
