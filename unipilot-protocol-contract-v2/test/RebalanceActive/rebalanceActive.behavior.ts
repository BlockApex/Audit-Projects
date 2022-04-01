import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, Wallet } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getMaxTick,
  getMinTick,
  unipilotVaultFixture,
} from "../utils/fixtures";
import { MaxUint256 } from "@ethersproject/constants";
import { ethers, waffle } from "hardhat";
import { encodePriceSqrt } from "../utils/encodePriceSqrt";
import {
  UniswapV3Pool,
  NonfungiblePositionManager,
  UnipilotVault,
} from "../../typechain";
import { generateFeeThroughSwap } from "../utils/SwapFunction/swap";

export async function shouldBehaveLikeRebalanceActive(): Promise<void> {
  const createFixtureLoader = waffle.createFixtureLoader;
  let uniswapV3Factory: Contract;
  let uniswapV3PositionManager: NonfungiblePositionManager;
  let uniStrategy: Contract;
  let unipilotFactory: Contract;
  let swapRouter: Contract;
  let daiUsdtVault: UnipilotVault;
  let SHIB: Contract;
  let PILOT: Contract;
  let DAI: Contract;
  let USDT: Contract;
  let daiUsdtUniswapPool: UniswapV3Pool;

  const encodedPrice = encodePriceSqrt(
    parseUnits("1", "18"),
    parseUnits("8", "18"),
  );

  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
  const [wallet, alice, bob, carol, other, user0, user1, user2, user3, user4] =
    waffle.provider.getWallets();

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let createVault: ThenArg<
    ReturnType<typeof unipilotVaultFixture>
  >["createVault"];

  before("fixtures deployer", async () => {
    loadFixture = createFixtureLoader([wallet, other]);
  });

  beforeEach("setting up fixture contracts", async () => {
    ({
      uniswapV3Factory,
      uniswapV3PositionManager,
      swapRouter,
      unipilotFactory,
      DAI,
      USDT,
      PILOT,
      SHIB,
      uniStrategy,
      createVault,
    } = await loadFixture(unipilotVaultFixture));

    await uniswapV3Factory.createPool(DAI.address, USDT.address, 3000);
    let daiUsdtPoolAddress = await uniswapV3Factory.getPool(
      DAI.address,
      USDT.address,
      3000,
    );

    daiUsdtUniswapPool = (await ethers.getContractAt(
      "UniswapV3Pool",
      daiUsdtPoolAddress,
    )) as UniswapV3Pool;

    await daiUsdtUniswapPool.initialize(encodedPrice);

    await uniStrategy.setBaseTicks([daiUsdtPoolAddress], [1800]);

    daiUsdtVault = await createVault(
      USDT.address,
      DAI.address,
      3000,
      encodedPrice,
      "unipilot PILOT-USDT",
      "PILOT-USDT",
    );

    await unipilotFactory
      .connect(wallet)
      .whitelistVaults([daiUsdtVault.address]);

    await USDT._mint(wallet.address, parseUnits("2000000", "18"));
    await DAI._mint(wallet.address, parseUnits("2000000", "18"));
    await SHIB._mint(wallet.address, parseUnits("2000000", "18"));
    await PILOT._mint(wallet.address, parseUnits("2000000", "18"));
    await SHIB._mint(alice.address, parseUnits("2000000", "18"));
    await PILOT._mint(alice.address, parseUnits("2000000", "18"));
    await SHIB._mint(bob.address, parseUnits("100000000000", "18"));
    await PILOT._mint(bob.address, parseUnits("100000000000", "18"));

    await USDT.connect(wallet).approve(daiUsdtVault.address, MaxUint256);
    await DAI.connect(wallet).approve(daiUsdtVault.address, MaxUint256);

    await DAI.connect(wallet).approve(
      uniswapV3PositionManager.address,
      MaxUint256,
    );
    await USDT.connect(wallet).approve(
      uniswapV3PositionManager.address,
      MaxUint256,
    );

    await USDT.connect(wallet).approve(swapRouter.address, MaxUint256);
    await DAI.connect(wallet).approve(swapRouter.address, MaxUint256);
    await SHIB.connect(wallet).approve(swapRouter.address, MaxUint256);
    await PILOT.connect(wallet).approve(swapRouter.address, MaxUint256);
    await SHIB.connect(alice).approve(swapRouter.address, MaxUint256);
    await PILOT.connect(alice).approve(swapRouter.address, MaxUint256);

    await SHIB.connect(bob).approve(swapRouter.address, MaxUint256);
    await PILOT.connect(bob).approve(swapRouter.address, MaxUint256);
    await uniswapV3PositionManager.connect(wallet).mint(
      {
        token0: USDT.address,
        token1: DAI.address,
        tickLower: getMinTick(60),
        tickUpper: getMaxTick(60),
        fee: 3000,
        recipient: wallet.address,
        amount0Desired: parseUnits("1", "18"),
        amount1Desired: parseUnits("1", "18"),
        amount0Min: 0,
        amount1Min: 0,
        deadline: 2000000000,
      },
      {
        gasLimit: "3000000",
      },
    );
  });

  // it("rebalance with 50/50", async () => {
  //   // const usdtMindtedOnWallet = parseUnits("2000000", "18");
  //   // const daiMintedOnWallet = parseUnits("2000000", "18");

  //   await daiUsdtVault.init();

  //   await daiUsdtVault
  //     .connect(wallet)
  //     .deposit(parseUnits("5000", "18"), parseUnits("5000", "18"));

  //   let positionDetails = await daiUsdtVault.callStatic.getPositionDetails();

  //   console.log("positionDetails before swap", positionDetails);

  //   await generateFeeThroughSwap(swapRouter, bob, USDT, DAI, "5000");

  //   positionDetails = await daiUsdtVault.callStatic.getPositionDetails();

  //   console.log("positionDetails after swap", positionDetails);

  //   // await daiUsdtVault.readjustLiquidity();

  //   // positionDetails = await daiUsdtVault.callStatic.getPositionDetails();

  //   // console.log("positionDetails", positionDetails);
  // });

  it(" Index fund account should recieve 10% of the pool fees earned.", async () => {
    await daiUsdtVault.init();

    await daiUsdtVault
      .connect(wallet)
      .deposit(parseUnits("5000", "18"), parseUnits("5000", "18"));

    await generateFeeThroughSwap(swapRouter, bob, USDT, DAI, "5000");

    let positionDetails = await daiUsdtVault.callStatic.getPositionDetails();

    console.log("positionDetails after swap", positionDetails);

    await daiUsdtVault.readjustLiquidity();

    const fees0 = positionDetails[2];
    const fees1 = positionDetails[3];

    const percentageOfFees0Collected = fees0
      .mul(parseInt("10"))
      .div(parseInt("100"));

    const percentageOfFees1Collected = fees1
      .mul(parseInt("10"))
      .div(parseInt("100"));

    const indexFund = carol.address;

    const usdtBalanceOfIndexFund = await USDT.balanceOf(indexFund);
    const daiBalanceOfIndexFund = await DAI.balanceOf(indexFund);

    console.log("percentageOfFees0Collected", percentageOfFees0Collected);
    console.log("percentageOfFees1Collected", percentageOfFees1Collected);

    expect(percentageOfFees0Collected).to.be.equal(usdtBalanceOfIndexFund);
    expect(percentageOfFees1Collected).to.be.equal(daiBalanceOfIndexFund);
  });
}
