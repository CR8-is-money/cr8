<template>
  <v-alert
    v-model="balanceAlert"
    dense
    type="info"
    color="#6cc1ff"
    transition="slide-x-reverse-transition"
    class="balance-alert"
  >
    <p v-if="DAIChange">{{ operator(DAIChange) }}{{ DAIChange | formatBigInt }} DAI</p>
    <p v-if="CR8Change">{{ operator(CR8Change) }}{{ CR8Change | formatBigInt }} CR8</p>
  </v-alert>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BalanceAlert',

  data: () => ({
    timer: null
  }),

  computed: {
    ...mapState({
      balanceAlert: (state) => state.alerts.balanceAlert,
      DAIChange: (state) => state.alerts.DAIChange,
      CR8Change: (state) => state.alerts.CR8Change,
      CR8Balance: (state) => state.cr8.balanceOf,
      DAIBalance: (state) => state.dai.balanceOf
    })
  },

  methods: {
    operator (value) {
      if (value > 0) {
        return '+'
      }
      return ''
    },
    setTimer () {
      const self = this
      this.timer = setTimeout(() => {
        self.$store.dispatch('alerts/clearBalanceAlert')
      }, 8000)
    },
    resetTimer () {
      clearTimeout(this.timer)
      this.setTimer()
    }
  },

  watch: {
    CR8Balance (newBalance, oldBalance) {
      if (oldBalance !== null) {
        const value = newBalance.sub(oldBalance)
        if (!value.isZero()) {
          this.$store.dispatch('alerts/CR8BalanceAlert', value)
          this.resetTimer()
        }
      }
    },
    DAIBalance (newBalance, oldBalance) {
      if (oldBalance !== null) {
        const value = newBalance.sub(oldBalance)
        if (!value.isZero()) {
          this.$store.dispatch('alerts/DAIBalanceAlert', value)
          this.resetTimer()
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.balance-alert
  position fixed
  bottom 15px
  right -5px
  padding-right 40px
  z-index 2
  & p
    margin 0
</style>
