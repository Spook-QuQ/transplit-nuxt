<template lang="pug">
  v-dialog(
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  )
    //- template(v-slot:activator="{ on, attrs }")
    v-card
      v-toolbar
        v-spacer
        //- v-btn(icon v-if="step != 0" @click="setCurrentLoginMethod(null)"): v-icon mdi-arrow-left
        v-btn.text--secondary(
          text
          v-if="step != 0"
          @click="setCurrentLoginMethod(null)"
        ) {{ $t('Back') }}
        v-btn(
          icon
          @click="closeDialog"
        ): v-icon.text--secondary mdi-close
      v-card(elevation="0")
        v-card-title.mt-5(class="title font-weight-light justify-center") {{ type ? $t(type) : '' }}
        v-divider.my-4
        v-window(:value="step")
          //-
          v-window-item(:value="0" class="justify-center")
            v-list.ma-auto(max-width="160")
              template(v-for="(authType, index) in authTypes")
                v-list-item.text--secondary(
                  link
                  @click="setCurrentLoginMethod(authType.name)"
                )
                  v-list-item-action: v-icon.text--secondary {{ authType.icon }}
                  v-list-item-title.text--secondary {{ authType.name }}
                v-divider(
                  v-if="index < authTypes.length - 1"
                  :key="index"
                )
          //-
          v-window-item(:value="1")
            v-card
              v-card-title.justify-center
                v-icon mdi-email
                span.ml-4.text--secondary E-mail
              v-card-text
                RegisterFormWithEmail(v-if="step == 1")
          v-window-item(:value="2")
            v-card
              v-card-title.justify-center
                v-icon.text--secondary mdi-google
                span.ml-4.text--secondary Google
              //- v-progress-circular(
              //-   indeterminate
              //-   v-if="googleAuthPopUpOpening"
              //- )
              v-card-actions.justify-center
                v-btn.text-capitalize.text--secondary(
                  :loading="googleAuthPopUpOpening"
                  @click="loginGoogle"
                ) {{ type ? $t(type) : '' }}
    v-snackbar(
      v-if="dialog"
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
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RegisterFormWithEmail from '~/components/layoutParts/default/logInModal/RegisterFormWithEmail.vue'

export default {
  components: {
    RegisterFormWithEmail
  },
  data: () => ({
    authTypes: [
      { name: 'E-mail', icon: 'mdi-email'},
      { name: 'Google', icon: 'mdi-google'}
    ]
  }),
  methods: {
    ...mapMutations('user', [
      'dialogToggle',
      'setCurrentLoginMethod',
      'setSnackbar'
    ]),
    closeDialog () {
      this.dialogToggle(false)
    },
    ...mapActions('user', [
      'loginGoogle'
    ])
  },
  computed: {
    ...mapState('user', {
      dialog: state => state.logInModal.dialog,
      type: state => state.logInModal.type,
      currentLoginMethod: state => state.logInModal.currentLoginMethod,
      googleAuthPopUpOpening: state => state.logInModal.googleAuthPopUpOpening,
      snackbar: state => state.snackbar,
      snackbarMessage: state => state.snackbarMessage
    }),
    step () {
      const index = this.authTypes.findIndex(type => type.name === this.currentLoginMethod)
      return (0 <= index ? index + 1 : 0)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
