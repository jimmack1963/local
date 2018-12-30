import vue from 'vue'
import { Howl } from 'howler'

export function saveTempLink (state, payload) {
  let which = state.ids[payload.entry.id]
  if (which) {
    vue.set(which, 'link', payload.response.link)
    vue.set(which, 'linkTime', new Date())
  }
  else {

    if (window.jim_DEBUG_VUEX) console.log('Fail save templink: ')
    if (window.jim_DEBUG_VUEX) console.dir(payload)
  }
}

export function createHowl (state, payload) {
  let which = state.ids[payload.entry.id]
  let src = payload.response.link

  if (which) {
    let newHowl = new Howl({
      src: [src],
      format: ['wav'],
      preload: payload.howlPreload || false,
    })
    vue.set(which, 'howl', newHowl)

    newHowl.state = state
    newHowl.page = which

    newHowl.on('end', () => {
      which.next()
    })
    // vue.set(which, 'metadata', payload.response.metadata)
  }
  else {

    if (window.jim_DEBUG_VUEX) console.log('Fail create howl: ')
    if (window.jim_DEBUG_VUEX) console.dir(payload)
  }
}

export function saveThumbnail (state, payload) {
  // TODO cache the thumbnails locally
  vue.set(state.thumbnails, payload.entry.id, payload.thumbnail)
  let which = state.ids[payload.entry.id]
  if (which) {
    vue.set(which, 'thumbnail', payload.thumbnail)


    // Now link the cover images with the _TOC
    if (which.name.toLowerCase() === 'book.cover.png') {
      let key = which.dir
      let target = state._TOC[key]
      if (target) {
        vue.set(target, 'thumbnail', payload.thumbnail)
        if (window.jim_DEBUG_VUEX) console.log('TOC thumbnail set: ' + which.name)
        return true
      }
    }
  }
  else {

    if (window.jim_DEBUG_VUEX) console.log('Fail save thumbnail: ', payload.entry.id)
    if (window.jim_DEBUG_VUEX) console.dir(payload)
  }
}

export function saveEntry (state, payload) {

  let placed = false

  let entry = payload.entry
  vue.set(state.ids, entry.id, entry)

  if (entry.path_lower) {
    // let org = entry.parts.dir.split('/')
    // let base = state.folders

    if (entry.parts.dir !== '/') {

      // make easier to get as used often
      entry.dir = entry.parts.dir
      entry.fname = entry.parts.name
      if (!(entry.dir in state.folders)) {
        vue.set(state.folders, entry.dir, {})
      }

      let base = state.folders[entry.dir]

      if (entry['.tag'] === 'file') {
        let pageParts = entry.fname.match(/([pP]+)(\d*)/)
        if (!pageParts) {
          base[entry.fname] = base[entry.fname] || {
            mp3: [],
            png: [],
            jpg: [],
            json: [],
            NoExt: []
            // txt: {},
          }
          base[entry.fname][(entry.ext || 'NoExt')].push(entry)
          placed = true
        }
        else {
          let pageNumber
          switch (pageParts.length) {
            case 3: {
              pageNumber = parseInt(pageParts[2]).toString()
              break
            }
            case 2: {
              pageNumber = parseInt(pageParts[0]).toString()
              break
            }
            default: {
              let err = {
                message: 'saveEntry fail: NO PAGE NUMBER for ' + entry.path_lower,
              }
              throw err
            }
          }
          if (pageNumber) {
            base.pages = base.pages || {}
            base.pages[pageNumber] = base.pages[pageNumber] || {
              mp3: [],
              png: [],
              jpg: [],
              json: [],
              // txt: {},
            }
            entry.pageNumber = pageNumber
            base.pages[pageNumber][entry.ext].push(entry)
            placed = true
          }
        }
      }
      else {
        vue.set(base, entry.fname, entry)
        placed = true
      }

    }
  }

  if (!placed) {
    let folder = payload.folder || '_TOC'
    let key = entry.path_lower
    if (!state[folder]) {
      vue.set(state, folder, {})
    }
    vue.set(state[folder], key, entry)
    console.dir(['saveEntry', folder, key, entry, state[folder]])
  }
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

export function dropboxCredentials (state, payload) {
  vue.set(state, 'access_token', payload.access_token)
  vue.set(state, 'token_type', payload.token_type)
  vue.set(state, 'uid', payload.uid)
  vue.set(state, 'account_id', payload.account_id)
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
        }
        else {
          if (key === 'cover') {
            assemble[0] = key
          }
          else {
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

    let myArray = assemble.filter( function (x) {
      return (x !== (undefined || null || ''))
    })

    return myArray
  }

  let folderName = payload.TOC.path_lower
  let contents = state.folders[folderName]
  if (contents) {
    let pageOrder = pageOrderProc(payload.TOC, contents)
    vue.set(state._TOC[payload.TOC.path_lower], 'pageOrder', pageOrder)
    let soundOrder = []
    let imageOrder = []

    for (let scene = 0; scene < pageOrder.length; scene++) {
      let thisPageNumber = pageOrder[scene]
      let entries = contents[thisPageNumber] || contents.pages[thisPageNumber]
      soundOrder[scene] = entries.mp3.length > 0 ? entries.mp3[0].link : false
      imageOrder[scene] = entries.png.length > 0 ? entries.png[0].thumbnail : false
      if (!imageOrder[scene]) {
        imageOrder[scene] = entries.jpg.length > 0 ? entries.jpg[0].thumbnail : false
      }
    }

    vue.set(state._TOC[payload.TOC.path_lower], 'soundOrder', soundOrder)
    vue.set(state._TOC[payload.TOC.path_lower], 'imageOrder', imageOrder)

    /*
    Temporarily, only one sound + image per page
    scene order contiguous zero based
    page # any based
    sound & image based on scene
     */

  }
}
