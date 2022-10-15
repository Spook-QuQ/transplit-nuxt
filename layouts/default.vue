<template lang="pug">
  v-app
    NavigationDrawer
    AppBar
    v-snackbar(
      v-if="!dialog"
      :value="snackbar"
      bottom
      right
    ) {{ $t(snackbarMessage) }}
      template(v-slot:action="{ attrs }")
        v-btn.text--secondary(
          text
          v-bind="attrs"
          @click="setSnackbar(false)"
        ) {{ $t('Close') }}
    v-main
      //- v-container {{ $t('test') }}
      v-container
        nuxt
</template>

<script>
import {
  mapState,
  mapMutations,
  // mapActions
} from 'vuex'
import AppBar from '~/components/layoutParts/default/AppBar.vue'
import NavigationDrawer from '~/components/layoutParts/default/NavigationDrawer.vue'

export default {
  components: {
    AppBar,
    NavigationDrawer
  },
  data: () => ({
  }),
  methods: {
    ...mapMutations('user', [
      'setSnackbar'
    ]),
  },
  computed: {
    ...mapState('user', {
      snackbar: state => state.snackbar,
      snackbarMessage: state => state.snackbarMessage,
      dialog: state => state.logInModal.dialog
    })
  },
}
</script>
