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
  return Object.values(getters.TOC).reverse()
}

export function TOC (state, getters) {
  return {...getters['demos/_TOC'], ...getters['dropbox/_TOC'], ...state._TOC}
}

export function thumbs (state, getters) {
  return {...getters['dropbox/thumbnails'], ...getters['demos/thumbnails']}
}

/*
export function thumbnailByID2 (state) {

}
*/

/*
const nested = {
  thumbnailByID: (state, getters) => key => {

    let found
    found = state.dropbox.thumbnails[key]
    return found
  }
}

export function thumbnailByID {
  return nested.thumbnailByID
}
*/
