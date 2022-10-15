import colors from 'vuetify/es5/util/colors'
import messages from './i18n-text'

// const baseUrl = 'https://transplit.vercel.app'
// const baseUrl = 'http://OwO.local:3000'
// const baseUrl = 'http://localhost:3000'
const baseUrl = process.env.BASE_URL

const _env = {
  title: 'Transplit',
  TEST: 'TEST',
  baseUrl,
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  },
  serviceAccountConfig: {
    "type": process.env.FIREBAE_SERVICE_ACCOUNT_TYPE,
    "project_id": process.env.FIREBAE_SERVICE_ACCOUNT_PROJECT_ID,
    "private_key_id": process.env.FIREBAE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBAE_SERVICE_ACCOUNT_PRIVATE_KEY,
    "client_email": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    "client_id": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_ID,
    "auth_uri": process.env.FIREBAE_SERVICE_ACCOUNT_AUTH_URL,
    "token_uri": process.env.FIREBAE_SERVICE_ACCOUNT_TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.FIREBAE_SERVICE_ACCOUNT_AUTH_PROVIDER_x509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBAE_SERVICE_ACCOUNT_CLIENT_x509_CERT_URL
  }
}

export default {
  env: _env,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${ _env.title }`,
    title: _env.title,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },

      // I added those
      { hid: "og:site_name", name: "og:site_name", content: 'Transplit' },
      { hid: "og:type", name: "og:type", content: 'website' },
      { hid: "og:url", name: "og:url", content: baseUrl },
      { hid: "og:title", name: "og:title", content: "Transplit" },
      { hid: "og:description", name: "og:description", content: '' },
      { hid: "og:image", name: "og:image", content: baseUrl + '/misc/og-icon.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'en',
            name: 'English'
          },
          {
            code: 'ja',
            name: '日本語'
          }
        ],
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          messages: messages
        }
      }
    ]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
