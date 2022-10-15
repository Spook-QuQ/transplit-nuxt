<template lang="pug">
  v-card
    v-card-title.d-flex.justify-center.py-12 Transplit
    v-divider
    //- v-subheader.justify-center Made by
    v-card-subtitle.d-flex.justify-center.pb-2 Made by
    v-card-text.d-flex.justify-center.pt-0.pb-7
      v-btn(
        link
        href="https://twitter.com/S_p_o_o_k"
        style="text-transform: none"
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
        small
      ) @S_p_o_o_k
</template>

<script>
export default {
  head: {
    title: 'Info',
  },
  mounted () {
  }
}
</script>

<style lang="css" scoped>
</style>
