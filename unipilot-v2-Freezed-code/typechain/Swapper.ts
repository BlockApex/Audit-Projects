/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface SwapperInterface extends utils.Interface {
  functions: {
    "poolFee()": FunctionFragment;
    "swapExactInputSingle(uint256,address,address,uint24)": FunctionFragment;
    "swapRouter()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "poolFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapExactInputSingle",
    values: [BigNumberish, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapRouter",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "poolFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapExactInputSingle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "swapRouter", data: BytesLike): Result;

  events: {};
}

export interface Swapper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SwapperInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    poolFee(overrides?: CallOverrides): Promise<[number]>;

    swapExactInputSingle(
      amountIn: BigNumberish,
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapRouter(overrides?: CallOverrides): Promise<[string]>;
  };

  poolFee(overrides?: CallOverrides): Promise<number>;

  swapExactInputSingle(
    amountIn: BigNumberish,
    _token0: string,
    _token1: string,
    _fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapRouter(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    poolFee(overrides?: CallOverrides): Promise<number>;

    swapExactInputSingle(
      amountIn: BigNumberish,
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapRouter(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    poolFee(overrides?: CallOverrides): Promise<BigNumber>;

    swapExactInputSingle(
      amountIn: BigNumberish,
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapRouter(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    poolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapExactInputSingle(
      amountIn: BigNumberish,
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
