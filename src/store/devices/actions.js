export const enumerateDevices = async (context) => {
  context.commit('mediaState', 'loading devices')

  const sofar = []
  if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
    context.commit('mediaState', 'present')
  }
  else {
    context.commit('mediaState', 'fail - no getUserMedia')
    return false
  }

  const devices = await navigator.mediaDevices.enumerateDevices()
  const media = devices.filter(dev => (dev.kind === 'videoinput' || dev.kind === 'audioinput'))

  console.log('device list:')
  let count = 0
  let latest = false
  media.forEach(dev => {
    if (dev.kind === 'videoinput') {
      count++
      latest = dev.deviceId
    }
    // dev.label = dev.label || 'Camera ' + count

    sofar.push(dev)
  })
  context.commit('devices', sofar)
  if (count === 1) { // probably a desktop with 1 camcorder
    // context.commit('selected', latest)
    context.dispatch('prepUserMedia', {
      command: latest,
    })
  }
}

export const requestPermission = async (context) => {
  return navigator.mediaDevices.getUserMedia({video: true, audio: true},
    () => {
      context.commit('mediaState', 'permission granted')
      context.dispatch('enumerateDevices')
    },
    (err) => {
      context.commit('mediaState', 'fail - permission denied ' + err)
    },
  )
}

export const stopMediaTracks = async (context) => {
  if (context.state.stream) {
    context.state.stream.getTracks().forEach(track => {
      track.stop()
    })
  }
  context.commit('stream', false)
}

export const captureImage = async (context) => {
  switch (context.state.selected) {
    case 'native':
    case 'file': {
      context.dispatch('captureImageNative')
      break
    }

    default:
    case 'user':
    case 'environment': {
      context.dispatch('captureImageCamera')
      break
    }
  }
}
export const captureImageNative = async (context, event) => {
  // if external input, this is not needed
  if (context.state.externals.input) {
    context.state.externals.input.click()
  }
  else {
    alert('no input set')
  }
}
export const handleImageNative = async (context, event) => {

  context.commit('files', event.target.files)
  if (event.target.files.length > 0) {
    const url = URL.createObjectURL(event.target.files[0])
    context.commit('latestImage', url)
    // this.fileList.push(JSON.stringify(e.target.files[ctr]))
  }
  // console.dir(e.target.files)
}
export const handleFiles = async (context, selected) => {

  if (Array.isArray(selected)) {
    context.commit('files', selected)
    const url = URL.createObjectURL(selected[0])
    context.commit('latestImage', url)
    // this.fileList.push(JSON.stringify(e.target.selected[ctr]))
  }
  else {
    context.commit('files', [selected])
    if (selected) {
      const url = URL.createObjectURL(selected)
      context.commit('latestImage', url)
    }
    else {
      context.commit('latestImage', false)
    }
    // this.fileList.push(JSON.stringify(e.target.selected[ctr]))
  }
  // console.dir(e.target.selected)
}
export const captureImageCamera = async (context) => {
  context.state.externals.canvas.width = context.state.externals.video.videoWidth
  context.state.externals.canvas.height = context.state.externals.video.videoHeight
  context.state.externals.canvas.getContext('2d')
    .drawImage(context.state.externals.video, 0, 0)
  // this.cameraOutput.src = context.state.externals.canvas.toDataURL('image/webp')
  context.commit('latestImage', context.state.externals.canvas.toDataURL('image/webp'))

}

export const prepUserMedia = async (context, payload) => {
  /*
  close all possible open things
   */

  await context.dispatch('stopMediaTracks')
  await context.dispatch('getUserMediaCleanup')

  if (context.state.externals.video && 'close' in context.state.externals.video) {
    context.state.externals.video.close()
  }
  else {
  }

  switch (context.state.selected) {
    case 'native':
    case 'file': {
      await context.commit('selected', payload.command)
      if (context.state.externals.input) {
        context.state.externals.input.onchange = function (event) {
          context.dispatch('handleImageNative', event)
        }
      }
      else {
        // alert('no input device set')
      }
      break
    }

    default:
    case 'user':
    case 'environment': {
      await context.commit('selected', payload.command)
      context.dispatch('getUserMediaHandleStream', payload)
      break
    }
  }
}

export const getUserMediaCleanup = async (context, payload) => {
  const videoRef = context.state.externals.video
  if (videoRef.srcObject) {
    // videoRef.srcObject = false
    videoRef.removeEventListener('canplay', function (ev) {
      console.log('VideoRef is Ready!')
    })
    videoRef.onloadedmetadata = function (e) {
      console.log('onloadedmetadata called')
    }
  }
}

export const getUserMediaHandleStream = async (context, payload) => {
  const handleStream = function (aStream) {
    // const self = this
    const videoRef = context.state.externals.video
    videoRef.srcObject = aStream
    videoRef.addEventListener('canplay', function (ev) {
      console.log('VideoRef is Ready!')
    }, false)
    videoRef.onloadedmetadata = function (e) {
      console.log('onloadedmetadata called')
      videoRef.play()
    }
  }

  const onError = function (err) {
    console.log(err)
  }

  await context.dispatch('stopMediaTracks')
  // if (!('stream' in payload)) alert('missing stream function')
  // if (!context.state.externals.video) alert('missing videoRef reference')
  // if (!('err' in payload)) alert('missing err function')

  let constraints

  const setConstraint = function (cmd) {
    if (typeof cmd === 'string') {
      constraints = {
        audio: false,
        video: {
          facingMode: cmd,
        },
      }
    }
    else {
      constraints = {
        audio: false,
        video: {
          deviceId: cmd,
        },
      }
    }
  }

  if ('constraints' in payload && payload.constraints) {
    constraints = payload.constraints
  }
  else if ('command' in payload) {
    setConstraint(payload.command)
  }
  else if (context.state.selected) {
    setConstraint(context.state.selected)
  }
  else {
    constraints = {video: true, audio: false}
  }

  // if (!payload.constraints) {}
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      context.commit('stream', stream)
      if ('stream' in payload) {
        payload.stream(stream)
      }
      else {
        handleStream(stream)
      }
    })
    .catch(function (err) {
      context.commit('mediaState', 'error getUserMedia for ' + payload.constraints)
      if ('err' in payload) {
        payload.err(err)
      }
      else {
        onError(err)
      }
    })
}
