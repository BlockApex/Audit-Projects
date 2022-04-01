/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IUnipilotStakeInterface extends ethers.utils.Interface {
  functions: {
    "getBoostMultiplier(address,address)": FunctionFragment;
    "setVaults(address[])": FunctionFragment;
    "stake(uint256)": FunctionFragment;
    "unStake(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getBoostMultiplier",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "setVaults", values: [string[]]): string;
  encodeFunctionData(functionFragment: "stake", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "unStake",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getBoostMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setVaults", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unStake", data: BytesLike): Result;

  events: {
    "Staked(uint256,address,address)": EventFragment;
    "UnStaked(uint256,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnStaked"): EventFragment;
}

export type StakedEvent = TypedEvent<
  [BigNumber, string, string] & {
    _amount: BigNumber;
    _tokenAddress: string;
    _owner: string;
  }
>;

export type UnStakedEvent = TypedEvent<
  [BigNumber, string, string] & {
    _amount: BigNumber;
    _tokenAddress: string;
    _owner: string;
  }
>;

export class IUnipilotStake extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IUnipilotStakeInterface;

  functions: {
    getBoostMultiplier(
      _vault: string,
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setVaults(
      _vaults: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unStake(
      _share: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getBoostMultiplier(
    _vault: string,
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setVaults(
    _vaults: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unStake(
    _share: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getBoostMultiplier(
      _vault: string,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setVaults(_vaults: string[], overrides?: CallOverrides): Promise<void>;

    stake(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    unStake(_share: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "Staked(uint256,address,address)"(
      _amount?: null,
      _tokenAddress?: string | null,
      _owner?: string | null
    ): TypedEventFilter<
      [BigNumber, string, string],
      { _amount: BigNumber; _tokenAddress: string; _owner: string }
    >;

    Staked(
      _amount?: null,
      _tokenAddress?: string | null,
      _owner?: string | null
    ): TypedEventFilter<
      [BigNumber, string, string],
      { _amount: BigNumber; _tokenAddress: string; _owner: string }
    >;

    "UnStaked(uint256,address,address)"(
      _amount?: null,
      _tokenAddress?: string | null,
      _owner?: string | null
    ): TypedEventFilter<
      [BigNumber, string, string],
      { _amount: BigNumber; _tokenAddress: string; _owner: string }
    >;

    UnStaked(
      _amount?: null,
      _tokenAddress?: string | null,
      _owner?: string | null
    ): TypedEventFilter<
      [BigNumber, string, string],
      { _amount: BigNumber; _tokenAddress: string; _owner: string }
    >;
  };

  estimateGas: {
    getBoostMultiplier(
      _vault: string,
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setVaults(
      _vaults: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unStake(
      _share: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getBoostMultiplier(
      _vault: string,
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setVaults(
      _vaults: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unStake(
      _share: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}