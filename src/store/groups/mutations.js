import gtm from 'src/components/gtm'
import vue from 'vue'

export function setsomething (state, payload) {
    vue.set(state, 'junk', payload.junk)
}


export function clearData (state) {
  state._TOC = {}
  state.activeFolder = false
  state.folders = {}
  state.thumbnails = {}
  state.activeScene = false
  state.ids = {}
}

export function setActiveFolder (state, payload) {
  if (payload) gtm.logEvent('book', 'activeFolder', payload.name, false)
  state.activeFolder = payload
  state.activeScene = 0
}

export function setActivePage (state, payload) {
  if (payload.activePage) gtm.logEvent('book', 'page', payload.activePage, false)
  if (state.activeFolder && state.activeFolder.pageOrder) {
    let index = state.activeFolder.pageOrder.indexOf(payload.activePage)
    state.activeScene = index
    if (window.jim_DEBUG_VUEX) console.log(`setActivePage>> ${payload.activePage} set scene ${index}`)
  }
  else {
    state.activeScene = 0
  }
}

export function activeScene (state, payload) {
  state.activeScene = payload.activeScene
}

export function saveEntry (state, payload) {
  let folder = payload.folder
  let entry = payload.entry
  vue.set(state.ids, entry.id || entry.fname, entry)
  if (!entry['.tag']) {
    entry['.tag'] = 'folder'
  }

  if (entry.ext === 'wav') entry.ext = 'mp3'
  if (entry.ext === 'm4a') entry.ext = 'mp3'

  if (!(folder in state.folders)) {
    vue.set(state.folders, folder, {
      mp3: [],
      png: [],
      jpg: [],
      json: [],
      NoExt: []
    })
  }


  // let base = state.folders[folder]

  if (entry['.tag']) {

  }


}
