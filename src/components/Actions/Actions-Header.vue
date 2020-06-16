<template>
  <v-layout column align-center class="header">
    <h2 class="header__title text-capitalize">{{ title }}</h2>
    <v-layout class="header__conversion" justify-center align-center>
      <slot name="input"></slot>
      <v-icon class="mx-10">arrow_forward</v-icon>
      <slot name="output"></slot>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: 'ActionsHeader',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  width 100%
  border-bottom 1px solid #000
  margin-bottom 20px
  &__title
    margin-bottom 15px
  &__conversion
    padding-bottom 20px
</style>
