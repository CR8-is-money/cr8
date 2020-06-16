/* eslint-disable no-else-return */

/**
 * cr8 functions to interact with Ethereum contract
 */
import { ethers } from 'ethers'
import cr8abi from './cr8.abi.json'
import erc20abi from './erc20.abi.json'

let cr8
let DAI
let signer
let provider
let contracts
let network

export const contractAddresses = {
  kovan: {
    cr8: '0x511370c1380dE7f2d5c0da6129f68BBB28759251', // TEMP ALPHA
    DAI: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa'
  }
}

export const getMetamaskProvider = async () => {
  await window.ethereum.enable()
  provider = new ethers.providers.Web3Provider(window.ethereum)
  return provider
}

export const getNetwork = async () => {
  const { name } = await provider.ready
  network = name
  return name
}

export const verifyNetwork = async () => {
  const { name } = await provider.ready
  network = name
  return Object.keys(contractAddresses).find((s) => s === name)
}

export const setup = async () => {
  if (cr8) return

  if (!provider) {
    await getMetamaskProvider()
    await getNetwork()
  }

  // Get contract addresses based on network
  contracts = contractAddresses[network]
  // Get a corresponding signer
  signer = provider.getSigner()

  cr8 = new ethers.Contract(contracts.cr8, cr8abi, signer)
  DAI = new ethers.Contract(contracts.DAI, erc20abi, signer)
}

export const getCR8 = (writable) => (writable ? cr8 : cr8.callStatic)

export const getAddress = async () => signer.getAddress()

// action
export const pack = async (amount, execute) => {
  // BEGIN DIRTY HACKS
  let dataStr = amount.toHexString().slice(2)
  dataStr = `${'00'.repeat(32)}${dataStr}`.slice(-64)
  dataStr = `0x6ea42555${dataStr}`
  const transaction = {
    to: cr8.address,
    data: dataStr,
    gasLimit: ethers.BigNumber.from('1000000')
  }
  if (execute) return signer.sendTransaction(transaction)

  transaction.from = await signer.getAddress()
  return provider.call(transaction)
  // END DIRTY HACKS
}

// action
export const unpack = async (amount, execute) => {
  // BEGIN DIRTY HACKS
  let dataStr = amount.toHexString().slice(2)
  dataStr = `${'00'.repeat(32)}${dataStr}`.slice(-64)
  dataStr = `0x8a02be68${dataStr}`
  const transaction = {
    to: cr8.address,
    data: dataStr,
    gasLimit: ethers.BigNumber.from('1000000')
  }
  if (execute) return signer.sendTransaction(transaction)

  transaction.from = await signer.getAddress()
  return provider.call(transaction)
  // END DIRTY HACKS
}

export const crate = async () => cr8.callStatic.crate()

export const target = async (execute) => {
  const c = execute ? cr8 : cr8.callStatic
  return c.target()
}

export const packedDAI = async (execute) => {
  const c = execute ? cr8 : cr8.callStatic
  return c.packedDAI()
}

export const daiShare = async (address, execute) => {
  const c = execute ? cr8 : cr8.callStatic
  return c.daiShare(address)
}

export const cr8DAIValue = async () => {
  const supply = await cr8.callStatic.totalSupply()
  if (supply.eq(0)) return ethers.BigNumber.from(0)
  const cr8DAI = await cr8.callStatic.packedDAI()
  return cr8DAI.mul(ethers.constants.WeiPerEther).div(supply)
}

export const packable = async (address) => cr8.callStatic.packable(address)

export const cDAIPerBlockRate = async () => cr8.callStatic.cDAIPerBlockRate()

export const CHAIPerBlockRate = async () => cr8.callStatic.CHAIPerBlockRate()

export const balanceOf = async (address) => cr8.callStatic.balanceOf(address)

export const DAIBalanceOf = async (address) => DAI.balanceOf(address)

export const approveDAI = async (amount) => DAI.approve(contracts.cr8, amount)

// Usage (see src/App.vue)
// import * as CR8 from '../lib/cr8'

// function test() {
//   // CR8.pack()
//   // CR8.unpack()
// }
