import * as types from '../mutation-types'

const state = {
  // general alert
  alertOpen: false,
  alertMessage: '',
  alertType: '',

  // processing alert
  processing: false,
  processingStatus: '',

  // balance alert
  balanceAlert: false,
  DAIChange: '',
  CR8Change: ''
}

const mutations = {
  // general alert
  [types.OPEN_ALERT] (state, payload) {
    const { message, error } = payload
    state.alertMessage = `${message} ${error && error.message ? ':' : ''} ${error ? error.message : ''}`
    state.alertType = 'error'
    console.error(payload)
    setTimeout(() => {
      state.alertOpen = true
    }, 500)
  },
  [types.CLEAR_ALERT] (state) {
    state.alertOpen = false
    setTimeout(() => {
      state.alertMessage = ''
      state.alertType = ''
    }, 500)
  },

  // processing alert
  [types.PROCESSING] (state, status) {
    state.processing = true
    if (status) {
      state.processingStatus = status
    }
  },
  [types.UPDATE_PROCESSING_STATUS] (state, status) {
    state.processingStatus = status
  },
  [types.END_PROCESSING] (state) {
    state.processing = false
    state.processingStatus = ''
  },

  // balance alert
  [types.DAI_BALANCE_ALERT] (state, value) {
    // console.log('DAI value change', value)
    state.DAIChange = value
    setTimeout(() => {
      state.balanceAlert = true
    }, 500)
  },
  [types.CR8_BALANCE_ALERT] (state, value) {
    // console.log('CR8 value change', value)
    state.CR8Change = value
    setTimeout(() => {
      state.balanceAlert = true
    }, 500)
  },
  [types.CLEAR_BALANCE_ALERT] (state) {
    state.balanceAlert = false
    setTimeout(() => {
      state.CR8Change = ''
      state.DAIChange = ''
    }, 500)
  }
}

const actions = {
  // general alert
  openAlert ({ commit }, payload) {
    commit(types.END_PROCESSING)
    commit(types.OPEN_ALERT, payload)
  },
  clearAlert ({ commit }) {
    commit(types.CLEAR_ALERT)
  },

  // processing alert
  processing ({ commit }, status) {
    commit(types.CLEAR_ALERT)
    commit(types.PROCESSING, status)
  },
  updateProcessingStatus ({ commit }, status) {
    commit(types.UPDATE_PROCESSING_STATUS, status)
  },
  endProcessing ({ commit }) {
    commit(types.END_PROCESSING)
  },

  // balance alert
  DAIBalanceAlert ({ commit }, value) {
    commit(types.DAI_BALANCE_ALERT, value)
  },
  CR8BalanceAlert ({ commit }, value) {
    commit(types.CR8_BALANCE_ALERT, value)
  },
  clearBalanceAlert ({ commit }) {
    commit(types.CLEAR_BALANCE_ALERT)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
