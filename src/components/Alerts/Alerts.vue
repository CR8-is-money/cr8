<template>
  <v-alert
    v-model="alertOpen"
    text
    tile
    dense
    :type="alertType || 'error'"
    icon="mdi-cloud-alert"
    transition="slide-y-transition"
    class="alert"
  >
    <v-layout
      justify-space-between
      align-center
      class="alert__content"
    >
      <p class="mb-0 mr-4">{{ alertMessage }}</p>
      <button @click="close" class="alert__close"><v-icon :color="alertType">close</v-icon></button>
    </v-layout>
  </v-alert>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Alerts',

  computed: {
    ...mapState({
      alertOpen: (state) => state.alerts.alertOpen,
      alertMessage: (state) => state.alerts.alertMessage,
      alertType: (state) => state.alerts.alertType
    })
  },

  methods: {
    close () {
      this.$store.dispatch('alerts/clearAlert')
    }
  }
}
</script>

<style lang="stylus" scoped>
.alert
  &__content
    width calc(100% - 260px)
  &__close
    outline none
</style>
