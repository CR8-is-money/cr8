import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import * as errors from './error-messages'
import alerts from './modules/alerts'
import cr8 from './modules/cr8'
import dai from './modules/dai'
import { parseBigInt } from '../filters/index'
import * as CR8 from '../../lib/cr8'

Vue.use(Vuex)

const state = {
  network: '',
  signer: undefined,
  provider: undefined,
  contracts: {},
  connected: false, // Connected to Metamask
  supportedNetwork: false // Connected to Metamask and on the right network
}

const mutations = {
  [types.SET_ADDRESS] (state, address) {
    state.address = address
  },

  [types.SET_CONNECTED] (state, connected) {
    state.connected = connected
  },

  [types.SET_PROVIDER] (state, provider) {
    state.provider = provider
  },

  [types.SET_SUPPORTED_NETWORK] (state, supported) {
    state.supportedNetwork = supported
  },

  [types.SET_NETWORK] (state, network) {
    state.network = network
  }
}

const actions = {
  async setAddress ({ commit }) {
    try {
      const address = await CR8.getAddress()
      commit(types.SET_ADDRESS, address)
      return true
    } catch (e) {
      return e
    }
  },

  addListeners ({ dispatch }) {
    window.ethereum.on('networkChanged', () => {
      dispatch('setup')
    })
  },

  async setup ({ commit, dispatch }) {
    dispatch('addListeners')

    try {
      const provider = await CR8.getMetamaskProvider()
      commit(types.SET_PROVIDER, provider)
      commit(types.SET_CONNECTED, true)
      const network = await CR8.getNetwork()
      commit(types.SET_NETWORK, network)
    } catch (e) {
      commit(types.SET_CONNECTED, false)
    }

    try {
      const isSupported = await CR8.verifyNetwork()

      if (isSupported) {
        commit(types.SET_SUPPORTED_NETWORK, true)
        await CR8.setup()
        await dispatch('setAddress')

        dispatch('alerts/clearAlert')
        dispatch('poll')

        setInterval(() => {
          dispatch('poll')
        }, 5000)
      } else {
        commit(types.SET_SUPPORTED_NETWORK, false)
        dispatch('alerts/openAlert', { message: errors.NETWORK })
      }
    } catch (e) {
      console.log({ e })
      const payload = {
        message: errors.SETUP,
        error: e
      }
      dispatch('alerts/openAlert', payload)
    }
  },

  /**
   * Get DAI balance, CR8 balance, cR8DAI exchange rate
   */
  async poll ({ dispatch }) {
    dispatch('dai/balanceOf')
    dispatch('cr8/balanceOf')
    dispatch('cr8/cr8DAIValue')
  },

  async pack ({ dispatch }, packAmount) {
    dispatch('alerts/processing', 'Packing DAI . . .  Confirm transaction on Metamask . . .')

    const amount = parseBigInt(packAmount)

    try {
      const approveTx = await CR8.approveDAI(amount)
      await approveTx.wait()
    } catch (e) {
      const payload = {
        message: errors.APPROVE_DAI,
        error: e
      }
      dispatch('alerts/openAlert', payload)
    }

    dispatch('alerts/updateProcessingStatus', 'DAI approved, watch Metamask for 2nd portion of transaction.')

    try {
      const packTx = await CR8.pack(amount, true)
      await packTx.wait()
    } catch (e) {
      const payload = {
        message: errors.PACK,
        error: e
      }
      dispatch('alerts/openAlert', payload)
    }

    // Get new CR8 amount and alert user of success!
    dispatch('cr8/balanceOf')

    dispatch('alerts/updateProcessingStatus', 'Transaction complete! CR8 transferred to account.')

    // Close processing bar
    setTimeout(() => {
      dispatch('alerts/endProcessing')
    }, 3000)
  },

  async unpack ({ dispatch }, unpackAmount) {
    dispatch('alerts/processing', 'Unpacking CR8 . . . Confirm transaction on Metamask . . . ')

    const amount = parseBigInt(unpackAmount)

    try {
      const unpackTx = await CR8.unpack(amount, true)
      await unpackTx.wait()
    } catch (e) {
      const payload = {
        message: errors.UNPACK,
        error: e
      }
      dispatch('alerts/openAlert', payload)
    }

    // Get new DAI amount and alert user of success!
    dispatch('dai/balanceOf')

    dispatch('alerts/updateProcessingStatus', 'Transaction complete! DAI transferred to account.')

    // Close processing bar
    setTimeout(() => {
      dispatch('alerts/endProcessing')
    }, 3000)
  },

  async getContractInfo () {
    await CR8.setup()
    const supply = await CR8.getCR8().totalSupply()
    const crate = await CR8.crate()
    const other = await CR8.cDAIPerBlockRate()
    const CHAIper = await CR8.CHAIPerBlockRate()
    console.log({
      supply,
      crate,
      other,
      CHAIper
    })
  },

}

export default new Vuex.Store({
  namespaced: true,
  modules: {
    cr8,
    dai,
    alerts
  },
  state,
  mutations,
  actions
})
