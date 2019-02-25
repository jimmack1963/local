/* eslint-disable camelcase */

export function ids (state, getters) {
  return {...getters['dropbox/ids'], ...getters['demos/ids'], ...state.ids}
}

export function folders (state, getters) {
  return {...getters['demos/folders'], ...getters['dropbox/folders'], ...state.folders}
}

export function activeFolder (state) { return state.activeFolder }

export function activeScene (state) { return state.activeScene }

export function TOCSorted (state, getters) {
  let maybe = Object.values(getters.TOC).reverse()
  return maybe
}

export function TOC (state, getters) {
  let sofar = {...getters['dropbox/_TOC'], ...getters['demos/_TOC'], ...state._TOC}

  return sofar
}
