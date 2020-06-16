<template>
  <v-container class="tabs">
    <v-layout wrap>
      <v-flex xs-6>
        <v-layout justify-center>
          <Actions-Pack class="tabs__tab"/>
        </v-layout>
      </v-flex>
      <v-flex xs-6>
        <v-layout justify-center>
          <Actions-Unpack class="tabs__tab"/>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Actions',

  components: {
    ActionsPack: () => import(/* webpackChunkName: 'Tabs-Pack' */ '@/components/Actions/Actions-Pack'),
    ActionsUnpack: () => import(/* webpackChunkName: 'Tabs-Unpack' */ '@/components/Actions/Actions-Unpack')
  },

  /* eslint-disable-next-line */
  data: function () {
    return {
      tab: ''
    }
  },

  methods: {
    changeTab (tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="stylus">
.tabs
  &__tab
    width 20%
    min-width 500px
    min-height 370px
    margin 50px 20px
</style>
