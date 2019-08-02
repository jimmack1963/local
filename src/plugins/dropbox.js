/* eslint-disable camelcase,no-extra-boolean-cast */
import gtm from 'src/components/gtm'
import Dropbox from 'dropbox'
import Store from '../store'
import { LocalStorage } from 'quasar'
import fetch from 'isomorphic-unfetch'

const parseQueryString = function (str) {
  let ret = {}

  if (typeof str !== 'string') {
    return ret
  }

  str = str.trim().replace(/^(\?|#|&)/, '')

  if (!str) {
    return ret
  }

  str.split('&').forEach(function (param) {
    let parts = param.replace(/\+/g, ' ').split('=')
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    let key = parts.shift()
    let val = parts.length > 0 ? parts.join('=') : undefined

    key = decodeURIComponent(key)

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val)

    if (ret[key] === undefined) {
      ret[key] = val
    }
    else if (Array.isArray(ret[key])) {
      ret[key].push(val)
    }
    else {
      ret[key] = [ret[key], val]
    }
  })

  return ret
}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  let store = false
  window.jim_DEBUG = true // devprod !!!!!
  window.jim_DEBUG_FULL = true // devprod !!!!!
  window.jim_DEBUG_VUEX = true // devprod !!!!!
  window.jim_DEBUG_FULL_PLAYING = true // devprod !!!!!

  // let CLIENT_ID = '42zjexze6mfpf7x'
  // let CLIENT_ID = '80z0vbjkw50ybvb' // memoRead - all dropbox
  let CLIENT_ID = 'b7ggii7duwya8gj' // PlayItAgainKid - only subfolder

  // If the user was just redirected from authenticating, the urls hash will
  // contain the access token.
  // function isAuthenticated () {
  //   return !!getAccessTokenFromUrl()
  // }

  // This example keeps both the authenticate and non-authenticated setions
  // in the DOM and uses this function to show/hide the correct section.
  let queryString = parseQueryString(window.location.hash)

  let saved = LocalStorage.get.item('dropbox/access_token')
  let access_token = queryString.access_token
  if (access_token) {
    if (!saved || saved !== access_token) {
      LocalStorage.set('dropbox/access_token', access_token)
    }
  }
  else if (saved) {
    access_token = saved
  }
  else {
    // need to validate against dropbox
  }

  let token_type = queryString.token_type
  let uid = queryString.uid
  let account_id = queryString.account_id
  let dbx

  if (!!access_token) {
    // Create an instance of Dropbox with the access token and use it to
    // fetch and render the files in the users root directory.

    dbx = new Dropbox.Dropbox({clientId: CLIENT_ID, accessToken: access_token, fetch: fetch})
    Vue.prototype.$dbx = dbx

    if (Store) {
      store = Store()
      if (window.jim_DEBUG_FULL) console.dir(store)

      store.commit('dropbox/Credentials', {
        access_token,
        token_type,
        uid,
        account_id,
      })
    }
    else {

      if (window.jim_DEBUG_FULL) console.log('No store?')
    }
  }
  else {
    // Set the login anchors href using dbx.getAuthenticationUrl()
    if (Store) {
      store = Store()
    }
    else {
      if (window.jim_DEBUG_FULL) console.log('No store?')
    }

    dbx = new Dropbox.Dropbox({clientId: CLIENT_ID, fetch: fetch})
    Vue.prototype.$dbx = dbx
  }

  let authUrl = dbx.getAuthenticationUrl(store.state.general.authURL)
  console.log('authUrl')
  console.dir(authUrl)
  gtm.logEvent('website', store.state.general.authURL, '', false)
  Vue.prototype.$authURL = authUrl

  /*
  let Dropbox = dropbox.Dropbox
  let myToken = false
  if (window.jim_DEBUG_FULL) {
  }
  myToken = 'K637rkl3w9UAAAAAAAAO6EwDPADy3tiG-UF5Ap3KZ8hx6EHCNL0CQMEIPegvE5ZE' // playItAgainKid
  // myToken = 'K637rkl3w9UAAAAAAAAO6SRSimVr5yYJ82-eNMl_D3Igt5FHqb94vAoGW4I4emXC' // memoRead
  // let fetch = false
  let dbx = new Dropbox({access_token: myToken, fetch: fetch})

  Vue.prototype.$Dropbox = Dropbox
  Vue.prototype.$dbx = dbx

  // dbx.filesListFolder({path: '/playitagainkid'})
  dbx.filesListFolder({path: ''})
    .then(response => {

      console.log('response.entries')
      console.dir(response.entries)
      if (window.jim_DEBUG_FULL) {
      }
    })
  */
}
