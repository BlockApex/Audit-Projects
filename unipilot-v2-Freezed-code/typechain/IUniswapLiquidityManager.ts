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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type LiquidityPositionStruct = {
  baseTickLower: BigNumberish;
  baseTickUpper: BigNumberish;
  baseLiquidity: BigNumberish;
  rangeTickLower: BigNumberish;
  rangeTickUpper: BigNumberish;
  rangeLiquidity: BigNumberish;
  fees0: BigNumberish;
  fees1: BigNumberish;
  feeGrowthGlobal0: BigNumberish;
  feeGrowthGlobal1: BigNumberish;
  totalLiquidity: BigNumberish;
  feesInPilot: boolean;
  oracle0: string;
  oracle1: string;
  timestamp: BigNumberish;
  counter: BigNumberish;
  status: boolean;
  managed: boolean;
};

export type LiquidityPositionStructOutput = [
  number,
  number,
  BigNumber,
  number,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean,
  string,
  string,
  BigNumber,
  number,
  boolean,
  boolean
] & {
  baseTickLower: number;
  baseTickUpper: number;
  baseLiquidity: BigNumber;
  rangeTickLower: number;
  rangeTickUpper: number;
  rangeLiquidity: BigNumber;
  fees0: BigNumber;
  fees1: BigNumber;
  feeGrowthGlobal0: BigNumber;
  feeGrowthGlobal1: BigNumber;
  totalLiquidity: BigNumber;
  feesInPilot: boolean;
  oracle0: string;
  oracle1: string;
  timestamp: BigNumber;
  counter: number;
  status: boolean;
  managed: boolean;
};

export type PositionStruct = {
  nonce: BigNumberish;
  pool: string;
  liquidity: BigNumberish;
  feeGrowth0: BigNumberish;
  feeGrowth1: BigNumberish;
  tokensOwed0: BigNumberish;
  tokensOwed1: BigNumberish;
};

export type PositionStructOutput = [
  BigNumber,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  nonce: BigNumber;
  pool: string;
  liquidity: BigNumber;
  feeGrowth0: BigNumber;
  feeGrowth1: BigNumber;
  tokensOwed0: BigNumber;
  tokensOwed1: BigNumber;
};

export interface IUniswapLiquidityManagerInterface extends utils.Interface {
  functions: {
    "collect(bool,bool,uint256,bytes)": FunctionFragment;
    "createPair(address,address,bytes)": FunctionFragment;
    "deposit(address,address,uint256,uint256,uint256,uint256,bool,bytes)": FunctionFragment;
    "getReserves(address,address,bytes)": FunctionFragment;
    "poolPositions(address)": FunctionFragment;
    "uniswapV3MintCallback(uint256,uint256,bytes)": FunctionFragment;
    "uniswapV3SwapCallback(int256,int256,bytes)": FunctionFragment;
    "updatePositionTotalAmounts(address)": FunctionFragment;
    "userPositions(uint256)": FunctionFragment;
    "withdraw(bool,bool,uint256,uint256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "collect",
    values: [boolean, boolean, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createPair",
    values: [string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getReserves",
    values: [string, string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "poolPositions",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV3MintCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV3SwapCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePositionTotalAmounts",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userPositions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [boolean, boolean, BigNumberish, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReserves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "poolPositions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV3MintCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV3SwapCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updatePositionTotalAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userPositions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Collect(uint256,uint256,uint256,uint256,address,address)": EventFragment;
    "Deposited(address,uint256,uint256,uint256,uint256)": EventFragment;
    "PoolCreated(address,address,address,uint24,uint160)": EventFragment;
    "PoolReajusted(address,uint128,uint128,int24,int24,int24,int24)": EventFragment;
    "Withdrawn(address,address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Collect"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolReajusted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export type CollectEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, string, string],
  {
    tokenId: BigNumber;
    userAmount0: BigNumber;
    userAmount1: BigNumber;
    pilotAmount: BigNumber;
    pool: string;
    recipient: string;
  }
>;

export type CollectEventFilter = TypedEventFilter<CollectEvent>;

export type DepositedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber],
  {
    pool: string;
    tokenId: BigNumber;
    amount0: BigNumber;
    amount1: BigNumber;
    liquidity: BigNumber;
  }
>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

export type PoolCreatedEvent = TypedEvent<
  [string, string, string, number, BigNumber],
  {
    token0: string;
    token1: string;
    pool: string;
    fee: number;
    sqrtPriceX96: BigNumber;
  }
>;

export type PoolCreatedEventFilter = TypedEventFilter<PoolCreatedEvent>;

export type PoolReajustedEvent = TypedEvent<
  [string, BigNumber, BigNumber, number, number, number, number],
  {
    pool: string;
    baseLiquidity: BigNumber;
    rangeLiquidity: BigNumber;
    newBaseTickLower: number;
    newBaseTickUpper: number;
    newRangeTickLower: number;
    newRangeTickUpper: number;
  }
>;

export type PoolReajustedEventFilter = TypedEventFilter<PoolReajustedEvent>;

export type WithdrawnEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber],
  {
    pool: string;
    recipient: string;
    tokenId: BigNumber;
    amount0: BigNumber;
    amount1: BigNumber;
  }
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface IUniswapLiquidityManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IUniswapLiquidityManagerInterface;

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
    collect(
      pilotToken: boolean,
      wethToken: boolean,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createPair(
      _token0: string,
      _token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposit(
      token0: string,
      token1: string,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      shares: BigNumberish,
      tokenId: BigNumberish,
      isTokenMinted: boolean,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getReserves(
      token0: string,
      token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    poolPositions(
      pool: string,
      overrides?: CallOverrides
    ): Promise<[LiquidityPositionStructOutput]>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updatePositionTotalAmounts(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amount0: BigNumber;
        amount1: BigNumber;
        totalLiquidity: BigNumber;
      }
    >;

    userPositions(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[PositionStructOutput]>;

    withdraw(
      pilotToken: boolean,
      wethToken: boolean,
      liquidity: BigNumberish,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  collect(
    pilotToken: boolean,
    wethToken: boolean,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createPair(
    _token0: string,
    _token1: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposit(
    token0: string,
    token1: string,
    amount0Desired: BigNumberish,
    amount1Desired: BigNumberish,
    shares: BigNumberish,
    tokenId: BigNumberish,
    isTokenMinted: boolean,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getReserves(
    token0: string,
    token1: string,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  poolPositions(
    pool: string,
    overrides?: CallOverrides
  ): Promise<LiquidityPositionStructOutput>;

  uniswapV3MintCallback(
    amount0Owed: BigNumberish,
    amount1Owed: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapV3SwapCallback(
    amount0Delta: BigNumberish,
    amount1Delta: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updatePositionTotalAmounts(
    _pool: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      amount0: BigNumber;
      amount1: BigNumber;
      totalLiquidity: BigNumber;
    }
  >;

  userPositions(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<PositionStructOutput>;

  withdraw(
    pilotToken: boolean,
    wethToken: boolean,
    liquidity: BigNumberish,
    tokenId: BigNumberish,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    collect(
      pilotToken: boolean,
      wethToken: boolean,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    createPair(
      _token0: string,
      _token1: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    deposit(
      token0: string,
      token1: string,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      shares: BigNumberish,
      tokenId: BigNumberish,
      isTokenMinted: boolean,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getReserves(
      token0: string,
      token1: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        totalAmount0: BigNumber;
        totalAmount1: BigNumber;
        totalLiquidity: BigNumber;
      }
    >;

    poolPositions(
      pool: string,
      overrides?: CallOverrides
    ): Promise<LiquidityPositionStructOutput>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    updatePositionTotalAmounts(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amount0: BigNumber;
        amount1: BigNumber;
        totalLiquidity: BigNumber;
      }
    >;

    userPositions(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PositionStructOutput>;

    withdraw(
      pilotToken: boolean,
      wethToken: boolean,
      liquidity: BigNumberish,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Collect(uint256,uint256,uint256,uint256,address,address)"(
      tokenId?: null,
      userAmount0?: null,
      userAmount1?: null,
      pilotAmount?: null,
      pool?: null,
      recipient?: null
    ): CollectEventFilter;
    Collect(
      tokenId?: null,
      userAmount0?: null,
      userAmount1?: null,
      pilotAmount?: null,
      pool?: null,
      recipient?: null
    ): CollectEventFilter;

    "Deposited(address,uint256,uint256,uint256,uint256)"(
      pool?: string | null,
      tokenId?: null,
      amount0?: null,
      amount1?: null,
      liquidity?: null
    ): DepositedEventFilter;
    Deposited(
      pool?: string | null,
      tokenId?: null,
      amount0?: null,
      amount1?: null,
      liquidity?: null
    ): DepositedEventFilter;

    "PoolCreated(address,address,address,uint24,uint160)"(
      token0?: string | null,
      token1?: string | null,
      pool?: string | null,
      fee?: null,
      sqrtPriceX96?: null
    ): PoolCreatedEventFilter;
    PoolCreated(
      token0?: string | null,
      token1?: string | null,
      pool?: string | null,
      fee?: null,
      sqrtPriceX96?: null
    ): PoolCreatedEventFilter;

    "PoolReajusted(address,uint128,uint128,int24,int24,int24,int24)"(
      pool?: null,
      baseLiquidity?: null,
      rangeLiquidity?: null,
      newBaseTickLower?: null,
      newBaseTickUpper?: null,
      newRangeTickLower?: null,
      newRangeTickUpper?: null
    ): PoolReajustedEventFilter;
    PoolReajusted(
      pool?: null,
      baseLiquidity?: null,
      rangeLiquidity?: null,
      newBaseTickLower?: null,
      newBaseTickUpper?: null,
      newRangeTickLower?: null,
      newRangeTickUpper?: null
    ): PoolReajustedEventFilter;

    "Withdrawn(address,address,uint256,uint256,uint256)"(
      pool?: string | null,
      recipient?: string | null,
      tokenId?: null,
      amount0?: null,
      amount1?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      pool?: string | null,
      recipient?: string | null,
      tokenId?: null,
      amount0?: null,
      amount1?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    collect(
      pilotToken: boolean,
      wethToken: boolean,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createPair(
      _token0: string,
      _token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposit(
      token0: string,
      token1: string,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      shares: BigNumberish,
      tokenId: BigNumberish,
      isTokenMinted: boolean,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getReserves(
      token0: string,
      token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    poolPositions(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updatePositionTotalAmounts(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userPositions(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdraw(
      pilotToken: boolean,
      wethToken: boolean,
      liquidity: BigNumberish,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    collect(
      pilotToken: boolean,
      wethToken: boolean,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createPair(
      _token0: string,
      _token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      token0: string,
      token1: string,
      amount0Desired: BigNumberish,
      amount1Desired: BigNumberish,
      shares: BigNumberish,
      tokenId: BigNumberish,
      isTokenMinted: boolean,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getReserves(
      token0: string,
      token1: string,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    poolPositions(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updatePositionTotalAmounts(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userPositions(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdraw(
      pilotToken: boolean,
      wethToken: boolean,
      liquidity: BigNumberish,
      tokenId: BigNumberish,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
