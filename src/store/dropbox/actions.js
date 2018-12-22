const pathParse = require('path-parse')
import { LocalStorage } from 'quasar'

export const saveLevel = (context, payload) => {
  let folder = payload.folder
  let entries = payload.response.entries
  let dbx = payload.dbx

  entries.forEach((entry) => {
    entry.parts = pathParse(entry.path_lower)
    entry.ext = entry.parts.ext.toLowerCase().replace('.', '')
    context.commit('saveEntry', {
      folder,
      entry,
    })
    switch (entry.ext) {
      // 'w32h32' | 'w64h64' | 'w128h128' | 'w256h256' | 'w480h320' | 'w640h480' | 'w960h640' | 'w1024h768' | 'w2048h1536'
      case 'jpg':
      case 'png': {
        if (3 > 8 && LocalStorage.has(entry.id)) {
          if (window.jim_DEBUG_FULL) console.log('found thumbnail: ' + entry.id)

          debugger
          let thumb = LocalStorage.get.item(entry.id)

          context.commit('saveThumbnail', {
            entry,
            thumbnail: thumb,
          })
        }
        else {
          dbx.filesGetThumbnail({
            path: entry.path_lower,
            format: 'jpeg',
            size: 'w480h320'
          })
            .then((response) => {
              debugger
              let useful = window.URL.createObjectURL(response.fileBlob)
              LocalStorage.set(entry.id, response.fileBlob)
              if (window.jim_DEBUG_FULL) console.log('saved thumbnail: ' + entry.id)
              context.commit('saveThumbnail', {
                entry,
                thumbnail: useful,
              })
            })
            .catch((error) => {

              if (window.jim_DEBUG_FULL) console.log('ERROR:')
              console.log(error)
            })
        }
        break
      }
      case 'mp3': {
        dbx.filesGetTemporaryLink({path: entry.path_lower})
          .then((response) => {
            context.commit('saveTempLink', {
              entry,
              response,
            })
            context.commit('createHowl', {
              entry,
              response,
              context,
            })
          })
        break
      }
    }
  })

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder
    })
  }
}

export const recalc = (context) => {
  if (window.jim_DEBUG_FULL) console.log('RECALC links')

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder
    })
  }
}
