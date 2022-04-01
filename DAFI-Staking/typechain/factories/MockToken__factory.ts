/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockToken, MockTokenInterface } from "../MockToken";

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
      {
        internalType: "address[]",
        name: "LPs",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "mintVal",
        type: "uint256[]",
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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "transferAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "success",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620018d1380380620018d183398101604081905262000034916200043a565b838381818160039080519060200190620000509291906200028f565b508051620000669060049060208401906200028f565b505050620000836200007d6200016960201b60201c565b6200016d565b506200009b90503368056bc75e2d63100000620001bf565b8051825167016345785d8a00009114620000d25760405162461bcd60e51b8152600401620000c9906200055d565b60405180910390fd5b60005b83518110156200015d57620001488482815181106200010457634e487b7160e01b600052603260045260246000fd5b6020026020010151838584815181106200012e57634e487b7160e01b600052603260045260246000fd5b602002602001015162000142919062000641565b620001bf565b806200015481620006a0565b915050620000d5565b505050505050620006ea565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038216620001e85760405162461bcd60e51b8152600401620000c99062000594565b620001f6600083836200028a565b80600260008282546200020a919062000626565b90915550506001600160a01b038216600090815260208190526040812080548392906200023990849062000626565b90915550506040516001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906200027e908590620005cb565b60405180910390a35050565b505050565b8280546200029d9062000663565b90600052602060002090601f016020900481019282620002c157600085556200030c565b82601f10620002dc57805160ff19168380011785556200030c565b828001600101855582156200030c579182015b828111156200030c578251825591602001919060010190620002ef565b506200031a9291506200031e565b5090565b5b808211156200031a57600081556001016200031f565b600082601f83011262000346578081fd5b815160206200035f620003598362000600565b620005d4565b82815281810190858301838502870184018810156200037c578586fd5b855b858110156200039c578151845292840192908401906001016200037e565b5090979650505050505050565b600082601f830112620003ba578081fd5b81516001600160401b03811115620003d657620003d6620006d4565b6020620003ec601f8301601f19168201620005d4565b828152858284870101111562000400578384fd5b835b838110156200041f57858101830151828201840152820162000402565b838111156200043057848385840101525b5095945050505050565b6000806000806080858703121562000450578384fd5b84516001600160401b038082111562000467578586fd5b6200047588838901620003a9565b95506020915081870151818111156200048c578586fd5b6200049a89828a01620003a9565b955050604087015181811115620004af578485fd5b8701601f81018913620004c0578485fd5b8051620004d1620003598262000600565b81815284810190838601868402850187018d1015620004ee578889fd5b8894505b83851015620005275780516001600160a01b03811681146200051257898afd5b835260019490940193918601918601620004f2565b5060608b015190975094505050508082111562000542578283fd5b50620005518782880162000335565b91505092959194509250565b60208082526015908201527f434f4e535452554354494f4e204d49534d415443480000000000000000000000604082015260600190565b6020808252601f908201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604082015260600190565b90815260200190565b6040518181016001600160401b0381118282101715620005f857620005f8620006d4565b604052919050565b60006001600160401b038211156200061c576200061c620006d4565b5060209081020190565b600082198211156200063c576200063c620006be565b500190565b60008160001904831182151516156200065e576200065e620006be565b500290565b6002810460018216806200067857607f821691505b602082108114156200069a57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415620006b757620006b7620006be565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6111d780620006fa6000396000f3fe608060405234801561001057600080fd5b50600436106101365760003560e01c8063715018a6116100b2578063a0712d6811610081578063a9059cbb11610066578063a9059cbb14610262578063dd62ed3e14610275578063f2fde38b1461028857610136565b8063a0712d681461023c578063a457c2d71461024f57610136565b8063715018a61461020257806379cc67901461020c5780638da5cb5b1461021f57806395d89b411461023457610136565b8063313ce567116101095780634000aea0116100ee5780634000aea0146101c957806342966c68146101dc57806370a08231146101ef57610136565b8063313ce567146101a157806339509351146101b657610136565b806306fdde031461013b578063095ea7b31461015957806318160ddd1461017957806323b872dd1461018e575b600080fd5b61014361029b565b6040516101509190610d3d565b60405180910390f35b61016c610167366004610ba4565b61032d565b6040516101509190610d32565b61018161034a565b604051610150919061111d565b61016c61019c366004610b69565b610350565b6101a96103f0565b6040516101509190611126565b61016c6101c4366004610ba4565b6103f5565b61016c6101d7366004610bcd565b610444565b61016c6101ea366004610c8a565b61047f565b6101816101fd366004610b16565b61049b565b61020a6104b6565b005b61020a61021a366004610ba4565b610501565b610227610556565b6040516101509190610ced565b610143610565565b61020a61024a366004610c8a565b610574565b61016c61025d366004610ba4565b610581565b61016c610270366004610ba4565b6105f2565b610181610283366004610b37565b610606565b61020a610296366004610b16565b610631565b6060600380546102aa90611163565b80601f01602080910402602001604051908101604052809291908181526020018280546102d690611163565b80156103235780601f106102f857610100808354040283529160200191610323565b820191906000526020600020905b81548152906001019060200180831161030657829003601f168201915b5050505050905090565b600061034161033a61069f565b84846106a3565b50600192915050565b60025490565b600061035d848484610757565b6001600160a01b03841660009081526001602052604081208161037e61069f565b6001600160a01b03166001600160a01b03168152602001908152602001600020549050828110156103ca5760405162461bcd60e51b81526004016103c190610ed1565b60405180910390fd5b6103e5856103d661069f565b6103e0868561114c565b6106a3565b506001949350505050565b601290565b600061034161040261069f565b84846001600061041061069f565b6001600160a01b03908116825260208083019390935260409182016000908120918b16815292529020546103e09190611134565b600061045084846105f2565b5061045c338585610757565b6104658461087f565b1561047557610475848484610885565b5060019392505050565b600061049261048c61069f565b836108ef565b5060015b919050565b6001600160a01b031660009081526020819052604090205490565b6104be61069f565b6001600160a01b03166104cf610556565b6001600160a01b0316146104f55760405162461bcd60e51b81526004016103c190610f2e565b6104ff60006109d5565b565b600061050f8361028361069f565b9050818110156105315760405162461bcd60e51b81526004016103c190610f63565b6105478361053d61069f565b6103e0858561114c565b61055183836108ef565b505050565b6005546001600160a01b031690565b6060600480546102aa90611163565b61057e3382610a3f565b50565b6000806001600061059061069f565b6001600160a01b03908116825260208083019390935260409182016000908120918816815292529020549050828110156105dc5760405162461bcd60e51b81526004016103c190611089565b6104756105e761069f565b856103e0868561114c565b60006103416105ff61069f565b8484610757565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61063961069f565b6001600160a01b031661064a610556565b6001600160a01b0316146106705760405162461bcd60e51b81526004016103c190610f2e565b6001600160a01b0381166106965760405162461bcd60e51b81526004016103c190610dd5565b61057e816109d5565b3390565b6001600160a01b0383166106c95760405162461bcd60e51b81526004016103c190611045565b6001600160a01b0382166106ef5760405162461bcd60e51b81526004016103c190610e32565b6001600160a01b0380841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061074a90859061111d565b60405180910390a3505050565b6001600160a01b03831661077d5760405162461bcd60e51b81526004016103c190610fe8565b6001600160a01b0382166107a35760405162461bcd60e51b81526004016103c190610d50565b6107ae838383610551565b6001600160a01b038316600090815260208190526040902054818110156107e75760405162461bcd60e51b81526004016103c190610e74565b6107f1828261114c565b6001600160a01b038086166000908152602081905260408082209390935590851681529081208054849290610827908490611134565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610871919061111d565b60405180910390a350505050565b3b151590565b604051635260769b60e11b815283906001600160a01b0382169063a4c0ed36906108b790339087908790600401610d01565b600060405180830381600087803b1580156108d157600080fd5b505af11580156108e5573d6000803e3d6000fd5b5050505050505050565b6001600160a01b0382166109155760405162461bcd60e51b81526004016103c190610fa7565b61092182600083610551565b6001600160a01b0382166000908152602081905260409020548181101561095a5760405162461bcd60e51b81526004016103c190610d93565b610964828261114c565b6001600160a01b0384166000908152602081905260408120919091556002805484929061099290849061114c565b90915550506040516000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9061074a90869061111d565b600580546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038216610a655760405162461bcd60e51b81526004016103c1906110e6565b610a7160008383610551565b8060026000828254610a839190611134565b90915550506001600160a01b03821660009081526020819052604081208054839290610ab0908490611134565b90915550506040516001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610af390859061111d565b60405180910390a35050565b80356001600160a01b038116811461049657600080fd5b600060208284031215610b27578081fd5b610b3082610aff565b9392505050565b60008060408385031215610b49578081fd5b610b5283610aff565b9150610b6060208401610aff565b90509250929050565b600080600060608486031215610b7d578081fd5b610b8684610aff565b9250610b9460208501610aff565b9150604084013590509250925092565b60008060408385031215610bb6578182fd5b610bbf83610aff565b946020939093013593505050565b600080600060608486031215610be1578283fd5b610bea84610aff565b92506020808501359250604085013567ffffffffffffffff80821115610c0e578384fd5b818701915087601f830112610c21578384fd5b813581811115610c3357610c336111b4565b604051601f8201601f1916810185018381118282101715610c5657610c566111b4565b60405281815283820185018a1015610c6c578586fd5b81858501868301378585838301015280955050505050509250925092565b600060208284031215610c9b578081fd5b5035919050565b60008151808452815b81811015610cc757602081850181015186830182015201610cab565b81811115610cd85782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0391909116815260200190565b60006001600160a01b038516825283602083015260606040830152610d296060830184610ca2565b95945050505050565b901515815260200190565b600060208252610b306020830184610ca2565b60208082526023908201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526022908201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604082015261636560f01b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201527f6464726573730000000000000000000000000000000000000000000000000000606082015260800190565b60208082526022908201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604082015261737360f01b606082015260800190565b60208082526026908201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260408201527f616c616e63650000000000000000000000000000000000000000000000000000606082015260800190565b60208082526028908201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160408201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526024908201527f45524332303a206275726e20616d6f756e74206578636565647320616c6c6f77604082015263616e636560e01b606082015260800190565b60208082526021908201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736040820152607360f81b606082015260800190565b60208082526025908201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460408201527f6472657373000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526024908201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526025908201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760408201527f207a65726f000000000000000000000000000000000000000000000000000000606082015260800190565b6020808252601f908201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604082015260600190565b90815260200190565b60ff91909116815260200190565b600082198211156111475761114761119e565b500190565b60008282101561115e5761115e61119e565b500390565b60028104600182168061117757607f821691505b6020821081141561119857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea164736f6c6343000800000a";

export class MockToken__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    LPs: string[],
    mintVal: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockToken> {
    return super.deploy(
      name,
      symbol,
      LPs,
      mintVal,
      overrides || {}
    ) as Promise<MockToken>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    LPs: string[],
    mintVal: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name,
      symbol,
      LPs,
      mintVal,
      overrides || {}
    );
  }
  attach(address: string): MockToken {
    return super.attach(address) as MockToken;
  }
  connect(signer: Signer): MockToken__factory {
    return super.connect(signer) as MockToken__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockTokenInterface {
    return new utils.Interface(_abi) as MockTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockToken {
    return new Contract(address, _abi, signerOrProvider) as MockToken;
  }
}
