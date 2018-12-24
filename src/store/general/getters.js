import { micStatus } from '../../helpers/enums.js'

export function micAvailable (state) {
  return state.micStatus === micStatus.available
}
export function micRecording (state) {
  return state.micStatus === micStatus.recording
}
export function micSaving (state) {
  return state.micStatus === micStatus.saving
}
export function micUninitialized (state) {
  return state.micStatus === micStatus.uninitialized
}

export function title (state) {
  return state.title
}

export function verb (state) {
  return state.verb
}

export function subtitle (state) {
  return state.subtitle
}

export function dataPrefix (state) {
  return state.dataPrefix
}

export function authURL (state) {
  return state.authURL
}

export function hostname (state) {
  return state.hostname
}

export function camera (state) {
  return state.camera
}
