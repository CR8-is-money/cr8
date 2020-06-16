<template>
  <v-card class="pa-5">
    <Actions-Header title="Unpack">
      <template v-slot:input>
        <Crate />
      </template>
      <template v-slot:output>
        <v-img src="../../assets/dai-logo.jpg"></v-img>
      </template>
    </Actions-Header>

    <div class="subtitle-1">
      <p class="mb-0">Unpack CR8 into DAI!</p>
      <p>Get your returns!</p>
    </div>

    <p v-if="exchangeRate && !exchangeRate.isZero()"
      class="subtitle-2"
    >
      1 CR8 = {{ exchangeRate | formatBigInt }} DAI
    </p>

    <div v-if="supportedNetwork">
      <v-form ref="unpackForm" v-model="unpackValid">
        <v-text-field
          v-model="unpackAmount"
          label="CR8 Amount"
          :placeholder="`${viewCR8} CR8`"
          :rules="unpackRules"
          :hint="exchangeDAIValue"
          persistent-hint
          color="#6cc1ff"
          solo
          class="mb-2"
        ></v-text-field>

        <v-layout d-flex justify-space-between>
          <v-btn large
            :disabled="!unpackAmount && !processing"
            @click="resetUnpack"
          >
            Reset
          </v-btn>

          <v-btn
            large
            color="#6cc1ff"
            :disabled="!unpackValid || processing"
            @click="handleUnpack"
          >
            Unpack
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
  name: 'ActionsUnpack',

  components: {
    ActionsHeader: () => import(/* webpackChunkName: 'Actions-Header' */ '@/components/Actions/Actions-Header'),
    Crate: () => import(/* webpackChunkName: 'Crate' */ '@/components/Crate')
  },

  /* eslint-disable-next-line */
  data: function () {
    return {
      unpackAmount: null,
      unpackValid: false,

      unpackRules: [
        (v) => !!v || 'Please enter an amount',
        (v) => this.amountNotZero(v) || 'Please enter an amount',
        (v) => this.amountNotMaxed(v) || `Maximum of ${this.viewCR8} CR8`
      ]
    }
  },

  computed: {
    ...mapState({
      CR8Balance: (state) => state.cr8.balanceOf,
      DAIBalance: (state) => state.dai.balanceOf,
      exchangeRate: (state) => state.cr8.cr8DAIValue,
      processing: (state) => state.alerts.processing,
      supportedNetwork: (state) => state.supportedNetwork
    }),

    viewCR8 () {
      return formatBigInt(this.CR8Balance)
    },

    exchangeDAIValue () {
      if (this.unpackAmount && this.exchangeRate) {
        const value = this.unpackAmount * parseFloat(formatBigInt(this.exchangeRate))
        return `Receive: ~ ${value} DAI`
      }
      return 'Receive: 0 DAI'
    }
  },

  methods: {
    async handleUnpack () {
      await this.$store.dispatch('unpack', this.unpackAmount)
      this.$refs.unpackForm.reset()
    },

    resetUnpack () {
      this.unpackAmount = null
      this.unpackValid = false
      this.$refs.unpackForm.resetValidation()
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
      return parseBigInt(amount).lte(this.CR8Balance)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
