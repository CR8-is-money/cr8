<template>
  <v-layout
    column
    align-center
    justify-center
    class="loading"
  >
    <Boat></Boat>
    <p class="mt-10">Loading, one moment . . .</p>
  </v-layout>
</template>

<script>
export default {
  name: 'AppLoading',

  components: {
    Boat: () => import('@/components/Boat')
  }
}
</script>

<style lang="stylus" scoped>
.loading
  width 100%
  height 100%
</style>
