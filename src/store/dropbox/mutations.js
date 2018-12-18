import vue from 'vue'
import { Howl } from 'howler'

export function saveTempLink (state, payload) {
  let which = state.ids[payload.entry.id]
  if (which) {
    vue.set(which, 'link', payload.response.link)
    vue.set(which, 'linkTime', new Date())
  }
  else {

    if (window.jim_DEBUG_FULL) console.log('Fail save templink: ')
    if (window.jim_DEBUG_FULL) console.dir(payload)
  }
}

export function createHowl (state, payload) {
  let which = state.ids[payload.entry.id]
  let src = payload.response.link

  if (which) {
    let newHowl = new Howl({
      src: [src],
      format: ['wav'],
      preload: true,
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

    if (window.jim_DEBUG_FULL) console.log('Fail create howl: ')
    if (window.jim_DEBUG_FULL) console.dir(payload)
  }
}

export function saveThumbnail (state, payload) {
  // TODO cache the thumbnails locally
  let which = state.ids[payload.entry.id]
  if (which) {
    vue.set(which, 'thumbnail', payload.thumbnail)

    // Now link the cover images with the _TOC
    if (which.name.toLowerCase() === 'book.cover.png') {
      let key = which.dir
      let target = state._TOC[key]
      if (target) {
        vue.set(target, 'thumbnail', payload.thumbnail)
        if (window.jim_DEBUG_FULL) console.log('TOC thumbnail set: ' + which.name)
        return true
      }
    }
  }
  else {

    if (window.jim_DEBUG_FULL) console.log('Fail save thumbnail: ')
    if (window.jim_DEBUG_FULL) console.dir(payload)
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
            json: [],
            // txt: {},
          }
          base[entry.fname][entry.ext].push(entry)
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

export function saveEntryOld (state, payload) {
  let placed = false

  let entry = payload.entry
  vue.set(state.ids, entry.id, entry)
  debugger

  if (entry.path_lower) {
    let org = entry.parts.dir.split('/')
    let base = state.folders

    if (entry.parts.dir !== '/') {
      // entry.dir = entry.parts.dir
      entry.fname = entry.parts.name
      if (org.length > 1) {
        // the first char of a path is the /, which is split into an empty string
        for (let ctr = 1; ctr < org.length; ctr++) {
          let part = org[ctr]
          base[part] = base[part] || {}
          base = base[part]
        }
        if (entry['.tag'] === 'file') {
          let pageParts = entry.fname.match(/([pP]+)(\d*)/)
          if (!pageParts) {
            base[entry.fname] = entry
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
