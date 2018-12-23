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
