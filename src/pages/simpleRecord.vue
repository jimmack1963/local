<template>
  <div class="">
    <div class="button-stack row justify-center">
      <folderCardDisplay :folder="activeFolder">

      </folderCardDisplay>
      <div class="col-4 row">
        <!--<q-btn
          v-show="!this.micRecording"
          class="q-mt-md q-mb-sm col-12"
          label="Manage" :to="'/manage/' + ($route.params.groupkey || group.id)" icon="settings"></q-btn>-->

        <q-btn
          v-show="!this.micRecording"
          class="q-mb-md col-12"
          label="No More Pages"
          color="secondary"
          to="/scroll"
        ></q-btn>
      </div>

      <q-btn
        class="q-my-md col-10"
        style="height:4em;"
        :icon="likelyIcon"
        color="primary"
        :label="likelyAction"
        @click="doAction(false)"
      ></q-btn>
      <!--<feedback v-if="micRecording" class="col-12 offset-5"></feedback>-->
      <h4 class="col-12 text-center"> {{page ? 'Recording: Page ' + page : 'Recording for Cover Page: Mention the title and a greeting to the listener'}}</h4>
    </div>

    <!--
    <div class="button-stack row justify-center">
      <q-btn
        class="q-mx-md"
        icon="replay"
        label="Play Last Recording"
        @click="playLast"
      ></q-btn>
    </div>
    <div class="button-stack row justify-center">

      <q-btn
        class="q-mx-md"
        icon="redo"
        label="Re-Record Last Recording"
        @click="rerecord"
      ></q-btn>
    </div>
    -->

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

  import { mixinSound } from '../components/mixinSound'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinGeneral } from '../components/mixinGeneral'
  import folderCardDisplay from '../components/folderCardDisplay'

export default {
  name: 'simplerecord',
  components: {folderCardDisplay},
  mixins: [ mixinGeneral, mixinDropbox, mixinSound ],
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
      let fname = `${this.activeFolder.path_lower}/p${this.pageCount(this.activeFolder) + 1}.mp3`
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

      this.uploadFileBlob(recording.blob, fname, recording.size)
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
  .button-stack {
    margin-top: 2em;
  }
  .foundImage {
    width: auto;
    height: 25vh;
  }
</style>
