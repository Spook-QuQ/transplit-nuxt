<template lang="pug">
v-col(style="white-space: pre-wrap")
  span(v-for="word in rs")
    span.text--secondary(v-if="typeof word === 'string'") {{ word }}
    v-menu(v-else offset-y)
      template(v-slot:activator="{ on, attrs }")
        v-btn.text--secondary.mx-1(
          :style="wordButtonStyle"
          elevation="0"
          text
          tile
          v-bind="attrs"
          v-on="on"
        ) {{ word.word }}
      v-list(outlined)
        v-list-item: v-list-item-title {{ word.rs }}
        v-divider.mb-2
        v-list-item(
          v-for="dic in dictionaries"
          link
          dense
          :href="dic.url + word.word"
          target="_blank"
          rel="noopener noreferrer"
        )
          v-list-item-title {{ dic.name }}
          v-icon(small) mdi-open-in-new
  span(v-if="loadingCircle")
    v-progress-circular(
      color="secondary"
      indeterminate
    )
</template>

<script>
export default {
  props: [
    'result',
    'loadingCircle'
  ],
  data: _=> ({
    wordButtonStyle: `
      border-bottom: dashed 2px lightgray;
      text-transform: none; letter-spacing: 0.5px;
      min-width: auto;
      padding: 4px;
    `,
    dictionaries: [
      {
        url: 'https://jisho.org/search/',
        name: 'jisho'
      },
      {
        url: 'https://ejje.weblio.jp/content/',
        name: 'Weblio'
      }
    ]
  }),
  computed: {
    rs () {
      if (!this.result) return {}

      return this.result.splitedRsText.map(spRsWord => {
        return this.result.rsWords.find(rsWord => {
          return rsWord.word === spRsWord
        }) || spRsWord
      }) || []
      return rs
    },
  }
}
</script>

<style lang="css" scoped>
</style>
