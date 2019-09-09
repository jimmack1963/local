import { micStatus } from '../../helpers/enums'

let hostname = window.location.hostname.toLowerCase()
let authURL = ''
let title = 'title'
let verb = 'verb'
let subtitle = 'sub'
let dataPrefix = 'dev'
// const commonSubtitle = 'Hear a familiar voice<br>as often as you need<br>even when separated<br>by miles or years'
const commonSubtitle = 'Get on your kid\'s infinite playlist'

switch (hostname) {
  default: { // devprod !!
    authURL = window.location.origin
    title = 'Play It Again, Kid'
    verb = 'record'


    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'playitagainkid.com': { // devprod !!
    authURL = 'https://playitagainkid.com'
    title = 'Play It Again Kid'
    verb = 'Play It Again'
    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'letsreadastorytogether.com': { // devprod !!
    authURL = 'https://letsreadastorytogether.com'
    title = 'Let\'s Read A Story Together'
    verb = 'record'
    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'memoread.me': { // devprod !!
    authURL = 'https://memoread.me'
    title = 'Memories of Reading Together'
    verb = 'memoRead'
    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'readingtogether.works': { // devprod !!
    authURL = 'https://readingtogether.works'
    title = 'Reading Together Works'
    verb = 'record'
    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'myfamiliarvoices.com': { // devprod !!
    authURL = 'https://myfamiliarvoices.com'
    title = 'My Familiar Voices'
    verb = 'record'
    subtitle = commonSubtitle
    dataPrefix = 'prod'
    break
  }
  case 'localhost':
  case 'dev' : { // devprod !!
    authURL = window.location.origin
    title = 'Play It Again, Kid'
    verb = 'record'
    subtitle = commonSubtitle
    break
  }
}

export default {
  showDemos: true, // #day0
  playAfterRecord: true,
  micStatus: micStatus.uninitialized,
  // facingMode: 'environment', // 'user'
  facingMode: 'user',
  cameraPreference: 'touch', // pick
  device: false,
  mic: false,
  camera: false,
  mic_permitted: false,
  camera_permitted: false,
  isMobile: false,
  title,
  verb,
  subtitle,
  dataPrefix,
  authURL,
  hostname,
  locked: !process.env.DEV
}
