import { micStatus } from '../../helpers/enums.js'
// import vue from 'vue'

/*
https://medium.com/js-dojo/why-all-my-vuex-stores-have-just-one-action-and-mutation-and-why-yours-should-too-80898e8c0646?fbclid=IwAR0IqahHpo0C1QTUmU_q1KRt3KUt3k6xx7eE2gkkE4KIuDwP2-NVnKq2svw
const mutations = {
    mutate(state, payload) {
        state[payload.property] = payload.with;
    }
};
If an action needs to store data in state, we call this mutation like this:

commit('mutate', {
    property: <propertyNameHere>,
    with: <valueGoesHere>
});

commit('mutate', {
    key: <propertyNameHere>,
    to: <valueGoesHere>
});

 */

export function mutate (state, payload) {
  state[payload.property || payload.key] = payload.with || payload.to
}

export function device (state, payload) {
  if (payload) {

    state.device = payload
    state.mic = payload.hasMicrophone
    state.camera = payload.hasWebcam

    if (state.mic) {
      state.micStatus = micStatus.available
    }

    state.mic_permitted = payload.isWebsiteHasMicrophonePermissions
    state.camera_permitted = payload.isWebsiteHasWebcamPermissions

    state.isMobile = payload.isMobileDevice
  }
  else {
    console.error('NO VALID DEVICE SENT!')
  }
}


export function lock (state) {
  state.locked = true
}
export function unlock (state) {
  state.locked = false
}

export function setMicAvailable (state) {
  state.micStatus = micStatus.available
}
export function setMicRecording (state) {
  state.micStatus = micStatus.recording
}

export function setMicSaving (state) {
  state.micStatus = micStatus.saving
}

export function nextCamera (state) {
  state.facingMode === 'user'
    ? state.facingMode = 'environment'
    : state.facingMode = 'user'

  console.log('facingMode changed to ' + state.facingMode)
}

export function facingMode (state, payload) {
  state.facingMode = payload.facingMode
}

export function playAfterRecord (state, payload) {
  if (!payload || payload.toggle) {
    state.playAfterRecord = !state.playAfterRecord
  }
  else {
    state.playAfterRecord = payload.playAfterRecord
  }
}
