export function ids (state) {
  return state.ids
}

export function TOC (state) {
  return state.folders._TOC
}

export function folders (state) {
  return state.folders
}

/*
let numberTest = /^\d|$/
export function pageOrder (state, folder) {
       let numberTest = /^\d|$/
      let assemble = []
      let sourceFolder = this.folders[folder.path_lower.substr(1)]

      if (sourceFolder) {

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
      if (window.jim_DEBUG_FULL) {
        console.log('assemble')
        console.dir(assemble)
        }

      return assemble

}
*/


