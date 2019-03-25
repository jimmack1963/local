<template>
  <div  v-touch-swipe="swipeHandler">
    <!--v-model="cameraMode"-->
    <q-tabs class="row"  v-if="active">
      <q-tab
        name="take"
        :label="dataURL ? 'Retake' : 'Take' "
        @click="dataURL ? clearPhoto() : touchHandler8()"
        icon="camera"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="File"
        label="file"
        @click="clickFile"
        icon="attachment"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="front"
        :label="modeCaption"
        @click="modeClick"
        :icon="modeIcon"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="done"
        label="Cancel"
        @click="home"
        icon="stop"
        slot="title"
      >
      </q-tab>
    </q-tabs>
    <slot></slot>

    <div class="camera"   >
      <video @click.stop="touchHandler8" v-show="!preview" ref="video" id="video">Video stream not available.</video>
    </div>
    <canvas v-show="preview" ref="canvas" id="canvas"></canvas>

  </div>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  export default {
    name: 'recordcamcord',
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    props: ['pageName', 'wholeFileName', 'active'],
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
      async commit (bookTitle, tags, pageStyle) {
        await this.useImage(bookTitle)
      }
    },
  }
</script>

<style></style>
