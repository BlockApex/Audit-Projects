/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface IOracleInterface extends utils.Interface {
  functions: {
    "assetToEth(address,address,uint256)": FunctionFragment;
    "ethToAsset(address,address,uint256)": FunctionFragment;
    "getPilotAmount(address,uint256,address)": FunctionFragment;
    "getPilotAmountForTokens(address,address,uint256,uint256,address,address)": FunctionFragment;
    "getPilotAmountWethPair(address,uint256,uint256,address)": FunctionFragment;
    "getPrice(address,address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "assetToEth",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ethToAsset",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPilotAmount",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPilotAmountForTokens",
    values: [string, string, BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPilotAmountWethPair",
    values: [string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPrice",
    values: [string, string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "assetToEth", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ethToAsset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPilotAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPilotAmountForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPilotAmountWethPair",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;

  events: {
    "GovernanceUpdated(address,address)": EventFragment;
    "UniStrategyUpdated(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "GovernanceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UniStrategyUpdated"): EventFragment;
}

export type GovernanceUpdatedEvent = TypedEvent<
  [string, string],
  { governance: string; _governance: string }
>;

export type GovernanceUpdatedEventFilter =
  TypedEventFilter<GovernanceUpdatedEvent>;

export type UniStrategyUpdatedEvent = TypedEvent<
  [string, string],
  { oldStrategy: string; newStrategy: string }
>;

export type UniStrategyUpdatedEventFilter =
  TypedEventFilter<UniStrategyUpdatedEvent>;

export interface IOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOracleInterface;

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
    assetToEth(
      token: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { ethAmountOut: BigNumber }>;

    ethToAsset(
      tokenOut: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountOut: BigNumber }>;

    getPilotAmount(
      token: string,
      amount: BigNumberish,
      pool: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { pilotAmount: BigNumber }>;

    getPilotAmountForTokens(
      token0: string,
      token1: string,
      amount0: BigNumberish,
      amount1: BigNumberish,
      oracle0: string,
      oracle1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { total: BigNumber }>;

    getPilotAmountWethPair(
      tokenAlt: string,
      altAmount: BigNumberish,
      wethAmount: BigNumberish,
      altOracle: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amount: BigNumber }>;

    getPrice(
      tokenA: string,
      tokenB: string,
      pool: string,
      _amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { amountOut: BigNumber }>;
  };

  assetToEth(
    token: string,
    pool: string,
    amountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  ethToAsset(
    tokenOut: string,
    pool: string,
    amountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPilotAmount(
    token: string,
    amount: BigNumberish,
    pool: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPilotAmountForTokens(
    token0: string,
    token1: string,
    amount0: BigNumberish,
    amount1: BigNumberish,
    oracle0: string,
    oracle1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPilotAmountWethPair(
    tokenAlt: string,
    altAmount: BigNumberish,
    wethAmount: BigNumberish,
    altOracle: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPrice(
    tokenA: string,
    tokenB: string,
    pool: string,
    _amountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    assetToEth(
      token: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ethToAsset(
      tokenOut: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmount(
      token: string,
      amount: BigNumberish,
      pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmountForTokens(
      token0: string,
      token1: string,
      amount0: BigNumberish,
      amount1: BigNumberish,
      oracle0: string,
      oracle1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmountWethPair(
      tokenAlt: string,
      altAmount: BigNumberish,
      wethAmount: BigNumberish,
      altOracle: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(
      tokenA: string,
      tokenB: string,
      pool: string,
      _amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "GovernanceUpdated(address,address)"(
      governance?: null,
      _governance?: null
    ): GovernanceUpdatedEventFilter;
    GovernanceUpdated(
      governance?: null,
      _governance?: null
    ): GovernanceUpdatedEventFilter;

    "UniStrategyUpdated(address,address)"(
      oldStrategy?: null,
      newStrategy?: null
    ): UniStrategyUpdatedEventFilter;
    UniStrategyUpdated(
      oldStrategy?: null,
      newStrategy?: null
    ): UniStrategyUpdatedEventFilter;
  };

  estimateGas: {
    assetToEth(
      token: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    ethToAsset(
      tokenOut: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmount(
      token: string,
      amount: BigNumberish,
      pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmountForTokens(
      token0: string,
      token1: string,
      amount0: BigNumberish,
      amount1: BigNumberish,
      oracle0: string,
      oracle1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPilotAmountWethPair(
      tokenAlt: string,
      altAmount: BigNumberish,
      wethAmount: BigNumberish,
      altOracle: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(
      tokenA: string,
      tokenB: string,
      pool: string,
      _amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    assetToEth(
      token: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ethToAsset(
      tokenOut: string,
      pool: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPilotAmount(
      token: string,
      amount: BigNumberish,
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPilotAmountForTokens(
      token0: string,
      token1: string,
      amount0: BigNumberish,
      amount1: BigNumberish,
      oracle0: string,
      oracle1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPilotAmountWethPair(
      tokenAlt: string,
      altAmount: BigNumberish,
      wethAmount: BigNumberish,
      altOracle: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(
      tokenA: string,
      tokenB: string,
      pool: string,
      _amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
