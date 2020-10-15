import {LocalStorage} from 'quasar'

export function mediaState (state, payload) {
  state.mediaState = payload
}

export function devices (state, payload) {
  state.devices = payload
}

export function stream (state, payload) {
  state.stream = payload
}

export function selected (state, payload) {
  LocalStorage.set('devices/selected', payload)
  state.selected = payload
}

export function latestImageAsDataURL (state, payload) {
  state.latestImageAsDataURL = payload
}

export function externals (state, payload) {
  state.externals = payload
}

export function files (state, payload) {
  state.files = payload
}

export function latestImage (state, payload) {
  state.latestImage = payload
  state.urls.push(payload)
}

export function clearImages (state, payload) {
  state.latestImage = '//:0'
  state.urls = []
}

