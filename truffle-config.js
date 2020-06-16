require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')

const {
  INFKEY, ESKEY, KEYIDX, MNEM
} = process.env

const kovan = {
  // Use 5th key - 0x6dcc7a0e8859aee16915a626472ba16b8d7ab359
  provider: () => new HDWalletProvider(MNEM, `https://kovan.infura.io/v3/${INFKEY}`, parseInt(KEYIDX, 10)),
  gas: 5000000,
  network_id: 42,
  networkCheckTimeout: 15000,
  confirmations: 2,
  timeoutBlocks: 200
}

const mainnet = {
  provider: () => new HDWalletProvider(MNEM, `https://mainnet.infura.io/v3/${INFKEY}`, parseInt(KEYIDX, 10)),
  gas: 5000000,
  network_id: 1,
  confirmations: 2,
  timeoutBlocks: 200
}

module.exports = {
  networks: {
    kovan,
    mainnet,
    ganache: {
      network_id: '*',
      host: 'localhost',
      port: 8545
    }
  },

  // Configure your compilers
  compilers: {
    solc: {}
  },

  plugins: [
    'solidity-coverage',
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: ESKEY
  }
}
