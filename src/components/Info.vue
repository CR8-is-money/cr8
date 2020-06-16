<template>
  <v-slide-y-transition>
    <div class="user-info">
      <h3>What is Crate and why should I use it?</h3>
      <p>Crate earns you interest on DAI by balancing the returns of Compound's cDAI and Maker's CHAI. It allows you to pack DAI into a new token ("CR8") and unpack CR8 to get DAI. While packed, the DAI are split between cDAI and CHAI. Every time you pack or unpack, the contract checks its current rate of return (the "crate"), and adjusts the ratio of its holdings to track a target combination of cDAI and CHAI. As a result, Crate smooths out the returns from CHAI and DAI.</p>

      <h3>Can I trade CR8?</h3>
      <p>CR8 is a perfectly normal ERC20 token. You can trade it safely, and use it in many dapps.</p>

      <h3>What do I need to use Crate?</h3>
      <p>All you need is Metamask (<a href="https://metamask.io/" target="_blank">https://metamask.io/</a>) and some DAI!</p>

      <h3>What does "pack" do?</h3>
      <p>DAI can be `pack`ed to make CR8. CR8 generates interest on the DAI it holds by splitting it between cDAI and CHAI. </p>

      <h3>What does "unpack" do?</h3>
      <p>CR8 can be `unpack`ed to get DAI. Because CR8 generates interest, you'll get back more DAI than you put in.</p>

      <h3>How does Crate work?</h3>
      <p>Every time anyone calls `pack` or `unpack`, the Crate contract rebalances its entire portfolio to ensure users always get the intended interest rate.</p>

      <h3>Is there a fee to use Crate?</h3>
      <p>There is a 0.25% fee on unpacking. This goes to support the development team and pay for audits and upgrades.</p>
    </div>
  </v-slide-y-transition>
</template>

<script>
export default {
  name: 'Info'
}
</script>

<style lang="stylus">
.user-info
  margin-top 10px
  padding 20px
  & h3
    font-size 16px
    text-decoration underline
  & p
    font-size 14px
</style>
