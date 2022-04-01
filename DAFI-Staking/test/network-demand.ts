import { ethers, waffle } from 'hardhat'
import chai from 'chai'
import TVLFeedsArtifact from '../artifacts/contracts/network demand/TVLFeeds.sol/TVLFeeds.json'
import PriceFeedsArtifact from '../artifacts/contracts/testing/MockPriceFeeds.sol/MockPriceFeeds.json'
import MockTokenArtifact from '../artifacts/contracts/testing/MockToken.sol/MockToken.json'
import NetworkDemandArtifact from '../artifacts/contracts/network demand/NetworkDemand.sol/NetworkDemand.json'
import {
    MockPriceFeeds,
    MockToken,
    NetworkDemand,
    TVLFeeds,
} from '../typechain'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const { deployContract } = waffle
const { expect } = chai

describe('Network Demand', () => {
    let tvlFeeds: TVLFeeds
    let priceFeeds: MockPriceFeeds
    let dafi: MockToken
    let networkDemand: NetworkDemand

    let owner: SignerWithAddress

    beforeEach(async () => {
        // get signers
        const signers = await ethers.getSigners()
        owner = signers[0]

        // network demand
        tvlFeeds = (await deployContract(owner, TVLFeedsArtifact)) as TVLFeeds
        priceFeeds = (await deployContract(owner, PriceFeedsArtifact)) as MockPriceFeeds

        // token
        dafi = (await deployContract(owner, MockTokenArtifact, ['DAFI Protocol', 'DAFI', [], []])) as MockToken
        await dafi.mint('10000000000000000')

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
    })

    // describe('price feeds', async () => {
    //     it('sets the price', async () => {
    //         await priceFeeds.setPrice(1)
    //         const price = await priceFeeds.getThePrice()
    //         expect(price).to.equal(1)
    //     })

    //     it('returns correct df', async () => {
    //         const df = await networkDemand.calculateNetworkDemand()
    //         expect(df).to.equal(10_000_000) // 0.1 * EIGHT_DECIMALS

    //         await priceFeeds.setPrice(5)
    //         const df5 = await networkDemand.calculateNetworkDemand()
    //         expect(df5).to.equal(50_000_000) // 0.5 * EIGHT_DECIMALS

    //         await priceFeeds.setPrice(10)
    //         const df10 = await networkDemand.calculateNetworkDemand()
    //         expect(df10).to.equal(100_000_000) // 1 * EIGHT_DECIMALS
    //     })
    // })

    // describe('price update', async () => {
    //     it('only accepts price that is not too far from previous price', async () => {
            
    //     })

    //     it('uses TWAP', async () => {
    //         // less than threshold (beginning)

    //         // enough threshold (mid -> end)
    //     })
    // })
})
