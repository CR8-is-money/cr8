<template>
  <v-alert
    v-model="notConnected"
    text
    tile
    dense
    type="warning"
    icon="mdi-cloud-alert"
    transition="slide-y-transition"
    class="not-connected"
  >
    Wallet not connected. Connect to Metamask to start packing and unpacking.
  </v-alert>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'NotConnectedAlert',

  computed: {
    ...mapState({
      notConnected: (state) => !state.connected
    })
  }
}
</script>
