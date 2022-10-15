<template lang="pug">
  v-form.ma-auto(
    v-model="valid"
    style="max-width: 240px"
    :disabled="isRequesting"
  )
    v-row
      v-text-field(
        v-model="email"
        :label="$t('MailAddress')"
        autocomplete="email"
        required
        :rules="[rules.required, rules.emailMatch, rules.minLength]"
      )
    v-row
      v-text-field(
        v-model="password"
        :label="$t('Password')"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @paste.prevent.stop=""
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
        :hint="type === 'Register' ? $t('PassMinLengthError').replace('***', passwordMinLength) : undefined"
        required
        :rules="[rules.required, ...(type === 'Register' ? [rules.minLength] : [])]"
      )
    v-row(v-if="type === 'Register'")
      v-text-field(
        v-model="confirmPassword"
        :label="$t('ConfirmPassword')"
        :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showConfirmPassword = !showConfirmPassword"
        @paste.prevent.stop=""
        :type="showConfirmPassword ? 'text' : 'password'"
        autocomplete="off"
        required
        :rules="[rules.required, rules.confirmPassword]"
      )
    v-row.mt-8.justify-center
      v-btn(:loading="isRequesting" @click="submit") {{ $t(type) }}
</template>

<script>
import {
  mapState,
  // mapMutations,
  mapActions
} from 'vuex'

export default {
  data: () => ({
    valid: false,
    email: '',
    password: '',
    showPassword: false,
    passwordMinLength: 8,
    confirmPassword: '',
    showConfirmPassword: false,
    emailRules: [
    ],
    isRequesting: false
  }),
  methods: {
    ...mapActions('user', [
      'registerEmail',
      'loginEmail'
    ]),
    submit () {
      if (this.valid) {
        this.isRequesting = true
        const email = this.email
        const password = this.password
        if (this.type === 'Register') {
          this.registerEmail({ email, password }).catch(_ => {
            // console.log(_)
            this.isRequesting = false
          })
        } else {
          this.loginEmail({ email, password }).catch(_ => {
            this.isRequesting = false
          })
        }
      }
    }
  },
  computed: {
    ...mapState('user', {
      type: state => state.logInModal.type,
    }),
    rules () {
      const i18n = this.$i18n
      const passwordMinLength = this.passwordMinLength
      const password = this.password
      const confirmPassword = this.confirmPassword
      return {
        required (value) { return !!value || i18n.t('Required') },
        minLength (value) {
          return (value || '').length >= passwordMinLength
          || i18n.t('PassMinLengthError')
            .replace('***', passwordMinLength)
        },
        emailMatch (value) {
          const pattern = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return  pattern.test(value) || i18n.t('InvalidEmail')
        },
        confirmPassword (value) {
          return password === confirmPassword || i18n.t('PassConfirmation')
        }
      }
    }
  },
  mounted () {
    this.email = ''
    this.password = ''
    this.confirmPassword = ''
    this.isRequesting = false
  }
}
</script>

<style lang="css" scoped>
</style>
