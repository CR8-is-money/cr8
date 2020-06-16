<template>
  <div class="alerts-main">
    <Alerts />
    <Processing />
    <Balance-Alert />
    <Not-Connected />
  </div>
</template>

<script>
export default {
  name: 'AlertsMain',

  components: {
    Alerts: () => import('@/components/Alerts/Alerts'),
    Processing: () => import('@/components/Alerts/Processing'),
    BalanceAlert: () => import('@/components/Alerts/Balance'),
    NotConnected: () => import('@/components/Alerts/NotConnected')
  }
}
</script>

<style lang="stylus">
.alerts-main
  position fixed
  width 100%
  font-size 12px
  z-index 2
  background-color #fff
  .v-alert
    margin-bottom 0px
</style>
