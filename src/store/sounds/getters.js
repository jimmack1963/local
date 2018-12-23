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
