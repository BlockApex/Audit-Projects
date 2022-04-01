/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PriceFeed, PriceFeedInterface } from "../PriceFeed";

const _abi = [
  {
    inputs: [],
    name: "getThePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "randomPriceFeed",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060628061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80638c3c9a5514602d575b600080fd5b60336047565b604051603e9190604c565b60405180910390f35b609f90565b9081526020019056fea164736f6c6343000800000a";

export class PriceFeed__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PriceFeed> {
    return super.deploy(overrides || {}) as Promise<PriceFeed>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PriceFeed {
    return super.attach(address) as PriceFeed;
  }
  connect(signer: Signer): PriceFeed__factory {
    return super.connect(signer) as PriceFeed__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PriceFeedInterface {
    return new utils.Interface(_abi) as PriceFeedInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PriceFeed {
    return new Contract(address, _abi, signerOrProvider) as PriceFeed;
  }
}