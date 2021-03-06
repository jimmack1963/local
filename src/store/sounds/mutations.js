import vue from 'vue'
import { Howl } from 'howler'

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

export function createHowl (state, payload) {

  let which = payload.ids[payload.entry.id]
  let src = payload.response.link
  let formats = []

  if (payload.entry && payload.entry.parts && payload.entry.parts.ext) {
    formats.push(payload.entry.parts.ext.replace('.', ''))
  }
  else {
    console.log('guessing the format for : ' + which)
    formats = ['m4a']
  }

  console.log('FORMATS: ' + JSON.stringify(formats))
  if (which) {
    // TODO: m4a may not be the only format!  Must be more rigorous
    let newHowl = new Howl({
      src: [src],
      format: formats,
      xhtml5: true,
      preload: payload.howlPreload || false,
    })
    vue.set(which, 'howl', newHowl)

    // newHowl.state = state
    newHowl.page = which

    newHowl.on('load', () => {
      console.log('HOWL loaded page ' + which.pageNumber || which.page || '')
    })
    newHowl.on('end', () => {
      // remove myself from playing
      let killLength = state.playing.length
      for (let killing = 0; killing < killLength; killing++) {
        state.playing.shift()
      }

      which.next()
    })
    // vue.set(which, 'metadata', payload.response.metadata)
  }
  else {

    if (window.jim_DEBUG_VUEX) console.log('Fail create howl: ')
    if (window.jim_DEBUG_VUEX) console.dir(payload)
  }
}
