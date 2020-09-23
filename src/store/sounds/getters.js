/* eslint-disable camelcase */

export function playing (state) {
  return state.playing
}

export function playingPage (state) {
  return state.playing.length > 0 ? state.playing[0].pageNumber : false
}

export function delayPlayNext (state) {
  return state.delayPlayNext
}

export function mostRecentPage (state) {
  if (state.mostRecentPage) {
    return state.mostRecentPage
  }
  else {
    return ''
  }
}

export function howlPreload (state) {
  return state.howlPreload
}

export function currentVideo (state) {
  return state.currentVideo
}

export function audioDevices (state) {
  return state.devices.filter(dev => (dev.kind === 'audioinput') &&
    !dev.label.includes('Soundflower '),
  )
}

export function videoDevices (state) {
  return state.devices.filter(dev => (dev.kind === 'videoinput') &&
    !dev.label.includes('Soundflower '),
  )
}

export function videoDevicesAsOptions (state) {
  return state.devices.filter(dev => (dev.kind === 'videoinput') &&
    !dev.label.includes('Soundflower '))
    .map(dev => {
      return {
        label: dev.label,
        value: dev.deviceId,
      }
    })
}

