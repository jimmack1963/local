<template>
  <q-page padding>
    <slot></slot>
    <br/>
    <div class="camera">
      <video ref="video" id="video">Video stream not available.</video>
    </div>
    <br/>
      <q-btn color="primary" ref="startbutton" id="startbutton" @click.stop="takePicture">Freeze Image</q-btn>
    <q-btn :disabled="!dataURL" color="secondary" @click="useImage">Use</q-btn>
    <br/>

    <canvas ref="canvas" id="canvas"></canvas>
  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'

  export default {
    name: 'recordcamcord',
    mixins: [ mixinGeneral, mixinDropbox ],
    props: ['pageName', 'quality'],
    data () {
      return {
        dataURL: false,
        width: 302,
        height: 0,
        streaming: false,
      }
    },
    mounted () {
      let vue = this
      window.jim = window.jim || {}
      window.jim.recordcamcord = this

      let video = this.$refs.video

      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(function (stream) {
          video.srcObject = stream
          video.play()
        })
        .catch(function (err) {
          console.log('An error occured! ' + err)
        })

      video.addEventListener('canplay', function (ev) {
        let canvas = vue.$refs.canvas
        if (!vue.streaming) {
          vue.height = video.videoHeight / (video.videoWidth / vue.width)
          video.setAttribute('width', vue.width)
          video.setAttribute('height', vue.height)
          canvas.setAttribute('width', vue.width)
          canvas.setAttribute('vue.height', vue.height)

          vue.streaming = true
        }
      }, false)

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

          await this.uploadFile(this.dataURL, fileName, this.width * this.height)

          v.$router.push('/simpleRecord')

        }
        else {
          alert('Image not available')
        }

      },
      clearPhoto () {
        let canvas = this.$refs.canvas
        let context = canvas.getContext('2d')
        context.fillStyle = '#AAA'
        context.fillRect(0, 0, canvas.width, canvas.height)
      },

      takePicture () {
        let canvas = this.$refs.canvas
        let context = canvas.getContext('2d')
        let video = this.$refs.video
        if (this.width && this.height) {
          canvas.width = this.width
          canvas.height = this.height
          context.drawImage(video, 0, 0, this.width, this.height)

          this.dataURL = canvas.toDataURL('image/jpeg', this.quality ? parseFloat(this.quality) : 0.95)
        }
        else {
          this.clearPhoto()
        }
      },

      generateImageName () {
        let pageFileName
        if (/^[0-9]+$/.test(this.pageName)) {
          // numeric page numbers start with 'p'
          pageFileName = 'p' + this.pageName
        }
        else {
          pageFileName = this.pageName
        }
        return `${this.activeFolder.path_display}/${pageFileName}.png`
      },

    },
  }
</script>

<style>
</style>
