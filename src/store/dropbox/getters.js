/* eslint-disable camelcase */

export function ids (state) {
  return state.ids
}

export function TOC (state) {
  return state._TOC
}

export function TOCSorted (state) {
  let maybe = Object.values(state._TOC).reverse()
  return maybe
}

export function folders (state) {
  return state.folders
}

export function activeFolder (state) { return state.activeFolder }

export function activeScene (state) { return state.activeScene }

export function access_token (state) {
  return state.access_token
}

export function token_type (state) {
  return state.token_type
}

export function uid (state) {
  return state.uid
}

export function account_id (state) {
  return state.account_id
}
