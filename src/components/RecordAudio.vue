<template>
  <div class="">
    <div class="button-stack row justify-center">
      <slot></slot>

      <q-btn
        class="q-my-md col-10"
        style="height:4em;"
        :icon="likelyIcon"
        color="primary"
        :label="likelyAction"
        @click="doAction(false)"
      ></q-btn>
      <!--<feedback v-if="micRecording" class="col-12 offset-5"></feedback>-->

    </div>

  </div>
</template>


<script>
  import RecorderService from '../shared/RecorderService'
  import utils from '../shared/Utils'

  import { mixinSound } from '../components/mixinSound'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinGeneral } from '../components/mixinGeneral'
  import folderCardDisplay from '../components/folderCardDisplay'

  export default {
    name: 'recordaudio',
    components: {folderCardDisplay},
    mixins: [mixinGeneral, mixinDropbox, mixinSound],
    props: ['pageName'],
    methods: {
      startRecording () {
        this.recorderSrvc.config.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
        this.recorderSrvc.config.createDynamicsCompressorNode = this.addDynamicsCompressor
        this.recorderSrvc.startRecording()
          .then(() => {
            this.recordingInProgress = true
          })
          .catch((error) => {
            console.error('Exception while start recording: ' + error)
            alert('Exception while start recording: ' + error.message)
          })
      },
      stopRecording () {
        this.recorderSrvc.stopRecording()
        this.recordingInProgress = false
      },
      onNewRecording (evt) {

        this.recordings.push(evt.detail.recording)
        this.pushToDropbox(evt.detail.recording)
      },
      async pushToDropbox (recording, ctr) {
        this.$emit('completed')
        this.$store.commit('setMicAvailable')
        let pageFileName
        if (/^[0-9]+$/.test(this.pageName)) {
          // numeric page numbers start with 'p'
          pageFileName = 'p' + this.pageName
        }
        else {
          pageFileName = this.pageName
        }

        let fname = `${this.activeFolder.path_lower}/${pageFileName}.mp3`
        let reader = new FileReader()
        let base64data
        // reader.readAsDataURL(recording.blobUrl) param 1 not type blob
        // reader.readAsArrayBuffer(recording.blobUrl) param 1 not type blob
        // reader.readAsBinaryString(recording.blobUrl)
        // reader.readAsText(recording.blobUrl)
        reader.onloadend = function () {
          base64data = reader.result
          console.log(base64data)
        }

        this.uploadFileBlobAudio(recording.blob, fname, recording.size)
      },
    },
    data () {
      return {
        recordingInProgress: false,
        supportedMimeTypes: [],
        recordings: [],
        micGainSlider: 100,
        micGain: 1.0,
        cleanupWhenFinished: true,
        addDynamicsCompressor: false,
      }
    },
    watch: {
      cleanupWhenFinished (val) {
        this.recorderSrvc.config.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
      },
      micGainSlider () {
        this.micGain = (this.micGainSlider * 0.01).toFixed(2)
        this.recorderSrvc.setMicGain(this.micGain)
      },
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.recordaudio = this
    },
    filters: {
      fileSizeToHumanSize (val) {
        return utils.humanFileSize(val, true)
      },
    },
    created () {
      this.recorderSrvc = new RecorderService()
      this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
    },
  }
</script>

<style>
</style>
