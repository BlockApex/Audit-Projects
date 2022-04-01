/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DemoTest, DemoTestInterface } from "../DemoTest";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "MyEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "log",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "log_address",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "log_bytes",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "log_bytes32",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    name: "log_int",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "val",
        type: "address",
      },
    ],
    name: "log_named_address",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "val",
        type: "bytes",
      },
    ],
    name: "log_named_bytes",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "val",
        type: "bytes32",
      },
    ],
    name: "log_named_bytes32",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "val",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
    ],
    name: "log_named_decimal_int",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "val",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
    ],
    name: "log_named_decimal_uint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "val",
        type: "int256",
      },
    ],
    name: "log_named_int",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "val",
        type: "string",
      },
    ],
    name: "log_named_string",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "key",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "val",
        type: "uint256",
      },
    ],
    name: "log_named_uint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "log_old_named_uint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "log_string",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "log_uint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[4]",
        name: "val",
        type: "uint256[4]",
      },
    ],
    name: "log_uint_array",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "logs",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "s1",
        type: "string",
      },
      {
        internalType: "string",
        name: "s2",
        type: "string",
      },
    ],
    name: "echo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "prove_this",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_asserts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_events",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_logn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_logs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_multiline",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_old_logs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test_this",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "test_trace",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000805460ff1916600117905534801561001d57600080fd5b50613caa8061002d6000396000f3fe608060405234801561001057600080fd5b50600436106100be5760003560e01c806348e6b393116100765780639db486221161005b5780639db486221461012a578063a88d42a514610132578063ea877ad61461013a576100be565b806348e6b3931461011a578063673933f114610122576100be565b806322ba24d9116100a757806322ba24d9146100d557806337c8d21f146100dd57806346444d9414610107576100be565b80631d1552b3146100c357806322a34337146100cd575b600080fd5b6100cb610142565b005b6100cb6101b2565b6100cb6101d4565b6100f06100eb3660046123fa565b61024d565b6040516100fe92919061263c565b60405180910390f35b6100cb6101153660046124b2565b610251565b6100cb6102a0565b6100cb6105b2565b6100cb6105b4565b6100cb6111d1565b6100cb611212565b7f3b33be04fcc119b177d5565b21e13329b6b9a44d71698122b433536ae7c9a77c6101f460405161017391906126c7565b60405180910390a17fafb795c9c61e4fe7468c386f925d7a5429ecad9c0495ddb8d38d690614d32f996040516101a890613ae8565b60405180910390a1565b60026001a0600360026001a16004600360026001a260056004600360026001a3565b6040516337c8d21f60e01b815230906337c8d21f906101f590600401612e1f565b60006040518083038186803b15801561020d57600080fd5b505afa158015610221573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610249919081019061245b565b5050565b9091565b7fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a8816040516102809190613223565b60405180910390a161029d610296826001613bd2565b60006113b1565b50565b600080516020613c5e8339815191526040516102bb90612cf6565b60405180910390a1600080516020613c5e8339815191526040516102de90612d2d565b60405180910390a1600080516020613c5e833981519152604051610301906137e9565b60405180910390a17fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a861020060405161033a9190613027565b60405180910390a1600080516020613c5e83398151915260405161035d90613ab1565b60405180910390a17f2fe632779174374378442a8e978bccfbdcc1d6b2b0d81f7e8eb776ab2286f1686101ff1960405161039791906131fe565b60405180910390a1600080516020613c5e8339815191526040516103ba9061266a565b60405180910390a17f9c4e8541ca8f0dc1c413f9108f66d82d3cecb1bddbce437a61caa3175c4cc96f306040516103f19190612bdc565b60405180910390a1600080516020613c5e83398151915260405161041490613652565b60405180910390a17fafb795c9c61e4fe7468c386f925d7a5429ecad9c0495ddb8d38d690614d32f99604051610449906132df565b60405180910390a1600080516020613c5e83398151915260405161046c90612b64565b60405180910390a17fd26e16cad4548705e4c9e2d94f98ee91c289085ee425594fd5635fa2964ccf186040516104a1906136af565b60405180910390a1600080516020613c5e8339815191526040516104c490612cb3565b60405180910390a1600080516020613c7e8339815191526040516104e790613299565b60405180910390a1600080516020613c5e83398151915260405161050a906138ac565b60405180910390a17feb8ba43ced7537421946bd43e828b8b2b8428927aa8f801c13d934bf11aca57b670de0b6b3a7640000601260405161054c92919061291d565b60405180910390a1600080516020613c5e83398151915260405161056f90613909565b60405180910390a17f5da6ce9d51151ba10c09a559ef24d520b9dac5c5b8810ae8434e4d0d86411a95670de0b6b3a763ffff1960126040516101a8929190613820565b565b604080518082018252601581527f74686973207465737420686173206661696c656421000000000000000000000060208201529051600080516020613c5e83398151915290610602906133a1565b60405180910390a16106146000611451565b600080516020613c5e83398151915260405161062f9061271f565b60405180910390a1610642600082611481565b600080516020613c5e83398151915260405161065d9061314c565b60405180910390a161066f30336114b4565b600080516020613c5e83398151915260405161068a9061271f565b60405180910390a161069d303383611556565b600080516020613c5e8339815191526040516106b890612961565b60405180910390a16106de666279746573203160c81b66313cba32b9901960c91b61159e565b600080516020613c5e8339815191526040516106f99061271f565b60405180910390a1610720666279746573203160c81b66313cba32b9901960c91b836115a8565b600080516020613c5e83398151915260405161073b90613b12565b60405180910390a1610761666279746573203160c81b66313cba32b9901960c91b61159e565b600080516020613c5e83398151915260405161077c9061271f565b60405180910390a16107a3666279746573203160c81b66313cba32b9901960c91b836115a8565b600080516020613c5e8339815191526040516107be906134ba565b60405180910390a16107d2600060016115b3565b600080516020613c5e8339815191526040516107ed9061271f565b60405180910390a16108026000600183611643565b600080516020613c5e83398151915260405161081d90612b2d565b60405180910390a1610833600019600119611679565b600080516020613c5e83398151915260405161084e9061271f565b60405180910390a161086560001960011983611709565b600080516020613c5e83398151915260405161088090613966565b60405180910390a16108a6670de0b6b3a763ffff19670f43fc2c04edffff19601261173f565b600080516020613c5e8339815191526040516108c19061271f565b60405180910390a16108e8670de0b6b3a763ffff19670f43fc2c04edffff196012846117e3565b600080516020613c5e83398151915260405161090390612f29565b60405180910390a1610927670de0b6b3a7640000670f43fc2c04ee00006012611820565b600080516020613c5e8339815191526040516109429061271f565b60405180910390a1610967670de0b6b3a7640000670f43fc2c04ee00006012846118b4565b600080516020613c5e83398151915260405161098290612e60565b60405180910390a16109956000806113b1565b600080516020613c5e8339815191526040516109b09061271f565b60405180910390a16109c4600080836118eb565b600080516020613c5e8339815191526040516109df90612ff0565b60405180910390a16109f360001980611921565b600080516020613c5e833981519152604051610a0e9061271f565b60405180910390a1610a2360001980836119b1565b600080516020613c5e833981519152604051610a3e906129df565b60405180910390a1610a64671bc16d674ec7ffff19670f43fc2c04edffff1960126119e7565b600080516020613c5e833981519152604051610a7f9061271f565b60405180910390a1610aa6671bc16d674ec7ffff19670f43fc2c04edffff19601284611a7b565b600080516020613c5e833981519152604051610ac1906139a8565b60405180910390a1610ae5670de0b6b3a7640000670f43fc2c04ee00006012611ab2565b600080516020613c5e833981519152604051610b009061271f565b60405180910390a1610b25670de0b6b3a7640000670f43fc2c04ee0000601284611b46565b600080516020613c5e833981519152604051610b4090613327565b60405180910390a1610b5460006001611b7d565b600080516020613c5e833981519152604051610b6f9061271f565b60405180910390a1610b846000600183611ba0565b600080516020613c5e833981519152604051610b9f90612846565b60405180910390a1610bb46000196000611bd7565b600080516020613c5e833981519152604051610bcf9061271f565b60405180910390a1610be5600019600083611bfa565b600080516020613c5e833981519152604051610c0090612804565b60405180910390a1610c26671bc16d674ec7ffff19670f43fc2c04edffff196012611c31565b600080516020613c5e833981519152604051610c419061271f565b60405180910390a1610c68671bc16d674ec7ffff19670f43fc2c04edffff19601284611c54565b600080516020613c5e833981519152604051610c83906131ba565b60405180910390a1610ca7670de0b6b3a7640000670f43fc2c04ee00006012611c8c565b600080516020613c5e833981519152604051610cc29061271f565b60405180910390a1610ce7670de0b6b3a7640000670f43fc2c04ee0000601284611caf565b600080516020613c5e833981519152604051610d02906130cd565b60405180910390a1610d15600080611ce7565b600080516020613c5e833981519152604051610d309061271f565b60405180910390a1610d4460008083611d09565b600080516020613c5e833981519152604051610d5f906127cd565b60405180910390a1610d7360001980611d3f565b600080516020613c5e833981519152604051610d8e9061271f565b60405180910390a1610da36000198083611d61565b600080516020613c5e833981519152604051610dbe9061287d565b60405180910390a1610de4670de0b6b3a763ffff19670f43fc2c04edffff196012611d97565b600080516020613c5e833981519152604051610dff9061271f565b60405180910390a1610e26670de0b6b3a763ffff19670f43fc2c04edffff19601284611db9565b600080516020613c5e833981519152604051610e4190613476565b60405180910390a1610e65671bc16d674ec80000670f43fc2c04ee00006012611df0565b600080516020613c5e833981519152604051610e809061271f565b60405180910390a1610ea5671bc16d674ec80000670f43fc2c04ee0000601284611e12565b600080516020613c5e833981519152604051610ec090613b49565b60405180910390a1610ed460016000611e49565b600080516020613c5e833981519152604051610eef9061271f565b60405180910390a1610f046001600083611e6c565b600080516020613c5e833981519152604051610f1f90613262565b60405180910390a1610f346000600019611ea3565b600080516020613c5e833981519152604051610f4f9061271f565b60405180910390a1610f65600060001983611ec6565b600080516020613c5e833981519152604051610f80906128bf565b60405180910390a1610fa6670de0b6b3a763ffff19670f43fc2c04edffff196012611efd565b600080516020613c5e833981519152604051610fc19061271f565b60405180910390a1610fe8670de0b6b3a763ffff19670f43fc2c04edffff19601284611f20565b600080516020613c5e8339815191526040516110039061360e565b60405180910390a1611027671bc16d674ec80000670f43fc2c04ee00006012611f58565b600080516020613c5e8339815191526040516110429061271f565b60405180910390a1611067671bc16d674ec80000670f43fc2c04ee0000601284611f7b565b600080516020613c5e83398151915260405161108290612ba5565b60405180910390a1604080518082018252600880825267737472696e67203160c01b60208084019190915283518085019094529083526739ba3934b733901960c11b90830152906110d38282611fa0565b600080516020613c5e8339815191526040516110ee9061271f565b60405180910390a1611101828285612058565b600080516020613c5e83398151915260405161111c9061304d565b60405180910390a161116660405180604001604052806004815260200163abcdef0160e01b8152506040518060400160405280600481526020016355e6f78160e11b8152506120da565b600080516020613c5e8339815191526040516111819061271f565b60405180910390a16111cc60405180604001604052806004815260200163abcdef0160e01b8152506040518060400160405280600481526020016355e6f78160e11b81525085612171565b505050565b600460027fb0f98cf6a3ac72f8ce21b36c00f0c5bc98b2acbda7853638c61ce3199b2200116001600360405161120892919061262e565b60405180910390a3565b600080516020613c5e83398151915260405161122d90612d76565b60405180910390a1600080516020613c5e83398151915260405161125090612d3f565b60405180910390a17f23b62ad0584d24a75f0bf3560391ef5659ec6db1269c56e11aa241d637f19b2060405161128590612d2d565b60405180910390a17f23b62ad0584d24a75f0bf3560391ef5659ec6db1269c56e11aa241d637f19b206040516112ba90612a6b565b60405180910390a17f23b62ad0584d24a75f0bf3560391ef5659ec6db1269c56e11aa241d637f19b206040516112ef90612d76565b60405180910390a1600080516020613c5e83398151915260405161131290612901565b60405180910390a17fe7950ede0394b9f2ce4a5a1bf5a7e1852411f7e6661b4308c913c4bfd11027e460405161134790612d88565b60405180910390a17fd26e16cad4548705e4c9e2d94f98ee91c289085ee425594fd5635fa2964ccf1860405161137c9061376c565b60405180910390a17fe7950ede0394b9f2ce4a5a1bf5a7e1852411f7e6661b4308c913c4bfd11027e46040516101a890613183565b80821161024957600080516020613c5e8339815191526040516113d390612faf565b60405180910390a17fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a88260405161140a9190613701565b60405180910390a17fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a8816040516114419190613a7b565b60405180910390a16102496121ae565b8061029d57600080516020613c5e833981519152604051611471906137b2565b60405180910390a161029d6121ae565b8161024957600080516020613c7e833981519152816040516114a391906139ec565b60405180910390a161024982611451565b806001600160a01b0316826001600160a01b03161461024957600080516020613c5e8339815191526040516114e890613419565b60405180910390a17f9c4e8541ca8f0dc1c413f9108f66d82d3cecb1bddbce437a61caa3175c4cc96f8160405161151f9190612c24565b60405180910390a17f9c4e8541ca8f0dc1c413f9108f66d82d3cecb1bddbce437a61caa3175c4cc96f826040516114419190613864565b816001600160a01b0316836001600160a01b0316146111cc57600080516020613c7e8339815191528160405161158c91906139ec565b60405180910390a16111cc83836114b4565b61024982826121bf565b6111cc83838361224f565b80821461024957600080516020613c5e8339815191526040516115d590612aa2565b60405180910390a17fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a88160405161160c9190612c4d565b60405180910390a17fb2de2fbe801a0df6c0cbddfd448ba3c41d48a040ca35c56c8196ef0fcae721a8826040516114419190613876565b8183146111cc57600080516020613c7e8339815191528160405161166791906139ec565b60405180910390a16111cc83836115b3565b80821461024957600080516020613c5e83398151915260405161169b906126de565b60405180910390a17f2fe632779174374378442a8e978bccfbdcc1d6b2b0d81f7e8eb776ab2286f168816040516116d29190612c4d565b60405180910390a17f2fe632779174374378442a8e978bccfbdcc1d6b2b0d81f7e8eb776ab2286f168826040516114419190613876565b8183146111cc57600080516020613c7e8339815191528160405161172d91906139ec565b60405180910390a16111cc8383611679565b8183146111cc57600080516020613c5e83398151915260405161176190612ae4565b60405180910390a17f5da6ce9d51151ba10c09a559ef24d520b9dac5c5b8810ae8434e4d0d86411a95828260405161179a929190612c91565b60405180910390a17f5da6ce9d51151ba10c09a559ef24d520b9dac5c5b8810ae8434e4d0d86411a9583826040516117d392919061389a565b60405180910390a16111cc6121ae565b82841461181a57600080516020613c7e8339815191528160405161180791906139ec565b60405180910390a161181a84848461173f565b50505050565b8183146111cc57600080516020613c5e83398151915260405161184290613582565b60405180910390a17feb8ba43ced7537421946bd43e828b8b2b8428927aa8f801c13d934bf11aca57b828260405161187b929190612c91565b60405180910390a17feb8ba43ced7537421946bd43e828b8b2b8428927aa8f801c13d934bf11aca57b83826040516117d392919061389a565b82841461181a57600080516020613c7e833981519152816040516118d891906139ec565b60405180910390a161181a848484611820565b8183116111cc57600080516020613c7e8339815191528160405161190f91906139ec565b60405180910390a16111cc83836113b1565b80821361024957600080516020613c5e83398151915260405161194390613737565b60405180910390a17f2fe632779174374378442a8e978bccfbdcc1d6b2b0d81f7e8eb776ab2286f1688260405161197a9190613701565b60405180910390a17f2fe632779174374378442a8e978bccfbdcc1d6b2b0d81f7e8eb776ab2286f168816040516114419190613a7b565b8183136111cc57600080516020613c7e833981519152816040516119d591906139ec565b60405180910390a16111cc8383611921565b8183136111cc57600080516020613c5e833981519152604051611a0990613104565b60405180910390a17f5da6ce9d51151ba10c09a559ef24d520b9dac5c5b8810ae8434e4d0d86411a958382604051611a42929190613713565b60405180910390a17f5da6ce9d51151ba10c09a559ef24d520b9dac5c5b8810ae8434e4d0d86411a9582826040516117d3929190613a8d565b82841361181a57600080516020613c7e83398151915281604051611a9f91906139ec565b60405180910390a161181a8484846119e7565b8183116111cc57600080516020613c5e833981519152604051611ad490612996565b60405180910390a17feb8ba43ced7537421946bd43e828b8b2b8428927aa8f801c13d934bf11aca57b8382604051611b0d929190613713565b60405180910390a17feb8ba43ced7537421946bd43e828b8b2b8428927aa8f801c13d934bf11aca57b82826040516117d3929190613a8d565b82841161181a57600080516020613c7e83398151915281604051611b6a91906139ec565b60405180910390a161181a848484611ab2565b8082101561024957600080516020613c5e8339815191526040516113d3906135cc565b818310156111cc57600080516020613c7e83398151915281604051611bc591906139ec565b60405180910390a16111cc8383611b7d565b8082121561024957600080516020613c5e833981519152604051611943906133d8565b818312156111cc57600080516020613c7e83398151915281604051611c1f91906139ec565b60405180910390a16111cc8383611bd7565b818312156111cc57600080516020613c5e833981519152604051611a099061273a565b8284121561181a57600080516020613c7e83398151915281604051611c7991906139ec565b60405180910390a161181a848484611c31565b818310156111cc57600080516020613c5e833981519152604051611ad490612783565b8284101561181a57600080516020613c7e83398151915281604051611cd491906139ec565b60405180910390a161181a848484611c8c565b80821061024957600080516020613c5e8339815191526040516113d390613a3a565b8183106111cc57600080516020613c7e83398151915281604051611d2d91906139ec565b60405180910390a16111cc8383611ce7565b80821261024957600080516020613c5e83398151915260405161194390612e97565b8183126111cc57600080516020613c7e83398151915281604051611d8591906139ec565b60405180910390a16111cc8383611d3f565b8183126111cc57600080516020613c5e833981519152604051611a09906134f1565b82841261181a57600080516020613c7e83398151915281604051611ddd91906139ec565b60405180910390a161181a848484611d97565b8183106111cc57600080516020613c5e833981519152604051611ad490613084565b82841061181a57600080516020613c7e83398151915281604051611e3691906139ec565b60405180910390a161181a848484611df0565b8082111561024957600080516020613c5e8339815191526040516113d390612f6d565b818311156111cc57600080516020613c7e83398151915281604051611e9191906139ec565b60405180910390a16111cc8383611e49565b8082131561024957600080516020613c5e83398151915260405161194390612d9a565b818313156111cc57600080516020613c7e83398151915281604051611eeb91906139ec565b60405180910390a16111cc8383611ea3565b818313156111cc57600080516020613c5e833981519152604051611a0990613539565b8284131561181a57600080516020613c7e83398151915281604051611f4591906139ec565b60405180910390a161181a848484611efd565b818311156111cc57600080516020613c5e833981519152604051611ad490612a21565b8284111561181a57600080516020613c7e83398151915281604051611cd491906139ec565b80604051602001611fb19190612612565b6040516020818303038152906040528051906020012082604051602001611fd89190612612565b604051602081830303815290604052805190602001201461024957600080516020613c5e83398151915260405161200e90612ddb565b60405180910390a1600080516020613c7e833981519152826040516120339190613725565b60405180910390a1600080516020613c7e833981519152816040516114419190613a9f565b816040516020016120699190612612565b60405160208183030381529060405280519060200120836040516020016120909190612612565b60405160208183030381529060405280519060200120146111cc57600080516020613c7e833981519152816040516120c891906139ec565b60405180910390a16111cc8383611fa0565b6120e48282612285565b61024957600080516020613c5e8339815191526040516121039061335e565b60405180910390a17fd26e16cad4548705e4c9e2d94f98ee91c289085ee425594fd5635fa2964ccf188260405161213a9190612c6d565b60405180910390a17fd26e16cad4548705e4c9e2d94f98ee91c289085ee425594fd5635fa2964ccf18816040516114419190613888565b61217b8383612285565b6111cc57600080516020613c7e8339815191528160405161219c91906139ec565b60405180910390a16111cc83836120da565b6000805461ff001916610100179055565b80821461024957600080516020613c5e8339815191526040516121e190612ecc565b60405180910390a17fafb795c9c61e4fe7468c386f925d7a5429ecad9c0495ddb8d38d690614d32f99816040516122189190612c4d565b60405180910390a17fafb795c9c61e4fe7468c386f925d7a5429ecad9c0495ddb8d38d690614d32f99826040516114419190613876565b8183146111cc57600080516020613c7e8339815191528160405161227391906139ec565b60405180910390a16111cc83836121bf565b8051825160019114156123545760005b835181101561234e578281815181106122be57634e487b7160e01b600052603260045260246000fd5b602001015160f81c60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191684828151811061230b57634e487b7160e01b600052603260045260246000fd5b01602001517fff00000000000000000000000000000000000000000000000000000000000000161461233c57600091505b8061234681613c16565b915050612295565b50612358565b5060005b92915050565b600082601f83011261236e578081fd5b813561238161237c82613baa565b613b80565b818152846020838601011115612395578283fd5b816020850160208301379081016020019190915292915050565b600082601f8301126123bf578081fd5b81516123cd61237c82613baa565b8181528460208386010111156123e1578283fd5b6123f2826020830160208701613bea565b949350505050565b6000806040838503121561240c578182fd5b823567ffffffffffffffff80821115612423578384fd5b61242f8683870161235e565b93506020850135915080821115612444578283fd5b506124518582860161235e565b9150509250929050565b6000806040838503121561246d578182fd5b825167ffffffffffffffff80821115612484578384fd5b612490868387016123af565b935060208501519150808211156124a5578283fd5b50612451858286016123af565b6000602082840312156124c3578081fd5b5035919050565b600081518084526124e2816020860160208601613bea565b601f01601f19169290920160200192915050565b600a81527f2020457870656374656400000000000000000000000000000000000000000000602082015260400190565b60088152676120737472696e6760c01b602082015260400190565b601381527f61206d756c74696c696e655c6e737472696e6700000000000000000000000000602082015260400190565b600281526000602082015260400190565b600981527f202056616c756520610000000000000000000000000000000000000000000000602082015260400190565b600a81527f2020202041637475616c00000000000000000000000000000000000000000000602082015260400190565b600981527f202056616c756520620000000000000000000000000000000000000000000000602082015260400190565b60008251612624818460208701613bea565b9190910192915050565b918252602082015260400190565b60006040825261264f60408301856124ca565b828103602084015261266181856124ca565b95945050505050565b60208082526025908201527f2d2d206c6f675f6e616d65645f6164647265737328737472696e672c2061646460408201527f7265737329000000000000000000000000000000000000000000000000000000606082015260800190565b626b657960e81b8152602081019190915260400190565b60208082526021908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b696e746040820152605d60f81b606082015260800190565b6020808252600190820152600560f91b604082015260600190565b60208082526029908201527f4572726f723a2061203e3d2062206e6f7420736174697366696564205b646563604082015268696d616c20696e745d60b81b606082015260800190565b6020808252602a908201527f4572726f723a2061203e3d2062206e6f7420736174697366696564205b646563604082015269696d616c2075696e745d60b01b606082015260800190565b60208082526016908201527f0a2323206173736572744c7428696e742c696e74290a00000000000000000000604082015260600190565b60208082526022908201527f0a2323206173736572744765446563696d616c28696e742c696e742c75696e74604082015261148560f11b606082015260800190565b60208082526016908201527f0a232320617373657274476528696e742c696e74290a00000000000000000000604082015260600190565b60208082526022908201527f0a2323206173736572744c74446563696d616c28696e742c696e742c75696e74604082015261148560f11b606082015260800190565b60208082526022908201527f0a2323206173736572744c65446563696d616c28696e742c696e742c75696e74604082015261148560f11b606082015260800190565b602080825260029082015261ce8f60f01b604082015260600190565b6060808252600c908201527f646563696d616c2075696e74000000000000000000000000000000000000000060808201526020810192909252604082015260a00190565b6020808252818101527f0a2323206173736572744571333228627974657333322c62797465733332290a604082015260600190565b60208082526029908201527f4572726f723a2061203e2062206e6f7420736174697366696564205b646563696040820152686d616c2075696e745d60b81b606082015260800190565b60208082526022908201527f0a2323206173736572744774446563696d616c28696e742c696e742c75696e74604082015261148560f11b606082015260800190565b6020808252602a908201527f4572726f723a2061203c3d2062206e6f7420736174697366696564205b646563604082015269696d616c2075696e745d60b01b606082015260800190565b60208082526012908201527f61206d756c74696c696e650a737472696e670000000000000000000000000000604082015260600190565b60208082526022908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b75696e604082015261745d60f01b606082015260800190565b60208082526029908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b646563604082015268696d616c20696e745d60b81b606082015260800190565b60208082526016908201527f0a232320617373657274457128696e742c696e74290a00000000000000000000604082015260600190565b60208082526021908201527f2d2d206c6f675f6e616d65645f627974657328737472696e672c2062797465736040820152602960f81b606082015260800190565b6020808252601c908201527f0a232320617373657274457128737472696e672c737472696e67290a00000000604082015260600190565b60408082526007908201527f616464726573730000000000000000000000000000000000000000000000000060608201526001600160a01b0391909116602082015260800190565b600060408252612c36604083016124f6565b90506001600160a01b038316602083015292915050565b600060408252612c5f604083016124f6565b905082602083015292915050565b600060408252612c7f604083016124f6565b82810360208401526123f281856124ca565b600060608252612ca3606083016124f6565b6020830194909452506040015290565b60208082526023908201527f2d2d206c6f675f6e616d65645f737472696e6728737472696e672c20737472696040820152626e672960e81b606082015260800190565b6020808252600e908201527f2d2d206c6f6728737472696e6729000000000000000000000000000000000000604082015260600190565b60006020825261235860208301612526565b60208082526012908201527f61206d756c74696c696e6520737472696e670000000000000000000000000000604082015260600190565b60006020825261235860208301612541565b60006020825261235860208301612571565b60208082526021908201527f4572726f723a2061203c3d2062206e6f7420736174697366696564205b696e746040820152605d60f81b606082015260800190565b60208082526024908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b737472604082015263696e675d60e01b606082015260800190565b6040808252600890820181905267737472696e67203160c01b60608301526080602083018190528201526739ba3934b733901960c11b60a082015260c00190565b60208082526018908201527f0a23232061737365727447742875696e742c75696e74290a0000000000000000604082015260600190565b6020808252818101527f4572726f723a2061203c2062206e6f7420736174697366696564205b696e745d604082015260600190565b60208082526025908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b62797460408201527f657333325d000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526024908201527f0a2323206173736572744571446563696d616c2875696e742c75696e742c7569604082015263373a148560e11b606082015260800190565b60208082526022908201527f4572726f723a2061203c3d2062206e6f7420736174697366696564205b75696e604082015261745d60f01b606082015260800190565b60208082526021908201527f4572726f723a2061203e2062206e6f7420736174697366696564205b75696e746040820152605d60f81b606082015260800190565b60208082526016908201527f0a232320617373657274477428696e742c696e74290a00000000000000000000604082015260600190565b6040808252600490820152631d5a5b9d60e21b6060820152602081019190915260800190565b6020808252601b908201527f0a2323206173736572744571302862797465732c6279746573290a0000000000604082015260600190565b60208082526029908201527f4572726f723a2061203c2062206e6f7420736174697366696564205b646563696040820152686d616c2075696e745d60b81b606082015260800190565b60208082526018908201527f0a2323206173736572744c742875696e742c75696e74290a0000000000000000604082015260600190565b60208082526028908201527f4572726f723a2061203e2062206e6f7420736174697366696564205b646563696040820152676d616c20696e745d60c01b606082015260800190565b6020808252601e908201527f0a232320617373657274457128616464726573732c61646472657373290a0000604082015260600190565b60208082526001908201527fff00000000000000000000000000000000000000000000000000000000000000604082015260600190565b60208082526024908201527f0a2323206173736572744765446563696d616c2875696e742c75696e742c7569604082015263373a148560e11b606082015260800190565b6040808252600390820152621a5b9d60ea1b6060820152602081019190915260800190565b60408082526005908201527f73796d20780000000000000000000000000000000000000000000000000000006060820152602081019190915260800190565b60208082526016908201527f0a2323206173736572744c6528696e742c696e74290a00000000000000000000604082015260600190565b600060408252600660408301527f737472696e67000000000000000000000000000000000000000000000000000060608301526080602083015261235860808301612526565b60408082526007908201527f62797465733332000000000000000000000000000000000000000000000000006060820152676120737472696e6760c01b602082015260800190565b60208082526018908201527f0a23232061737365727447652875696e742c75696e74290a0000000000000000604082015260600190565b60208082526023908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b62797460408201526265735d60e81b606082015260800190565b60208082526014908201527f2323206173736572745472756528626f6f6c290a000000000000000000000000604082015260600190565b60208082526021908201527f4572726f723a2061203e3d2062206e6f7420736174697366696564205b696e746040820152605d60f81b606082015260800190565b60208082526025908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b61646460408201527f726573735d000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526024908201527f0a2323206173736572744c74446563696d616c2875696e742c75696e742c7569604082015263373a148560e11b606082015260800190565b60208082526018908201527f0a23232061737365727445712875696e742c75696e74290a0000000000000000604082015260600190565b60208082526028908201527f4572726f723a2061203c2062206e6f7420736174697366696564205b646563696040820152676d616c20696e745d60c01b606082015260800190565b60208082526029908201527f4572726f723a2061203c3d2062206e6f7420736174697366696564205b646563604082015268696d616c20696e745d60b81b606082015260800190565b6020808252602a908201527f4572726f723a2061203d3d2062206e6f7420736174697366696564205b646563604082015269696d616c2075696e745d60b01b606082015260800190565b60208082526022908201527f4572726f723a2061203e3d2062206e6f7420736174697366696564205b75696e604082015261745d60f01b606082015260800190565b60208082526024908201527f0a2323206173736572744c65446563696d616c2875696e742c75696e742c7569604082015263373a148560e11b606082015260800190565b60208082526025908201527f2d2d206c6f675f6e616d65645f6279746573333228737472696e672c2062797460408201527f6573333229000000000000000000000000000000000000000000000000000000606082015260800190565b60408082526005908201527f6279746573000000000000000000000000000000000000000000000000000000606082015260806020820181905260039082015262657f7f60e91b60a082015260c00190565b600060408252612c5f60408301612582565b600060608252612ca360608301612582565b600060408252612c7f60408301612582565b6020808252818101527f4572726f723a2061203e2062206e6f7420736174697366696564205b696e745d604082015260600190565b600060408252600660408301527f307830303030000000000000000000000000000000000000000000000000000060608301526080602083015261235860808301612571565b60208082526017908201527f4572726f723a20417373657274696f6e204661696c6564000000000000000000604082015260600190565b6020808252601f908201527f2d2d206c6f675f6e616d65645f75696e7428737472696e672c2075696e742900604082015260600190565b6060808252600b908201527f646563696d616c20696e7400000000000000000000000000000000000000000060808201526020810192909252604082015260a00190565b600060408252612c36604083016125b2565b600060408252612c5f604083016125b2565b600060408252612c7f604083016125b2565b600060608252612ca3606083016125b2565b6020808252602d908201527f2d2d206c6f675f6e616d65645f646563696d616c5f75696e7428737472696e6760408201527f2c2075696e742c2075696e742900000000000000000000000000000000000000606082015260800190565b6020808252602b908201527f2d2d206c6f675f6e616d65645f646563696d616c5f696e7428737472696e672c60408201527f20696e742c2075696e7429000000000000000000000000000000000000000000606082015260800190565b60208082526022908201527f0a2323206173736572744571446563696d616c28696e742c696e742c75696e74604082015261148560f11b606082015260800190565b60208082526024908201527f0a2323206173736572744774446563696d616c2875696e742c75696e742c7569604082015263373a148560e11b606082015260800190565b600060408252600560408301527f4572726f72000000000000000000000000000000000000000000000000000000606083015260806020830152613a3360808301846124ca565b9392505050565b60208082526021908201527f4572726f723a2061203c2062206e6f7420736174697366696564205b75696e746040820152605d60f81b606082015260800190565b600060408252612c5f604083016125e2565b600060608252612ca3606083016125e2565b600060408252612c7f604083016125e2565b6020808252601d908201527f2d2d206c6f675f6e616d65645f696e7428737472696e672c20696e7429000000604082015260600190565b604080825260049082015263626b657960e01b6060820152621d985b60ea1b602082015260800190565b6020808252601e908201527f0a232320617373657274457128627974657333322c62797465733332290a0000604082015260600190565b60208082526018908201527f0a2323206173736572744c652875696e742c75696e74290a0000000000000000604082015260600190565b60405181810167ffffffffffffffff81118282101715613ba257613ba2613c47565b604052919050565b600067ffffffffffffffff821115613bc457613bc4613c47565b50601f01601f191660200190565b60008219821115613be557613be5613c31565b500190565b60005b83811015613c05578181015183820152602001613bed565b8381111561181a5750506000910152565b6000600019821415613c2a57613c2a613c31565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfe41304facd9323d75b11bcdd609cb38effffdb05710f7caf0e9b16c6d9d709f50280f4446b28a1372417dda658d30b95b2992b12ac9c7f378535f29a97acf3583a164736f6c6343000800000a";

export class DemoTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DemoTest> {
    return super.deploy(overrides || {}) as Promise<DemoTest>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DemoTest {
    return super.attach(address) as DemoTest;
  }
  connect(signer: Signer): DemoTest__factory {
    return super.connect(signer) as DemoTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DemoTestInterface {
    return new utils.Interface(_abi) as DemoTestInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DemoTest {
    return new Contract(address, _abi, signerOrProvider) as DemoTest;
  }
}
