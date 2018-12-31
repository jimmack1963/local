<template>
  <div>
    <div row wrap>
      <div class="test1">
        <div>
          <q-btn @click="startRecording" :disabled="recordingInProgress">Start Recording
          </q-btn>
          <q-btn @click="stopRecording" :disabled="!recordingInProgress">Stop Recording</q-btn>
          <q-icon :class="recordingInProgress ? 'live ' : ''">mic</q-icon>
        </div>
      </div>
    </div>
    <!--<div row wrap class="ml-1 mt-1">
      <div xs10 md6>
        <q-slider :max="500" v-model="micGainSlider"></q-slider>
      </div>
      <div xs2>
        <div class="input-group">
          <label>{{ micGain }}</label>
        </div>
      </div>
    </div>-->
    <!--    <div row wrap class="ml-1 mt-1">
          <q-checkbox v-model="addDynamicsCompressor"
                      label="Add dynamics compressor to audio graph"
                      :disabled="recordingInProgress"></q-checkbox>
        </div>
        <div row wrap class="ml-1 mt-1">
          <q-checkbox v-model="cleanupWhenFinished"
                      label="Stop tracks and close audio context when recording stopped"></q-checkbox>
        </div>-->
    <div column wrap v-if="recordings.length > 0">
      <h4 class="mt-3">Pages</h4>
      <div v-for="(recording,idx) in recordings" :key="recording.ts">
        <q-card>
          <q-card-title primary-title>
            <div column wrap>
              <div>
                <h3>Page #{{ idx + 1 }}</h3>
              </div>
              <div class="ml-3">
                <div>
                  <audio :src="recording.blobUrl" controls="true"/>
                </div>
                <div>
                  size: {{recording.size | fileSizeToHumanSize}}<!--, type: {{recording.mimeType}}-->
                </div>
                <q-btn @click="pushToDropbox(recording, idx)">Save</q-btn>
              </div>
            </div>
          </q-card-title>
        </q-card>
        <div v-if="idx !== (recordings.length-1)"/>
      </div>
    </div>

  </div>
</template>


<script>
  import RecorderService from '../shared/RecorderService'
  import utils from '../shared/Utils'

  // import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'

export default {
  name: 'simplerecord',
  mixins: [ mixinDropbox ],
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
    },
    async pushToDropbox (recording, ctr) {
      let fname = `${this.activeFolder.path_lower}/p${ctr}.mp3`
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
    }
  },
  data () {
    return {
      recordingInProgress: false,
      supportedMimeTypes: [],
      recordings: [],
      micGainSlider: 100,
      micGain: 1.0,
      cleanupWhenFinished: true,
      addDynamicsCompressor: false
    }
  },
  watch: {
    cleanupWhenFinished (val) {
      this.recorderSrvc.config.stopTracksAndCloseCtxWhenFinished = this.cleanupWhenFinished
    },
    micGainSlider () {
      this.micGain = (this.micGainSlider * 0.01).toFixed(2)
      this.recorderSrvc.setMicGain(this.micGain)
    }
  },
  mounted () {
    window.jim = window.jim || {}
    window.jim.simplerecord = this
  },
  filters: {
    fileSizeToHumanSize (val) {
      return utils.humanFileSize(val, true)
    }
  },
  created () {
    this.recorderSrvc = new RecorderService()
    this.recorderSrvc.em.addEventListener('recording', (evt) => this.onNewRecording(evt))
  },
}
</script>

<style>
</style>
