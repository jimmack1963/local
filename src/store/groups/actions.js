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
  context.commit('activeScene', payload.activeScene || 0)
  context.commit('setActiveFolder', activeFolder)

  // load the children
  if (activeFolder && !activeFolder.childrenLoaded && activeFolder.contents && activeFolder.contents.pages) {
    Object.keys(activeFolder.contents.pages).forEach(key => {
      let kid = activeFolder.contents.pages[key]
      Object.keys(kid).forEach(type => {
        let processing = kid[type]
        processing.forEach(entry => {
          context.dispatch('dropbox/registerFileSecondPass', {entry})
          console.log(entry.path_lower)
        })
      })
    })
    context.commit('dropbox/childrenLoaded', {activeFolder})

  }
}
