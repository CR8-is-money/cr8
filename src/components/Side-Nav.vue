<template>
  <v-navigation-drawer
    permanent
    clipped
    fixed
    class="side-nav"
  >
    <v-layout justify-center class="side-nav__exchange-rate mb-2">
      <h3 class="font-light">1 CR8 =
        <span v-if="exchangeRate">{{ exchangeRate | formatBigInt }}</span>
        <span v-else><v-icon color="error">remove</v-icon></span>
        DAI
      </h3>
    </v-layout>
    <v-layout column class="side-nav__balance">
      <h5 v-if="connected">
        Connected to <span class="text-capitalize">{{ network | formatNetwork }}</span> Network
        <hr class="my-4">
      </h5>
      <div v-if="supportedNetwork">
        <h4>Your CR8 Balance:</h4>
        <h4 class="font-light">
          You have
            <span v-if="CR8Balance && !CR8Balance.isZero()">
              {{ CR8Balance | formatBigInt }}
            </span>
            <span v-else>
              <v-icon color="error">remove</v-icon>
            </span>
          CR8
        </h4>
        <h4 class="font-light body-2 ml-5">
          = {{ daiValue | formatBigInt }} DAI
        </h4>
      </div>
    </v-layout>

    <v-layout column class="side-nav__balance">
      <div v-if="supportedNetwork">
        <h4>Your DAI Balance:</h4>
        <h4 class="font-light">
          You have
            <span v-if="DAIBalance && !DAIBalance.isZero()">
              {{ DAIBalance | formatBigInt }}
            </span>
            <span v-else>
              <v-icon color="error">remove</v-icon>
            </span>
          DAI
        </h4>
      </div>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { constants } from 'ethers'

export default {
  name: 'Nav',

  computed: {
    ...mapState({
      CR8Balance: (state) => state.cr8.balanceOf,
      DAIBalance: (state) => state.dai.balanceOf,
      exchangeRate: (state) => state.cr8.cr8DAIValue,
      network: (state) => state.network,
      connected: (state) => state.connected,
      supportedNetwork: (state) => state.supportedNetwork
    }),

    daiValue () {
      if (this.CR8Balance && this.exchangeRate) {
        return this.CR8Balance.mul(this.exchangeRate).div(constants.WeiPerEther)
      }
      return null
    }
  }
}
</script>

<style lang='stylus' scoped>
.side-nav
  // to remove disclaimer
  // padding-top 100px
  padding-top 160px
  box-shadow -1px 1px 5px #888888
  &__exchange-rate
    padding 10px 5px
    border-bottom 1px solid #000

  &__balance
    padding 10px

  &__logo
    position fixed
    bottom 20px
    left 10px
    width 120px
</style>
