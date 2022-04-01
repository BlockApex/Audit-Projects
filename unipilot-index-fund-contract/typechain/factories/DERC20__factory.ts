/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DERC20, DERC20Interface } from "../DERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200123b3803806200123b8339810160408190526200003491620001cb565b8151829082906200004d9060039060208501906200006e565b508051620000639060049060208401906200006e565b505050505062000288565b8280546200007c9062000235565b90600052602060002090601f016020900481019282620000a05760008555620000eb565b82601f10620000bb57805160ff1916838001178555620000eb565b82800160010185558215620000eb579182015b82811115620000eb578251825591602001919060010190620000ce565b50620000f9929150620000fd565b5090565b5b80821115620000f95760008155600101620000fe565b600082601f8301126200012657600080fd5b81516001600160401b038082111562000143576200014362000272565b604051601f8301601f19908116603f011681019082821181831017156200016e576200016e62000272565b816040528381526020925086838588010111156200018b57600080fd5b600091505b83821015620001af578582018301518183018401529082019062000190565b83821115620001c15760008385830101525b9695505050505050565b60008060408385031215620001df57600080fd5b82516001600160401b0380821115620001f757600080fd5b620002058683870162000114565b935060208501519150808211156200021c57600080fd5b506200022b8582860162000114565b9150509250929050565b600181811c908216806200024a57607f821691505b602082108114156200026c57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610fa380620002986000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806342966c681161008c57806395d89b411161006657806395d89b41146101e8578063a457c2d7146101f0578063a9059cbb14610203578063dd62ed3e1461021657600080fd5b806342966c681461018c57806370a082311461019f57806379cc6790146101d557600080fd5b806323b872dd116100c857806323b872dd14610142578063313ce56714610155578063395093511461016457806340c10f191461017757600080fd5b806306fdde03146100ef578063095ea7b31461010d57806318160ddd14610130575b600080fd5b6100f761025c565b6040516101049190610e71565b60405180910390f35b61012061011b366004610e2e565b6102ee565b6040519015158152602001610104565b6002545b604051908152602001610104565b610120610150366004610df2565b610304565b60405160128152602001610104565b610120610172366004610e2e565b6103ef565b61018a610185366004610e2e565b610438565b005b61018a61019a366004610e58565b610446565b6101346101ad366004610d9d565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b61018a6101e3366004610e2e565b610453565b6100f761050c565b6101206101fe366004610e2e565b61051b565b610120610211366004610e2e565b6105f3565b610134610224366004610dbf565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b60606003805461026b90610f13565b80601f016020809104026020016040519081016040528092919081815260200182805461029790610f13565b80156102e45780601f106102b9576101008083540402835291602001916102e4565b820191906000526020600020905b8154815290600101906020018083116102c757829003601f168201915b5050505050905090565b60006102fb338484610600565b50600192915050565b60006103118484846107b3565b73ffffffffffffffffffffffffffffffffffffffff84166000908152600160209081526040808320338452909152902054828110156103d7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160448201527f6c6c6f77616e636500000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b6103e48533858403610600565b506001949350505050565b33600081815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490916102fb918590610433908690610ee4565b610600565b6104428282610a67565b5050565b6104503382610b87565b50565b600061045f8333610224565b9050818110156104f0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f7760448201527f616e63650000000000000000000000000000000000000000000000000000000060648201526084016103ce565b6104fd8333848403610600565b6105078383610b87565b505050565b60606004805461026b90610f13565b33600090815260016020908152604080832073ffffffffffffffffffffffffffffffffffffffff86168452909152812054828110156105dc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084016103ce565b6105e93385858403610600565b5060019392505050565b60006102fb3384846107b3565b73ffffffffffffffffffffffffffffffffffffffff83166106a2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f726573730000000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff8216610745576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f737300000000000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8316610856576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f647265737300000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff82166108f9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f657373000000000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260208190526040902054818110156109af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e6365000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082208585039055918516815290812080548492906109f3908490610ee4565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a5991815260200190565b60405180910390a350505050565b73ffffffffffffffffffffffffffffffffffffffff8216610ae4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103ce565b8060026000828254610af69190610ee4565b909155505073ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604081208054839290610b30908490610ee4565b909155505060405181815273ffffffffffffffffffffffffffffffffffffffff8316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b73ffffffffffffffffffffffffffffffffffffffff8216610c2a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360448201527f730000000000000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090205481811015610ce0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60448201527f636500000000000000000000000000000000000000000000000000000000000060648201526084016103ce565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120838303905560028054849290610d1c908490610efc565b909155505060405182815260009073ffffffffffffffffffffffffffffffffffffffff8516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610d9857600080fd5b919050565b600060208284031215610daf57600080fd5b610db882610d74565b9392505050565b60008060408385031215610dd257600080fd5b610ddb83610d74565b9150610de960208401610d74565b90509250929050565b600080600060608486031215610e0757600080fd5b610e1084610d74565b9250610e1e60208501610d74565b9150604084013590509250925092565b60008060408385031215610e4157600080fd5b610e4a83610d74565b946020939093013593505050565b600060208284031215610e6a57600080fd5b5035919050565b600060208083528351808285015260005b81811015610e9e57858101830151858201604001528201610e82565b81811115610eb0576000604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60008219821115610ef757610ef7610f67565b500190565b600082821015610f0e57610f0e610f67565b500390565b600181811c90821680610f2757607f821691505b60208210811415610f61577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea164736f6c6343000807000a";

export class DERC20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DERC20> {
    return super.deploy(name, symbol, overrides || {}) as Promise<DERC20>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): DERC20 {
    return super.attach(address) as DERC20;
  }
  connect(signer: Signer): DERC20__factory {
    return super.connect(signer) as DERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DERC20Interface {
    return new utils.Interface(_abi) as DERC20Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DERC20 {
    return new Contract(address, _abi, signerOrProvider) as DERC20;
  }
}