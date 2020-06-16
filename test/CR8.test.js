/* global artifacts contract assert */
const BN = require('bn.js')

const CR8 = artifacts.require('TestingCR8')
const TestingCToken = artifacts.require('TestingCToken')
const TestingChai = artifacts.require('TestingChai')
const TestingPot = artifacts.require('TestingPot')


function assertAddressEquality (a, b, msg) {
  assert.strictEqual(
    a.toLowerCase(),
    b.toLowerCase(),
    msg
  )
}

function assertBNeq (a, b, name) {
  assert.instanceOf(b, BN)
  assert(a.eq(b), `wrong ${name}. Got ${a}, expected ${b}`)
}

function assertBNeqn (a, b, name) {
  assert.isNumber(b)
  assert(a.eqn(b), `wrong ${name}. Got ${a}, expected ${b}`)
}

function e (a, b) {
  return new BN(a).mul(new BN(10).pow(new BN(b)))
}


const ONE_ETHER = e(1, 18)
const HALF_ETHER = ONE_ETHER.divn(2)
const QUARTER_ETHER = ONE_ETHER.divn(4)

const DSR_ONE = e(1, 27)
const DSR = new BN('1000000002440418608258400030', 10)
const ADJ_DSR = new BN('1000000031725442371899357264', 10) // perblock

// cDAI Rate.  Must be adjusted to match maker rate
const CDR = new BN('36946002563', 10)
const ADJ_CDR = CDR.mul(new BN('1000000000')).add(DSR_ONE)

contract('CR8', async (accounts) => {
  let cr8
  let cDAI
  let CHAI
  let DAI
  let POT

  const [caller, developer] = accounts

  beforeEach(async () => {
    cDAI = await TestingCToken.new()
    CHAI = await TestingChai.new()
    POT = new TestingPot(await CHAI.pot.call())
    DAI = await TestingChai.new()

    await POT.setDSR(DSR)
    await cDAI.setSupplyRatePerBlock(CDR)

    cr8 = await CR8.new(
      cDAI.address,
      CHAI.address,
      DAI.address,
      developer
    )

    await DAI.mint(caller, ONE_ETHER)
  })

  describe('#constructor', async () => {
    it('inits and sets addresses', async () => {
      assertAddressEquality(
        await cr8.developer.call(),
        developer,
        'wrong address for developer'
      )
      assertAddressEquality(
        await cr8.cDAI.call(),
        cDAI.address,
        'wrong address for cDAI'
      )
      assertAddressEquality(
        await cr8.CHAI.call(),
        CHAI.address,
        'wrong address for cUSDC'
      )
      assertAddressEquality(
        await cr8.DAI.call(),
        DAI.address,
        'wrong array entry 0 for tokens'
      )
    })
  })

  describe('#crate', async () => {
    it('defaults to 50/50 if there is no ', async () => {
      const crate = await cr8.crate.call()
      assertBNeq(
        crate,
        ADJ_DSR.add(ADJ_CDR).divn(2)
      )
    })
  })

  describe('#pack', async () => {
    it('packs DAI', async () => {
      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })

      const packableBefore = await cr8.packable.call(caller)
      assertBNeq(packableBefore, HALF_ETHER, 'packable before')

      await cr8.pack(0, { from: caller })

      const packableAfter = await cr8.packable.call(caller)
      assertBNeqn(packableAfter, 0, 'packable after')

      const supply = await cr8.totalSupply.call()
      assertBNeq(supply, HALF_ETHER, 'supply')

      const cr8Bal = await cr8.balanceOf.call(caller)
      assertBNeq(cr8Bal, HALF_ETHER, 'cr8bal')
    })

    it('it errors if cdai.mint returns an error code', async () => {
      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })
      await cDAI.setMint(1)
      try {
        await cr8.pack(0, { from: caller })
        assert(false, 'expected an error')
      } catch (err) {
        assert.include(err.message, 'CR8Utils/_getCDAI --- cDAI mint failed')
      }
    })

    it('packs an amnt passed in', async () => {
      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })

      const toPack = HALF_ETHER.divn(10)
      await cr8.pack(toPack, { from: caller })

      const packableAfter = await cr8.packable.call(caller)
      assertBNeq(packableAfter, HALF_ETHER.sub(toPack), 'packable after')
    })

    it('adjusts holdings properly reasonably', async () => {
      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })

      const toPack = HALF_ETHER.divn(10)
      await cr8.pack(toPack, { from: caller })

      await cDAI.setBalanceOfUnderlying(10)
      await CHAI.setDAI(0)
      await cr8.setTarget(0)
      await cr8.pack(toPack, { from: caller })
    })

    it('errors on low amnt', async () => {
      try {
        await cr8.pack(1, { from: caller })
        assert(false, 'expected an error')
      } catch (err) {
        assert.include(err.message, 'CR8/pack --- amount too small')
      }
    })
  })

  describe('#unpack', async () => {
    it('unpacks tokens', async () => {
      // Compound uses 8 decimals
      await cDAI.mint(cr8.address, e(1, 8))
      await CHAI.mint(cr8.address, e(1, 18))
      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })
      await cr8.pack(0, { from: caller })
      await cr8.setTarget(ADJ_CDR.add(ADJ_DSR).divn(2))

      const supplyPre = await cr8.totalSupply.call()
      assertBNeq(supplyPre, HALF_ETHER, 'supply pre')

      await cr8.unpack(QUARTER_ETHER, { from: caller })

      const expected = QUARTER_ETHER.muln(251).divn(250)
      const supply = await cr8.totalSupply.call()
      assertBNeq(supply, expected, 'supply')

      const devBalance = await cr8.balanceOf(developer)
      assertBNeq(devBalance, QUARTER_ETHER.divn(250), 'dev balance')
    })

    it('errors if 0 amount', async () => {
      try {
        await cr8.unpack(0, { from: caller })
        assert(false, 'expected an error')
      } catch (err) {
        assert.include(err.message, 'CR8/unpack --- 0 amount')
      }
    })
  })

  describe('#crate', async () => {
    it('calculates the crate', async () => {
      // Compound uses 8 decimals
      await cDAI.mint(cr8.address, e(1, 8))
      await CHAI.mint(cr8.address, e(1, 18))

      const expectedCrate = ADJ_CDR.add(ADJ_DSR).divn(2)
      assertBNeq(await cr8.crate(), expectedCrate, 'crate')

      const newExpectedCrate = (ADJ_DSR.muln(2).add(ADJ_CDR)).divn(3)
      await CHAI.mint(cr8.address, ONE_ETHER)
      assertBNeq(await cr8.crate(), newExpectedCrate, 'new crate')
    })
  })

  describe('#packedDAI', async () => {
    it('returns the sum of CHAI DAI and cDAI DAI', async () => {
      await CHAI.setDAI(500)
      await cDAI.setBalanceOfUnderlying(1000)
      assertBNeqn(await cr8.packedDAI.call(), 500 + 1000, 'packedDAI')
    })
  })

  describe('#daiShare', async () => {
    it('returns the DAI share', async () => {
      await CHAI.setDAI(HALF_ETHER)
      await cDAI.setBalanceOfUnderlying(HALF_ETHER)
      await cr8.mint(caller, QUARTER_ETHER)
      await cr8.mint(developer, HALF_ETHER)

      const expected = QUARTER_ETHER.mul(ONE_ETHER).div(HALF_ETHER.add(QUARTER_ETHER))
      assertBNeq(await cr8.daiShare.call(caller), expected, 'daishare')
    })
  })

  describe('#packable', async () => {
    it('calculates the packable amount', async () => {
      let packable

      await DAI.approve(cr8.address, HALF_ETHER, { from: caller })
      packable = await cr8.packable.call(caller)
      assertBNeq(packable, HALF_ETHER, 'packable 1')

      await DAI.approve(cr8.address, ONE_ETHER, { from: caller })
      packable = await cr8.packable.call(caller)
      assertBNeq(packable, ONE_ETHER, 'packable 2')

      await cr8.pack(0, { from: caller })
      packable = await cr8.packable.call(caller)
      assertBNeqn(packable, 0, 'packable 3')
    })
  })

  describe('#per block rates', async () => {
    it('checks per block rates', async () => {
      const cdr = new BN('1000000036946002563000000000')
      const chr = new BN('1000000031725442371899357264')
      assertBNeq(
        await cr8.cDAIPerBlockRate.call(),
        cdr
      )
      assertBNeq(
        await cr8.CHAIPerBlockRate.call(),
        chr
      )

      // check _target call via target
      const tuple = await cr8.target.call()
      assertBNeqn(
        tuple[0],
        7 // dummy from TestingCR8.sol
      )
      assertBNeqn(
        tuple[1],
        7 // dummy from TestingCR8.sol
      )
    })
  })

  describe('#packed DAI amounts', async () => {
    it('checks packed DAI amounts', async () => {
      assertBNeqn(
        await cr8.packedInCDAI.call(),
        3 // dummy from TestingChai.sol
      )
      assertBNeqn(
        await cr8.packedInCHAI.call(),
        0 // dummy from TestingCToken.sol
      )
    })
  })
})
