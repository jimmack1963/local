const pathParse = require('path-parse')

export const saveLevel = (context, payload) => {
  let folder = payload.folder
  let entries = payload.response.entries
  let dbx = payload.dbx

  entries.forEach((entry) => {
    entry.parts = pathParse(entry.path_lower)
    entry.ext = entry.parts.ext.toLowerCase().replace('.', '')
    switch (entry.ext) {
      // 'w32h32' | 'w64h64' | 'w128h128' | 'w256h256' | 'w480h320' | 'w640h480' | 'w960h640' | 'w1024h768' | 'w2048h1536'
      case 'png': {
        dbx.filesGetThumbnail({
          path: entry.path_lower,
          format: 'jpeg',
          size: 'w480h320'
        })
          .then((response) => {
            context.commit('saveThumbnail', {
              entry,
              thumbnail: window.URL.createObjectURL(response.fileBlob),
            })
          })
          .catch((error) => {

            if (window.jim_DEBUG_FULL) console.log('ERROR:')
            console.log(error)
          })
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
            })
          })
        break
      }
    }
    context.commit('saveEntry', {
      folder,
      entry,
    })
  })
}
