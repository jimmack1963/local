<template>
  <q-page padding>
    <slot></slot>
    <br/>
    <div class="camera">
      <video v-show="!preview" ref="video" id="video">Video stream not available.</video>
    </div>
      <canvas v-show="preview" ref="canvas" id="canvas"></canvas>
    <br/>
    <q-btn v-if="preview" color="secondary" ref="retakeButton" id="retakeButton" @click.stop="clearPhoto">Retake</q-btn>
    <q-btn v-if="!preview" color="primary" ref="startbutton" id="startbutton" @click.stop="takePicture">Freeze Image</q-btn>
    <q-btn v-if="preview" :disabled="!dataURL" color="secondary" @click="useImage">Use</q-btn>
    <br/>

  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  export default {
    name: 'recordcamcord',
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    props: ['pageName', 'quality'],
    data () {
      return {
      }
    },
    mounted () {
      debugger
      let vue = this
      window.jim = window.jim || {}
      window.jim.recordcamcord = this

      this.videoRef = this.$refs.video

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
      navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false})
        .then(function (stream) {
          this.videoRef.srcObject = stream
          this.videoRef.play()
        })
        .catch(function (err) {
          console.log('An error occured! ' + err)
        })

      this.videoRef.addEventListener('canplay', this.captureCanvas, false)

      this.clearPhoto()
    },
    methods: {},
  }
</script>

<style>
</style>
