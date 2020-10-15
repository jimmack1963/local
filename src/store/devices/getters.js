export function videoDevices (state) {
  return state.devices.filter(dev => (dev.kind === 'videoinput') &&
    !dev.label.includes('Soundflower '),
  )
}

export function videoDevicesAsOptions (state) {
  const byRole = [{
    label: 'Saved Image',
    value: 'file'
  },
    {
      label: 'Device Camera',
      value: 'native'
    }
  ]

  state.devices.filter(dev => (dev.kind === 'videoinput') &&
    !dev.label.includes('Soundflower '))
    .forEach(dev => {
      byRole.push({
        label: dev.label,
        value: dev.deviceId,
      })
    })

  byRole.push({
    label: 'Camera: User',
    value: 'user',
  })

  byRole.push({
    label: 'Camera: Environment',
    value: 'environment',
  })

  return byRole
}

export function mediaState (state) {
  return state.mediaState
}

export function selected (state) {
  return state.selected
}

export function selectedInfo (state) {
  switch (state.selected) {
    case 'native': {
      return {
        showMedia: false,
        capture: true,
        useInput: true,
        type: 'native',
        caption: 'Device Camera',
        icon: 'camera',
      }
    }
    case 'file': {
      return {
        showMedia: false,
        capture: false,
        useInput: true,
        type: 'file',
        caption: 'Device Default',
        icon: 'attachment',
      }
    }

    default:
    case 'user':
    case 'environment': {
      return {
        showMedia: true,
        capture: true,
        useInput: !true,
        type: 'camera',
        key: state.selected,
        constraints: {},
        caption: 'Keep Image',
        icon: 'camera'
      }
    }
  }
}

export function latestImage (state) {
  return state.latestImage
}

export function files (state) {
  return state.files
}

export function urls (state) {
  return state.urls
}

export function externals (state) {
  return state.externals
}

export function latestImageAsDataURL (state) {
  return state.latestImageAsDataURL
}


