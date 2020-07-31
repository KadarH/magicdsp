
export default {
  mode: 'universal',
  server: {
    port: 8000,
    host: 'https://app.magic-dsp.com/'
    // host: 'localhost'
  },
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
 target: 'server',
  /*
  ** Headers of the page
  */
  head: {
    bodyAttrs: {
      'page': ''
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt'
  ],
  axios: {
    baseURL: "https://api.magic-dsp.com/",
    // baseURL: "http://localhost:8000/",
    credentials: true
  },
  oneSignal: {
    init: {
      appId: 'b5004127-4151-444a-9401-2e7030cf5f6f',
      // appId: '9f583a30-49a0-43b9-afa6-e697f7b42bd7',
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
