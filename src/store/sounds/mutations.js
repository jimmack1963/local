import vue from 'vue'

export function playHowl (state, payload) {
  let killLength = state.playing.length

  state.playing.push(payload.page)
  payload.page.howl.play()
  state.mostRecentPage = payload.page.pageNumber

  for (let killing = 0; killing < killLength; killing++) {
    state.playing.shift()
  }
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
  state.playing.forEach((howl) => {
    howl.howl.stop()
  })
}

export function delayPlayNext (state, ms) {
  vue.set(state, 'delayPlayNext', ms)
}

export function howlPreload (state, value) {
  state.howlPreload = value
}
