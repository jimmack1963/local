export const getDevices = async (context) => {
  context.commit('mediaState', 'loading')
  if (context.state.devices.length > 0) {
    return context.state.devices
  }
  const sofar = []
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    context.commit('mediaState', 'present')
  }
  else {
    context.commit('mediaState', 'fail')
    return false
  }

  // verify can use media - permissions
  // await navigator.mediaDevices.getUserMedia({video: true, audio: true})

  const devices = await navigator.mediaDevices.enumerateDevices()
  const media = devices.filter(dev => (dev.kind === 'videoinput' || dev.kind === 'audioinput') &&
  !dev.label.includes('Soundflower ')
  )

  console.log('device list:')
  let count = 0
  let latest = false
  media.forEach(dev => {
    if (dev.kind === 'videoinput') {
      count++
      latest = dev.deviceId
    }
    console.dir(dev)
    sofar.push(dev)
  })
  context.commit('setDevices', sofar)
  if (count === 1) { // probably a desktop with 1 camcorder
    context.commit('setCurrentVideo', latest)

  }
}
