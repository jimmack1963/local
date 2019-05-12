export const registerFile = async (context, payload) => {

  let folder = payload.folder
  let entry = payload.entry
  context.commit('saveEntry', {
    folder,
    entry,
  })
}

export function setActiveFolder (context, payload) {
  var activeFolder = payload.activeFolder
  let sourced = false
  context.commit('activeScene', payload.activeScene || 0)
  context.commit('setActiveFolder', activeFolder)

  // load the children
  if (activeFolder && !activeFolder.childrenLoaded && activeFolder.contents && activeFolder.contents.pages) {
    Object.keys(activeFolder.contents.pages).forEach(key => {
      let pageRecords = activeFolder.contents.pages[key]
      Object.keys(pageRecords).forEach(type => {
        let processing = pageRecords[type]
        processing.forEach(entry => {
          sourced = sourced || entry.source
          console.log(entry.source + 'registerFileSecondPass ' + entry.path_lower)
          context.dispatch(entry.source + 'registerFileSecondPass', {entry})
          console.log(entry.path_lower)
        })
      })
    })

    if (sourced) {
      context.commit(sourced + 'childrenLoaded', {activeFolder})
    }

  }
}
