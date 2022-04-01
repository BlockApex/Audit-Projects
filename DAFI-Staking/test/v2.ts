import { ethers, network, waffle } from 'hardhat'
import chai from 'chai'
import TVLFeedsArtifact from '../artifacts/contracts/network demand/TVLFeeds.sol/TVLFeeds.json'
import PriceFeedsArtifact from '../artifacts/contracts/testing/MockPriceFeeds.sol/MockPriceFeeds.json'
import MockTokenArtifact from '../artifacts/contracts/testing/MockToken.sol/MockToken.json'
import NetworkDemandArtifact from '../artifacts/contracts/network demand/NetworkDemand.sol/NetworkDemand.json'
import TokenPoolArtifact from '../artifacts/contracts/TokenPool.sol/TokenPool.json'
import StakingDatabaseArtifact from '../artifacts/contracts/v2/StakingDatabaseV2.sol/StakingDatabaseV2.json'
import RebaseEngineArtifact from '../artifacts/contracts/v2/RebaseEngineV2.sol/RebaseEngineV2.json'
import StakingManagerArtifact from '../artifacts/contracts/v2/StakingManagerV2.sol/StakingManagerV2.json'
import {
    MockPriceFeeds,
    MockToken,
    MockToken__factory,
    NetworkDemand,
    RebaseEngineV2 as RebaseEngine,
    StakingDatabaseV2 as StakingDatabase,
    StakingManagerV2 as StakingManager,
    StakingManagerV2__factory,
    TokenPool,
    TVLFeeds,
} from '../typechain'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { boolean } from 'hardhat/internal/core/params/argumentTypes'

const { deployContract } = waffle
const { expect } = chai

describe('Staking Manager', () => {
    let tvlFeeds: TVLFeeds
    let priceFeeds: MockPriceFeeds
    let dafi: MockToken
    let networkDemand: NetworkDemand
    let stakingDatabase: StakingDatabase
    let tokenPool: TokenPool
    let rebaseEngine: RebaseEngine
    let stakingManager: StakingManager

    let owner: SignerWithAddress
    let alice: SignerWithAddress
    let bob: SignerWithAddress

    let aliceDafi: MockToken
    let bobDafi: MockToken

    let aliceStakingManager: StakingManager
    let bobStakingManager: StakingManager

    const startMDI = 1000

    beforeEach(async () => {
        // get signers
        const signers = await ethers.getSigners()
        owner = signers[0]
        alice = signers[1]
        bob = signers[2]

        // network demand
        tvlFeeds = (await deployContract(owner, TVLFeedsArtifact)) as TVLFeeds
        priceFeeds = (await deployContract(owner, PriceFeedsArtifact)) as MockPriceFeeds

        // token
        dafi = (await deployContract(owner, MockTokenArtifact, ['DAFI Protocol', 'DAFI', [], []])) as MockToken
        aliceDafi = MockToken__factory.connect(dafi.address, alice)
        bobDafi = MockToken__factory.connect(dafi.address, bob)

        await dafi.mint('1000000000000000000')
        await dafi.transfer(alice.address, 1000000000)
        await dafi.transfer(bob.address, 1000000000)

        // network demand
        networkDemand = (await deployContract(owner, NetworkDemandArtifact, [
            dafi.address,
            priceFeeds.address,
            tvlFeeds.address,
        ])) as NetworkDemand
        await networkDemand.setTVLPercentage(0)
        await networkDemand.setPricePercentage(10000)
        await networkDemand.setTargetTVL(0)
        await networkDemand.setTargetPrice(10)
        // await networkDemand.setTolerance(30)
        // await networkDemand.setNoOfPrices(5)

        // database
        stakingDatabase = (await deployContract(owner, StakingDatabaseArtifact)) as StakingDatabase

        // token pool
        tokenPool = (await deployContract(owner, TokenPoolArtifact, [dafi.address])) as TokenPool
        await dafi.transfer(tokenPool.address, '100000000000')

        // rabase engine
        rebaseEngine = (await deployContract(owner, RebaseEngineArtifact)) as RebaseEngine
        await rebaseEngine.initialize(networkDemand.address, stakingDatabase.address)

        // staking manager
        stakingManager = (await deployContract(owner, StakingManagerArtifact, [dafi.address])) as StakingManager

        aliceStakingManager = StakingManagerV2__factory.connect(stakingManager.address, alice)
        bobStakingManager = StakingManagerV2__factory.connect(stakingManager.address, bob)

        // whitelisting
        await stakingDatabase.addWhitelist(stakingManager.address)
        await stakingDatabase.addWhitelist(rebaseEngine.address)
        await stakingDatabase.addWhitelist(owner.address)

        // initializee staking manager
        await stakingManager.initialize(
            stakingDatabase.address,
            rebaseEngine.address,
            networkDemand.address,
            tokenPool.address,
            0,
            0,
            24 * 60 * 60 * startMDI, // (24 * 60 * 60) * startMDI
            25,
            1
        ) // 1 dDAFI / second at the beginning, max 10 DAFI / second

        await networkDemand.addWhitelist(stakingManager.address)
        await networkDemand.addWhitelist(rebaseEngine.address)

        await rebaseEngine.addWhitelist(stakingManager.address)

        await tokenPool.addWhitelist(stakingManager.address)

        await stakingManager.enableStaking()
        await stakingManager.enableUnstaking()
    })

    const advanceTime = async (seconds: number) => {
        await network.provider.send('evm_increaseTime', [seconds])
        await network.provider.send('evm_mine')
    }

    const advanceBlocks = async (blocks: number) => {
        for (let i = 0; i < blocks; ++i) {
            await network.provider.send('evm_mine')
        }
    }

    const approve = async (...tokens: MockToken[]) => {
        for (let token of tokens) {
            await token.approve(stakingManager.address, '1000000000000000')
        }
    }

    const getTimeStamp = async (): Promise<number> => {
        const blockNumber = await ethers.provider.getBlockNumber()
        const timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp
        return timestamp
    }

    const checkValueWithCorrection = (expectedValue: BigNumberish, realValue: BigNumberish) => {
        const correction = 1000
        const upper = correction + 1
        const lower = correction - 1
        expect(BigNumber.from(realValue).mul(upper).div(correction).gte(expectedValue)).to.be.true
        expect(BigNumber.from(realValue).mul(lower).div(correction).lte(expectedValue)).to.be.true
    }

    describe('staking', async () => {
        const stakingAmount = 1000000

        it('only able to stake when staking is live', async () => {
            await approve(aliceDafi)
            await stakingManager.disableStaking()
            await expect(aliceStakingManager.stake(stakingAmount)).to.revertedWith('Staking is not allowed right now')

            await stakingManager.enableStaking()
            await aliceStakingManager.stake(stakingAmount)
        })

        it('only approved assets can be staked', async () => {
            await expect(aliceStakingManager.stake(stakingAmount)).to.revertedWith(
                'ERC20: transfer amount exceeds allowance'
            )

            await approve(aliceDafi)
            await aliceStakingManager.stake(stakingAmount)
        })

        it('cannot stake more than balance', async () => {
            await approve(aliceDafi)
            // balance is 1000000000
            await expect(aliceStakingManager.stake(1000000001)).to.revertedWith(
                'ERC20: transfer amount exceeds balance'
            )
        })

        it('correct staking info (amount, time, poolWeight...) are recorded correctly', async () => {
            await approve(aliceDafi)
            await aliceStakingManager.stake(stakingAmount)

            const timestamp = await getTimeStamp()

            let staker = await stakingDatabase.getUserStake(alice.address)

            expect(staker.amount.toString()).to.equal(String(stakingAmount))
            expect(staker.createdOn.toString()).to.equal(timestamp.toString())
            expect(staker.lastUpdatedOn.toString()).to.equal(timestamp.toString())
            expect(staker.lastStakingAccumulatedWeight.toString()).to.equal('0')
            expect(staker.lastAccumulatedFeeWeight.toString()).to.equal('0')
            expect(staker.totalUnclaimed.toString()).to.equal('0')

            await aliceStakingManager.stake(stakingAmount)
            let accumulatedPW = await stakingDatabase.getAccumulatedPoolWeight()
            let accumulatedFW = await stakingDatabase.getAccumulatedFeeWeight()
            staker = await stakingDatabase.getUserStake(alice.address)
            const updatedTimestamp = await getTimeStamp()

            expect(staker.createdOn.toString()).to.equal(timestamp.toString())
            expect(staker.lastUpdatedOn.toString()).to.equal(updatedTimestamp.toString())
            expect(staker.amount.toString()).to.equal(String(stakingAmount * 2))
            expect(staker.lastStakingAccumulatedWeight.toString()).to.equal(accumulatedPW.toString())
            expect(staker.lastAccumulatedFeeWeight.toString()).to.equal(accumulatedFW.toString())
        })
    })

    describe('unstaking', async () => {
        const stakingAmount = 1000000

        beforeEach(async () => {
            await approve(aliceDafi)
            await aliceStakingManager.stake(stakingAmount)
        })

        it('only able to unstake when unstaking is live', async () => {
            await stakingManager.disableUnstaking()
            await expect(aliceStakingManager.unstake(stakingAmount)).to.revertedWith(
                'Reward claiming is not allowed right now'
            )

            await stakingManager.enableUnstaking()
            await aliceStakingManager.unstake(stakingAmount)
        })

        it('only able to unstake when staking amount is greater than unstaking amount', async () => {
            await expect(bobStakingManager.unstake(100)).to.revertedWith('Invalid User')
            await expect(aliceStakingManager.unstake(stakingAmount + 1)).to.revertedWith('Invalid amount')
        })

        it('users are able to unstake, partially and fully', async () => {
            await aliceStakingManager.unstake(stakingAmount / 10)
            await aliceStakingManager.unstake(stakingAmount - stakingAmount / 10)
        })

        it('staking info are updated accordingly', async () => {
            let aliceStake = await stakingDatabase.getUserStake(alice.address)
            expect(aliceStake.amount.toString()).to.equal(String(stakingAmount))

            await aliceStakingManager.unstake(stakingAmount / 10)
            aliceStake = await stakingDatabase.getUserStake(alice.address)
            expect(aliceStake.amount.toString()).to.equal(String(stakingAmount - stakingAmount / 10))

            const accumulatedPW = await stakingDatabase.getAccumulatedPoolWeight()
            const accumulatedFW = await stakingDatabase.getAccumulatedFeeWeight()
            const updatedTimestamp = await getTimeStamp()

            expect(aliceStake.lastUpdatedOn.toString()).to.equal(updatedTimestamp.toString())
            expect(aliceStake.lastStakingAccumulatedWeight.toString()).to.equal(accumulatedPW.toString())
            expect(aliceStake.lastAccumulatedFeeWeight.toString()).to.equal(accumulatedFW.toString())
        })

        it('when unstaking, rewards can also be claimed', async () => {
            const balance = await dafi.balanceOf(alice.address)
            await aliceStakingManager.unstake(1000)
            const minBalance = balance.add(1000)
            await advanceBlocks(500)
            await advanceTime(100000)
            const realBalance = await dafi.balanceOf(alice.address)

            console.log("balance", balance.toString());
            console.log("minBalance", minBalance.toString());
            console.log("realbalance", realBalance.toString());
        
            expect(realBalance.gt(minBalance)).to.be.true
        })
    })

    describe('reward & fee', async () => {
        const stakingAmount = 1000000

        beforeEach(async () => {
            await approve(aliceDafi)
            await aliceStakingManager.stake(stakingAmount)
        })

        it('MDI remains constant if not changed', async () => {
            const oldMdi = await stakingDatabase.getDistributePerSecond()
            await advanceTime(1000)
            await advanceBlocks(10)
            await aliceStakingManager.unstake(stakingAmount)

            const newMdi = await stakingDatabase.getDistributePerSecond()
            expect(newMdi.eq(oldMdi)).to.be.true
        })

        it('rewards are calculated correctly', async () => {
            // fees are 25%
            const mdi = await stakingDatabase.getDistributePerSecond()
            console.log('mdi', mdi.toString())

            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn

            await advanceTime(1000)
            await priceFeeds.setPrice(5)
            const aliceBalanceBefore = await dafi.balanceOf(alice.address)
            await aliceStakingManager.unstake(stakingAmount)

            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)
            const currentTime = aliceStakingAfter.lastUpdatedOn
            const stakingDuration = currentTime.sub(stakingTime)

            // console.log('unclaimedAmount', aliceStakingAfter.totalUnclaimed.toString())
            // console.log('expectedUnclaimedAmount', stakingDuration.mul(mdi).toString())

            // mul(3).div(4) due to fee, div(2) due to the price is 5/10
            const expectedReward = stakingDuration.mul(startMDI).mul(3).div(4).div(2)

            const aliceBalanceAfter = await dafi.balanceOf(alice.address)
            const balanceIncrease = aliceBalanceAfter.sub(aliceBalanceBefore).sub(stakingAmount)

            // TODO: Why there's a difference of 3 between these values?
            console.log('expectedReward', expectedReward.toString())
            console.log('balanceIncrease', balanceIncrease.toString())

            // allow 1 ten thousandth variance
            expect(expectedReward.mul(10001).div(10000).gt(balanceIncrease)).to.be.true
            expect(expectedReward.mul(9999).div(10000).lt(balanceIncrease)).to.be.true
        })

        it('rewards are calculated correctly when df fluctuates', async () => {
            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn

            await advanceTime(1000)
            await priceFeeds.setPrice(7)
            await aliceStakingManager.stake(1)

            await advanceTime(100)
            await priceFeeds.setPrice(4)
            const aliceBalanceBefore = await dafi.balanceOf(alice.address)
            await aliceStakingManager.unstake(stakingAmount)

            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)
            const currentTime = aliceStakingAfter.lastUpdatedOn
            const stakingDuration = currentTime.sub(stakingTime)

            // mul(3).div(4) due to fee, mul(4).div(10) due to the price is 4/10
            const expectedReward = stakingDuration.mul(startMDI).mul(3).div(4).mul(4).div(10)

            const aliceBalanceAfter = await dafi.balanceOf(alice.address)
            const balanceIncrease = aliceBalanceAfter.sub(aliceBalanceBefore).sub(stakingAmount)

            console.log('expectedReward', expectedReward.toString())
            console.log('balanceIncrease', balanceIncrease.toString())

            // allow 1% variance
            checkValueWithCorrection(expectedReward, balanceIncrease)
        })

        it('rewards can be claimed fully', async () => {
            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn
            const aliceBalanceBefore = await dafi.balanceOf(alice.address)

            await advanceTime(1000) // reward is about 1850
            await priceFeeds.setPrice(5)
            await aliceStakingManager.claimRewards(false, 0)

            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)
            const unstakingTime = aliceStakingAfter.lastUpdatedOn
            const stakingDuration = unstakingTime.sub(stakingTime)
            const expectedReward = stakingDuration.mul(startMDI).mul(3).div(4).div(2)

            const aliceBalanceAfter = await dafi.balanceOf(alice.address)
            const balanceIncrease = aliceBalanceAfter.sub(aliceBalanceBefore)

            checkValueWithCorrection(expectedReward, balanceIncrease)
        })

        it('rewards can be claimed partially', async () => {
            const claimAmount = BigNumber.from(100000)

            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn
            const aliceBalanceBefore = await dafi.balanceOf(alice.address)

            await advanceTime(1000) // reward is about 1850
            await priceFeeds.setPrice(5)
            await aliceStakingManager.claimRewards(true, claimAmount)
            const currentTime = BigNumber.from(await getTimeStamp())
            const stakingDuration = currentTime.sub(stakingTime)
            const expectedTotalReward = stakingDuration.mul(startMDI)
            const expectedPartialReward = claimAmount.mul(3).div(4).div(2)
            const expectedRemainingReward = expectedTotalReward.sub(claimAmount)

            const aliceBalanceAfter = await dafi.balanceOf(alice.address)
            const balanceIncrease = aliceBalanceAfter.sub(aliceBalanceBefore)
            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)
            const remainingReward = aliceStakingAfter.totalUnclaimed

            console.log('expectedTotalReward', expectedTotalReward.toString())
            console.log('expectedPartialReward', expectedPartialReward.toString())
            console.log('expectedRemainingReward', expectedRemainingReward.toString())
            console.log('remainingReward', aliceStakingAfter.totalUnclaimed.toString())
            console.log('remainingRewardAdjusted', aliceStakingAfter.totalUnclaimed.div(2).toString())
            console.log('balanceIncrease', balanceIncrease.toString())

            // allow 1% variance
            checkValueWithCorrection(expectedPartialReward, balanceIncrease)
            checkValueWithCorrection(expectedRemainingReward, remainingReward)
        })

        it('fees are collected & distributed correctly', async () => {
            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const aliceStakingTime = aliceStaking.lastUpdatedOn

            await approve(bobDafi)
            await bobStakingManager.stake(stakingAmount)
            const bobStaking = await stakingDatabase.getUserStake(bob.address)
            const bobStakingTime = bobStaking.lastUpdatedOn

            const aliceBalanceBefore = await dafi.balanceOf(alice.address)

            await advanceTime(1000)
            await priceFeeds.setPrice(5)
            await aliceStakingManager.unstake(stakingAmount)

            const aliceBalanceAfter = await dafi.balanceOf(alice.address)
            const aliceRealReward = aliceBalanceAfter.sub(aliceBalanceBefore).sub(stakingAmount)
            console.log('aliceRealReward', aliceRealReward.toString())

            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)

            const aliceUnstakingTime = aliceStakingAfter.lastUpdatedOn
            // alone
            const aliceStakingDuration1 = bobStakingTime.sub(aliceStakingTime)
            // with Bob
            const aliceStakingDuration2 = aliceUnstakingTime.sub(bobStakingTime)

            const expectedFee1 = aliceStakingDuration1.mul(startMDI).div(2)
            const expectedFee2 = aliceStakingDuration2.mul(startMDI).div(2).div(2)
            const expectedFee = expectedFee1.add(expectedFee2).div(4)
            const actualFee = await stakingDatabase.getFeesDeposited()

            console.log('expectedFee', expectedFee.toString())
            console.log('actualFee', actualFee.toString())

            checkValueWithCorrection(expectedFee, actualFee)

            await bobStakingManager.stake(1)
            const bobStakingBefore = await stakingDatabase.getUserStake(bob.address)
            console.log('totalUnclaimed', bobStakingBefore.totalUnclaimed.toString())
            console.log('feeBalance', bobStakingBefore.feeBalance.toString())
            const bobBalanceBefore = await dafi.balanceOf(bob.address)

            await priceFeeds.setPrice(7)
            await bobStakingManager.unstake(stakingAmount)
            const bobStakingAfter = await stakingDatabase.getUserStake(bob.address)
            const bobUnstakingTime = bobStakingAfter.lastUpdatedOn

            // with Alice
            const bobStakingDuration1 = aliceUnstakingTime.sub(bobStakingTime)
            // alone
            const bobStakingDuration2 = bobUnstakingTime.sub(aliceUnstakingTime)

            const bobExpectedReward1 = bobStakingDuration1.mul(startMDI).div(2)
            const bobExpectedReward2 = bobStakingDuration2.mul(startMDI)
            const bobExpectedRewardWithFee = bobExpectedReward1.add(bobExpectedReward2).mul(7).div(10).add(actualFee)
            const bobExpectedReward = bobExpectedRewardWithFee.mul(3).div(4)

            const bobBalanceAfter = await dafi.balanceOf(bob.address)
            const realReward = bobBalanceAfter.sub(bobBalanceBefore).sub(stakingAmount)

            console.log('bobExpectedReward', bobExpectedReward.toString())
            console.log('realReward', realReward.toString())

            checkValueWithCorrection(bobExpectedReward, realReward)
        })

        it('fee percentage can be updated and be different than 25%', async () => {
            await stakingManager.updateRewardFees(20)

            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn

            await advanceTime(1000)
            await priceFeeds.setPrice(5)
            await aliceStakingManager.unstake(stakingAmount)

            const aliceStakingAfter = await stakingDatabase.getUserStake(alice.address)
            const currentTime = aliceStakingAfter.lastUpdatedOn
            const stakingDuration = currentTime.sub(stakingTime)

            const expectedFee = stakingDuration.mul(startMDI).div(5).div(2)
            const actualFee = await stakingDatabase.getFeesDeposited()

            console.log('expectedFee', expectedFee.toString())
            console.log('actualFee', actualFee.toString())

            checkValueWithCorrection(expectedFee, actualFee)
        })

        it('fee percentage can be updated without causing any issue to existing fee', async () => {
            let aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const stakingTime = aliceStaking.lastUpdatedOn

            await advanceTime(1000)
            await priceFeeds.setPrice(5)
            await aliceStakingManager.unstake(stakingAmount)

            aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const currentTime = aliceStaking.lastUpdatedOn
            const stakingDuration = currentTime.sub(stakingTime)

            const expectedFee = stakingDuration.mul(startMDI).div(4).div(2)
            const actualFee = await stakingDatabase.getFeesDeposited()

            console.log('expectedFee', expectedFee.toString())
            console.log('actualFee', actualFee.toString())

            checkValueWithCorrection(expectedFee, actualFee)

            await stakingManager.updateRewardFees(10)
            await aliceStakingManager.stake(stakingAmount)

            const stakingTime1 = (await stakingDatabase.getUserStake(alice.address)).lastUpdatedOn
            advanceTime(1000)
            await aliceStakingManager.unstake(stakingAmount)
            const unstakingTime1 = (await stakingDatabase.getUserStake(alice.address)).lastUpdatedOn
            const stakingDuration1 = unstakingTime1.sub(stakingTime1)

            const expectedFee1 = stakingDuration1.mul(startMDI).div(10).div(2)
            const actualFee1 = await stakingDatabase.getFeesDeposited()

            console.log('expectedFee1', expectedFee1.toString())
            console.log('actualFee1', actualFee1.toString())

            checkValueWithCorrection(expectedFee1, actualFee1)
        })
    })

    describe('Governance', async () => {
        const stakingAmount = 1000000

        beforeEach(async () => {
            await approve(aliceDafi, bobDafi)
            await aliceStakingManager.stake(stakingAmount)
            await bobStakingManager.stake(stakingAmount)
        })

        it('updates MDI correctly', async () => {
            const firstMdi = await stakingDatabase.getDistributePerSecond()
            const startTime = (await stakingDatabase.getUserStake(alice.address)).lastUpdatedOn

            expect(firstMdi.eq(startMDI)).to.be.true

            await advanceTime(10000)
            const maxDafi = await stakingDatabase.getMaxDAFI()
            const newMaxDafi = maxDafi.mul(2)
            await stakingManager.extendProgram(1, newMaxDafi)

            const afterUpdateTime = await stakingDatabase.getPoolLastUpdatedOn()
            const duration1 = afterUpdateTime.sub(startTime)
            const expectedDistributedDafi1 = duration1.mul(startMDI)
            const distributedDafi1 = await stakingDatabase.getdDAFIDistributed()

            console.log('expectedDistributedDafi1', expectedDistributedDafi1.toString())
            console.log('distributedDafi1', distributedDafi1.toString())
            expect(expectedDistributedDafi1.eq(distributedDafi1)).to.be.true

            await advanceTime(5000)
            await aliceStakingManager.stake(1)
            const currentTime = (await stakingDatabase.getUserStake(alice.address)).lastUpdatedOn
            const programDuration = await stakingDatabase.getProgramDuration()
            const expectedNewMdi = newMaxDafi.sub(expectedDistributedDafi1).div(programDuration.sub(duration1))
            const newMdi = await stakingDatabase.getDistributePerSecond()
            const expectedDistributedDafi2 = currentTime.sub(afterUpdateTime).mul(expectedNewMdi)
            const distributedDafi2Total = await stakingDatabase.getdDAFIDistributed()
            const distributedDafi2 = distributedDafi2Total.sub(distributedDafi1)

            console.log('expectedNewMdi', expectedNewMdi.toString())
            console.log('newMdi', newMdi.toString())
            console.log('distributedDafi2Total', distributedDafi2Total.toString())
            console.log('expectedDistributedDafi2', expectedDistributedDafi2.toString())
            console.log('distributedDafi2', distributedDafi2.toString())

            expect(expectedNewMdi.eq(newMdi)).to.be.true
            expect(expectedDistributedDafi2.eq(distributedDafi2)).to.be.true
        })

        it('reflects correct reward if max reward changes', async () => {
            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const aliceStakingTime = aliceStaking.lastUpdatedOn
            const bobStaking = await stakingDatabase.getUserStake(bob.address)
            const bobStakingTime = bobStaking.lastUpdatedOn

            await advanceTime(40000)
            await priceFeeds.setPrice(5)

            const maxDafi = await stakingDatabase.getMaxDAFI()
            const newMaxDafi = maxDafi.mul(2)
            await stakingManager.extendProgram(1, newMaxDafi)

            const programDuration = await stakingDatabase.getProgramDuration()
            const afterUpdateTime = await stakingDatabase.getPoolLastUpdatedOn()
            const duration1 = afterUpdateTime.sub(aliceStakingTime)
            const expectedDistributedDafi1 = duration1.mul(startMDI)
            const expectedNewMdi = newMaxDafi.sub(expectedDistributedDafi1).div(programDuration.sub(duration1))

            await advanceTime(40000)

            const bobBalanceBefore = await dafi.balanceOf(bob.address)
            await bobStakingManager.unstake(stakingAmount)

            const bobStakingAfter = await stakingDatabase.getUserStake(bob.address)
            const bobUnstakingTime = bobStakingAfter.lastUpdatedOn

            const bobStakingDuration1 = afterUpdateTime.sub(bobStakingTime)
            const bobStakingDuration2 = bobUnstakingTime.sub(afterUpdateTime)

            const expectedReward1 = bobStakingDuration1.mul(startMDI)
            const expectedReward2 = bobStakingDuration2.mul(expectedNewMdi)
            const expectedReward = expectedReward1.add(expectedReward2).mul(3).div(4).div(2).div(2)

            const bobBalanceAfter = await dafi.balanceOf(bob.address)
            const balanceIncrease = bobBalanceAfter.sub(bobBalanceBefore).sub(stakingAmount)

            console.log('expectedReward', expectedReward.toString())
            console.log('balanceIncrease', balanceIncrease.toString())
            console.log('expectedNewMdi', expectedNewMdi.toString())
            console.log('newMdi', (await stakingDatabase.getDistributePerSecond()).toString())

            checkValueWithCorrection(expectedReward, balanceIncrease)
        })

        it('reflects correct reward if program duration changes', async () => {
            const aliceStaking = await stakingDatabase.getUserStake(alice.address)
            const aliceStakingTime = aliceStaking.lastUpdatedOn
            const bobStaking = await stakingDatabase.getUserStake(bob.address)
            const bobStakingTime = bobStaking.lastUpdatedOn

            await advanceTime(40000)
            await priceFeeds.setPrice(5)

            const maxDafi = await stakingDatabase.getMaxDAFI()
            await stakingManager.extendProgram(3, maxDafi)

            const programDuration = await stakingDatabase.getProgramDuration()
            const afterUpdateTime = await stakingDatabase.getPoolLastUpdatedOn()
            const duration1 = afterUpdateTime.sub(aliceStakingTime)
            const expectedDistributedDafi1 = duration1.mul(startMDI)
            const expectedNewMdi = maxDafi.sub(expectedDistributedDafi1).div(programDuration.sub(duration1))

            await advanceTime(40000)

            const bobBalanceBefore = await dafi.balanceOf(bob.address)
            await bobStakingManager.unstake(stakingAmount)

            const bobStakingAfter = await stakingDatabase.getUserStake(bob.address)
            const bobUnstakingTime = bobStakingAfter.lastUpdatedOn

            const bobStakingDuration1 = afterUpdateTime.sub(bobStakingTime)
            const bobStakingDuration2 = bobUnstakingTime.sub(afterUpdateTime)

            const expectedReward1 = bobStakingDuration1.mul(startMDI)
            const expectedReward2 = bobStakingDuration2.mul(expectedNewMdi)
            const expectedReward = expectedReward1.add(expectedReward2).mul(3).div(4).div(2).div(2)

            const bobBalanceAfter = await dafi.balanceOf(bob.address)
            const balanceIncrease = bobBalanceAfter.sub(bobBalanceBefore).sub(stakingAmount)

            console.log('expectedReward', expectedReward.toString())
            console.log('balanceIncrease', balanceIncrease.toString())
            console.log('expectedNewMdi', expectedNewMdi.toString())
            console.log('newMdi', (await stakingDatabase.getDistributePerSecond()).toString())

            checkValueWithCorrection(expectedReward, balanceIncrease)
        })

        it('program can be extended without affecting reward distribution', async () => {
            const bobStaking = await stakingDatabase.getUserStake(bob.address)
            const bobStakingTime = bobStaking.lastUpdatedOn

            await advanceTime(40000)
            await priceFeeds.setPrice(5)

            const maxDafi = await stakingDatabase.getMaxDAFI()
            const newMaxDafi = maxDafi.mul(2)
            await stakingManager.extendProgram(2, newMaxDafi)

            await advanceTime(40000)

            const bobBalanceBefore = await dafi.balanceOf(bob.address)
            await bobStakingManager.unstake(stakingAmount)

            const bobStakingAfter = await stakingDatabase.getUserStake(bob.address)
            const bobUnstakingTime = bobStakingAfter.lastUpdatedOn

            const bobStakingDuration = bobUnstakingTime.sub(bobStakingTime)
            const expectedReward = bobStakingDuration.mul(startMDI).mul(3).div(4).div(2).div(2)

            const bobBalanceAfter = await dafi.balanceOf(bob.address)
            const balanceIncrease = bobBalanceAfter.sub(bobBalanceBefore).sub(stakingAmount)

            console.log('expectedReward', expectedReward.toString())
            console.log('balanceIncrease', balanceIncrease.toString())

            checkValueWithCorrection(expectedReward, balanceIncrease)
        })
    })
})
