// import vue from 'vue'

export function playHowl (state, payload) {
  let killing = state.playing.pop()
  while (killing) {
    killing.howl.stop()
    killing = state.playing.pop()
  }

  state.playing.push(payload.page)
  payload.page.howl.play()
}

export function playHowlAlso (state, payload) {
  state.playing.push(payload.page)
  payload.page.howl.play()
}

export function silence (state, payload) {
  let killing = state.playing.pop()
  while (killing) {
    killing.howl.stop()
    killing = state.playing.pop()
  }
}

export function endHowlPlay (state, payload) {
  let page = payload.page
  // get it off of playing
  if (state.playing.length === 1) {
    state.playing.pop()
  }
  else {
    // iterate to remove, or just leave it there for now.
  }

  // What to do to trigger next?
  if (state.delayPlayNext) {
    page.next()
  }
}
