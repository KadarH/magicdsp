
export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: 'localhost'
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
    credentials: true
  },
  oneSignal: {
    init: {
      appId: 'b5004127-4151-444a-9401-2e7030cf5f6f',
      allowLocalhostAsSecureOrigin: true,
      notifyButton: {
        enable: true,
      },
      promptOptions: {
        customlink: {
          enabled: true, /* Required to use the Custom Link */
          style: "button", /* Has value of 'button' or 'link' */
          size: "medium", /* One of 'small', 'medium', or 'large' */
          color: {
            button: '#E12D30', /* Color of the button background if style = "button" */
            text: '#FFFFFF', /* Color of the prompt's text */
          },
          text: {
            subscribe: "Abonnez-vous aux notifications", /* Prompt's text when not subscribed */
            unsubscribe: "Se désabonner des notifications", /* Prompt's text when subscribed */
            explanation: "Recevez des mises à jour sur toutes sortes de choses qui comptent pour vous", /* Optional text appearing before the prompt button */
          },
          unsubscribeEnabled: false, /* Controls whether the prompt is visible after subscription */
        }
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
