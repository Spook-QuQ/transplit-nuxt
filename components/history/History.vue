<template lang="pug">
  v-card.pt-1(v-if="login" :loading="loading")
    template(slot="progress")
      v-progress-linear(color="secondary" indeterminate)
    v-row.ma-2.pb-1.align-center
      v-col(
        cols="12"
        sm="6"
      )
        p.caption.text--secondary.mb-1 {{ $t('historyNote1') }}
        p.caption.text--secondary.mb-0 {{ $t('historyNote2') }}
      v-spacer
      v-col.d-flex.justify-sm-end.justify-start(
        cols="12"
        sm="2"
      )
        v-btn(
          @click="deleteHistory"
          :loading="isDeleteReqesting"
          v-if="history.length"
          style="text-transform: none;"
        ) {{ $t('deleteAll') }}
    v-divider
    v-list
      v-list-item.my-4(v-if="!loading && !history.length")
        v-list-item-content
          v-list-item-subtitle.caption.mb-2 {{ $t('thereIsNoRecord') }}
      v-list-item.my-4(
        v-for="(h, i) in history"
        link
        @click="openDetail(h)"
        style="border-left: solid 1px #d3d3d32e"
        :key="i"
      )
        v-list-item-content
          v-list-item-subtitle.caption.mb-2 {{ h.text }}
          p {{ h.rsText }}
          //- p(style="white-space: pre") {{ h }}
          v-divider
    v-dialog(
      v-model="isOpenDetail"
    )
      v-card(v-if="dataForDetail" outlined)
        v-list-item-content.py-8
          v-list-item-subtitle.caption.px-4.mb-6 {{ dataForDetail.text }}
          v-divider
          TranslateResult(:result="resultParser")
</template>

<script>
import TranslateResult from '~/components/TranslateResult.vue'

import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  data: _=> ({
    loading: false,
    isDeleteReqesting: false,
    isOpenDetail: false,
    dataForDetail: null
  }),
  computed: {
    ...mapState('user', {
      login: state => state.login,
      history: state => state.data.history.content
    }),
    ...mapState('config', {
      graphqlUrl: state => state.graphqlUrl
    }),
    resultParser () {
      if (!this.dataForDetail) return {}
      return {
        rsWords: JSON.parse(this.dataForDetail.rsWords),
        splitedRsText: JSON.parse(this.dataForDetail.splitedRsText)
      }
    }
  },
  methods: {
    ...mapActions('user', [
      'launchSnackbar',
      'getIdToken'
    ]),
    ...mapMutations('user', [
      'setHistory',
    ]),
    openDetail (h) {
      // console.log(h)
      this.dataForDetail = h
      this.isOpenDetail = true
    },
    async deleteHistory () {
      if (!this.history.length) return
      this.loading = true
      this.isDeleteReqesting = true
      this.$axios.post(this.graphqlUrl, {
        query: `
          mutation {
            deleteHistory {
              rs
            }
          }
        `
      }, {
        headers: {
          'Authorization': `Bearer ${ await this.getIdToken() || '' }`
        }
      }).then(({ data }) => {
        this.setHistory([])
        this.loading = false
        this.isDeleteReqesting = false
        this.launchSnackbar('historyDeleted')
      })
    }
  },
  async mounted () {
    if (this.login) {
      this.loading = true
      this.$axios.post(this.graphqlUrl, {
        query: `
          query {
            history {
              rs
            }
          }
        `
      }, {
        headers: {
          'Authorization': `Bearer ${ await this.getIdToken() || '' }`
        }
      }).then(({ data }) => {
        const { history } = data.data
        if (!history) {
          this.loading = false
          return
        }

        this.setHistory(JSON.parse(history.rs))
        this.loading = false
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
