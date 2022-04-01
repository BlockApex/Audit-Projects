/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { SwapRouter, SwapRouterInterface } from "../SwapRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_WETH9",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "WETH9",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "path",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutMinimum",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapRouter.ExactInputParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutMinimum",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct ISwapRouter.ExactInputSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "path",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountInMaximum",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapRouter.ExactOutputParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountInMaximum",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct ISwapRouter.ExactOutputSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactOutputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
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
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "refundETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "selfPermit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "selfPermitAllowed",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "selfPermitAllowedIfNecessary",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "selfPermitIfNecessary",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "sweepToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
    ],
    name: "sweepTokenWithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "amount0Delta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "amount1Delta",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "unwrapWETH9",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address",
      },
    ],
    name: "unwrapWETH9WithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60c06040526000196000553480156200001757600080fd5b5060405162002733380380620027338339810160408190526200003a9162000076565b6001600160601b0319606092831b8116608052911b1660a052620000ad565b80516001600160a01b03811681146200007157600080fd5b919050565b6000806040838503121562000089578182fd5b620000948362000059565b9150620000a46020840162000059565b90509250929050565b60805160601c60a05160601c61262b620001086000398060e252806104975280610582528061060f528061064f528061073a52806116f0528061173652806117aa525080610b72528061106d5280611885525061262b6000f3fe6080604052600436106100d25760003560e01c806312210e8a14610147578063414bf3891461014f5780634659a4941461017857806349404b7c1461018b5780634aa4a4fc1461019e5780639b2c0a37146101c0578063a4a78f0c146101d3578063ac9650d8146101e6578063c04b8d5914610206578063c2e3140a14610219578063c45a01551461022c578063db3e219814610241578063df2ab5bb14610254578063e0e189a014610267578063f28c04981461027a578063f3995c671461028d578063fa461e33146102a057610142565b3661014257336001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610140576040805162461bcd60e51b81526020600482015260096024820152684e6f7420574554483960b81b604482015290519081900360640190fd5b005b600080fd5b6101406102c0565b61016261015d3660046121f0565b6102d2565b60405161016f9190612542565b60405180910390f35b610140610186366004611f72565b6103f9565b6101406101993660046122f5565b610493565b3480156101aa57600080fd5b506101b361060d565b60405161016f91906123df565b6101406101ce366004612324565b610631565b6101406101e1366004611f72565b6107fd565b6101f96101f4366004611fd2565b61088e565b60405161016f9190612439565b610162610214366004612146565b6109cd565b610140610227366004611f72565b610ae1565b34801561023857600080fd5b506101b3610b70565b61016261024f3660046121f0565b610b94565b610140610262366004611ed3565b610cbb565b610140610275366004611f14565b610d99565b61016261028836600461220c565b610ec0565b61014061029b366004611f72565b610fb6565b3480156102ac57600080fd5b506101406102bb366004612063565b611028565b47156102d0576102d0334761113b565b565b60008160800135806102e261122a565b111561032b576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b6103c460a08401356103436080860160608701611eb0565b610354610100870160e08801611eb0565b604080518082019091528061036c60208a018a611eb0565b61037c60608b0160408c016122d2565b61038c60408c0160208d01611eb0565b60405160200161039e93929190612399565b6040516020818303038152906040528152602001336001600160a01b031681525061122e565b91508260c001358210156103f35760405162461bcd60e51b81526004016103ea906124d8565b60405180910390fd5b50919050565b604080516323f2ebc360e21b815233600482015230602482015260448101879052606481018690526001608482015260ff851660a482015260c4810184905260e4810183905290516001600160a01b03881691638fcbaf0c9161010480830192600092919082900301818387803b15801561047357600080fd5b505af1158015610487573d6000803e3d6000fd5b50505050505050505050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561050257600080fd5b505afa158015610516573d6000803e3d6000fd5b505050506040513d602081101561052c57600080fd5b505190508281101561057a576040805162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e7420574554483960701b604482015290519081900360640190fd5b8015610608577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b1580156105e657600080fd5b505af11580156105fa573d6000803e3d6000fd5b50505050610608828261113b565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600082118015610642575060648211155b61064b57600080fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156106ba57600080fd5b505afa1580156106ce573d6000803e3d6000fd5b505050506040513d60208110156106e457600080fd5b5051905084811015610732576040805162461bcd60e51b8152602060048201526012602482015271496e73756666696369656e7420574554483960701b604482015290519081900360640190fd5b80156107f6577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d826040518263ffffffff1660e01b815260040180828152602001915050600060405180830381600087803b15801561079e57600080fd5b505af11580156107b2573d6000803e3d6000fd5b5050505060006127106107ce858461138090919063ffffffff16565b816107d557fe5b04905080156107e8576107e8838261113b565b6107f48582840361113b565b505b5050505050565b60408051636eb1769f60e11b81523360048201523060248201529051600019916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b15801561084e57600080fd5b505afa158015610862573d6000803e3d6000fd5b505050506040513d602081101561087857600080fd5b505110156107f4576107f48686868686866103f9565b6060816001600160401b03811180156108a657600080fd5b506040519080825280602002602001820160405280156108da57816020015b60608152602001906001900390816108c55790505b50905060005b828110156109c657600080308686858181106108f857fe5b905060200281019061090a919061254b565b6040516109189291906123cf565b600060405180830381855af49150503d8060008114610953576040519150601f19603f3d011682016040523d82523d6000602084013e610958565b606091505b5091509150816109a45760448151101561097157600080fd5b6004810190508080602001905181019061098b91906120dd565b60405162461bcd60e51b81526004016103ea9190612499565b808484815181106109b157fe5b602090810291909101015250506001016108e0565b5092915050565b60008160400151806109dd61122a565b1115610a26576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b335b6000610a3785600001516113aa565b9050610a83856060015182610a50578660200151610a52565b305b60006040518060400160405280610a6c8b600001516113b6565b8152602001876001600160a01b031681525061122e565b60608601528015610aa3578451309250610a9c906113c5565b8552610ab0565b8460600151935050610ab6565b50610a28565b8360800151831015610ada5760405162461bcd60e51b81526004016103ea906124d8565b5050919050565b60408051636eb1769f60e11b8152336004820152306024820152905186916001600160a01b0389169163dd62ed3e91604480820192602092909190829003018186803b158015610b3057600080fd5b505afa158015610b44573d6000803e3d6000fd5b505050506040513d6020811015610b5a57600080fd5b505110156107f4576107f4868686868686610fb6565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000816080013580610ba461122a565b1115610bed576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b610c8960a0840135610c056080860160608701611eb0565b610c16610100870160e08801611eb0565b6040518060400160405280886020016020810190610c349190611eb0565b610c4460608b0160408c016122d2565b610c5160208c018c611eb0565b604051602001610c6393929190612399565b6040516020818303038152906040528152602001336001600160a01b03168152506113dc565b91508260c00135821115610caf5760405162461bcd60e51b81526004016103ea906124ac565b50600019600055919050565b6000836001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015610d0a57600080fd5b505afa158015610d1e573d6000803e3d6000fd5b505050506040513d6020811015610d3457600080fd5b5051905082811015610d82576040805162461bcd60e51b815260206004820152601260248201527124b739bab33334b1b4b2b73a103a37b5b2b760711b604482015290519081900360640190fd5b8015610d9357610d93848383611557565b50505050565b600082118015610daa575060648211155b610db357600080fd5b6000856001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015610e0257600080fd5b505afa158015610e16573d6000803e3d6000fd5b505050506040513d6020811015610e2c57600080fd5b5051905084811015610e7a576040805162461bcd60e51b815260206004820152601260248201527124b739bab33334b1b4b2b73a103a37b5b2b760711b604482015290519081900360640190fd5b80156107f4576000612710610e8f8386611380565b81610e9657fe5b0490508015610eaa57610eaa878483611557565b610eb78786838503611557565b50505050505050565b6000816040013580610ed061122a565b1115610f19576040805162461bcd60e51b8152602060048201526013602482015272151c985b9cd858dd1a5bdb881d1bdbc81bdb19606a1b604482015290519081900360640190fd5b610f8c6060840135610f316040860160208701611eb0565b6040805180820190915260009080610f49898061254b565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505090825250336020909101526113dc565b5060005491508260800135821115610caf5760405162461bcd60e51b81526004016103ea906124ac565b6040805163d505accf60e01b8152336004820152306024820152604481018790526064810186905260ff8516608482015260a4810184905260c4810183905290516001600160a01b0388169163d505accf9160e480830192600092919082900301818387803b15801561047357600080fd5b60008413806110375750600083135b61104057600080fd5b600061104e82840184612243565b90506000806000611062846000015161169e565b9250925092506110947f00000000000000000000000000000000000000000000000000000000000000008484846116cf565b5060008060008a136110bb57846001600160a01b0316846001600160a01b031610896110d2565b836001600160a01b0316856001600160a01b0316108a5b9150915081156110f1576110ec85876020015133846116ee565b610487565b85516110fc906113aa565b1561112157855161110c906113c5565b865261111b81336000896113dc565b50610487565b8060008190555083945061048785876020015133846116ee565b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b602083106111875780518252601f199092019160209182019101611168565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146111e9576040519150601f19603f3d011682016040523d82523d6000602084013e6111ee565b606091505b5050905080610608576040805162461bcd60e51b815260206004820152600360248201526253544560e81b604482015290519081900360640190fd5b4290565b60006001600160a01b038416611242573093505b6000806000611254856000015161169e565b919450925090506001600160a01b038083169084161060008061127886868661187e565b6001600160a01b031663128acb088b856112918f6118bc565b6001600160a01b038e16156112a6578d6112cc565b876112c55773fffd8963efd1fc6a506488495d951d5263988d256112cc565b6401000276a45b8d6040516020016112dd9190612505565b6040516020818303038152906040526040518663ffffffff1660e01b815260040161130c9594939291906123f3565b6040805180830381600087803b15801561132557600080fd5b505af1158015611339573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061135d9190612040565b915091508261136c578161136e565b805b6000039b9a5050505050505050505050565b600082158061139b5750508181028183828161139857fe5b04145b6113a457600080fd5b92915050565b8051604211155b919050565b60606113a4826000602b6118d2565b80516060906113a4908390601790601619016118d2565b60006001600160a01b0384166113f0573093505b6000806000611402856000015161169e565b919450925090506001600160a01b038084169083161060008061142685878661187e565b6001600160a01b031663128acb088b8561143f8f6118bc565b6000036001600160a01b038e1615611457578d61147d565b876114765773fffd8963efd1fc6a506488495d951d5263988d2561147d565b6401000276a45b8d60405160200161148e9190612505565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016114bd9594939291906123f3565b6040805180830381600087803b1580156114d657600080fd5b505af11580156114ea573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061150e9190612040565b91509150600083611523578183600003611529565b82826000035b90985090506001600160a01b038a16611548578b811461154857600080fd5b50505050505050949350505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b1781529251825160009485949389169392918291908083835b602083106115d35780518252601f1990920191602091820191016115b4565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611635576040519150601f19603f3d011682016040523d82523d6000602084013e61163a565b606091505b5091509150818015611668575080511580611668575080806020019051602081101561166557600080fd5b50515b6107f6576040805162461bcd60e51b815260206004820152600260248201526114d560f21b604482015290519081900360640190fd5b600080806116ac8482611a23565b92506116b9846014611ad3565b90506116c6846017611a23565b91509193909250565b60006116e5856116e0868686611b7a565b611bd0565b95945050505050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316846001600160a01b031614801561172f5750804710155b15611851577f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b15801561178f57600080fd5b505af11580156117a3573d6000803e3d6000fd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb83836040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561181f57600080fd5b505af1158015611833573d6000803e3d6000fd5b505050506040513d602081101561184957600080fd5b50610d939050565b6001600160a01b0383163014156118725761186d848383611557565b610d93565b610d9384848484611bf3565b60006118b47f00000000000000000000000000000000000000000000000000000000000000006118af868686611b7a565b611d43565b949350505050565b6000600160ff1b82106118ce57600080fd5b5090565b60608182601f01101561191d576040805162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b604482015290519081900360640190fd5b828284011015611965576040805162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b604482015290519081900360640190fd5b818301845110156119b1576040805162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b604482015290519081900360640190fd5b6060821580156119d05760405191506000825260208201604052611a1a565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015611a095780518352602092830192016119f1565b5050858452601f01601f1916604052505b50949350505050565b600081826014011015611a72576040805162461bcd60e51b8152602060048201526012602482015271746f416464726573735f6f766572666c6f7760701b604482015290519081900360640190fd5b8160140183511015611ac3576040805162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b604482015290519081900360640190fd5b500160200151600160601b900490565b600081826003011015611b21576040805162461bcd60e51b8152602060048201526011602482015270746f55696e7432345f6f766572666c6f7760781b604482015290519081900360640190fd5b8160030183511015611b71576040805162461bcd60e51b8152602060048201526014602482015273746f55696e7432345f6f75744f66426f756e647360601b604482015290519081900360640190fd5b50016003015190565b611b82611e22565b826001600160a01b0316846001600160a01b03161115611ba0579192915b50604080516060810182526001600160a01b03948516815292909316602083015262ffffff169181019190915290565b6000611bdc8383611d43565b9050336001600160a01b038216146113a457600080fd5b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b178152925182516000948594938a169392918291908083835b60208310611c775780518252601f199092019160209182019101611c58565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114611cd9576040519150601f19603f3d011682016040523d82523d6000602084013e611cde565b606091505b5091509150818015611d0c575080511580611d0c5750808060200190516020811015611d0957600080fd5b50515b6107f4576040805162461bcd60e51b815260206004820152600360248201526229aa2360e91b604482015290519081900360640190fd5b600081602001516001600160a01b031682600001516001600160a01b031610611d6b57600080fd5b50805160208083015160409384015184516001600160a01b0394851681850152939091168385015262ffffff166060808401919091528351808403820181526080840185528051908301206001600160f81b031960a085015294901b6001600160601b03191660a183015260b58201939093527fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5460d5808301919091528251808303909101815260f5909101909152805191012090565b604080516060810182526000808252602082018190529181019190915290565b80356113b181612606565b600082601f830112611e5d578081fd5b8135611e70611e6b826125b9565b612596565b818152846020838601011115611e84578283fd5b816020850160208301379081016020019190915292915050565b600061010082840312156103f3578081fd5b600060208284031215611ec1578081fd5b8135611ecc81612606565b9392505050565b600080600060608486031215611ee7578182fd5b8335611ef281612606565b9250602084013591506040840135611f0981612606565b809150509250925092565b600080600080600060a08688031215611f2b578081fd5b8535611f3681612606565b9450602086013593506040860135611f4d81612606565b9250606086013591506080860135611f6481612606565b809150509295509295909350565b60008060008060008060c08789031215611f8a578081fd5b8635611f9581612606565b95506020870135945060408701359350606087013560ff81168114611fb8578182fd5b9598949750929560808101359460a0909101359350915050565b60008060208385031215611fe4578182fd5b82356001600160401b0380821115611ffa578384fd5b818501915085601f83011261200d578384fd5b81358181111561201b578485fd5b866020808302850101111561202e578485fd5b60209290920196919550909350505050565b60008060408385031215612052578182fd5b505080516020909101519092909150565b60008060008060608587031215612078578182fd5b843593506020850135925060408501356001600160401b038082111561209c578384fd5b818701915087601f8301126120af578384fd5b8135818111156120bd578485fd5b8860208285010111156120ce578485fd5b95989497505060200194505050565b6000602082840312156120ee578081fd5b81516001600160401b03811115612103578182fd5b8201601f81018413612113578182fd5b8051612121611e6b826125b9565b818152856020838501011115612135578384fd5b6116e58260208301602086016125da565b600060208284031215612157578081fd5b81356001600160401b038082111561216d578283fd5b9083019060a08286031215612180578283fd5b60405160a08101818110838211171561219557fe5b6040528235828111156121a6578485fd5b6121b287828601611e4d565b8252506121c160208401611e42565b602082015260408301356040820152606083013560608201526080830135608082015280935050505092915050565b60006101008284031215612202578081fd5b611ecc8383611e9e565b60006020828403121561221d578081fd5b81356001600160401b03811115612232578182fd5b820160a08185031215611ecc578182fd5b600060208284031215612254578081fd5b81356001600160401b038082111561226a578283fd5b908301906040828603121561227d578283fd5b60405160408101818110838211171561229257fe5b6040528235828111156122a3578485fd5b6122af87828601611e4d565b825250602083013592506122c283612606565b6020810192909252509392505050565b6000602082840312156122e3578081fd5b813562ffffff81168114611ecc578182fd5b60008060408385031215612307578182fd5b82359150602083013561231981612606565b809150509250929050565b60008060008060808587031215612339578182fd5b84359350602085013561234b81612606565b925060408501359150606085013561236281612606565b939692955090935050565b600081518084526123858160208601602086016125da565b601f01601f19169290920160200192915050565b606093841b6001600160601b0319908116825260e89390931b6001600160e81b0319166014820152921b166017820152602b0190565b6000828483379101908152919050565b6001600160a01b0391909116815260200190565b6001600160a01b0386811682528515156020830152604082018590528316606082015260a06080820181905260009061242e9083018461236d565b979650505050505050565b6000602080830181845280855180835260408601915060408482028701019250838701855b8281101561248c57603f1988860301845261247a85835161236d565b9450928501929085019060010161245e565b5092979650505050505050565b600060208252611ecc602083018461236d565b602080825260129082015271151bdbc81b5d58da081c995c5d595cdd195960721b604082015260600190565b602080825260139082015272151bdbc81b1a5d1d1b19481c9958d95a5d9959606a1b604082015260600190565b600060208252825160406020840152612521606084018261236d565b602094909401516001600160a01b0316604093909301929092525090919050565b90815260200190565b6000808335601e19843603018112612561578283fd5b8301803591506001600160401b0382111561257a578283fd5b60200191503681900382131561258f57600080fd5b9250929050565b6040518181016001600160401b03811182821017156125b157fe5b604052919050565b60006001600160401b038211156125cc57fe5b50601f01601f191660200190565b60005b838110156125f55781810151838201526020016125dd565b83811115610d935750506000910152565b6001600160a01b038116811461261b57600080fd5b5056fea164736f6c6343000706000a";

type SwapRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SwapRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SwapRouter__factory extends ContractFactory {
  constructor(...args: SwapRouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    _factory: string,
    _WETH9: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SwapRouter> {
    return super.deploy(
      _factory,
      _WETH9,
      overrides || {}
    ) as Promise<SwapRouter>;
  }
  getDeployTransaction(
    _factory: string,
    _WETH9: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_factory, _WETH9, overrides || {});
  }
  attach(address: string): SwapRouter {
    return super.attach(address) as SwapRouter;
  }
  connect(signer: Signer): SwapRouter__factory {
    return super.connect(signer) as SwapRouter__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SwapRouterInterface {
    return new utils.Interface(_abi) as SwapRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SwapRouter {
    return new Contract(address, _abi, signerOrProvider) as SwapRouter;
  }
}