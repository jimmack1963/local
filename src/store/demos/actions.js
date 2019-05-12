export const registerFile = async (context, payload) => {

  let folder = payload.folder
  let entry = payload.entry
  context.commit('saveEntry', {
    folder,
    entry
  })

  if (!entry.deferLoading && (entry.ext === 'mp3' || entry.ext === 'm4a')) {
    context.commit('createHowl', {
        entry,
        response: {
          link: entry.link
        },
        context,
        ids: context.rootState.demos.ids,
        howlPreload: context.rootState.sounds.howlPreload,
      },
      { root: true })

  }

}

export const registerFileSecondPass = async (context, payload) => {
  let entry = payload.entry
  if (entry.childrenLoaded) {
    console.log(entry.path_lower + ' ALREADY LOADED')
    return
  }

  console.log('FILE:,' + JSON.stringify(entry))
  if ((entry.ext === 'mp3' || entry.ext === 'm4a')) {
    context.commit('createHowl', {
        entry,
        response: {
          link: entry.link
        },
        context,
        ids: context.rootState.demos.ids,
        howlPreload: context.rootState.sounds.howlPreload,
      },
      { root: true })

  }


}
