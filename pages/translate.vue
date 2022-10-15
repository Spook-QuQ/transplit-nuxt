<template lang="pug">
div.mb-16
  div.mb-4
    v-btn-toggle(
      v-model="targetLanguageSet"
      mandatory
    )
      v-btn(
        small
        style="text-transform: none; letter-spacing: 0.5px"
        @click="inputHandler(true)"
      ) {{ $t('Japanese') }}
        v-icon.mx-1(small) mdi-play
        |{{ $t('English') }}
      v-btn(
        small
        style="text-transform: none; letter-spacing: 0.5px"
        @click="inputHandler(true)"
      ) {{ $t('English') }}
        v-icon.mx-1(small) mdi-play
        |{{ $t('Japanese') }}

  v-card(outlined)
    //- v-card-title a
    v-row.pa-4
      v-col.pa-0.pr-sm-1(
        cols="12"
        sm="6"
      )
        v-textarea.main-textarea.pa-3.mt-0(
          :class="text.length > maxLength ? 'textarea-error' : ''"
          v-model="text"
          auto-grow
          hide-details
          tile
          single-line
          color="secondary"
          @input="inputHandler"
          :label="$t('EnterText')"
          :loading="true"
        )
          template(slot="progress")
            v-progress-linear.mt-4(
              style="transform: translateY(-8px)"
              :value="(text.length / maxLength) * 100"
              absolute
              bottom
              :color="text.length <= maxLength ? 'primary' : 'error'"
              height="4"
            )
      v-divider.d-none.d-sm-block(vertical)
      v-col(
        cols="12"
        v-if="loadingCircle || result"
      ).d-block.d-sm-none
        v-divider
      TranslateResult.mt-n1.mb-4(
        cols="12"
        sm="6"
        :result="result"
        :loadingCircle="loadingCircle"
      )
</template>

<script>
import TranslateResult from '~/components/TranslateResult.vue'

import {
  mapState,
  // mapMutations,
  mapActions
} from 'vuex'

export default {
  head: {
    title: 'Translate Tool',
  },
  data: _=> ({
    targetLanguageSet: 0,
    text: '',
    // rsWords: [],
    // splitedRsText: [],
    result: null,
    st: null,
    sleepLength: 1000,
    loading: false,
    loadingCircle: false,
    maxLength: 2000
  }),
  // mounted () {
  // },
  methods: {
    ...mapActions('user', [
      'getIdToken',
    ]),
    inputHandler (button) {
      if (button) {
        this.result = null
      }

      clearTimeout(this.st)
      this.loading = true
      this.st = setTimeout(async _ => {
        await this.request()
        this.loading = false
      }, this.sleepLength)
    },
    async request () {
      if (!this.text) {
        // this.rsWOrds = []
        // this.splitedRsText = []
        this.result = null
        this.loading = false
        return
      }

      if (this.text.length > this.maxLength) {
        this.result = null
        this.loading = false
        return
      }

      let t = ''
      let f = ''

      switch (this.targetLanguageSet) {
        case 0:
          t = 'ja'
          f = 'en'
          break;
        case 1:
          t = 'en'
          f = 'ja'
          break;
      }

      this.loadingCircle = true
      this.$axios.post(this.graphqlUrl, {
        query: `
          mutation(
            $from: String
            $to: String!
            $text: String!
          ) {
          	translate(
              from: $from
              to: $to
              text: $text
            ) {
          	  rsText
          	  rsWords
          		splitedRsText
          	}
          }
        `,
        variables: {
          from: t,
          to: f,
          text: this.text.trim()
        }
      }, {
        headers: {
          'Authorization': `Bearer ${ await this.getIdToken() || '' }`
        }
      }).then(({ data }) => {
        this.loadingCircle = false
        const { translate } = data.data
        if (!translate) return
        const {
          rsText,
          rsWords,
          splitedRsText
        } = translate

        // this.rsWords = JSON.parse(rsWords)
        // this.splitedRsText = JSON.parse(splitedRsText)
        this.result = {
          rsWords: JSON.parse(rsWords),
          splitedRsText: JSON.parse(splitedRsText)
        }
      })
    }
  },
  computed: {
    ...mapState('config', {
      graphqlUrl: state => state.graphqlUrl
    })
  }
}
</script>

<style lang="sass">
  .main-textarea
    .v-input__slot
      &:after, &:before
        display: none
  .textarea-error
    textarea
      color: red !important
</style>
