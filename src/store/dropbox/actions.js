const pathParse = require('path-parse')
import { LocalStorage } from 'quasar'

export const clearAll = (context) => {

}

export const saveLevel = async (context, payload) => {
  let folder = payload.folder // folder is like a root base of operations more than a location
  let entries = payload.response.entries
  // jrm: this has all the entries as a bunch, which can be reserved for when needed.
  let dbx = payload.dbx
  let promises = []

  entries.forEach((entry) => {
    promises.push(context.dispatch('registerFile', {
      entry,
      dbx,
      folder,
      calc: false,
    }))
  })

  await Promise.all(promises)

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}

export const registerFileFirstPass = async (context, payload) => {

  let folder = payload.folder // folder is like a root base of operations more than a location
  let entry = payload.entry
  console.log('FILE:,' + JSON.stringify(entry))
  let dbx = payload.dbx
  entry.dbx = dbx
  entry.parts = pathParse(entry.path_lower)
  if (entry.parts.dir.length > 7 && entry.parts.dir.endsWith('/history')) {
    return false
  }
  entry.ext = entry.parts.ext.toLowerCase().replace('.', '')
  entry.childrenLoaded = false
  context.commit('saveEntry', {
    folder,
    entry,
  })

  // does nothing for .tag = folder
  if (entry.parts.name.toLowerCase() === 'book_cover') {
    switch (entry.ext) {
      case 'jpg':
      case 'png': {
        if (LocalStorage.has(entry.id)) {
          if (window.jim_DEBUG_VUEX) console.log('found thumbnail: ' + entry.id)

          let thumb = false
          let raw = LocalStorage.get.item(entry.id)
          let rawType = typeof raw
          switch (rawType) {
            case 'string': {
              try {
                thumb = JSON.parse(raw)
                context.commit('saveThumbnail', {
                  entry,
                  thumbnail: thumb.src,
                })
              } catch (e) {
                thumb = false
              }
              break
            }
            case 'object' : {

              context.commit('saveThumbnail', {
                entry,
                thumbnail: raw,
              })
              break
            }
          }
        } else {
          if (window.jim_DEBUG_FULL) console.log('Get Thumbnail for ', entry.id)

          let response = await dbx.filesGetThumbnail({
            path: entry.path_lower,
            format: 'jpeg',
            size: context.getters.thumbnailSize,
          })

          try {

            // don't save thumbnail when not a cover
            let useful = window.URL.createObjectURL(response.fileBlob)
            context.commit('saveThumbnail', {
              entry,
              thumbnail: useful,
            })


            let blob = response.fileBlob
            let size = blob.size
            let type = blob.type
            if (window.jim_DEBUG_FULL) console.log('Got: ', entry.id)

            let reader = new FileReader()
            reader.addEventListener('loadend', function () {
              if (window.jim_DEBUG_FULL) console.log('Reader: ', entry.id)
              let base64FileData = reader.result.toString()

              let mediaFile = {
                id: entry.id,
                size: size,
                type: type,
                src: base64FileData,
              }

              LocalStorage.set(entry.id, JSON.stringify(mediaFile))

            })

            reader.readAsDataURL(blob)
          } catch (error) {
            if (window.jim_DEBUG_VUEX) console.log('ERROR:')
            console.log(error)
          }
        }
        break
      }
      case 'mp3': {
        let response
        try {
          /*
            For some reason, await is not returning the response, but returns undefined
           */
          response = await dbx.filesGetTemporaryLink({path: entry.path_lower})
            .then((response) => {

              context.commit('saveTempLink', {
                entry,
                response,
              })

              context.commit('createHowl', {
                  entry,
                  response,
                  context,
                  ids: context.rootState.dropbox.ids,
                  howlPreload: context.rootState.sounds.howlPreload,
                },
                {root: true})
            })
        } catch (err) {
          if (window.jim_DEBUG_FULL) {
            console.log('err')
            console.dir(err)
          }
        }
        if (window.jim_DEBUG_FULL) console.log('response:', response)

        if (response && response.link) {
          context.commit('saveTempLink', {
            entry,
            response,
          })

          context.commit('createHowl', {
            entry,
            response,
            context,
            ids: context.rootState.dropbox.ids,
            howlPreload: context.rootState.sounds.howlPreload,
          })
        }

        break
      }
    }
  }
  if (payload.calc) {

    context.commit('calc', {
      TOC: entry,
    })
  }
}

export const registerFileSecondPass = async (context, payload) => {
  let entry = payload.entry
  if (entry.childrenLoaded) { return }

  console.log('FILE:,' + JSON.stringify(entry))
  let dbx = entry.dbx

  // does nothing for .tag = folder
  if (entry.parts.name.toLowerCase() !== 'book_cover') {
    switch (entry.ext) {
      case 'jpg':
      case 'png': {
        if (LocalStorage.has(entry.id)) {
          if (window.jim_DEBUG_VUEX) console.log('found thumbnail: ' + entry.id)

          let thumb = false
          let raw = LocalStorage.get.item(entry.id)
          let rawType = typeof raw
          switch (rawType) {
            case 'string': {
              try {
                thumb = JSON.parse(raw)
                context.commit('saveThumbnail', {
                  entry,
                  thumbnail: thumb.src,
                })
              } catch (e) {
                thumb = false
              }
              break
            }
            case 'object' : {

              context.commit('saveThumbnail', {
                entry,
                thumbnail: raw,
              })
              break
            }
          }
        } else {
          if (window.jim_DEBUG_FULL) console.log('Get Thumbnail for ', entry.id)

          let response = await dbx.filesGetThumbnail({
            path: entry.path_lower,
            format: 'jpeg',
            size: context.getters.thumbnailSize,
          })

          try {

            // don't save thumbnail for pages, only covers
            let useful = window.URL.createObjectURL(response.fileBlob)

            context.commit('saveThumbnail', {
              entry,
              thumbnail: useful,
            })

            let blob = response.fileBlob
            let size = blob.size
            let type = blob.type
            if (window.jim_DEBUG_FULL) console.log('Got: ', entry.id)

            let reader = new FileReader()
            reader.addEventListener('loadend', function () {
              if (window.jim_DEBUG_FULL) console.log('Reader: ', entry.id)
              let base64FileData = reader.result.toString()

              let mediaFile = {
                id: entry.id,
                size: size,
                type: type,
                src: base64FileData,
              }

              LocalStorage.set(entry.id, JSON.stringify(mediaFile))

            })

            reader.readAsDataURL(blob)
          } catch (error) {
            if (window.jim_DEBUG_VUEX) console.log('ERROR:')
            console.log(error)
          }
        }
        break
      }
      case 'mp3': {
        let response
        try {
          /*
            For some reason, await is not returning the response, but returns undefined
           */
          response = await dbx.filesGetTemporaryLink({path: entry.path_lower})
            .then((response) => {

              context.commit('saveTempLink', {
                entry,
                response,
              })

              context.commit('createHowl', {
                  entry,
                  response,
                  context,
                  ids: context.rootState.dropbox.ids,
                  howlPreload: context.rootState.sounds.howlPreload,
                },
                {root: true})
            })
        } catch (err) {
          if (window.jim_DEBUG_FULL) {
            console.log('err')
            console.dir(err)
          }
        }
        if (window.jim_DEBUG_FULL) console.log('response:', response)

        if (response && response.link) {
          context.commit('saveTempLink', {
            entry,
            response,
          })

          context.commit('createHowl', {
            entry,
            response,
            context,
            ids: context.rootState.dropbox.ids,
            howlPreload: context.rootState.sounds.howlPreload,
          })
        }

        break
      }
    }
  }
  if (payload.calc) {

    context.commit('calc', {
      TOC: entry,
    })
  }
}

export const registerFileOriginal = async (context, payload) => {
  // copy of registerFile... hoping to re-use
  let folder = payload.folder // folder is like a root base of operations more than a location
  let entry = payload.entry
  console.log('FILE:,' + JSON.stringify(entry))
  let dbx = payload.dbx
  entry.parts = pathParse(entry.path_lower)
  if (entry.parts.dir.length > 7 && entry.parts.dir.endsWith('/history')) {
    return false
  }
  entry.ext = entry.parts.ext.toLowerCase().replace('.', '')
  context.commit('saveEntry', {
    folder,
    entry,
  })

  // does nothing for .tag = folder
  switch (entry.ext) {
    case 'jpg':
    case 'png': {
      if (LocalStorage.has(entry.id)) {
        if (window.jim_DEBUG_VUEX) console.log('found thumbnail: ' + entry.id)

        let thumb = false
        let raw = LocalStorage.get.item(entry.id)
        let rawType = typeof raw
        switch (rawType) {
          case 'string': {
            try {
              thumb = JSON.parse(raw)
              context.commit('saveThumbnail', {
                entry,
                thumbnail: thumb.src,
              })
            } catch (e) {
              thumb = false
            }
            break
          }
          case 'object' : {

            context.commit('saveThumbnail', {
              entry,
              thumbnail: raw,
            })
            break
          }
        }
      } else {
        if (window.jim_DEBUG_FULL) console.log('Get Thumbnail for ', entry.id)

        let response = await dbx.filesGetThumbnail({
          path: entry.path_lower,
          format: 'jpeg',
          size: context.getters.thumbnailSize,
        })

        try {
          let useful = window.URL.createObjectURL(response.fileBlob)

          context.commit('saveThumbnail', {
            entry,
            thumbnail: useful,
          })

          let blob = response.fileBlob
          let size = blob.size
          let type = blob.type
          if (window.jim_DEBUG_FULL) console.log('Got: ', entry.id)

          let reader = new FileReader()
          reader.addEventListener('loadend', function () {
            if (window.jim_DEBUG_FULL) console.log('Reader: ', entry.id)
            let base64FileData = reader.result.toString()

            let mediaFile = {
              id: entry.id,
              size: size,
              type: type,
              src: base64FileData,
            }

            LocalStorage.set(entry.id, JSON.stringify(mediaFile))

          })

          reader.readAsDataURL(blob)
        } catch (error) {
          if (window.jim_DEBUG_VUEX) console.log('ERROR:')
          console.log(error)
        }
      }
      break
    }
    case 'mp3': {
      let response
      try {
        /*
          For some reason, await is not returning the response, but returns undefined
         */
        response = await dbx.filesGetTemporaryLink({path: entry.path_lower})
          .then((response) => {

            context.commit('saveTempLink', {
              entry,
              response,
            })

            context.commit('createHowl', {
                entry,
                response,
                context,
                ids: context.rootState.dropbox.ids,
                howlPreload: context.rootState.sounds.howlPreload,
              },
              {root: true})
          })
      } catch (err) {
        if (window.jim_DEBUG_FULL) {
          console.log('err')
          console.dir(err)
        }
      }
      if (window.jim_DEBUG_FULL) console.log('response:', response)

      if (response && response.link) {
        context.commit('saveTempLink', {
          entry,
          response,
        })

        context.commit('createHowl', {
          entry,
          response,
          context,
          ids: context.rootState.dropbox.ids,
          howlPreload: context.rootState.sounds.howlPreload,
        })
      }

      break
    }
  }
  if (payload.calc) {

    context.commit('calc', {
      TOC: entry,
    })
  }
}

export const registerFile = async (context, payload) => {
  // registerFileOriginal(context, payload)
  registerFileFirstPass(context, payload)
}


export const recalc = (context) => {
  if (window.jim_DEBUG_VUEX) console.log('RECALC links')

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}

export const removeEntry = async (context, payload) => {
  /*
  TODO: make this work for a scene not a page #16hr
   */
  // let self = this

  let TOC = payload.TOC
  let family = payload.family
  let pageNumber = payload.pageNumber
  let dbx = payload.dbx
  /*
  let scene = TOC.pageOrder.indexOf(pageNumber)
  if (!scene) { TOC.pageOrder.indexOf(pageNumber.toString()) }
  assert(scene >= 0, 'Unable to find scene for page ' + pageNumber)
  */
  let base
  // let familyEmpty = false
  let contents = TOC.contents
  if (contents) {
    if (pageNumber in contents) {
      base = contents[pageNumber]
    } else {
      base = contents.pages[pageNumber]
    }

    if (pageNumber === 'book_cover') {

    }

    if (base) {
      let offset = false
      let entry = false
      let familyLength = base[family].length
      if (familyLength === 1) {
        offset = 0
        entry = base[family][0]
        // familyEmpty = true
      } else {
        // familyEmpty = false
        for (let ctr = 0; ctr < familyLength; ctr++) {
          if (base[family][ctr].pageNumber === pageNumber) {
            entry = base[family][ctr]
            offset = ctr
          }
        }
      }
      base[family].splice(offset, 1) // deleted family

      dbx.filesDeleteV2({
        path: entry.path_lower,
      })
        .then(function () {
          context.commit('calc', {
            TOC,
          })
        })

      /*
          if (entry) {
            // if (familyEmpty) {
             // does this make the whole page go away?
              if (base.jpg.length === 0 && base.mp3.length === 0 && base.png.length === 0) {
                // TODO: the page is empty!
              }
            }
            else {
              // remove references

              }      // remember TOC.sound index
            // remember TOC.ids
          // remove all links to this entry
      */
    } else {
      if (window.jim_DEBUG_FULL) console.log(`${pageNumber} Not found in TOC ${TOC.path_lower}`)
    }
  }
}
