// import { formatEther } from '@ethersproject/units'
// import { task } from 'hardhat/config'
// import * as Addresses from '../constants/addressses'
// import { NetworkDemand__factory, RebaseEngine__factory, StakingDatabase__factory } from '../typechain'

// task('apy', 'Calculate APY with given parameters').setAction(async (_args, hre) => {
//     const signer = (await hre.ethers.getSigners())[0]

//     const networkDemandContract = NetworkDemand__factory.connect(Addresses.NETWORK_DEMAND_ETH_MAINNET, signer)
//     const networkDemand = await networkDemandContract.calculateNetworkDemand()

//     const databaseContract = StakingDatabase__factory.connect(Addresses.STAKING_DATABASE_ETH_MAINNET, signer)
//     const maxDafi = await databaseContract.getMaxDAFI()
//     const programDuration = await databaseContract.getProgramDuration()

//     const dps = maxDafi.div(programDuration)
//     const totalStakeAmount = await databaseContract.getTotalStaked()

//     const apy = dps
//         .mul(365 * 24 * 60 * 60)
//         .mul(4)
//         .div(10)
//         .div(10)
//         .mul(100)
//         .div(totalStakeAmount)

//     console.table({
//         maxDafi: formatEther(maxDafi),
//         totalStakeAmount: formatEther(totalStakeAmount),
//         programDuration: programDuration.toString(),
//         dps: formatEther(dps),
//         networkDemand: Number(networkDemand) / 100_000_000,
//         apy: apy.toString(),
//     })
// })

// task('staker', 'Staker Info').setAction(async (_args, hre) => {
//     const signer = (await hre.ethers.getSigners())[0]
//     const databaseContract = StakingDatabase__factory.connect(Addresses.STAKING_DATABASE_ETH_MAINNET, signer)

//     const staker = await databaseContract.getUserStake('0x78Ec73423B222cB225549bab0d0a812d58808Ffd')
//     console.log(staker)
// })