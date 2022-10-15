<template lang="pug">
  v-navigation-drawer(
    v-model="drawer"
    :mini-variant="miniVariant"
    floating
    fixed
    app
    permanent
  )
    v-list(nav dense)
      v-list-item(
        v-for="(route, i) in routes"
        :key="i"
        :to="localePath(route.to)"
      )
        v-list-item-action.justify-center
          v-icon(
            v-if="!miniVariant"
            small
          ) {{ route.icon }}
          //- //
          v-tooltip(
            right
            v-else
          )
            template(v-slot:activator="{ on, attrs }")
              v-icon(
                v-bind="attrs"
                v-on="on"
                small
              ) {{ route.icon }}
            span.caption {{ $t(route.title) }}
        v-list-item-content
          v-list-item-title {{ $t(route.title) }}
      v-divider.my-2(dense)
      v-list-item(
        key="miniVariant"
      )
        v-list-item-action.justify-center
          v-tooltip(right)
            template(v-slot:activator="{ on, attrs }")
              v-icon(
                v-bind="attrs"
                v-on="on"
                small
                @click.stop="miniVariantToggle"
              ) mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}
            span.caption {{ $t('MinimizeMaximize') }}
    v-list.mt-auto(nav dense)
      v-list-item(
        v-for="(route, i) in subRoutes"
        :key="i"
        :to="localePath(route.to)"
      )
        v-list-item-action.justify-center
          v-icon(
            v-if="!miniVariant"
            small
          ) {{ route.icon }}
          //- //
          v-tooltip(
            right
            v-else
          )
            template(v-slot:activator="{ on, attrs }")
              v-icon.text--secondary(
                v-bind="attrs"
                v-on="on"
                small
              ) {{ route.icon }}
            span.caption {{ $t(route.title) }}
        v-list-item-content
          v-list-item-title {{ $t(route.title) }}
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    miniVariant: false,
    routes: [
      // {
      //   icon: 'mdi-apps',
      //   title: 'Welcome',
      //   to: '/'
      // },
      {
        icon: 'mdi-translate',
        title: 'TranslateTool',
        to: '/translate'
      },
      {
        icon: 'mdi-history',
        title: 'History',
        to: '/history'
      }
    ],
    subRoutes: [
      {
        icon: 'mdi-information',
        title: 'Information',
        to: '/info'
      }
    ]
  }),
  methods: {
    miniVariantToggle () {
      this.miniVariant = !this.miniVariant
      localStorage.setItem('miniVariant', this.miniVariant)
    }
  },
  mounted () {
    // console.log(process.env.title)
    // console.log(localStorage.getItem('miniVariant'))
    if (null === localStorage.getItem('miniVariant')) {
      this.miniVariant = true
      localStorage.setItem('miniVariant', true)
    } else {
      this.miniVariant = localStorage.getItem('miniVariant') === 'true'
    }
  }
}
</script>

<style lang="sass">
  .v-navigation-drawer__content
    display: flex
    flex-direction: column
    justify-content: space-between
</style>
