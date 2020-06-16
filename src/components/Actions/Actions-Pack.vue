<template>
  <v-card class="pa-5">
    <Actions-Header title="Pack">
      <template v-slot:input>
        <v-img src="../../assets/dai-logo.jpg"></v-img>
      </template>
      <template v-slot:output>
        <Crate />
      </template>
    </Actions-Header>

    <div class="subtitle-1">
      <p class="mb-0">Pack DAI into CR8!</p>
      <p>Start earning compound cDAI and CHAI returns.</p>
    </div>

    <p v-if="exchangeRate && !exchangeRate.isZero()"
      class="subtitle-2"
    >
      1 DAI = {{ daiCR8Value }} CR8
    </p>

    <div v-if="supportedNetwork">
      <v-form ref="packForm" v-model="packValid">
        <v-text-field
          v-model="packAmount"
          label="DAI Amount"
          :placeholder="`${viewDAI} DAI`"
          :rules="packRules"
          :hint="exchangeCR8Value"
          persistent-hint
          color="#6cc1ff"
          solo
          class="mb-2"
        ></v-text-field>

        <v-layout d-flex justify-space-between>
          <v-btn
            large
            :disabled="!packAmount && !processing"
            @click="resetPack"
          >
            Reset
          </v-btn>

          <v-btn
            large
            color="#6cc1ff"
            :disabled="!packAmount || !packValid || processing"
            @click="handlePack"
          >
            Pack
          </v-btn>
        </v-layout>

      </v-form>
    </div>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { formatBigInt, parseBigInt } from '../../filters'

export default {
  name: 'ActionsPack',

  components: {
    ActionsHeader: () => import(/* webpackChunkName: 'Actions-Header' */ '@/components/Actions/Actions-Header'),
    Crate: () => import(/* webpackChunkName: 'Crate' */ '@/components/Crate')
  },

  /* eslint-disable-next-line */
  data: function () {
    return {
      packAmount: null,
      packValid: false,
      packRules: [
        (v) => !!v || 'Please enter an amount',
        (v) => this.amountNotZero(v) || 'Please enter an amount',
        (v) => this.amountNotMaxed(v) || `Maximum of ${this.viewDAI} DAI`
      ]
    }
  },

  computed: {
    ...mapState({
      DAIBalance: (state) => state.dai.balanceOf,
      processing: (state) => state.alerts.processing,
      exchangeRate: (state) => state.cr8.cr8DAIValue,
      supportedNetwork: (state) => state.supportedNetwork
    }),

    daiCR8Value () {
      return (1 / parseFloat(formatBigInt(this.exchangeRate))).toFixed(8)
    },

    exchangeCR8Value () {
      if (this.packAmount && this.exchangeRate) {
        const value = this.packAmount / parseFloat(formatBigInt(this.exchangeRate))
        return `Receive: ~ ${value} CR8`
      }

      return 'Receive: 0 CR8'
    },

    viewDAI () {
      return formatBigInt(this.DAIBalance)
    }
  },

  methods: {
    async handlePack () {
      await this.$store.dispatch('pack', this.packAmount)
      this.$refs.packForm.reset()
    },

    resetPack () {
      this.packAmount = null
      this.packValid = false
      this.$refs.packForm.resetValidation()
    },

    amountNotZero (amount) {
      if (!amount) {
        return false
      }
      return !parseBigInt(amount).isZero()
    },

    amountNotMaxed (amount) {
      if (!amount) {
        return false
      }
      return parseBigInt(amount).lte(this.DAIBalance)
    },
  }

}
</script>

<style lang="scss" scoped>

</style>
