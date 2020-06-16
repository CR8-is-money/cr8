<template>
  <v-img src="../assets/crate.svg" :class="size"></v-img>
</template>

// Takes a prop `size`, whose value is either "small", "medium", or "large"
// Default is "small"
// Example:
//// <Crate size="medium" />

<script>
export default {
  name: 'Crate',

  props: {
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>

<style lang='stylus' scoped>
.small
  width 40px

.medium
  width 65px

.large
  width 100px
</style>
