<template>
  <q-page
    v-touch-swipe="swipeHandler"

    >
    <div  >
<!--    <q-btn v-if="preview" color="secondary" ref="retakeButton" id="retakeButton" @click.stop="clearPhoto">Retake</q-btn>
    <q-btn v-if="!preview" color="primary" ref="startbutton" id="startbutton" @click.stop="lockCameraImage">Freeze Image</q-btn>
    <q-btn v-if="preview" :disabled="!dataURL" color="secondary" @click="useImage">Use</q-btn>-->
    <div class="camera"   >
      <video @click.stop="touchHandler8" v-show="!preview" ref="video" id="video">Video stream not available.</video>
    </div>
    <canvas v-show="preview" ref="canvas" id="canvas"></canvas>

    </div>
  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  /*
    v-touch-swipe="swipeHandler"
    v-touch-hold.prevent="touchHandler"
    @click.native="touchHandler"
   */
  export default {
    name: 'simpleRecord',
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    data () {
      return {
        quality: 0.5
      }
    },
    computed: {
      pageName () {
        if (this.activeFolder.pageOrder.length > 0) {
          let po = this.activeFolder.pageOrder
          return parseInt(po[po.length - 1]) + 1
        }
        else {
          return 0
        }
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.simpleRecord = this
      let v = this

      this.videoRef = this.$refs.video

      navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false})
        .then(function (stream) {

          v.videoRef.srcObject = stream
          v.videoRef.play()
        })
        .catch(function (err) {
          console.log('An error occured! ' + err)
        })

      this.videoRef.addEventListener('canplay', this.captureCanvas, false)

      this.clearPhoto()
    },
    methods: {

    },
  }
</script>

<style>
</style>
