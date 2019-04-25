const DetectRTC = require('detectrtc')
// const adapter = require('adapter')

export default ({ app, router, Vue }) => {
  if (window.jim_DEBUG_FULL) console.log('DetectRTC loading')

  DetectRTC.load(function () {
    if (window.jim_DEBUG_FULL) console.dir(DetectRTC)
    Vue.prototype.$device = DetectRTC
    if (Vue.prototype.$store) {
      Vue.prototype.$store.commit('device', Vue.prototype.$device)
      if (DetectRTC.hasMicrophone) {
        Vue.prototype.$store.commit('setMicAvailable')
      }
    }
    else {
      if (window.jim_DEBUG_FULL) console.log('No store by the time device properties received')
    }
  })
}
