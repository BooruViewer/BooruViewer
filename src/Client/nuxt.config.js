import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Booru Viewer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Allowing you to easily view your boorus.',
      },
      { name: 'msapplication-TileColor', content: '#9f00a7' },
      { name: 'msapplication-TileImage', content: '/mstile-144x144.png7' },
      { name: 'theme-color', content: '#FFFFFF' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicon-194x194.png' },
      { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicon-16x16.png' },
      { rel: 'manifest', sizes: '180x180', href: '/site.webmanifest' },
      { rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    "overlayscrollbars/css/OverlayScrollbars.css",
    "~/assets/global.scss",
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/components.js"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-vuex-router-sync',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    browserBaseURL: "/",
  },
  router: {
    middleware: 'wait-for-store'
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    // This breaks production builds because default is false for dev, true for  production
    // To use this with "true", would require manually importing all vuetify components.
    treeShake: false,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.purple.darken1,
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
  /*
  ** Build configuration
  */
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
      ]
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  generate: {
    dir: '../Server/wwwroot',
    // devtools: 'true',
  },
}
