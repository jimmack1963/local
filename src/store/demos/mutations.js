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
      source: entry.source,
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

    TOCEntry.pageOrder = Object.keys(folderDestination.pages)
    let myOffset = TOCEntry.pageOrder.indexOf(entry.pageNumber) || 0
    switch (entry.ext) {
      case 'png': {
        pageDestination.png.push(entry)
        entry.thumbnail = entry.link

        TOCEntry.imageOrder[myOffset] = entry.link
        break
      }
      case 'mp3': {
        pageDestination.mp3.push(entry)
        TOCEntry.soundOrder[myOffset] = entry.link

        // have a default to cover page if not yet loaded
        TOCEntry.imageOrder[myOffset] = TOCEntry.imageOrder[myOffset] || TOCEntry.thumbnail
        break
      }
    }
  }
}

export function childrenLoaded (state, payload) {
  let entry = payload.activeFolder
  // childrenLoaded probably not stored in correct structure
  vue.set(state._TOC[entry.path_lower], 'childrenLoaded', true)
}
export function calc (state, payload) {

  let pageOrderProc = function (folder, sourceFolder) {
    // TODO: this should be a property on the TOC
    let numberTest = /^\d|$/
    let assemble = []
    // let sourceFolder = this.folders[folder.path_lower]

    if (sourceFolder && sourceFolder.pages) {

      Object.keys(sourceFolder.pages).forEach((key) => {
        if (numberTest.test(key)) {
          let index = parseInt(key)
          assemble[index] = key
        } else {
          if (key === 'cover') {
            assemble[0] = key
          } else {
            // TODO: handle multiple string keys better
            let index = assemble.length + 10000
            assemble[index] = key
          }
        }
      })

      if (sourceFolder.cover) {
        assemble[0] = 'cover'
      }
    }

    return assemble.filter(function (x) {
      return (x !== (undefined || null || ''))
    })
  }

  let folderName = payload.TOC.path_lower
  let contents = state.folders[folderName]
  if (contents) {

    let pageOrder = pageOrderProc(payload.TOC, contents)
    vue.set(state._TOC[payload.TOC.path_lower], 'pageOrder', pageOrder)
    if (window.jim_DEBUG_FULL) console.log('Reactive: updated pageOrder for TOC', payload.TOC.path_lower)

    let soundOrder = []
    let imageOrder = []

    let coverImage = contents.book_cover.png.length > 0 ? contents.book_cover.png[0].thumbnail : false

    for (let scene = 0; scene < pageOrder.length; scene++) {
      let thisPageNumber = pageOrder[scene]
      let entries = contents[thisPageNumber] || contents.pages[thisPageNumber]
      soundOrder[scene] = entries.mp3.length > 0 ? entries.mp3[0].link : false
      imageOrder[scene] = entries.png.length > 0 ? entries.png[0].thumbnail : coverImage
      if (!imageOrder[scene]) {
        imageOrder[scene] = entries.jpg.length > 0 ? entries.jpg[0].thumbnail : coverImage
      }
    }

    vue.set(state._TOC[payload.TOC.path_lower], 'soundOrder', soundOrder)
    vue.set(state._TOC[payload.TOC.path_lower], 'imageOrder', imageOrder)
    vue.set(state._TOC[payload.TOC.path_lower], 'contents', contents)

    /*
    Temporarily, only one sound + image per page
    scene order contiguous zero based
    page # any based
    sound & image based on scene
     */

  }
}
