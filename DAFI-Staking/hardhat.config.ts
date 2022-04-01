import { task } from 'hardhat/config'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import './tasks'

task('accounts', 'Prints the list of accounts', async (args, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

export default {
    solidity: '0.8.0',
    hardhat: {
        gas: 12000000,
        blockGasLimit: 0x1fffffffffffff,
        allowUnlimitedContractSize: true,
    },
    networks: {
        mainnet: {
            url: 'https://eth-mainnet.alchemyapi.io/v2/zw3QH-DG8flFSJZXnW9sWNJwENsualhw',
            accounts: ['635c2c0b7b10709511a2ff4630164e8c1dfa14a42bd28a0fe9bfdaae3949ce89'],
        },
    },
    plugins: ['truffle-contract-size'],
    compilers: {
        solc: {
            version: '0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
}
