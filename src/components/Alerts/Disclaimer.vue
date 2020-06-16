<template>
  <v-alert
    text
    dense
    icon="mdi-cloud-alert"
    color="blue"
    class="disclaimer"
  >
    <p class="ma-0">This is alpha software running on the Kovan testnet. File issues at <a href="https://github.com/CR8-is-money/CR8" target="_blank">https://github.com/CR8-is-money/CR8.</a>
    </p>
  </v-alert>
</template>

<script>
export default {
  name: 'DisclaimerAlert'
}
</script>

<style lang="stylus" scoped>
.disclaimer
  position fixed
  top 0
  width 100%
  z-index 11
</style>
