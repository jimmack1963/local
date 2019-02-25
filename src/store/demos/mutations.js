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
  state.activeFolder = payload.activeFolder
  state.activeScene = payload.activeScene || 0
}

export function setActivePage (state, payload) {

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

  // first entry must be the cover image
  let folder = payload.folder
  let entry = payload.entry
  vue.set(state.ids, entry.id || entry.name, entry)
  if (!entry['.tag']) {
    entry['.tag'] = 'folder'
  }

  if (entry.ext === 'wav') entry.ext = 'mp3'
  if (entry.ext === 'm4a') entry.ext = 'mp3'

  if (!(folder in state.folders)) {
    vue.set(state.folders, folder, {
      book_cover: {
        mp3: [],
        png: [entry],
        jpg: [],
        json: [],
        NoExt: []
      },
      pages: {}
    })
    entry.thumbnail = entry.link
    let contents = {
      pageOrder: [],
      soundOrder: [],
      imageOrder: [],
      '.tag': 'folder',
      dir: folder,
      contents: state.folders[folder],
      id: entry.id || entry.name,
      name: folder,
      path_lower: folder,
      thumbnail: entry.thumbnail,
    }
    vue.set(state['_TOC'], contents.dir, contents)
  }
  else {
    let TOCEntry = state['_TOC'][folder]

    let folderDestination = state.folders[folder]
    let pageDestination = folderDestination.pages[entry.pageNumber] = folderDestination.pages[entry.pageNumber] || {
      mp3: [],
      png: [],
      jpg: [],
      json: [],
      NoExt: []
    }
    switch (entry.ext) {
      case 'png': {
        pageDestination.png.push(entry)
        entry.thumbnail = entry.link
        TOCEntry.imageOrder[entry.pageNumber] = entry.link
        break
      }
      case 'mp3': {
        pageDestination.mp3.push(entry)
        TOCEntry.soundOrder[entry.pageNumber] = entry.link
        break
      }
    }

    TOCEntry.pageOrder = Object.keys(folderDestination.pages)
  }
}
