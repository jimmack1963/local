export const registerFile = async (context, payload) => {

  let folder = payload.folder
  let entry = payload.entry
  context.commit('saveEntry', {
    folder,
    entry
  })


}
