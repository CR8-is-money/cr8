<template>
  <v-app>
    <Loading v-if="loading"></Loading>

    <div v-else>
      <Disclaimer-Alert />
      <Nav />

      <v-layout>
        <Side-Nav />
        <div class="app__content">
          <Alerts />
          <div class="app__view">
            <router-view></router-view>
          </div>
        </div>
      </v-layout>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    Nav: () => import('@/components/Nav'),
    SideNav: () => import('@/components/Side-Nav'),
    Alerts: () => import('@/components/Alerts/Alerts.main'),
    DisclaimerAlert: () => import('@/components/Alerts/Disclaimer'),
    Loading: () => import('@/components/Loading')
  },

  data: () => ({
    loading: true
  }),

  async created () {
    // this.$store.dispatch('getContractInfo')
    setTimeout(() => {
      this.loading = false
    }, 3000)
  }
}
</script>

<style lang="stylus">
.app
  &__content
    position relative
    margin-top 160px
    margin-left 256px
  &__view
    position relative
    width calc(100vw - 256px)
    margin-top 60px
  &__info-arrow
    outline none
    transition transform 0.5s

.rotate
  transform rotate(-180deg)

.font-light
  font-weight 300
.text-capitalize
  text-transform uppercase
.link
  color #000 !important
  text-decoration none
</style>
