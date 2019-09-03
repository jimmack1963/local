// Configuration for your app
const fs = require('fs')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    boot: [
      'i18n',
      'axios',
      'dropbox',
      'device',
      'gtm-plugin'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      // ctx.theme.mat ? 'roboto-font' : null,
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5'
    ],
    supportIE: false,
    build: {
      env: {
        DEBUG: true,
        DEBUG_WORKING: true,
        DEBUG_FULL: true,
        BASE_URL: ctx.dev
          ? JSON.stringify('https://localhost:8080')
          : JSON.stringify('https://readingTogether.works')
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })

        cfg.module.rules.push({
          test: /\.(png|m4a)$/,
          loader: 'file-loader'
        })
      }
    },
    devServer: {
      https: {
        key: fs.readFileSync('/Users/jim/localhost-key.pem'),
        cert: fs.readFileSync('/Users/jim/localhost.pem'),
        ca: fs.readFileSync('/Users/jim/Library/Application Support/mkcert/rootCA.pem'),
      },
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      cssAddon: true,
      components: [
        'QParallax',
        // 'QCollapsible', 'QExpansionItem',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QRadio',

        // 'QItemTile',
        'QBtnDropdown',

        'QTabs',
        'QTab',
        // 'QTabPane',

        // 'QWindowResizeObservable',

        'QCheckbox',
        'QSlider',

        'QField',

        // 'QModal',
        'QImg',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QCard',
        // 'QCardTitle',
        // 'QCardMain',
        // 'QCardMedia',
        // 'QCardSeparator',
        'QCardActions',
        'QInput',
        'QDialog',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QItemLabel',
        'QItemSection',
        'QCardSection',
        // 'QLayoutHeader',
        // 'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        // 'QListHeader',
        'QItem',
        // 'QItemMain',
        // 'QItemSide'
      ],
      directives: [
        'Ripple',
        'TouchSwipe',
        'TouchPan',
        'TouchHold'
      ],
      // Quasar plugins
      plugins: [
        'Dialog',
        'AppFullscreen',
        'LocalStorage',
        'Notify'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // lang: 'de' // Quasar language
    },
    // animations: 'all', // includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: 'com.PlayItAgainKid.Android',
      description: ''

    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
