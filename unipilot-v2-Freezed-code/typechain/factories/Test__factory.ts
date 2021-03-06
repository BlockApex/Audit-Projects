/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Test, TestInterface } from "../Test";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "what",
        type: "string",
      },
    ],
    name: "deployCode",
    outputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506102af806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80639a8325a014610030575b600080fd5b61004361003e366004610174565b610059565b60405161005091906101e7565b60405180910390f35b604051638d1cc92560e01b81526000908190737109709ecfa91a80626ff3989d68f67f5b1dd12d90638d1cc925906100959086906004016101fb565b600060405180830381600087803b1580156100af57600080fd5b505af11580156100c3573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526100eb91908101906100fd565b90508051602082016000f09392505050565b60006020828403121561010e578081fd5b81516001600160401b03811115610123578182fd5b8201601f81018413610133578182fd5b805161014661014182610251565b61022e565b81815285602083850101111561015a578384fd5b61016b826020830160208601610272565b95945050505050565b600060208284031215610185578081fd5b81356001600160401b0381111561019a578182fd5b8201601f810184136101aa578182fd5b80356101b861014182610251565b8181528560208385010111156101cc578384fd5b81602084016020830137908101602001929092525092915050565b6001600160a01b0391909116815260200190565b600060208252825180602084015261021a816040850160208701610272565b601f01601f19169190910160400192915050565b6040518181016001600160401b038111828210171561024957fe5b604052919050565b60006001600160401b0382111561026457fe5b50601f01601f191660200190565b60005b8381101561028d578181015183820152602001610275565b8381111561029c576000848401525b5050505056fea164736f6c6343000706000a";

type TestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Test__factory extends ContractFactory {
  constructor(...args: TestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Test> {
    return super.deploy(overrides || {}) as Promise<Test>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Test {
    return super.attach(address) as Test;
  }
  connect(signer: Signer): Test__factory {
    return super.connect(signer) as Test__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestInterface {
    return new utils.Interface(_abi) as TestInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Test {
    return new Contract(address, _abi, signerOrProvider) as Test;
  }
}
