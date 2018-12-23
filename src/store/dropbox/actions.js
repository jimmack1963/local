const pathParse = require('path-parse')
import { LocalStorage } from 'quasar'

export const saveLevel = (context, payload) => {
  let folder = payload.folder
  let entries = payload.response.entries
  let dbx = payload.dbx

  entries.forEach((entry) => {
    context.dispatch('registerFile', {
      entry,
      dbx,
      folder,
    })
  })

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}

export const registerFile = (context, payload) => {
  let folder = payload.folder
  let entry = payload.entry
  let dbx = payload.dbx
  entry.parts = pathParse(entry.path_lower)
  entry.ext = entry.parts.ext.toLowerCase().replace('.', '')
  context.commit('saveEntry', {
    folder,
    entry,
  })
  switch (entry.ext) {
    // TODO: let this be configured
    // 'w32h32' | 'w64h64' | 'w128h128' | 'w256h256' | 'w480h320' | 'w640h480' | 'w960h640' | 'w1024h768' | 'w2048h1536'
    case 'jpg':
    case 'png': {
      if (LocalStorage.has(entry.id)) {
        if (window.jim_DEBUG_VUEX) console.log('found thumbnail: ' + entry.id)

        let thumb = JSON.parse(LocalStorage.get.item(entry.id))

        context.commit('saveThumbnail', {
          entry,
          thumbnail: thumb.src,
        })
      }
      else {
        if (window.jim_DEBUG_FULL) console.log('Get Thumbnail for ', entry.id)

        dbx.filesGetThumbnail({
          path: entry.path_lower,
          format: 'jpeg',
          size: 'w480h320',
        })
          .then((response) => {
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
          })
          .catch((error) => {

            if (window.jim_DEBUG_VUEX) console.log('ERROR:')
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
            howlPreload: context.rootState.sounds.howlPreload,
          })
        })
      break
    }
  }
}

export const recalc = (context) => {
  if (window.jim_DEBUG_VUEX) console.log('RECALC links')

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}
