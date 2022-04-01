import { expect } from "chai";
import { Contract, constants, BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import {
  getMaxTick,
  getMinTick,
  unipilotActiveVaultFixture,
} from "../utils/fixuresActive";
import { ethers, waffle } from "hardhat";
import { encodePriceSqrt } from "../utils/encodePriceSqrt";
import {
  UnipilotActiveVault,
  UniswapV3Pool,
  NonfungiblePositionManager,
} from "../../typechain";
import { generateFeeThroughSwap } from "../utils/SwapFunction/swap";

export async function shouldBehaveLikeWithdrawActive(): Promise<void> {
  const createFixtureLoader = waffle.createFixtureLoader;
  let uniswapV3PositionManager: NonfungiblePositionManager;
  let uniswapV3Factory: Contract;
  let uniStrategy: Contract;
  let unipilotFactory: Contract;
  let swapRouter: Contract;
  let vault: UnipilotActiveVault;
  let DAI: Contract;
  let USDT: Contract;
  let pool: UniswapV3Pool;

  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
  const [wallet, other] = waffle.provider.getWallets();

  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let createVault: ThenArg<
    ReturnType<typeof unipilotActiveVaultFixture>
  >["createVault"];

  before("fixtures deployer", async () => {
    loadFixture = createFixtureLoader([wallet, other]);
  });

  beforeEach("basic setup", async () => {
    ({
      uniswapV3Factory,
      uniswapV3PositionManager,
      swapRouter,
      unipilotFactory,
      DAI,
      USDT,
      uniStrategy,
      createVault,
    } = await loadFixture(unipilotActiveVaultFixture));

    await uniswapV3Factory.createPool(USDT.address, DAI.address, 3000);

    let poolAddress = await uniswapV3Factory.getPool(
      DAI.address,
      USDT.address,
      3000,
    );

    pool = (await ethers.getContractAt(
      "UniswapV3Pool",
      poolAddress,
    )) as UniswapV3Pool;

    await pool.initialize(encodePriceSqrt(1, 2));
    await uniStrategy.setBaseTicks([poolAddress], [1800]);

    vault = await createVault(
      USDT.address,
      DAI.address,
      3000,
      encodePriceSqrt(1, 2),
      "DAI-USDT UniLP",
      "UniLP",
    );

    await USDT._mint(wallet.address, parseUnits("1000", "18"));
    await DAI._mint(wallet.address, parseUnits("1000", "18"));

    await USDT._mint(other.address, parseUnits("4000", "18"));
    await DAI._mint(other.address, parseUnits("4000", "18"));

    await USDT.approve(vault.address, constants.MaxUint256);
    await DAI.approve(vault.address, constants.MaxUint256);

    await DAI.connect(other).approve(vault.address, constants.MaxUint256);
    await DAI.connect(other).approve(
      uniswapV3PositionManager.address,
      constants.MaxUint256,
    );
    await DAI.connect(other).approve(swapRouter.address, constants.MaxUint256);

    await USDT.connect(other).approve(vault.address, constants.MaxUint256);
    await USDT.connect(other).approve(
      uniswapV3PositionManager.address,
      constants.MaxUint256,
    );
    await USDT.connect(other).approve(swapRouter.address, constants.MaxUint256);

    await uniswapV3PositionManager.connect(other).mint(
      {
        token0: USDT.address,
        token1: DAI.address,
        tickLower: getMinTick(60),
        tickUpper: getMaxTick(60),
        fee: 3000,
        recipient: other.address,
        amount0Desired: parseUnits("1500", "18"),
        amount1Desired: parseUnits("1500", "18"),
        amount0Min: 0,
        amount1Min: 0,
        deadline: 2000000000,
      },
      {
        gasLimit: "3000000",
      },
    );
  });

  describe("#withdraw for active pools", () => {
    beforeEach("Add liquidity in vault and whiteliste vault", async () => {
      await vault.init();
      await vault.deposit(
        parseUnits("1000", "18"),
        parseUnits("1000", "18"),
        wallet.address,
      );
      await vault.readjustLiquidity();
    });

    it("withdraw", async () => {
      const reserves = await vault.callStatic.getPositionDetails();

      const unusedAmount0 = await USDT.balanceOf(vault.address);
      const unusedAmount1 = await DAI.balanceOf(vault.address);

      await vault.withdraw(parseUnits("1000", "18"), wallet.address, false);
      const userLpBalance = await vault.balanceOf(wallet.address);
      const userDaiBalance = await DAI.balanceOf(wallet.address);
      const userUsdtBalance = await USDT.balanceOf(wallet.address);

      expect(userLpBalance).to.be.eq(0);
      expect(userUsdtBalance).to.be.eq(reserves[0].add(unusedAmount0));
      expect(userDaiBalance).to.be.eq(reserves[1]);
    });

    it("emits an event", async () => {
      const liquidity = await vault.balanceOf(wallet.address);
      const reserves = await vault.callStatic.getPositionDetails();

      const unusedAmount0 = await USDT.balanceOf(vault.address);

      await expect(await vault.withdraw(liquidity, wallet.address, false))
        .to.emit(vault, "Withdraw")
        .withArgs(
          wallet.address,
          liquidity,
          reserves[0].add(unusedAmount0),
          reserves[1],
        );
    });

    it("fails if liquidity is zero", async () => {
      await expect(vault.withdraw(0, wallet.address, false)).to.be.reverted;
    });

    it("fails if zero address", async () => {
      await expect(
        vault.withdraw(parseUnits("1000", "18"), constants.AddressZero, false),
      ).to.be.reverted;
    });

    it("fails if not owner", async () => {
      await expect(
        vault
          .connect(other)
          .withdraw(parseUnits("1000", "18"), other.address, false),
      ).to.be.reverted;
    });

    it("fails if amount exceed user liquidity", async () => {
      await expect(
        vault.withdraw(parseUnits("1001", "18"), wallet.address, false),
      ).to.be.reverted;
    });

    it("withdraw with fees earned", async () => {
      await generateFeeThroughSwap(swapRouter, other, USDT, DAI, "1000");
      await generateFeeThroughSwap(swapRouter, other, DAI, USDT, "1000");

      const fees = await vault.callStatic.getPositionDetails();
      const unusedAmount0 = await USDT.balanceOf(vault.address);

      await vault.withdraw(parseUnits("1000", "18"), wallet.address, false);
      const userDaiBalance = await DAI.balanceOf(wallet.address);
      const userUsdtBalance = await USDT.balanceOf(wallet.address);

      const details = await unipilotFactory.getUnipilotDetails();

      const amount0IndexFund = fees[2].div(details[3]);
      const amount1IndexFund = fees[3].div(details[3]);

      const total0 = fees[0].add(fees[2]).add(unusedAmount0);
      const total1 = fees[1].add(fees[3]);

      expect(userUsdtBalance).to.be.eq(total0.sub(amount0IndexFund));
      expect(userDaiBalance).to.be.eq(total1.sub(amount1IndexFund));
    });

    it("fees compounding on withdraw", async () => {
      await vault
        .connect(other)
        .deposit(
          parseUnits("1000", "18"),
          parseUnits("1000", "18"),
          other.address,
        );

      const user0LP = await vault.balanceOf(wallet.address);
      const user1LP = await vault.balanceOf(other.address);

      await generateFeeThroughSwap(swapRouter, other, USDT, DAI, "1000");
      await generateFeeThroughSwap(swapRouter, other, DAI, USDT, "1000");

      const reservesBefore = await vault.callStatic.getPositionDetails();
      const amount0ToCompound = reservesBefore[0].add(reservesBefore[2]).div(2);
      const amount1ToCompound = reservesBefore[1].add(reservesBefore[3]).div(2);

      const details = await unipilotFactory.getUnipilotDetails();

      const amount0IndexFund = reservesBefore[2].div(details[3]);
      const amount1IndexFund = reservesBefore[3].div(details[3]);

      await vault.connect(other).withdraw(user1LP, other.address, false);
      const reservesAfter = await vault.callStatic.getPositionDetails();

      expect(reservesAfter[0]).to.be.gte(
        amount0ToCompound.sub(amount0IndexFund),
      );
      expect(reservesAfter[1]).to.be.gte(
        amount1ToCompound.sub(amount1IndexFund),
      );

      const unusedAmount0 = await USDT.balanceOf(vault.address);

      await vault.withdraw(user0LP, wallet.address, false);
      const userDaiBalance = await DAI.balanceOf(wallet.address);
      const userUsdtBalance = await USDT.balanceOf(wallet.address);

      expect(userUsdtBalance).to.be.eq(reservesAfter[0].add(unusedAmount0));
      expect(userDaiBalance).to.be.eq(reservesAfter[1]);
    });

    it("receive correct amounts of liquidity for unclaimed pool fees", async () => {
      await generateFeeThroughSwap(swapRouter, other, USDT, DAI, "1000");
      await generateFeeThroughSwap(swapRouter, other, DAI, USDT, "1000");

      const { amount0, amount1 } = await vault
        .connect(other)
        .callStatic.deposit(
          parseUnits("1000", "18"),
          parseUnits("1000", "18"),
          other.address,
        );

      await vault
        .connect(other)
        .deposit(
          parseUnits("1000", "18"),
          parseUnits("1000", "18"),
          other.address,
        );

      const userDaiBalanceBfore = await DAI.balanceOf(other.address);
      const userUsdtBalanceBfore = await USDT.balanceOf(other.address);
      const otherLP = await vault.balanceOf(other.address);

      await vault.connect(other).withdraw(otherLP, other.address, false);

      const userDaiBalanceAfter = await DAI.balanceOf(other.address);
      const userUsdtBalanceAfter = await USDT.balanceOf(other.address);

      const t0 = userUsdtBalanceAfter.sub(userUsdtBalanceBfore);
      const t1 = userDaiBalanceAfter.sub(userDaiBalanceBfore);

      expect(t0).to.be.lte(amount0);
      expect(t1).to.be.lte(amount1);
    });

    // it("should withdraw after pulling liquidity", async () => {
    //   await vault
    //     .connect(other)
    //     .deposit(
    //       parseUnits("1000", "18"),
    //       parseUnits("1000", "18"),
    //       other.address,
    //     );

    //   const { lpShares } = await vault
    //     .connect(other)
    //     .callStatic.deposit(
    //       parseUnits("1000", "18"),
    //       parseUnits("1000", "18"),
    //       other.address,
    //     );

    //   const user1LP = await vault.balanceOf(other.address);
    //   const totalSupply = await vault.totalSupply();
    //   const userShare = user1LP.div(totalSupply);

    //   const user1DaiBalanceBefore = await DAI.balanceOf(other.address);
    //   const user1UsdtBalanceBefore = await USDT.balanceOf(other.address);

    //   await vault.pullLiquidity();

    //   const contractDaiBalance = await DAI.balanceOf(vault.address);
    //   const contractUsdtBalance = await USDT.balanceOf(vault.address);

    //   await vault.connect(other).withdraw(user1LP, other.address, false);

    //   const user1LpBalance = await vault.balanceOf(other.address);

    //   const contractDaiBalanceAfter = await DAI.balanceOf(vault.address);
    //   const contractUsdtBalanceAfter = await USDT.balanceOf(vault.address);

    //   const user1DaiBalance = await DAI.balanceOf(other.address);
    //   const user1UsdtBalance = await USDT.balanceOf(other.address);

    //   expect(user1LpBalance).to.be.eq(0);
    //   expect(user1UsdtBalance.sub(user1UsdtBalanceBefore)).to.be.eq(
    //     contractUsdtBalance.div(2),
    //   );
    //   expect(user1DaiBalance.sub(user1DaiBalanceBefore)).to.be.eq(
    //     contractDaiBalance.div(2),
    //   );
    // });
  });
}
