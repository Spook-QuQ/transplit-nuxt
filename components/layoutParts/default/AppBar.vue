<template lang="pug">
  v-app-bar(
    app
    fixed
    color="transparent"
    elevation="0"
  )
    //- v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    //- pre {{ $store.state.user.user }}
    v-toolbar-title
      nuxt-link(
        class="text--secondary text-decoration-none text-body-2"
        to="/"
      ) {{ title }}
    v-spacer
    v-menu
      template(v-slot:activator="{ on, attrs }")
        v-btn(
          text
          v-bind="attrs"
          v-on="on"
        )
          v-icon.text--secondary(small) mdi-translate
          span.ml-1.text--secondary {{ $i18n.locale }}
      v-list
        v-list-item(
          link
          v-for="locale in $i18n.locales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
        ): v-list-item-title {{ locale.name }}
    v-menu
      template(v-slot:activator="{ on, attrs }")
        //- v-btn(
        //-   icon
        //-   v-bind="attrs"
        //-   v-on="on"
        //- ): v-icon.text--secondary mdi-login
        //- v-btn(icon small): v-icon.text--secondary mdi-logout
        v-btn(
          icon
          v-bind="attrs"
          v-on="on"
        ): v-icon.text--secondary {{ login ? 'mdi-account' : 'mdi-login' }}
      v-list
        v-list-item(v-if="login") {{ email }}
        v-divider(v-if="login")
        v-list-item(link v-if="login")
          v-list-item-action
            v-icon(small).text--secondary mdi-logout
          v-list-item-title(@click="logout") {{ $t('Log-out') }}
        template(v-else)
          v-list-item(link @click="dialogToggle('Register')")
            v-list-item-action
              v-icon(small).text--secondary mdi-pencil-plus
            v-list-item-title {{ $t('Register') }}
          v-list-item(link @click="dialogToggle('Log-in')")
            v-list-item-action
              v-icon(small).text--secondary mdi-login
            v-list-item-title {{ $t('Log-in') }}
    LogInModal
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import LogInModal from '~/components/layoutParts/default/LogInModal.vue'

export default {
  components: {
    LogInModal
  },
  data: () => ({
    title: process.env.title
  }),
  methods: {
    ...mapMutations('user', [
      'dialogToggle'
    ]),
    ...mapActions('user', [
      'initUser',
      'logout'
    ])
  },
  computed: {
    ...mapState('user', {
      login: state => state.login,
      email: state => state.user.email
    })
  },
  mounted () {
    this.initUser()
  }
}
</script>

<style lang="css" scoped>
</style>
