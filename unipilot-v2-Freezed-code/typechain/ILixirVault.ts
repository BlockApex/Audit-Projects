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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ILixirVaultInterface extends utils.Interface {
  functions: {
    "activeFee()": FunctionFragment;
    "activePool()": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "calculateTotals()": FunctionFragment;
    "calculateTotalsFromTick(int24)": FunctionFragment;
    "deposit(uint256,uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "initialize(string,string,address,address,address,address,address)": FunctionFragment;
    "keeper()": FunctionFragment;
    "mainPosition()": FunctionFragment;
    "performanceFee()": FunctionFragment;
    "rangePosition()": FunctionFragment;
    "rebalance(int24,int24,int24,int24,int24,int24,uint24)": FunctionFragment;
    "setKeeper(address)": FunctionFragment;
    "setPerformanceFee(uint24)": FunctionFragment;
    "setStrategist(address)": FunctionFragment;
    "setStrategy(address)": FunctionFragment;
    "strategist()": FunctionFragment;
    "strategy()": FunctionFragment;
    "token0()": FunctionFragment;
    "token1()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "withdraw(uint256,uint256,uint256,address,uint256)": FunctionFragment;
    "withdrawFrom(address,uint256,uint256,uint256,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "activeFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "activePool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "calculateTotals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateTotalsFromTick",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string, string, string]
  ): string;
  encodeFunctionData(functionFragment: "keeper", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mainPosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "performanceFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rangePosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rebalance",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(functionFragment: "setKeeper", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setPerformanceFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrategist",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "setStrategy", values: [string]): string;
  encodeFunctionData(
    functionFragment: "strategist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "strategy", values?: undefined): string;
  encodeFunctionData(functionFragment: "token0", values?: undefined): string;
  encodeFunctionData(functionFragment: "token1", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, BigNumberish, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFrom",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(functionFragment: "activeFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "activePool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calculateTotals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateTotalsFromTick",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "keeper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "mainPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "performanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rangePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rebalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setKeeper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPerformanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrategy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "strategist", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "strategy", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token0", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token1", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFrom",
    data: BytesLike
  ): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  { owner: string; spender: string; value: BigNumber }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; value: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface ILixirVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILixirVaultInterface;

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
    activeFee(overrides?: CallOverrides): Promise<[number]>;

    activePool(overrides?: CallOverrides): Promise<[string]>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    calculateTotals(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        total0: BigNumber;
        total1: BigNumber;
        mL: BigNumber;
        rL: BigNumber;
      }
    >;

    calculateTotalsFromTick(
      virtualTick: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        total0: BigNumber;
        total1: BigNumber;
        mL: BigNumber;
        rL: BigNumber;
      }
    >;

    deposit(
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      name: string,
      symbol: string,
      _token0: string,
      _token1: string,
      _strategist: string,
      _keeper: string,
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    keeper(overrides?: CallOverrides): Promise<[string]>;

    mainPosition(
      overrides?: CallOverrides
    ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

    performanceFee(overrides?: CallOverrides): Promise<[number]>;

    rangePosition(
      overrides?: CallOverrides
    ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

    rebalance(
      mainTickLower: BigNumberish,
      mainTickUpper: BigNumberish,
      rangeTickLower0: BigNumberish,
      rangeTickUpper0: BigNumberish,
      rangeTickLower1: BigNumberish,
      rangeTickUpper1: BigNumberish,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setKeeper(
      _keeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPerformanceFee(
      newFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setStrategist(
      _strategist: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    strategist(overrides?: CallOverrides): Promise<[string]>;

    strategy(overrides?: CallOverrides): Promise<[string]>;

    token0(overrides?: CallOverrides): Promise<[string]>;

    token1(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      receiver: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFrom(
      withdrawer: string,
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  activeFee(overrides?: CallOverrides): Promise<number>;

  activePool(overrides?: CallOverrides): Promise<string>;

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  calculateTotals(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      total0: BigNumber;
      total1: BigNumber;
      mL: BigNumber;
      rL: BigNumber;
    }
  >;

  calculateTotalsFromTick(
    virtualTick: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      total0: BigNumber;
      total1: BigNumber;
      mL: BigNumber;
      rL: BigNumber;
    }
  >;

  deposit(
    amount0Desired: BigNumberish,
    amount1Desired: BigNumberish,
    amount0Min: BigNumberish,
    amount1Min: BigNumberish,
    recipient: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    name: string,
    symbol: string,
    _token0: string,
    _token1: string,
    _strategist: string,
    _keeper: string,
    _strategy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  keeper(overrides?: CallOverrides): Promise<string>;

  mainPosition(
    overrides?: CallOverrides
  ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

  performanceFee(overrides?: CallOverrides): Promise<number>;

  rangePosition(
    overrides?: CallOverrides
  ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

  rebalance(
    mainTickLower: BigNumberish,
    mainTickUpper: BigNumberish,
    rangeTickLower0: BigNumberish,
    rangeTickUpper0: BigNumberish,
    rangeTickLower1: BigNumberish,
    rangeTickUpper1: BigNumberish,
    fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setKeeper(
    _keeper: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPerformanceFee(
    newFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setStrategist(
    _strategist: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setStrategy(
    _strategy: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  strategist(overrides?: CallOverrides): Promise<string>;

  strategy(overrides?: CallOverrides): Promise<string>;

  token0(overrides?: CallOverrides): Promise<string>;

  token1(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    shares: BigNumberish,
    amount0Min: BigNumberish,
    amount1Min: BigNumberish,
    receiver: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFrom(
    withdrawer: string,
    shares: BigNumberish,
    amount0Min: BigNumberish,
    amount1Min: BigNumberish,
    recipient: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    activeFee(overrides?: CallOverrides): Promise<number>;

    activePool(overrides?: CallOverrides): Promise<string>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    calculateTotals(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        total0: BigNumber;
        total1: BigNumber;
        mL: BigNumber;
        rL: BigNumber;
      }
    >;

    calculateTotalsFromTick(
      virtualTick: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        total0: BigNumber;
        total1: BigNumber;
        mL: BigNumber;
        rL: BigNumber;
      }
    >;

    deposit(
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        shares: BigNumber;
        amount0: BigNumber;
        amount1: BigNumber;
      }
    >;

    initialize(
      name: string,
      symbol: string,
      _token0: string,
      _token1: string,
      _strategist: string,
      _keeper: string,
      _strategy: string,
      overrides?: CallOverrides
    ): Promise<void>;

    keeper(overrides?: CallOverrides): Promise<string>;

    mainPosition(
      overrides?: CallOverrides
    ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

    performanceFee(overrides?: CallOverrides): Promise<number>;

    rangePosition(
      overrides?: CallOverrides
    ): Promise<[number, number] & { tickLower: number; tickUpper: number }>;

    rebalance(
      mainTickLower: BigNumberish,
      mainTickUpper: BigNumberish,
      rangeTickLower0: BigNumberish,
      rangeTickUpper0: BigNumberish,
      rangeTickLower1: BigNumberish,
      rangeTickUpper1: BigNumberish,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setKeeper(_keeper: string, overrides?: CallOverrides): Promise<void>;

    setPerformanceFee(
      newFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategist(
      _strategist: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrategy(_strategy: string, overrides?: CallOverrides): Promise<void>;

    strategist(overrides?: CallOverrides): Promise<string>;

    strategy(overrides?: CallOverrides): Promise<string>;

    token0(overrides?: CallOverrides): Promise<string>;

    token1(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    withdraw(
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      receiver: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0Out: BigNumber; amount1Out: BigNumber }
    >;

    withdrawFrom(
      withdrawer: string,
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0Out: BigNumber; amount1Out: BigNumber }
    >;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
  };

  estimateGas: {
    activeFee(overrides?: CallOverrides): Promise<BigNumber>;

    activePool(overrides?: CallOverrides): Promise<BigNumber>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    calculateTotals(overrides?: CallOverrides): Promise<BigNumber>;

    calculateTotalsFromTick(
      virtualTick: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      name: string,
      symbol: string,
      _token0: string,
      _token1: string,
      _strategist: string,
      _keeper: string,
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    keeper(overrides?: CallOverrides): Promise<BigNumber>;

    mainPosition(overrides?: CallOverrides): Promise<BigNumber>;

    performanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    rangePosition(overrides?: CallOverrides): Promise<BigNumber>;

    rebalance(
      mainTickLower: BigNumberish,
      mainTickUpper: BigNumberish,
      rangeTickLower0: BigNumberish,
      rangeTickUpper0: BigNumberish,
      rangeTickLower1: BigNumberish,
      rangeTickUpper1: BigNumberish,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setKeeper(
      _keeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPerformanceFee(
      newFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setStrategist(
      _strategist: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    strategist(overrides?: CallOverrides): Promise<BigNumber>;

    strategy(overrides?: CallOverrides): Promise<BigNumber>;

    token0(overrides?: CallOverrides): Promise<BigNumber>;

    token1(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      receiver: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFrom(
      withdrawer: string,
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    activeFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    activePool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateTotals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    calculateTotalsFromTick(
      virtualTick: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      name: string,
      symbol: string,
      _token0: string,
      _token1: string,
      _strategist: string,
      _keeper: string,
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    keeper(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mainPosition(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    performanceFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rangePosition(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rebalance(
      mainTickLower: BigNumberish,
      mainTickUpper: BigNumberish,
      rangeTickLower0: BigNumberish,
      rangeTickUpper0: BigNumberish,
      rangeTickLower1: BigNumberish,
      rangeTickUpper1: BigNumberish,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setKeeper(
      _keeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPerformanceFee(
      newFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setStrategist(
      _strategist: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setStrategy(
      _strategy: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    strategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    strategy(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token0(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      receiver: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFrom(
      withdrawer: string,
      shares: BigNumberish,
      amount0Min: BigNumberish,
      amount1Min: BigNumberish,
      recipient: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
