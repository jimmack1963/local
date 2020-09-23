<template>
  <div>
    <!--
    <q-tabs
      v-model="activeTab"
      class="col-12 q-mb-sm"
      v-if="showLocalMenu"
    >

&lt;!&ndash;      <q-tab&ndash;&gt;
&lt;!&ndash;        name="take"&ndash;&gt;
&lt;!&ndash;        :label="$t(dataURL ? 'Retake' : 'Take') "&ndash;&gt;
&lt;!&ndash;        @click="dataURL ? clearPhotoProp() : touchImageFeedback()"&ndash;&gt;
&lt;!&ndash;        icon="camera"&ndash;&gt;
&lt;!&ndash;        slot="title"&ndash;&gt;
&lt;!&ndash;      >&ndash;&gt;
&lt;!&ndash;      </q-tab>&ndash;&gt;

      <q-tab
        name="File"
        :label="$t('file')"
        @click="clickFile"
        icon="attachment"
        v-if="fileable"
      >
      </q-tab>

      <q-tab
        name="front"
        :label="$t(modeCaption)"
        @click="modeClick"
        :icon="modeIcon"

      >
      </q-tab>

&lt;!&ndash;      <q-tab&ndash;&gt;
&lt;!&ndash;        name="done"&ndash;&gt;
&lt;!&ndash;        :label="$t('Cancel')"&ndash;&gt;
&lt;!&ndash;        @click="home_UI"&ndash;&gt;
&lt;!&ndash;        icon="stop"&ndash;&gt;

&lt;!&ndash;      >&ndash;&gt;
&lt;!&ndash;      </q-tab>&ndash;&gt;
    </q-tabs>
    -->

    <div
      @click.stop="touchImageFeedback"
      class="snapshot-medium camera-medium row "
      v-show="preview"
    >
      <canvas id="canvas" ref="canvas"></canvas>
    </div>

    <div
      @click.stop="touchImageFeedback"
      class="snapshot-medium camera-medium row  "
      id="wrap-snap"
      v-show="!preview"
    >
      <video id="video" ref="video">Video stream not available.</video>
    </div>


  </div>
</template>

<script>
// import { mixinGeneral } from '../components/mixinGeneral'
import {mixinDropbox} from '../components/mixinDropbox'
// import { mixinIllustrate } from '../components/mixinIllustrate'
import { mapGetters } from 'vuex'

export default {
  name: 'recordCamcord',
  // mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
  mixins: [mixinDropbox],
  props: ['wholeFileName', 'showLocalMenu', 'fileable', 'pageName'],
  data () {
    return {
      activeTab: 'File',
      dataURL: false,
      preview: false,
      selections: {
        audioInputSelect: [],
        audioOutputSelect: [],
        videoSelect: [],
      },
    }
  },
  mounted () {

    let vue = this
    window.jim = window.jim || {}
    window.jim.recordcamcord = this

    this.$store.dispatch('getDevices')

    vue.videoRef = vue.$refs.video

    /*
    function gotDevices (deviceInfos) {
      let selections = vue.selections
      for (let i = 0; i !== deviceInfos.length; ++i) {
        let deviceInfo = deviceInfos[i]
        let option = {}
        option.value = deviceInfo.deviceId
        if (deviceInfo.kind === 'audioinput') {
          option.text = deviceInfo.label ||
            'Microphone ' + (selections.audioInputSelect.length + 1)
          selections.audioInputSelect.push(option)
        }
        else if (deviceInfo.kind === 'audiooutput') {
          option.text = deviceInfo.label || 'Speaker ' +
            (selections.audioOutputSelect.length + 1)
          selections.audioOutputSelect.push(option)
        }
        else if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'Camera ' +
            (selections.videoSelect.length + 1)
          selections.videoSelect.push(option)
        }
      }
      if (window.jim_DEBUG_FULL) {
        console.log('gotDevices')
        console.dir([selections.audioInputSelect, selections.audioOutputSelect, selections.videoSelect])
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

    */

    /*
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    https://github.com/JodusNodus/react-qr-reader/issues/37
    */

    this.getUserMedia(this.videoRef)

    // vue.clearPhotoProp()
  },
  watch: {
    currentVideo: function (newVal, oldVal) {
      this.getUserMedia(this.videoRef)
    }
  },
  computed: {
    ...mapGetters(['currentVideo']),
    activeDevice: {
      get: function () {
        return this.currentVideo
      },
      set: function (val) {
        this.$store.commit('setCurrentVideo', val)
        this.getUserMedia(this.videoRef)
      }
    },
    modeIcon () {
      switch (this.facingMode) {
        case 'user':
          return 'camera_rear'
        case 'environment':
          return 'camera_front'
        default:
          return 'file'
      }
    },
    modeCaption () {
      switch (this.facingMode) {
        case 'user':
          return 'Switch:Rear'
        case 'environment':
          return 'Switch:front'
        default:
          return 'File'
      }
    },

  },
  methods: {
    touchImageFeedback (obj) {

      if (this.preview) {
        this.clearPhoto()
      }
      else if (this.activeFolder) {
        this.lockCameraImage()

        // TODO: make this settable preference #2hrs

        console.log('Saving page # ' + this.pageName)
        this.useImage(this.pageName)
      }
      else {
        // Brand new image taken, book does not yet exist...
        // where to save?
        this.lockCameraImage()
        this.recordImageURL()
      }
    },
    clearPhoto () {
      this.preview = false
      this.dataURL = false
      let canvas = this.$refs.canvas
      if (canvas) {
        let context = canvas.getContext('2d')
        context.fillStyle = '#AAA'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      this.$emit('completed', false)
    },
    lockCameraImage () {
      this.preview = true
      let canvas = this.$refs.canvas
      let context = canvas.getContext('2d')
      let video = this.$refs.video
      // if (this.width && this.height) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

      this.dataURL = canvas.toDataURL('image/jpeg', this.quality)
      // }
      // else {
      //     this.clearPhoto()
      // }
    },
    async recordImageURL () {

      this.$emit('completed', true)
      if (this.dataURL && this.dataURL !== 'data:,') {
        window.savedImage = this.dataURL
      }
      else {
        alert('Image not available')
      }
    },
    generateImageName (overridePage) {
      if (this.wholeFileName) {
        return this.wholeFileName
      }
      let pageFileName
      if (/^[0-9]+$/.test(overridePage)) {
        // numeric page numbers start with 'p'
        pageFileName = 'p' + overridePage
      }
      else {
        pageFileName = overridePage
      }
      return `${this.activeFolder.path_display}/${pageFileName}.png`
    },
    async useImage (overridePage) {

      console.log('Dest page = ' + overridePage)

      // let v = this

      //        Problem: below sets the image on the folder holder, not the target page

      /*
            this.$store.commit('dropbox/saveThumbnail', {
              entry: this.activeFolder,
              overridePageName: overridePage,
              thumbnail: this.dataURL,
            })
      */


      // this.pageName = (parseInt(this.pageName) + 1).toString()

      if (this.dataURL && this.dataURL !== 'data:,') {
        let wholeFileName = this.generateImageName(overridePage)
        console.log('filename in useImage: ' + wholeFileName)
        await this.uploadFileBlobImage(this.dataURL, wholeFileName, this.$refs.canvas.width * this.$refs.canvas.height)
        console.log('useImage done')
        this.clearPhoto()
      }
      else {
        alert('Image not available')
      }
    },
    clickFile () {
      this.$store.commit('facingMode', {facingMode: 'file'})
      this.$refs.hiddenInput.click()
      console.log('clickFile')
    },
    modeClick () {
      switch (this.facingMode) {
        case 'user':
          this.$store.commit('facingMode', {facingMode: 'environment'})
          console.log('clickRear')
          break
        case 'environment':
          this.$store.commit('facingMode', {facingMode: 'user'})
          console.log('clickFront')
          break
        default:
          return 'File'

      }
    },
    stopMediaTracks (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
    },

    async getUserMedia (videoRef) {
      if (!this.activeDevice) return false

      const self = this
      const vr = videoRef
      if (!videoRef) {
        return false
      }
      if (this.theStream) {
        console.log('Stopped theStream')
        this.stopMediaTracks(this.theStream)
      }

      const constraints = {
        video: {
          deviceId: this.activeDevice
        },
        audio: false,
      }

      await navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          if (!vr) {
            return false
          }

          self.theStream = stream
          vr.srcObject = stream

          vr.addEventListener('canplay', self.captureCanvas, false)
          vr.play()
        })
        .catch(function (err) {
          alert('An error occured! ' + err)
        })
    },

    async createNewBookCoverPage (bookTitle, tags, pageStyle) {
      await this.useImage(bookTitle)
    },
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
