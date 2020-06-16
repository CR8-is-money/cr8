import { ethers } from 'ethers'
import * as types from '../mutation-types'
import * as errors from '../error-messages'
import * as CR8 from '../../../lib/cr8'

const state = {
  balanceOf: localStorage.getItem('DAIBalance') ? ethers.BigNumber.from(localStorage.getItem('DAIBalance')) : ethers.BigNumber.from(0),
  approve: {
    amount: null,
    approved: false
  }
}

const mutations = {
  [types.SET_DAI_BALANCE_OF] (state, balance) {
    state.balanceOf = balance
  }
}

const actions = {
  async balanceOf ({ commit, rootState }) {
    try {
      const balance = await CR8.DAIBalanceOf(rootState.address)
      commit(types.SET_DAI_BALANCE_OF, balance)
      localStorage.setItem('DAIBalance', balance)
    } catch (e) {
      console.error(errors.DAI_BALANCE, e)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
