<template lang="pug">
div
  v-card.justify-center.pb-2(v-if="!login")
    v-card-title.text--secondary.justify-center.pa-9.pb-7 {{ $t('needToLogin') }}
    v-divider
    v-list.mx-auto.my-4(max-width="160")
      v-list-item.justify-center(@click="dialogToggle('Register')")
        v-list-item-action: v-icon.text--secondary mdi-pencil-plus
        v-list-item-title.text--secondary {{ $t('Register') }}
      v-divider
      v-list-item.justify-center(@click="dialogToggle('Log-in')")
        v-list-item-action: v-icon.text--secondary mdi-login
        v-list-item-title.text--secondary {{ $t('Log-in') }}
  v-card(v-else)
    History
</template>

<script>
import History from '~/components/history/History.vue'
import {
  mapState,
  mapMutations,
  // mapActions
} from 'vuex'

export default {
  head: {
    title: 'History',
  },
  methods: {
    ...mapMutations('user', [
      'dialogToggle'
    ]),
  },
  computed: {
    ...mapState('user', {
      login: state => state.login,
    }),
  }
}
</script>

<style lang="css" scoped>
</style>
