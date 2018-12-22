<template>
  <q-page padding>
    Selfie for "{{activeFolder.name}}"
    <br/>
    <div class="camera">
      <video ref="video" id="video">Video stream not available.</video>
    </div>
    <br/>
      <button ref="startbutton" id="startbutton">Take photo</button>
    <br/>

    <canvas ref="canvas" id="canvas"></canvas>
  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'

  export default {
    name: 'selfie',
    mixins: [ mixinGeneral, mixinDropbox ],
    data () {
      return {
        width: 302,
        height: 0,
        streaming: false,
      }
    },
    mounted () {
      let vue = this
      window.selfie = window.selfie || {}
      window.selfie.main = this

      let video = this.$refs.video
      let startbutton = this.$refs.startbutton

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

      startbutton.addEventListener('click', function (ev) {
        vue.takepicture()
        ev.preventDefault()
      }, false)

      this.clearphoto()
    },
    methods: {
      clearphoto () {
        let canvas = this.$refs.canvas
        let context = canvas.getContext('2d')
        context.fillStyle = '#AAA'
        context.fillRect(0, 0, canvas.width, canvas.height)
      },

      takepicture () {
        let canvas = this.$refs.canvas
        let context = canvas.getContext('2d')
        let video = this.$refs.video
        if (this.width && this.height) {
          canvas.width = this.width
          canvas.height = this.height
          context.drawImage(video, 0, 0, this.width, this.height)

          let dataURL = canvas.toDataURL('image/jpeg', 0.95)

          this.$store.commit('saveThumbnail', {
            entry: this.activeFolder,
            thumbnail: dataURL,
          })
          if (dataURL && dataURL !== 'data:,') {
            let fileName = this.generateImageName()
            this.uploadImage(dataURL, fileName, this.width * this.height)
          }
          else {
            alert('Image not available')
          }
        }
        else {
          this.clearphoto()
        }
      },

      generateImageName () {
        return this.activeFolder.path_display + '/' + 'book.cover.png'
      },

    },
  }
</script>

<style>
</style>
