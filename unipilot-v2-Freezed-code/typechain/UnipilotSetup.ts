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

export interface UnipilotSetupInterface extends utils.Interface {
  functions: {
    "Swap(address,address,uint256,uint24,address)": FunctionFragment;
    "depositInVault(address,uint256,uint256,address)": FunctionFragment;
    "getBalanceFromVault(address,address,address)": FunctionFragment;
    "readjustLiquidityForVault(address)": FunctionFragment;
    "setUp(address,address)": FunctionFragment;
    "setupActiveVault(address,address,uint24,uint256,string,string)": FunctionFragment;
    "setupPassiveVault(address,address,uint24,uint256,string,string)": FunctionFragment;
    "uaf()": FunctionFragment;
    "upf()": FunctionFragment;
    "withdrawFromVault(address,uint256,address,bool)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "Swap",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "depositInVault",
    values: [string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getBalanceFromVault",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "readjustLiquidityForVault",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setUp",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setupActiveVault",
    values: [string, string, BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setupPassiveVault",
    values: [string, string, BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "uaf", values?: undefined): string;
  encodeFunctionData(functionFragment: "upf", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdrawFromVault",
    values: [string, BigNumberish, string, boolean]
  ): string;

  decodeFunctionResult(functionFragment: "Swap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositInVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBalanceFromVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "readjustLiquidityForVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setUp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setupActiveVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setupPassiveVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uaf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "upf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFromVault",
    data: BytesLike
  ): Result;

  events: {
    "ReadjustCheck(string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ReadjustCheck"): EventFragment;
}

export type ReadjustCheckEvent = TypedEvent<[string], { msgs: string }>;

export type ReadjustCheckEventFilter = TypedEventFilter<ReadjustCheckEvent>;

export interface UnipilotSetup extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UnipilotSetupInterface;

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
    Swap(
      _token0: string,
      _token1: string,
      _amountIn: BigNumberish,
      _fee: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositInVault(
      _vaultAddr: string,
      _amount0: BigNumberish,
      _amount1: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getBalanceFromVault(
      _vaultAddress: string,
      _token0: string,
      _token1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { balance0: BigNumber; balance1: BigNumber }
    >;

    readjustLiquidityForVault(
      _vaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setUp(
      _governance: string,
      _indexFund: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setupActiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setupPassiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uaf(overrides?: CallOverrides): Promise<[string]>;

    upf(overrides?: CallOverrides): Promise<[string]>;

    withdrawFromVault(
      _vaultAddr: string,
      _liquidity: BigNumberish,
      _recipient: string,
      _refundAsETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  Swap(
    _token0: string,
    _token1: string,
    _amountIn: BigNumberish,
    _fee: BigNumberish,
    _recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositInVault(
    _vaultAddr: string,
    _amount0: BigNumberish,
    _amount1: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getBalanceFromVault(
    _vaultAddress: string,
    _token0: string,
    _token1: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { balance0: BigNumber; balance1: BigNumber }
  >;

  readjustLiquidityForVault(
    _vaultAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setUp(
    _governance: string,
    _indexFund: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setupActiveVault(
    _token0: string,
    _token1: string,
    _fee: BigNumberish,
    spRatio: BigNumberish,
    vaultName: string,
    vaultSymbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setupPassiveVault(
    _token0: string,
    _token1: string,
    _fee: BigNumberish,
    spRatio: BigNumberish,
    vaultName: string,
    vaultSymbol: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uaf(overrides?: CallOverrides): Promise<string>;

  upf(overrides?: CallOverrides): Promise<string>;

  withdrawFromVault(
    _vaultAddr: string,
    _liquidity: BigNumberish,
    _recipient: string,
    _refundAsETH: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    Swap(
      _token0: string,
      _token1: string,
      _amountIn: BigNumberish,
      _fee: BigNumberish,
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    depositInVault(
      _vaultAddr: string,
      _amount0: BigNumberish,
      _amount1: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBalanceFromVault(
      _vaultAddress: string,
      _token0: string,
      _token1: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { balance0: BigNumber; balance1: BigNumber }
    >;

    readjustLiquidityForVault(
      _vaultAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setUp(
      _governance: string,
      _indexFund: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setupActiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: CallOverrides
    ): Promise<string>;

    setupPassiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: CallOverrides
    ): Promise<string>;

    uaf(overrides?: CallOverrides): Promise<string>;

    upf(overrides?: CallOverrides): Promise<string>;

    withdrawFromVault(
      _vaultAddr: string,
      _liquidity: BigNumberish,
      _recipient: string,
      _refundAsETH: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount0: BigNumber; amount1: BigNumber }
    >;
  };

  filters: {
    "ReadjustCheck(string)"(msgs?: null): ReadjustCheckEventFilter;
    ReadjustCheck(msgs?: null): ReadjustCheckEventFilter;
  };

  estimateGas: {
    Swap(
      _token0: string,
      _token1: string,
      _amountIn: BigNumberish,
      _fee: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositInVault(
      _vaultAddr: string,
      _amount0: BigNumberish,
      _amount1: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getBalanceFromVault(
      _vaultAddress: string,
      _token0: string,
      _token1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    readjustLiquidityForVault(
      _vaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setUp(
      _governance: string,
      _indexFund: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setupActiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setupPassiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uaf(overrides?: CallOverrides): Promise<BigNumber>;

    upf(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawFromVault(
      _vaultAddr: string,
      _liquidity: BigNumberish,
      _recipient: string,
      _refundAsETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    Swap(
      _token0: string,
      _token1: string,
      _amountIn: BigNumberish,
      _fee: BigNumberish,
      _recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositInVault(
      _vaultAddr: string,
      _amount0: BigNumberish,
      _amount1: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getBalanceFromVault(
      _vaultAddress: string,
      _token0: string,
      _token1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    readjustLiquidityForVault(
      _vaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setUp(
      _governance: string,
      _indexFund: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setupActiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setupPassiveVault(
      _token0: string,
      _token1: string,
      _fee: BigNumberish,
      spRatio: BigNumberish,
      vaultName: string,
      vaultSymbol: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uaf(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    upf(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawFromVault(
      _vaultAddr: string,
      _liquidity: BigNumberish,
      _recipient: string,
      _refundAsETH: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
