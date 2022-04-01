// import { ethers, network, waffle } from 'hardhat'
// import chai from 'chai'
// import TVLFeedsArtifact from '../artifacts/contracts/network demand/TVLFeeds.sol/TVLFeeds.json'
// import PriceFeedsArtifact from '../artifacts/contracts/testing/MockPriceFeeds.sol/MockPriceFeeds.json'
// import MockTokenArtifact from '../artifacts/contracts/testing/MockToken.sol/MockToken.json'
// import NetworkDemandArtifact from '../artifacts/contracts/network demand/NetworkDemand.sol/NetworkDemand.json'
// import StakingDatabaseArtifact from '../artifacts/contracts/StakingDatabase.sol/StakingDatabase.json'
// import TokenPoolArtifact from '../artifacts/contracts/TokenPool.sol/TokenPool.json'
// import RebaseEngineNewArtifact from '../artifacts/contracts/rebase engine/RebaseEngineNew.sol/RebaseEngine.json'
// import StakingManagerArtifact from '../artifacts/contracts/StakingManagerV1.sol/StakingManagerV1.json'
// import {
//     MockPriceFeeds,
//     MockToken,
//     MockToken__factory,
//     NetworkDemand,
//     RebaseEngine,
//     StakingDatabase,
//     StakingManagerV1 as StakingManager,
//     StakingManagerV1__factory,
//     TokenPool,
//     TVLFeeds,
// } from '../typechain'
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// const { deployContract } = waffle
// const { expect } = chai

// describe('SS', () => {
//     let tvlFeeds: TVLFeeds
//     let priceFeeds: MockPriceFeeds
//     let dafi: MockToken
//     let networkDemand: NetworkDemand
//     let stakingDatabase: StakingDatabase
//     let tokenPool: TokenPool
//     let rebaseEngine: RebaseEngine
//     let stakingManager: StakingManager

//     let owner: SignerWithAddress
//     let alice: SignerWithAddress
//     let bob: SignerWithAddress

//     // time
//     let startTime: number

//     beforeEach(async () => {
//         // get signers
//         const signers = await ethers.getSigners()
//         owner = signers[0]
//         alice = signers[1]
//         bob = signers[2]

//         // network demand
//         tvlFeeds = (await deployContract(owner, TVLFeedsArtifact)) as TVLFeeds
//         priceFeeds = (await deployContract(owner, PriceFeedsArtifact)) as MockPriceFeeds

//         // token
//         dafi = (await deployContract(owner, MockTokenArtifact, ['DAFI Protocol', 'DAFI', [], []])) as MockToken
//         await dafi.mint('10000000000000000')
//         await dafi.transfer(alice.address, 1000)
//         await dafi.transfer(bob.address, 1000)

//         // network demand
//         networkDemand = (await deployContract(owner, NetworkDemandArtifact, [
//             dafi.address,
//             priceFeeds.address,
//             tvlFeeds.address,
//         ])) as NetworkDemand
//         await networkDemand.setTVLPercentage(0)
//         await networkDemand.setPricePercentage(10000)
//         await networkDemand.setTargetTVL(0)
//         await networkDemand.setTargetPrice(10)

//         // database
//         stakingDatabase = (await deployContract(owner, StakingDatabaseArtifact)) as StakingDatabase

//         // token pool
//         tokenPool = (await deployContract(owner, TokenPoolArtifact, [dafi.address])) as TokenPool
//         await dafi.transfer(tokenPool.address, '100000000000')

//         // rabase engine
//         rebaseEngine = (await deployContract(owner, RebaseEngineNewArtifact)) as RebaseEngine
//         await rebaseEngine.initialize(networkDemand.address, stakingDatabase.address)

//         // staking manager
//         stakingManager = (await deployContract(owner, StakingManagerArtifact, [dafi.address])) as StakingManager

//         // whitelisting
//         await stakingDatabase.addWhitelist(stakingManager.address)
//         await stakingDatabase.addWhitelist(rebaseEngine.address)
//         await stakingDatabase.addWhitelist(owner.address)

//         // initializee staking manager
//         await stakingManager.initialize(
//             stakingDatabase.address,
//             rebaseEngine.address,
//             networkDemand.address,
//             tokenPool.address,
//             0,
//             0,
//             864000, // (24 * 60 * 60) * (1 / 0.1)
//             25,
//             1
//         ) // 1 dDAFI / second at the beginning, max 10 DAFI / second

//         await networkDemand.addWhitelist(stakingManager.address)
//         await networkDemand.addWhitelist(rebaseEngine.address)

//         await rebaseEngine.addWhitelist(stakingManager.address)

//         await tokenPool.addWhitelist(stakingManager.address)

//         // enable staking
//         await stakingManager.enableStaking()
//     })

//     const advanceTime = async (seconds: number) => {
//         await network.provider.send('evm_increaseTime', [seconds])
//         await network.provider.send('evm_mine')
//     }

//     const advanceBlocks = async (blocks: number) => {
//         for (let i = 0; i < blocks; ++i) {
//             await network.provider.send('evm_mine')
//         }
//     }

//     const enableStaking = async () => {
//         await Promise.all([stakingManager.enableStaking(), stakingManager.enableUnstaking()])
//     }

//     const approve = async () => {
//         const aliceDafi = MockToken__factory.connect(dafi.address, alice)
//         const bobDafi = MockToken__factory.connect(dafi.address, bob)
//         await Promise.all([
//             dafi.approve(stakingManager.address, '1000000000000'),
//             aliceDafi.approve(stakingManager.address, '1000000000000'),
//             bobDafi.approve(stakingManager.address, '1000000000000'),
//         ])
//     }

//     const getTimeStamp = async (): Promise<number> => {
//         const blockNumber = await ethers.provider.getBlockNumber()
//         const timestamp = (await ethers.provider.getBlock(blockNumber)).timestamp
//         return timestamp
//     }

//     // network demand
//     describe('price feeds', async () => {
//         it('sets the price', async () => {
//             await priceFeeds.setPrice(1)
//             const price = await priceFeeds.getThePrice()
//             expect(price).to.equal(1)
//         })

//         it('returns correct df', async () => {
//             const df = await networkDemand.calculateNetworkDemand()
//             expect(df).to.equal(10_000_000) // 0.1 * EIGHT_DECIMALS

//             await priceFeeds.setPrice(5)
//             const df5 = await networkDemand.calculateNetworkDemand()
//             expect(df5).to.equal(50_000_000) // 0.5 * EIGHT_DECIMALS

//             await priceFeeds.setPrice(10)
//             const df10 = await networkDemand.calculateNetworkDemand()
//             expect(df10).to.equal(100_000_000) // 1 * EIGHT_DECIMALS
//         })
//     })

//     // staking
//     describe('staking', async () => {
//         beforeEach(async () => {
//             await Promise.all([enableStaking(), approve()])
//         })

//         it('allows stake & unstake', async () => {
//             await stakingManager.stake(100)
//             await stakingManager.unstake(100)
//         })

//         it('acknowledges new df', async () => {
//             const aliceStakingManager = StakingManagerV1__factory.connect(stakingManager.address, alice)

//             await aliceStakingManager.stake(100)
//             await advanceTime(1000)
            
//             const balanceBeforeUnstake = await dafi.balanceOf(alice.address)
//             // console.log("balanceBeforeUnstake", balanceBeforeUnstake.toString())
            
//             await priceFeeds.setPrice(10)
            
//             await aliceStakingManager.unstake(100)
            
//             const balanceAfterUnstake = await dafi.balanceOf(alice.address)
//             // console.log("balanceAfterUnstake", balanceAfterUnstake.toString())

//             const reward = balanceAfterUnstake.sub(balanceBeforeUnstake).sub(100).toNumber()
//             const minReward = 7400
//             const maxReward = 7600

//             expect(reward).to.be.lessThan(maxReward)
//             expect(reward).to.be.greaterThan(minReward)
//         })
//     })
// })
