/* eslint-disable camelcase */
export function playing (state) {
  return state.playing[0]
}

export function playingPage (state) {
  return state.playing[0] ? state.playing[0].pageNumber : false
}

