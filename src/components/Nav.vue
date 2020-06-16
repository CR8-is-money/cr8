<template>
  <v-app-bar class="nav" height="160" fixed>
    <v-container class="nav__container">
      <v-layout align-center>
        <v-layout align-center>
          <Boat class="nav__boat"></Boat>
          <h1 class="nav__title">CRATE</h1>
        </v-layout>

        <v-layout justify-end align-center>
          <router-link
            to="/"
            class="nav__tile link"
          >
            <h4 class="font-light">HOME</h4>
          </router-link>

          <router-link
            to="/faq"
            class="nav__tile link"
          >
            <h4 class="font-light">FAQ</h4>
          </router-link>

          <v-btn
            v-if="!connected"
            @click="setup"
            class="ml-3"
          >
            Connect Wallet
          </v-btn>
        </v-layout>
      </v-layout>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Nav',

  computed: {
    ...mapState({
      connected: (state) => state.connected
    })
  },

  components: {
    Boat: () => import('@/components/Boat')
  },

  methods: {
    async setup () {
      await this.$store.dispatch('setup')
    }
  }
}
</script>

<style lang='stylus' scoped>
.nav
  // to remove disclaimer:
  // max-height 100px
  max-height 160px
  z-index 10
  &__container
    // to remove disclaimer:
    // remove padding
    padding-top 60px
    max-width 1264px
  &__boat
    height 80px
    width 80px
  &__title
    font-weight 200 !important
    letter-spacing 15px
    font-size 30px
    margin-left 10px
  &__tile
    height 100%
    margin 0 5px
    padding 15px 25px
    transition background-color 0.4s
    &:hover
      background-color rgba(200,200,200,0.2)
      cursor pointer
</style>
