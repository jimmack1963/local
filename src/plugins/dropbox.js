import Dropbox from 'dropbox'

const parseQueryString = function (str) {
  let ret = Object.create(null)

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
  window.jim_DEBUG = true // devprod !!!!!
  window.jim_DEBUG_FULL = true // devprod !!!!!
  window.jim_DEBUG_FULL_PLAYING = true // devprod !!!!!

  // let CLIENT_ID = '42zjexze6mfpf7x'
  // let CLIENT_ID = '80z0vbjkw50ybvb' // memoRead - all dropbox
  let CLIENT_ID = 'b7ggii7duwya8gj' // PlayItAgainKid - only subfolder

  // Parses the url and gets the access token if it is in the urls hash
  function getAccessTokenFromUrl () {
    return parseQueryString(window.location.hash).access_token
  }

  // If the user was just redirected from authenticating, the urls hash will
  // contain the access token.
  function isAuthenticated () {
    return !!getAccessTokenFromUrl()
  }

  // Render a list of items to #files
  // function listItems (items) {
  //   items.forEach(function (item) {
  //     console.log(item.name)
  //   })
  // }

  // This example keeps both the authenticate and non-authenticated setions
  // in the DOM and uses this function to show/hide the correct section.
  if (isAuthenticated()) {
    // Create an instance of Dropbox with the access token and use it to
    // fetch and render the files in the users root directory.
    let dbx = new Dropbox.Dropbox({ accessToken: getAccessTokenFromUrl() })
    Vue.prototype.$dbx = dbx

    // /PlayItAgainKid/book1
    /*
    dbx.filesListFolder({
      path: '',
      include_media_info: true
    })
      .then(function (response) {
        listItems(response.entries)
      })
      .catch(function (error) {
        console.error(error)
      })
    */
  }
 else {
    // Set the login anchors href using dbx.getAuthenticationUrl()
    let dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID })
    Vue.prototype.$dbx = dbx
    let authUrl = dbx.getAuthenticationUrl('https://localhost:8080/auth')
    console.log('authUrl')
    console.dir(authUrl)
    Vue.prototype.$authURL = authUrl
  }
  /*
  let Dropbox = dropbox.Dropbox
  let myToken = false
  if (window.jim_DEBUG_FULL) {
  }
  myToken = 'K637rkl3w9UAAAAAAAAO6EwDPADy3tiG-UF5Ap3KZ8hx6EHCNL0CQMEIPegvE5ZE' // playItAgainKid
  // myToken = 'K637rkl3w9UAAAAAAAAO6SRSimVr5yYJ82-eNMl_D3Igt5FHqb94vAoGW4I4emXC' // memoRead
  // let fetch = false
  let dbx = new Dropbox({accessToken: myToken})

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
