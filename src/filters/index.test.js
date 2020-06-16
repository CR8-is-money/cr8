import { ethers } from 'ethers'
import { formatBigInt, parseBigInt } from './index'

describe('parseBigInt', () => {
  test('parses large number successfully', () => {
    const expected = ethers.BigNumber.from('1000000000000000000')
    const actual = parseBigInt('1')
    const assert = expected.eq(actual)
    expect(assert).toBeTruthy()
  })

  test('parses small number successfully', () => {
    const expected = ethers.BigNumber.from('1')
    const actual = parseBigInt('0.000000000000000001')
    const assert = expected.eq(actual)
    expect(assert).toBeTruthy()
  })
})

describe('parseBigInt errors', () => {
  test('error if underflow', () => {
    const err = 'underflow occurred (operation="division", fault="underflow", version=4.0.45)'
    expect(() => parseBigInt('0.0000000000000000001')).toThrow(err)
  })

  test('error if not a string: Float', () => {
    const err = 'invalid decimal value (arg=\"value\", value=0.00001, version=4.0.45)'
    expect(() => parseBigInt(0.00001)).toThrow(err)
  })

  test('error if not a string: BigNumber', () => {
    const err = 'invalid decimal value (arg=\"value\", value={\"_hex\":\"0x01\"}, version=4.0.45)'
    expect(() => parseBigInt(ethers.BigNumber.from('1'))).toThrow(err)
  })
})

describe('formatBigInt', () => {
  test('formats successfully', () => {
    const expected = '10.0'
    const actual = formatBigInt(ethers.BigNumber.from('10000000000000000000'))
    expect(expected).toBe(actual)
  })

  test('cuts off 8 decimal places by default', () => {
    const expected = '0.12345678'
    const actual = formatBigInt(ethers.BigNumber.from('123456789123456789'))
    expect(expected).toBe(actual)
  })

  test('cuts off specified number of decimal places - 4', () => {
    const expected = '0.1234'
    const actual = formatBigInt(ethers.BigNumber.from('123456789123456789'), 4)
    expect(expected).toBe(actual)
  })

  test('cuts off specified number of decimal places - 10', () => {
    const expected = '0.1234567891'
    const actual = formatBigInt(ethers.BigNumber.from('123456789123456789'), 10)
    expect(expected).toBe(actual)
  })

  test('if there are less decimal places than the specifies number, it returns the number as is', () => {
    const expected = '0.123456789123456789'
    const actual = formatBigInt(ethers.BigNumber.from('123456789123456789'), 22)
    expect(expected).toBe(actual)
  })
})

describe('formatBigInt errors', () => {
  test('error if not a Big Number: Int', () => {
    const err = 'Must be of type BigNumber'
    expect(() => formatBigInt(1000000000)).toThrow(err)
  })

  test('error if not a Big Number: String', () => {
    const err = 'Must be of type BigNumber'
    expect(() => formatBigInt('1000000000000000000')).toThrow(err)
  })
})
