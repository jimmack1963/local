import vue from 'vue'

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

  let entry = payload.entry
  let TOC = state._TOC[entry.dir]
  if (TOC.pageOrder) {
    let myOffset = TOC.pageOrder.indexOf(entry.pageNumber)
    if (myOffset >= 0 && !TOC.soundOrder[myOffset]) {

      vue.set(TOC.soundOrder, myOffset, payload.response.link)
    }
  }
}

export function saveThumbnail (state, payload) {
  let targetId = payload.overloadThumbnailID || payload.entry.id

  if (targetId in state.thumbnails) {

    console.log('thumbnail' + targetId + ' already cached')
    return
  }
  else {
    vue.set(state.thumbnails, targetId, payload.thumbnail)
  }

  let which = state.ids[targetId]
  if (which) {
    vue.set(which, 'thumbnail', payload.thumbnail)

    // Now link the cover images with the _TOC
    // there may be a few old images out there
    if (which.name.toLowerCase() === 'book_cover.png' || which.name.toLowerCase() === 'book.cover.png') {
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
    if (window.jim_DEBUG_VUEX) console.log('Fail save thumbnail: ', targetId)
    if (window.jim_DEBUG_VUEX) console.dir(payload)
  }

  let entry = payload.entry
  let TOC = state._TOC[(entry.dir || entry.path_lower)]
  if (payload.overridePageName || !('pageNumber' in entry)) {

    if (payload.overridePageName) {
      if (TOC && TOC.imageOrder) {
        vue.set(TOC.imageOrder, payload.overridePageName, payload.thumbnail)
      }
    }
 else {

      if (window.jim_DEBUG_FULL) console.log('Missing TOC or TOC.imageOrder for ' + entry.pageNumber)
      if (window.jim_DEBUG_FULL) console.dir([entry, TOC])
    }
    // how no page number inside entry?
  }
 else if (TOC && TOC.imageOrder) {
    vue.set(TOC.imageOrder, entry.pageNumber, payload.thumbnail)
  }
 else {
    if (window.jim_DEBUG_FULL) console.log('Missing TOC or TOC.imageOrder for ' + entry.pageNumber)
    if (window.jim_DEBUG_FULL) console.dir([entry, TOC])
  }
}

export function saveEntry (state, payload) {
  /*
  First entry = folder.  because path_lower starts with a /,
  when chopped intor parts, the dir = /, which makes it skip to the section !placed
  THis makes the TOC entry
   */
  // folder is like a root base of operations more than a location

  let placed = false

  let entry = payload.entry
  vue.set(state.ids, entry.id, entry)
  if (!entry['.tag']) {
    entry['.tag'] = 'folder'
  }

  if (entry.ext === 'wav') entry.ext = 'mp3'
  if (entry.ext === 'm4a') entry.ext = 'mp3'

  if (entry.path_lower) {
    // let org = entry.parts.dir.split('/')
    // let base = state.folders

    if (entry.parts.dir !== '/') {

      // make easier to get as used often

      entry.dir = entry.parts.dir || entry.parts.name
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
            NoExt: [],
            // txt: {},
          }
          if (entry.ext in base[entry.fname]) {
            base[entry.fname][(entry.ext || 'NoExt')].push(entry)
            placed = true
          }
 else {
            console.log('Not valid extention: ' + entry.ext + ' for ' + entry.path_lower)
          }
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
              let newVar = {
                message: 'saveEntry fail: NO PAGE NUMBER for ' + entry.path_lower,
              }
              throw newVar
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

        vue.set(state.folders, entry.dir, base)
      }
 else {
        vue.set(state.folders, entry.fname, entry)
        placed = true
      }
    }
  }

  if (!placed) {
    // make the TOC entry on first pass - as is a folder not an asset
    let folder = payload.folder || '_TOC'

    if (folder === '_TOC') {
      // setup default housekeeping
      vue.set(entry, 'pageOrder', [])
      vue.set(entry, 'soundOrder', [])
      vue.set(entry, 'imageOrder', [])
    }

    let key = entry.path_lower
    if (!state[folder]) {
      vue.set(state, folder, {})
    }
    vue.set(state[folder], key, entry)
    console.dir(['saveEntry', folder, key, entry, state[folder]])
  }
}

export function Credentials (state, payload) {
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
    vue.set(state._TOC[payload.TOC.path_lower], 'contents', contents)

    /*
    Temporarily, only one sound + image per page
    scene order contiguous zero based
    page # any based
    sound & image based on scene
     */

  }
}

export function thumbnailSize (state, payload) {
  // if not a valid size, use the smallest size
  if (state.thumbnailSizes.includes(payload.thumbnailSize)) {
    state.thumbnailSize = payload.thumbnailSize
  }
 else {
    state.thumbnailSize = state.thumbnailSizes[0]
  }
}

export function quality (state, payload) {
  state.quality = payload.quality
}
