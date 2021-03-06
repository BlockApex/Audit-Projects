/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "AggregatorV3Interface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AggregatorV3Interface__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "DemoTest",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DemoTest__factory>;
    getContractFactory(
      name: "DemoTestWithSetUp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DemoTestWithSetUp__factory>;
    getContractFactory(
      name: "DSTest",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DSTest__factory>;
    getContractFactory(
      name: "Dapping",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Dapping__factory>;
    getContractFactory(
      name: "UserContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UserContract__factory>;
    getContractFactory(
      name: "DappingTest",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DappingTest__factory>;
    getContractFactory(
      name: "DappingEchidna",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DappingEchidna__factory>;
    getContractFactory(
      name: "Hevm",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Hevm__factory>;
    getContractFactory(
      name: "PriceFeed",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PriceFeed__factory>;
    getContractFactory(
      name: "SetupContracts",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SetupContracts__factory>;
    getContractFactory(
      name: "TVLFeed",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TVLFeed__factory>;
    getContractFactory(
      name: "SetupToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SetupToken__factory>;
    getContractFactory(
      name: "TestERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestERC20__factory>;
    getContractFactory(
      name: "INetworkDemand",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.INetworkDemand__factory>;
    getContractFactory(
      name: "IPriceFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPriceFeeds__factory>;
    getContractFactory(
      name: "IRebaseEngine",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRebaseEngine__factory>;
    getContractFactory(
      name: "IStakingManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStakingManager__factory>;
    getContractFactory(
      name: "ITVLFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITVLFeeds__factory>;
    getContractFactory(
      name: "DIAPriceFeed",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DIAPriceFeed__factory>;
    getContractFactory(
      name: "IDIAOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDIAOracle__factory>;
    getContractFactory(
      name: "NetworkDemand",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NetworkDemand__factory>;
    getContractFactory(
      name: "PriceFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PriceFeeds__factory>;
    getContractFactory(
      name: "TVLFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TVLFeeds__factory>;
    getContractFactory(
      name: "RebaseEngine",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RebaseEngine__factory>;
    getContractFactory(
      name: "StakingDatabase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StakingDatabase__factory>;
    getContractFactory(
      name: "StakingManagerV1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StakingManagerV1__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "ERC677",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC677__factory>;
    getContractFactory(
      name: "IERC677Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC677Receiver__factory>;
    getContractFactory(
      name: "MockPriceFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockPriceFeeds__factory>;
    getContractFactory(
      name: "MockToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockToken__factory>;
    getContractFactory(
      name: "TokenPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenPool__factory>;
    getContractFactory(
      name: "INetworkDemand",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.INetworkDemand__factory>;
    getContractFactory(
      name: "IPriceFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPriceFeeds__factory>;
    getContractFactory(
      name: "IRebaseEngine",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRebaseEngine__factory>;
    getContractFactory(
      name: "IStakingManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStakingManager__factory>;
    getContractFactory(
      name: "ITVLFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITVLFeeds__factory>;
    getContractFactory(
      name: "NetworkDemand",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NetworkDemand__factory>;
    getContractFactory(
      name: "PriceFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PriceFeeds__factory>;
    getContractFactory(
      name: "TVLFeeds",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TVLFeeds__factory>;
    getContractFactory(
      name: "RebaseEngine",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RebaseEngine__factory>;
    getContractFactory(
      name: "StakingDatabase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StakingDatabase__factory>;
    getContractFactory(
      name: "StakingManagerV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StakingManagerV2__factory>;
    getContractFactory(
      name: "TokenPool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenPool__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
  }
}
