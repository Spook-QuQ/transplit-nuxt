<template lang="pug">
  v-card.py-16
    v-card-title.justify-center.text--secondary Transplit
    v-divider
    v-card-text
      v-row
        //- v-col.d-flex.justify-center(cols="12")
          //- video#preview(
          //-   autoplay
          //-   loop
          //-   muted
          //- )
          //-   source(
          //-     src="/misc/transplit-preview.mp4"
          //-   )
        v-col(cols="12").d-flex.justify-center
          div
            h3.my-4 単語も全て翻訳する「Transplit」
            p Transplitは文章全体の翻訳だけでなく、入力された文章を解析し単語の翻訳も行います。
            p 単語の詳細を調べやすくするため、すぐにWeblioとjishoが開けるリンクも用意しました。
    v-divider
    v-card-actions.justify-center.pt-8
      v-btn.px-5(
        style="text-transform: none"
        to="/translate"
        color="primary"
      ) Use Transplit
</template>

<script>
export default {
  head: {
    title: 'Top',
  },
  layout: 'plain',
  components: {
  },
  // mounted () {
  //   this.$refs.preview.play()
  // }
}
</script>

<style lang="sass">
  video#preview
    max-width: 100%
</style>
