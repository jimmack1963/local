import Vue from 'vue'
import Vuex from 'vuex'

import dropbox from './dropbox'
import general from './general'
import sounds from './sounds'
import demos from './demos'
import groups from './groups'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      sounds,
      general,
      dropbox,
      groups,
      demos,
    }
  })


  Vue.prototype.$store = Store

  if (Vue.prototype.$device) {
    if (window.jim_DEBUG_FULL) { console.log('Device exists, add to Store') }
    Store.commit('device', Vue.prototype.$device)
    if (Vue.prototype.$device.hasMicrophone) {
      Store.commit('setMicAvailable')
    }
  }
  else {
    if (window.jim_DEBUG_FULL) { console.log('Device in waiting, Store exists') }
  }

  /*
  if (process.env.DEV && module.hot) {
    module.hot.accept(['./main'], () => {
      const newShowcase = require('./main').default
      Store.hotUpdate({ modules: { showcase: newShowcase } })
    })
  }
  */


  return Store
}
