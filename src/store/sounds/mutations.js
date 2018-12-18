import vue from 'vue'

export function playHowl (state, payload) {
  let killing = state.playing.pop()
  while (killing) {
    killing.howl.stop()
    killing = state.playing.pop()
  }

  state.playing.push(payload.page)
  payload.page.howl.play()
  state.mostRecentPage = payload.page.pageNumber
}

export function playHowlAlso (state, payload) {
  state.playing.push(payload.page)
  payload.page.howl.play()
}

export function silence (state) {
  let killing = state.playing.pop()
  while (killing) {
    killing.howl.stop()
    killing = state.playing.pop()
  }
}

export function endHowlPlay (state, payload) {
  // let page = payload.page
  // get it off of playing - if only one playing, let's guess it's me...
  if (state.playing.length === 1) {
    state.playing.pop()
  }
  else {
    // iterate to remove, or just leave it there for now.
  }
}

export function delayPlayNext (state, ms) {
  vue.set(state, 'delayPlayNext', ms)
}
