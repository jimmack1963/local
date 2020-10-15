import {LocalStorage, Platform} from 'quasar'

export default function () {
  return {
    mediaState: 'uninitialized',
    devices: [],
    files: [],
    selected: Platform.is.desktop ? (LocalStorage.getItem('devices/selected') || 'file') : 'file',
    stream: false,
    externals: {
      video: false,
      canvas: false,
      image: false,
      input: false,
    },
    latestImage: '//:0',
    latestImageAsDataURL: false,
    urls: [],
  }
}
