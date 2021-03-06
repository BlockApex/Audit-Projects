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
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface DappingEchidnaInterface extends ethers.utils.Interface {
  functions: {
    "test_APW(uint256,uint32,uint128,uint256,uint256,uint32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "test_APW",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(functionFragment: "test_APW", data: BytesLike): Result;

  events: {
    "log(string)": EventFragment;
    "log_address(address)": EventFragment;
    "log_bytes(bytes)": EventFragment;
    "log_bytes32(bytes32)": EventFragment;
    "log_int(int256)": EventFragment;
    "log_named_address(string,address)": EventFragment;
    "log_named_bytes(string,bytes)": EventFragment;
    "log_named_bytes32(string,bytes32)": EventFragment;
    "log_named_decimal_int(string,int256,uint256)": EventFragment;
    "log_named_decimal_uint(string,uint256,uint256)": EventFragment;
    "log_named_int(string,int256)": EventFragment;
    "log_named_string(string,string)": EventFragment;
    "log_named_uint(string,uint256)": EventFragment;
    "log_string(string)": EventFragment;
    "log_uint(uint256)": EventFragment;
    "log_uint_array(uint256[4])": EventFragment;
    "logs(bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "log"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_address"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_bytes"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_bytes32"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_int"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_address"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_bytes"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_bytes32"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_decimal_int"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_decimal_uint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_int"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_string"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_named_uint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_string"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_uint"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "log_uint_array"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "logs"): EventFragment;
}

export class DappingEchidna extends BaseContract {
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

  interface: DappingEchidnaInterface;

  functions: {
    test_APW(
      _seed: BigNumberish,
      _warp: BigNumberish,
      _amount: BigNumberish,
      _ms: BigNumberish,
      _md: BigNumberish,
      _pd: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  test_APW(
    _seed: BigNumberish,
    _warp: BigNumberish,
    _amount: BigNumberish,
    _ms: BigNumberish,
    _md: BigNumberish,
    _pd: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    test_APW(
      _seed: BigNumberish,
      _warp: BigNumberish,
      _amount: BigNumberish,
      _ms: BigNumberish,
      _md: BigNumberish,
      _pd: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    log(undefined?: null): TypedEventFilter<[string], { arg0: string }>;

    log_address(undefined?: null): TypedEventFilter<[string], { arg0: string }>;

    log_bytes(undefined?: null): TypedEventFilter<[string], { arg0: string }>;

    log_bytes32(undefined?: null): TypedEventFilter<[string], { arg0: string }>;

    log_int(
      undefined?: null
    ): TypedEventFilter<[BigNumber], { arg0: BigNumber }>;

    log_named_address(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, string], { key: string; val: string }>;

    log_named_bytes(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, string], { key: string; val: string }>;

    log_named_bytes32(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, string], { key: string; val: string }>;

    log_named_decimal_int(
      key?: null,
      val?: null,
      decimals?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { key: string; val: BigNumber; decimals: BigNumber }
    >;

    log_named_decimal_uint(
      key?: null,
      val?: null,
      decimals?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { key: string; val: BigNumber; decimals: BigNumber }
    >;

    log_named_int(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, BigNumber], { key: string; val: BigNumber }>;

    log_named_string(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, string], { key: string; val: string }>;

    log_named_uint(
      key?: null,
      val?: null
    ): TypedEventFilter<[string, BigNumber], { key: string; val: BigNumber }>;

    log_string(undefined?: null): TypedEventFilter<[string], { arg0: string }>;

    log_uint(
      undefined?: null
    ): TypedEventFilter<[BigNumber], { arg0: BigNumber }>;

    log_uint_array(
      val?: null
    ): TypedEventFilter<
      [[BigNumber, BigNumber, BigNumber, BigNumber]],
      { val: [BigNumber, BigNumber, BigNumber, BigNumber] }
    >;

    logs(undefined?: null): TypedEventFilter<[string], { arg0: string }>;
  };

  estimateGas: {
    test_APW(
      _seed: BigNumberish,
      _warp: BigNumberish,
      _amount: BigNumberish,
      _ms: BigNumberish,
      _md: BigNumberish,
      _pd: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    test_APW(
      _seed: BigNumberish,
      _warp: BigNumberish,
      _amount: BigNumberish,
      _ms: BigNumberish,
      _md: BigNumberish,
      _pd: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
