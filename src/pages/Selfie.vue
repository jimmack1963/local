<template>
  <q-page padding>
    <q-btn v-if="preview" color="secondary" ref="retakeButton" id="retakeButton" @click.stop="clearPhoto">Retake</q-btn>
    <q-btn v-if="!preview" color="primary" ref="startbutton" id="startbutton" @click.stop="takePicture">Freeze Image</q-btn>
    <q-btn v-if="preview" :disabled="!dataURL" color="secondary" @click="useImage">Use</q-btn>
    <div class="camera">
      <video v-show="!preview" ref="video" id="video">Video stream not available.</video>
    </div>
    <canvas v-show="preview" ref="canvas" id="canvas"></canvas>


  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  export default {
    name: 'selfie',
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    data () {
      return {

      }
    },
    mounted () {
      debugger
      window.jim = window.jim || {}
      window.jim.selfie = this
      let v = this

      this.videoRef = this.$refs.video

      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function (stream) {
          debugger
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
      async useImage () {
        let v = this
        this.$store.commit('saveThumbnail', {
          entry: this.activeFolder,
          thumbnail: this.dataURL,
        })
        if (this.dataURL && this.dataURL !== 'data:,') {
          let fileName = this.generateImageName()

          await this.uploadFileBlobImage(this.dataURL, fileName, this.width * this.height)
          this.clearPhoto()
          v.$router.push('/simpleRecord')

        }
        else {
          alert('Image not available')
        }

      },

      generateImageName () {
        debugger
        return this.activeFolder.path_display + '/' + 'book.cover.png'
      },

    },
  }
</script>

<style>
</style>
