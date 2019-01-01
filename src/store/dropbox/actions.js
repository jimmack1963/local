const pathParse = require('path-parse')
import { LocalStorage } from 'quasar'

export const clearAll = (context) => {

}

export const saveLevel = async (context, payload) => {
  let folder = payload.folder
  let entries = payload.response.entries
  let dbx = payload.dbx
  let promises = []

  entries.forEach((entry) => {
    promises.push(context.dispatch('registerFile', {
      entry,
      dbx,
      folder,
      calc: false
    }))
  })

  await Promise.all(promises)

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}

export const registerFile = async (context, payload) => {

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
            }
            catch (e) {
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
      }
      else {
        if (window.jim_DEBUG_FULL) console.log('Get Thumbnail for ', entry.id)

        let response = await dbx.filesGetThumbnail({
          path: entry.path_lower,
          format: 'jpeg',
          size: 'w480h320',
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
        }
       catch (error) {
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
              howlPreload: context.rootState.sounds.howlPreload,
            })
          })
      }
      catch (err) {
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

export const recalc = (context) => {
  if (window.jim_DEBUG_VUEX) console.log('RECALC links')

  for (let folder of Object.values(context.state._TOC)) {
    context.commit('calc', {
      TOC: folder,
    })
  }
}
