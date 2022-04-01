import { expect } from "chai";
import { BigNumber, Contract, Signer, Wallet } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { unipilotFarmFixture } from "../utils/fixtures";
import hre, { ethers, waffle } from "hardhat";
import { UnipilotFarm } from "../../typechain/UnipilotFarm";
import { MaxUint256 } from "@ethersproject/constants";

export async function shouldBehaveLikeUnipilotFarm(): Promise<void> {
  const createFixtureLoader = waffle.createFixtureLoader;
  let unipilotFarm: UnipilotFarm;
  let USDT: Contract;
  let PILOT: Contract;
  let DAI: Contract;

  type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
  const [
    wallet,
    alice,
    bob,
    carol,
    other,
    staking,
    user1,
    user2,
    user3,
    user4,
  ] = waffle.provider.getWallets();

  let loadFixture: ReturnType<typeof createFixtureLoader>;

  let createUnipilotFarm: ThenArg<
    ReturnType<typeof unipilotFarmFixture>
  >["createUnipilotFarm"];

  before("fixtures deployer", async () => {
    loadFixture = createFixtureLoader([wallet, other]);
  });

  beforeEach("setting up fixture contracts", async () => {
    ({ USDT, PILOT, DAI, createUnipilotFarm } = await loadFixture(
      unipilotFarmFixture,
    ));

    unipilotFarm = await createUnipilotFarm(
      wallet.address,
      PILOT.address,
      parseUnits("1", "18"),
    );

    await PILOT._mint(unipilotFarm.address, parseUnits("1000000", "18"));

    await DAI._mint(unipilotFarm.address, parseUnits("1000000", "18"));

    await USDT._mint(alice.address, parseUnits("100", "18"));

    await USDT._mint(carol.address, parseUnits("100", "18"));

    await USDT.connect(alice).approve(unipilotFarm.address, MaxUint256);

    await USDT.connect(carol).approve(unipilotFarm.address, MaxUint256);
  });

  it("Fail: Only governance can set pools", async () => {
    let init = unipilotFarm
      .connect(alice)
      .initializer(
        [USDT.address],
        ["1000000000000000000"],
        ["0"],
        [PILOT.address],
      );
    await expect(init).to.be.revertedWith("NA");
  });

  it("Pass: Only governance can set pools", async () => {
    let init = await unipilotFarm
      .connect(wallet)
      .initializer(
        [USDT.address],
        ["1000000000000000000"],
        ["0"],
        [PILOT.address],
      );
    expect(init).to.be.ok;
  });

  describe("#Blacklisting pools", async () => {
    beforeEach("init pool and deposit in farming", async () => {
      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [parseUnits("1", "18")],
          ["0"],
          [PILOT.address],
        );

      let stakeLp = await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }
    });

    it("Fail: Blacklisting by other accounts", async () => {
      let blacklist = unipilotFarm
        .connect(alice)
        .blacklistVaults([USDT.address]);

      await expect(blacklist).to.be.revertedWith("NA");
    });

    it("Pass: Blacklisting by governance", async () => {
      let blacklist = await unipilotFarm
        .connect(wallet)
        .blacklistVaults([USDT.address]);
      expect(blacklist).to.be.ok;
    });

    it("Fail: Deposit to be reverted after blacklist", async () => {
      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]);

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      let stakeLp = unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));
      await expect(stakeLp).to.be.revertedWith("TNL");
    });

    it("Pass: Reward not growing after blacklist", async () => {
      const rewardBeforeBlackList = await unipilotFarm
        .connect(alice)
        .callStatic.claimReward(USDT.address);

      expect(rewardBeforeBlackList[0]).to.be.equal(parseUnits("10", "18"));

      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]);

      await hre.network.provider.send("evm_mine");
      const rewardAfterBlackList = await unipilotFarm
        .connect(alice)
        .callStatic.claimReward(USDT.address);

      expect(rewardAfterBlackList[0]).to.be.equal(parseUnits("11", "18"));
    });

    it("Pass: Enable whitelisting", async () => {
      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]);

      let stakeLp = unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));
      await expect(stakeLp).to.be.revertedWith("TNL");

      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [parseUnits("2", "18")],
          ["0"],
          [PILOT.address],
        );

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let stakeLpAfterWhitelist = await unipilotFarm
        .connect(alice)
        .claimReward(USDT.address);

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      console.log("pilotBalance", pilotBalance);
      console.log("daiBalance", daiBalance);
    });
  });

  describe("#Staking", async () => {
    beforeEach("Enabling staking", async () => {
      unipilotFarm.connect(wallet).setStake(staking.address);
    });

    it("Fail: Stake contract to be verified from government", async () => {
      const stake = unipilotFarm.connect(alice).setStake(staking.address);
      await expect(stake).to.be.revertedWith("NA");
    });

    it("Fail: toggle booster can only be called by staking", async () => {
      const booster = unipilotFarm
        .connect(alice)
        .toggleBooster(USDT.address, alice.address);
      await expect(booster).to.be.revertedWith("NS");
    });

    it("Enable user booster", async () => {
      let userInfo = await unipilotFarm.userInfo(USDT.address, alice.address);
      expect(userInfo[4]).to.be.false;
      const booster = await unipilotFarm
        .connect(staking)
        .toggleBooster(USDT.address, alice.address);
      expect(booster).to.be.ok;
      userInfo = await unipilotFarm.userInfo(USDT.address, alice.address);
      expect(userInfo[4]).to.be.true;
    });

    it("Disable user booster", async () => {
      let booster = await unipilotFarm
        .connect(staking)
        .toggleBooster(USDT.address, alice.address);
      expect(booster).to.be.ok;
      let userInfo = await unipilotFarm.userInfo(USDT.address, alice.address);
      expect(userInfo[4]).to.be.true;
      booster = await unipilotFarm
        .connect(staking)
        .toggleBooster(USDT.address, alice.address);
      expect(booster).to.be.ok;
      userInfo = await unipilotFarm.userInfo(USDT.address, alice.address);
      expect(userInfo[4]).to.be.false;
    });

    // Reward growing faster according multiplier we will need to test this
  });

  describe("#Farming block limit", async () => {
    beforeEach("Initializing farming pools", async () => {
      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          ["1000000000000000000"],
          ["0"],
          [PILOT.address],
        );
    });

    it("Pass: enable farming limit only by governance", async () => {
      const blockNumber = await ethers.provider.getBlockNumber();
      let limit = unipilotFarm.connect(wallet).updateFarmingLimit(blockNumber);

      await expect(limit).to.be.revertedWith("BSG");

      let limit1 = await unipilotFarm
        .connect(wallet)
        .updateFarmingLimit(blockNumber + 3);

      await expect(limit1).to.be.ok;
    });

    it("Fail: enable farming limit only by governance", async () => {
      const blockNumber = await ethers.provider.getBlockNumber();
      let limit = unipilotFarm.connect(alice).updateFarmingLimit(blockNumber);
      await expect(limit).to.be.revertedWith("NA");
    });

    it("Fail: Cant deposit lp when limit enabled", async () => {
      let stakeLp = await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      expect(stakeLp).to.be.ok;

      const blockNumber = await ethers.provider.getBlockNumber();

      let limit = await unipilotFarm
        .connect(wallet)
        .updateFarmingLimit(blockNumber + 23);

      let stakeLpAfterEnabled = unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      await expect(stakeLpAfterEnabled).to.be.revertedWith("LA");
    });

    it("Remaining reward withdraw after enabling farming limit", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      const balanceOfUsdtAfterDeposit = await USDT.balanceOf(alice.address);

      expect(balanceOfUsdtAfterDeposit).to.be.equal(parseUnits("90", "18"));

      let blockNumber = await ethers.provider.getBlockNumber();

      await unipilotFarm.connect(wallet).updateFarmingLimit(blockNumber + 2);

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18"));

      const balanceOfUsdtAfterWithdraw = await USDT.balanceOf(alice.address);

      expect(balanceOfUsdtAfterWithdraw).to.be.equal(parseUnits("100", "18"));

      const pilotBalanceOfAlice = await PILOT.balanceOf(alice.address);

      expect(pilotBalanceOfAlice).to.be.equal(parseUnits("12", "18"));
    });
  });

  describe("#Farming with multiple reward type", async () => {
    beforeEach("Initializing farming pools", async () => {
      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          ["1000000000000000000"],
          ["0"],
          [PILOT.address],
        );
    });

    it("change reward type to alt", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "1", DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("1", "18"));

      for (let i = 0; i < 1; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18"));

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(parseUnits("11", "18"));
      expect(daiBalance).to.be.equal(parseUnits("2", "18"));
    });

    it("change reward type to Dual", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "2", DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("1", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18"));

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(parseUnits("23", "18"));
      expect(daiBalance).to.be.equal(parseUnits("11", "18"));
    });

    it("change reward type back to pilot from Alt", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "1", DAI.address); //11

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("1", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address); //11 //11

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "0", DAI.address); //12

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18"));

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(parseUnits("22", "18"));
      expect(daiBalance).to.be.equal(parseUnits("12", "18"));
    });
  });

  describe("#Farming update multipliers", async () => {
    beforeEach("Initializing farming pools", async () => {
      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          ["1000000000000000000"],
          ["0"],
          [PILOT.address],
        );
    });

    it("Change only pilot Multiplier with reward type dual", async () => {
      await unipilotFarm //bn =2 lr =2
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm //bn=13 lr= 2 alr=13 sb = 13
        .connect(wallet)
        .updateRewardType(USDT.address, "2", DAI.address);

      await unipilotFarm //bn=14 lr=14 alr=13
        .connect(wallet)
        .updateMultiplier(USDT.address, parseUnits("4", "18")); //12

      await unipilotFarm //bn=15 lr=14 alr=13 altGr=0
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("1", "18"));

      await unipilotFarm //bn=16 lr=16 alr=13 altGr=3
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18")); //20 //1

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(parseUnits("20", "18"));
      expect(daiBalance).to.be.equal(parseUnits("1", "18"));
    });

    it("Change only alt Multiplier with reward type dual", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("10", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet) //2 bn=2 lr=1 alr=2 algr = 0
        .updateRewardType(USDT.address, "2", DAI.address); //11

      await unipilotFarm
        .connect(wallet) //bn=3 lr=1 alr = 2 algr=0
        .updateAltMultiplier(USDT.address, parseUnits("4", "18")); //12

      await unipilotFarm //bn =4 lr=4 alr = 2
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18")); //13 //4

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(parseUnits("13", "18"));
      expect(daiBalance).to.be.equal(parseUnits("4", "18"));
    });

    it("Change only alt Multiplier with reward type alt", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("15", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "1", DAI.address); //11

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("4", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("10", "18")); //11 //44

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);
      const usdtBalance = await USDT.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(
        parseUnits("10.999999999999999995", "18"),
      );
      expect(daiBalance).to.be.equal(parseUnits("43.999999999999999995", "18"));
      expect(usdtBalance).to.be.equal(parseUnits("95", "18"));
    });

    it("Change both multiplier with reward type dual", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("7", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "2", DAI.address); //11

      await unipilotFarm
        .connect(wallet)
        .updateMultiplier(USDT.address, parseUnits("2", "18")); //12

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("4", "18")); //14

      for (let i = 0; i < 5; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseUnits("7", "18")); //26 //24

      const pilotBalance = await PILOT.balanceOf(alice.address);

      const daiBalance = await DAI.balanceOf(alice.address);
      const usdtBalance = await USDT.balanceOf(alice.address);

      expect(pilotBalance).to.be.equal(
        parseUnits("25.999999999999999995", "18"),
      );
      expect(daiBalance).to.be.equal(parseUnits("23.999999999999999997", "18"));
      expect(usdtBalance).to.be.equal(parseUnits("100", "18"));
    });
  });

  describe("#Multiple people deposit", async () => {
    beforeEach("Initializing farming pools", async () => {
      let init = await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          ["1000000000000000000"],
          ["0"],
          [PILOT.address],
        );
    });

    it("Verifying actual rewards each user receives", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("25", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, parseUnits("13", "18"));

      await hre.network.provider.send("evm_mine");

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      const pilotBalanceOfAlice = await PILOT.balanceOf(alice.address);
      const pilotBalanceOfCarol = await PILOT.balanceOf(carol.address);

      expect(pilotBalanceOfAlice).to.be.equal(
        parseUnits("12.315789473684210525", "18"),
      );
      expect(pilotBalanceOfCarol).to.be.equal(
        parseUnits("4.447368421052631568", "18"),
      );
    });

    it("Apply limits with multiple users", async () => {
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, parseUnits("25", "18"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, parseUnits("13", "18"));

      await unipilotFarm.connect(wallet).updateFarmingLimit("37");

      await hre.network.provider.send("evm_mine");

      await unipilotFarm.connect(alice).claimReward(USDT.address); // claim 1st time by Alice 12.973684210526315775

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address); //4.447368421052631568

      /////////////////////////////////
      ///FARMING LIMIT APPLIED HERE/// BLOCK 37
      ///////////////////////////////

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);
      // claim 2nd time by Alice

      await expect(
        unipilotFarm.connect(carol).claimReward(USDT.address),
      ).to.be.revertedWith("RZ"); //CLAIM 2nd time by Carol

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await expect(
        unipilotFarm.connect(alice).claimReward(USDT.address),
      ).to.be.revertedWith("RZ");

      await expect(
        unipilotFarm.connect(carol).claimReward(USDT.address),
      ).to.be.revertedWith("RZ"); //CLAIM 3rd time by Carol

      const pilotBalanceOfAlice = await PILOT.balanceOf(alice.address);
      const pilotBalanceOfCarol = await PILOT.balanceOf(carol.address);

      expect(pilotBalanceOfAlice).to.be.equal(
        parseUnits("19.5526315789473684", "18"),
      );
      expect(pilotBalanceOfCarol).to.be.equal(
        parseUnits("4.447368421052631568", "18"),
      );
    });
  });

  describe("Check Alt features", async () => {
    it("check only Alt reward", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );
      // await unipilotFarm.updateRewardType(USDT.address, "1", DAI.address);
      // await unipilotFarm.updateAltMultiplier(
      //   USDT.address,
      //   ethers.utils.parseEther("1"),
      // );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("100"));

      //await advanceBlockTo(316)

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("100"));

      let balancePilot = await PILOT.balanceOf(alice.address);

      let altbal = await DAI.balanceOf(alice.address);
    });

    it("reward received on second stake", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["0"],
          [PILOT.address],
        );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let pilotBalance = await PILOT.balanceOf(alice.address);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotBalance = await PILOT.balanceOf(alice.address);
    });

    it("Switch case of Reward status as Pilot", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 2, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 0, DAI.address);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("5"));

      for (let i = 0; i < 15; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("15"));

      let pilotBalance = await PILOT.balanceOf(alice.address);
    });

    it("Switch case of Reward status from Pilot to Dual", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["0"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 1, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 2, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, ethers.utils.parseEther("1"));

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let pilotBalance = await PILOT.balanceOf(alice.address);

      let altBalance = await DAI.balanceOf(alice.address);

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("5"));

      pilotBalance = await PILOT.balanceOf(alice.address);

      altBalance = await DAI.balanceOf(alice.address);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotBalance = await PILOT.balanceOf(alice.address);

      altBalance = await DAI.balanceOf(alice.address);

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("15"));

      pilotBalance = await PILOT.balanceOf(alice.address);

      altBalance = await DAI.balanceOf(alice.address);
    });

    it("Switch case of Reward status from Alt to Dual", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 2, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateMultiplier(PILOT.address, ethers.utils.parseEther("1"));

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let pilotBalance = await PILOT.balanceOf(alice.address);

      let altBalance = await DAI.balanceOf(alice.address);

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("5"));

      pilotBalance = await PILOT.balanceOf(alice.address);
      altBalance = await DAI.balanceOf(alice.address);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("15"));

      pilotBalance = await PILOT.balanceOf(alice.address);

      altBalance = await DAI.balanceOf(alice.address);
    });
  });

  describe("Check governance functions with fast switching rewardStatus and whitelisting", async () => {
    it("check rewardstatus behavior before and after whitelisting", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "0", DAI.address);

      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]);

      for (let i = 0; i < 50; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "2", DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateMultiplier(USDT.address, ethers.utils.parseEther("1"));

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, ethers.utils.parseEther("1"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["2"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("50"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let tx = await unipilotFarm
        .connect(alice)
        .callStatic.claimReward(USDT.address);

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("50"));

      expect(tx.reward).to.be.equal("10000000000000000000");
      expect(tx.altReward).to.be.equal("10000000000000000000");
    });

    it("initializer and changed to alt", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["0"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 2, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, 1, DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, ethers.utils.parseEther("1"));

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("50"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, ethers.utils.parseEther("1"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      const pilotReward = await PILOT.balanceOf(alice.address);
      const daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward", daiReward);
      console.log("pilotReward", pilotReward);

      expect(daiReward).to.be.eq(parseUnits("22", "18"));
      expect(pilotReward).to.be.eq(0);
    });

    it("stake, unstake, stake and claim", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["2"],
          [DAI.address],
        );
      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let i = 0; i < 25; i++) {
        await hre.network.provider.send("evm_mine");
      }

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward", daiReward);
      console.log("pilotReward", pilotReward);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("20"));

      for (let i = 0; i < 25; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward", daiReward);
      console.log("pilotReward", pilotReward);
      expect(pilotReward).to.be.equal(parseUnits("37", "18"));
      expect(daiReward).to.be.equal(parseUnits("37", "18"));
    });

    it("update reward type ", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer([USDT.address], [parseEther("1")], ["2"], [DAI.address]);

      await unipilotFarm
        .connect(wallet)
        .updateMultiplier(USDT.address, parseEther("2"));

      await unipilotFarm.connect(alice).stakeLp(USDT.address, parseEther("3"));

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]); //22 //11

      for (let i = 0; i < 10; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward", daiReward);
      console.log("pilotReward", pilotReward);
      expect(pilotReward).to.be.equal(
        parseUnits("21.999999999999999999", "18"),
      );
      expect(daiReward).to.be.equal(parseUnits("10.999999999999999998", "18"));
    });

    it("two people in farming", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer([USDT.address], [parseEther("1")], ["2"], [DAI.address]);

      await unipilotFarm
        .connect(wallet)
        .updateMultiplier(USDT.address, parseEther("2"));

      await unipilotFarm.connect(alice).stakeLp(USDT.address, parseEther("3"));

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      } //40

      await unipilotFarm.connect(carol).stakeLp(USDT.address, parseEther("3")); //42 21  gr=14 altgr=7

      await unipilotFarm.connect(alice).claimReward(USDT.address); //
      await unipilotFarm.connect(carol).claimReward(USDT.address); // 14.6 - 14 = 0.6 * 3

      let pilotReward = await PILOT.balanceOf(carol.address);
      let daiReward = await DAI.balanceOf(carol.address);
      console.log("daiReward carol", daiReward);
      console.log("pilotReward carol", pilotReward);

      let pilotReward2 = await PILOT.balanceOf(alice.address);
      let daiReward2 = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward2);
      console.log("pilotReward alice", pilotReward2);
    });

    it("dual changed to pilot", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer([USDT.address], [parseEther("1")], ["2"], [DAI.address]);

      await unipilotFarm.connect(alice).stakeLp(USDT.address, parseEther("3"));

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "0", DAI.address);

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);
      // await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);
    });

    it("unstake and then stake. reward type is pilot before everything", async function () {
      await unipilotFarm
        .connect(wallet)
        .initializer([USDT.address], [parseEther("1")], ["2"], [DAI.address]);

      await unipilotFarm.connect(alice).stakeLp(USDT.address, parseEther("3"));

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "0", DAI.address);

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);

      await unipilotFarm
        .connect(alice)
        .unstakeLp(USDT.address, parseEther("3"));

      await hre.network.provider.send("evm_mine");

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);

      await unipilotFarm.connect(alice).stakeLp(USDT.address, parseEther("3"));

      for (let i = 0; i < 20; i++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);
    });

    it("Multiple User Stakes of Lp tokens", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );
      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice", daiReward);
      console.log("pilotReward alice", pilotReward);

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after first stake", daiReward);
      console.log("pilotReward alice after first stake", pilotReward);

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after second stake", daiReward);
      console.log("pilotReward alice after second stake", pilotReward);

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after first stake", daiReward);
      console.log("pilotReward carol after first stake", pilotReward);

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after first claim", daiReward);
      console.log("pilotReward carol after first claim", pilotReward);

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after second stake", daiReward);
      console.log("pilotReward carol after second stake", pilotReward);

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after first claim", daiReward);
      console.log("pilotReward alice after first claim", pilotReward);
    });

    it("check unstakeLp emergency", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["0"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, ethers.utils.parseEther("5"));

      let carolLpBalance = await USDT.balanceOf(carol.address);
      let aliceLpBalance = await USDT.balanceOf(alice.address);

      expect(carolLpBalance).to.be.equal(parseUnits("95", "18"));
      expect(aliceLpBalance).to.be.equal(parseUnits("90", "18"));

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).emergencyUnstakeLp(USDT.address);

      await unipilotFarm.connect(alice).emergencyUnstakeLp(USDT.address);

      carolLpBalance = await USDT.balanceOf(carol.address);
      aliceLpBalance = await USDT.balanceOf(alice.address);

      expect(carolLpBalance).to.be.equal(parseUnits("100", "18"));
      expect(aliceLpBalance).to.be.equal(parseUnits("100", "18"));

      let pilotRewardAlice = await PILOT.balanceOf(alice.address);

      let pilotRewardCarol = await PILOT.balanceOf(carol.address);

      expect(pilotRewardAlice).to.be.equal(0);
      expect(pilotRewardCarol).to.be.equal(0);
    });

    it("multiple deposits and multiple change reward type ", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["1"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10")); //alice rew= 6

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after first stake", daiReward);
      console.log("pilotReward alice after first stake", pilotReward);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, ethers.utils.parseEther("10")); //gr= 6.3

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after first stake", daiReward);
      console.log("pilotReward carol after first stake", pilotReward);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine"); //gr = 0.16
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address); //gr=6.5

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after first claim", daiReward);
      console.log("pilotReward alice after first claim", pilotReward);

      await unipilotFarm
        .connect(carol)
        .stakeLp(USDT.address, ethers.utils.parseEther("10")); //gr = 6.53

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after second stake", daiReward);
      console.log("pilotReward carol after second stake", pilotReward);

      await unipilotFarm.connect(alice).claimReward(USDT.address); //gr = 6.5583

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after second claim", daiReward);
      console.log("pilotReward alice after second claim", pilotReward);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address); //gr = 6.7083

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after first claim", daiReward);
      console.log("pilotReward carol after first claim", pilotReward);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "0", DAI.address); //gr = 6.7333

      const vaultAlt = await unipilotFarm.vaultAltInfo(USDT.address);
      expect(vaultAlt.startBlock).to.be.equal(vaultAlt.lastRewardBlock);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after second claim", daiReward);
      console.log("pilotReward carol after second claim", pilotReward);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after third claim", daiReward);
      console.log("pilotReward carol after third claim", pilotReward);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "1", DAI.address);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after fourth claim", daiReward);
      console.log("pilotReward carol after fourth claim", pilotReward);

      for (let index = 0; index < 5; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(carol).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(carol.address);
      daiReward = await DAI.balanceOf(carol.address);

      console.log("daiReward carol after fifth claim", daiReward);
      console.log("pilotReward carol after fifth claim", pilotReward);
    });

    it("blacklist and generate reward", async () => {
      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("1")],
          ["0"],
          [DAI.address],
        );

      await unipilotFarm
        .connect(alice)
        .stakeLp(USDT.address, ethers.utils.parseEther("10"));

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(wallet).blacklistVaults([USDT.address]);

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      let pilotReward = await PILOT.balanceOf(alice.address);
      let daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after first claim", daiReward);
      console.log("pilotReward alice after first claim", pilotReward);

      expect(pilotReward).to.be.equal(parseUnits("11", "18"));
      expect(daiReward).to.be.equal(0);

      await unipilotFarm
        .connect(wallet)
        .initializer(
          [USDT.address],
          [ethers.utils.parseEther("2")],
          ["0"],
          [DAI.address],
        );

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);

      console.log("daiReward alice after whitelist", daiReward);
      console.log("pilotReward alice after whitelist", pilotReward);

      await unipilotFarm
        .connect(wallet)
        .updateRewardType(USDT.address, "1", DAI.address);

      await unipilotFarm
        .connect(wallet)
        .updateAltMultiplier(USDT.address, parseUnits("1", "18"));

      for (let index = 0; index < 10; index++) {
        await hre.network.provider.send("evm_mine");
      }

      await unipilotFarm.connect(alice).claimReward(USDT.address);

      pilotReward = await PILOT.balanceOf(alice.address);
      daiReward = await DAI.balanceOf(alice.address);
      console.log("daiReward alice after whitelist", daiReward);
      console.log("pilotReward alice after whitelist", pilotReward);
    });
  });
}
