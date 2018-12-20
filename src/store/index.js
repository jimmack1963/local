import Vue from 'vue'
import Vuex from 'vuex'

import dropbox from './dropbox'
import general from './general'
import sounds from './sounds'

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
      dropbox
    }
  })

  return Store
}
