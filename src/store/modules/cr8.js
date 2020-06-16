import { ethers } from 'ethers'
import * as types from '../mutation-types'
import * as errors from '../error-messages'
import * as CR8 from '../../../lib/cr8'

const state = {
  cr8DAIValue: localStorage.getItem('cr8DaiValue') ? ethers.BigNumber.from(localStorage.getItem('cr8DaiValue')) : ethers.BigNumber.from(0),
  balanceOf: localStorage.getItem('CR8Balance') ? ethers.BigNumber.from(localStorage.getItem('CR8Balance')) : ethers.BigNumber.from(0)
}

const mutations = {
  [types.SET_CR8_RESPONSE_VALUE] (state, { key, value }) {
    state[key] = value
  }
}

const actions = {
  async balanceOf ({ commit, rootState }) {
    try {
      const result = await CR8.balanceOf(rootState.address)
      commit(types.SET_CR8_RESPONSE_VALUE, {
        key: 'balanceOf',
        value: result
      })
      localStorage.setItem('CR8Balance', result)
    } catch (e) {
      console.error(errors.CR8_BALANCE, e)
    }
  },

  async cr8DAIValue ({ commit, rootState }) {
    try {
      const result = await CR8.cr8DAIValue(rootState.address)
      commit(types.SET_CR8_RESPONSE_VALUE, {
        key: 'cr8DAIValue',
        value: result
      })
      localStorage.setItem('cr8DaiValue', result)
    } catch (e) {
      console.error(errors.EXCHANGE_RATE, e)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
