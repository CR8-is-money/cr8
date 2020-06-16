import { ethers } from 'ethers'

/**
 * Takes a BigNumber and formats it into a decimal string
 * Typically ethers.utils.formatEther is going to convert wei to Ether, but this will
 * work for any 10**18 value
 * @param {BigNumber} val value as a BigNumber
 * @param {int} decimalPlaces number of places after the decimal
 * @returns {String} returns value as a decimal string
 *
 * @example Use to convert '766078771731921541' to '0.766078771731921541'
 */
export const formatBigInt = (val, decimalPlaces = 8) => {
  const bigNum = val instanceof ethers.BigNumber
  if (!bigNum) {
    throw new TypeError('Must be of type BigNumber')
  }

  const formatted = ethers.utils.formatEther(val)
  const index = formatted.indexOf('.')
  const end = 1 + index + decimalPlaces
  return formatted.slice(0, end)
}

/**
 * Takes a decimal string and formats it into a BigNumber
 * Typically ethers.utils.formatEther is going to Ether to a BigNumber instance of the
 * amount of wei, but this will work for any 10**18 value
 * @param {String} val value as an ether string
 * @returns {BigNumber} returns value as a BigNumber instance
 *
 * @example Use to convert '0.766078771731921541' to '766078771731921541'
 */
export const parseBigInt = (val) => ethers.utils.parseEther(val)

/**
 * Formats Ethereum network name
 */
export const formatNetwork = (val) => {
  if (val === 'homestead') {
    return 'Main Ethereum'
  }
  return val
}
