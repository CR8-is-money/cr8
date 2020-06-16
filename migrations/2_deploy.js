/* global artifacts */

const BestRateCr8 = artifacts.require('BestRateCR8')
const SWCR8 = artifacts.require('SupplyWeightedCR8')

const infrastructure = {
  kovan: {
    developer: '0x425249Cf0F2f91f488E24cF7B1AA3186748f7516',
    DAI: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
    cDAI: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
    CHAI: '0xb641957b6c29310926110848db2d464c8c3c3f38'
  },
  mainnet: {
    developer: 'Satsuma Nagaimo',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    cDAI: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    CHAI: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215'
  }
}

module.exports = async (deployer, network) => {
  const addrs = infrastructure[network]
  if (!addrs || ['test', 'development', 'coverage'].includes(network)) {
    // test deploys are done in tests
    return
  }

  console.log('')
  console.log('Welcome to cr8')
  console.log(`#ShipIt on ${network}`)
  console.log(`Pay the man: ${addrs.developer}`)
  console.log('That look good?')
  console.log('')
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const br = await deployer.deploy(BestRateCr8, addrs.cDAI, addrs.CHAI, addrs.DAI, addrs.developer)
  const sw = await deployer.deploy(SWCR8, addrs.cDAI, addrs.CHAI, addrs.DAI, addrs.developer)
  console.log(`BestRateCr8 deployed at ${br.address}`)
  console.log(`SWCR8 deployed at ${sw.address}`)
}
