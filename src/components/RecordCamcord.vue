<template>
  <div>
    <!--v-model="cameraMode"-->
    <q-tabs class="col-12 q-mb-sm"  v-if="active">
      <q-tab
        name="take"
        :label="$t(dataURL ? 'Retake' : 'Take') "
        @click="dataURL ? clearPhoto() : touchHandler8()"
        icon="camera"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="File"
        :label="$t('file')"
        @click="clickFile"
        icon="attachment"
        slot="title"
        v-if="fileable"
      >
      </q-tab>

      <q-tab
        name="front"
        :label="$t(modeCaption)"
        @click="modeClick"
        :icon="modeIcon"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="done"
        :label="$t('Cancel')"
        @click="home_UI"
        icon="stop"
        slot="title"
      >
      </q-tab>
    </q-tabs>
    <slot></slot>

    <div
      @click.stop="touchHandler8"
      class="snapshot-medium camera-medium row "
      v-show="preview"
    >
      <canvas ref="canvas" id="canvas"></canvas>
    </div>

    <div
      id="wrap-snap"
      class="snapshot-medium camera-medium row  "
      v-show="!preview"
      @click.stop="touchHandler8"
    >
      <video ref="video" id="video">Video stream not available.</video>
    </div>

  </div>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  export default {
    name: 'recordcamcord',
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    props: ['wholeFileName', 'active', 'fileable'],
    data () {
      return {

      }
    },
    mounted () {

      let vue = this
      window.jim = window.jim || {}
      window.jim.recordcamcord = this

      vue.videoRef = vue.$refs.video

      function gotDevices (deviceInfos) {
        for (let i = 0; i !== deviceInfos.length; ++i) {
          let deviceInfo = deviceInfos[i]
          let option = {}
          option.value = deviceInfo.deviceId
          if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label ||
              'Microphone ' + (vue.audioInputSelect.length + 1)
            vue.audioInputSelect.push(option)
          }
 else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || 'Speaker ' +
              (vue.audioOutputSelect.length + 1)
            vue.audioOutputSelect.push(option)
          }
 else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || 'Camera ' +
              (vue.videoSelect.length + 1)
            vue.videoSelect.push(option)
          }
        }
        if (window.jim_DEBUG_FULL) {
          console.log('gotDevices')
          console.dir([vue.audioInputSelect, vue.audioOutputSelect, vue.videoSelect])
          }
      }

      function errorCallback (e) {
        if (window.jim_DEBUG_FULL) {
          console.log('e')
          console.dir(e)
          }
      }

      navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .catch(errorCallback)

      /*
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      https://github.com/JodusNodus/react-qr-reader/issues/37
      */

      this.getUserMedia(this.videoRef)

      vue.clearPhoto()
    },

    methods: {
      async createNewBookCoverPage (bookTitle, tags, pageStyle) {
        await this.useImage(bookTitle)
      }
    },
  }
</script>

<style>
  .camera-medium {
    height: 100%;
    max-height: 50vh;
  }
  video {
    width: 100%;
    height: 100%;
  }
  canvas {
    width: 100%;
    height: 100%;
  }
  video2 {
    left: 50%;
    min-height: 100%;
    min-width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
