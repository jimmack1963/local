/* eslint-disable camelcase */

export function ids (state, getters) {
  return {...getters['dropbox/ids'], ...state.ids}
}

export function folders (state, getters) {
  return {...getters['dropbox/folders'], ...state.folders}
}

export function activeFolder (state) { return state.activeFolder }

export function activeScene (state) { return state.activeScene }

export function _TOC (state) {
  return state._TOC
}

export function thumbnails (state) {
  return state.thumbnails
}
