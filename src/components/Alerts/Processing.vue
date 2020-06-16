<template>
  <div v-if="processing" class="process-bar">
    <v-progress-linear
      indeterminate
      color="#6cc1ff"
      class="process-bar__processing"
    ></v-progress-linear>
    <div class="process-bar__status">
      {{ processingStatus }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProcessingAlert',

  computed: {
    ...mapState({
      processing: (state) => state.alerts.processing,
      processingStatus: (state) => state.alerts.processingStatus
    })
  }
}
</script>

<style lang="stylus">
.process-bar
  background-color rgba(108,193,255, 0.3)
  &__processing
    width 100vw
  &__status
    max-width 900px
    margin auto
    padding 10px 0
    font-size 14px
</style>
