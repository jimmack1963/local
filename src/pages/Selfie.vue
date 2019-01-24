<template>
  <q-page

  >
    <q-window-resize-observable @resize="onResize" />
      <q-tabs class="row" v-model="cameraMode">
        <q-tab
          name="take"
          label="Take Selfie"
          @click="touchHandler8"
          icon="camera"
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
          name="file"
          label="file"
          @click="clickFile"
          icon="attachment"
          slot="title"
        >

        </q-tab>
      </q-tabs>

    <input @change="inputElChanged($event)"
           type="file"
           id="hiddenInput"
           ref="hiddenInput"
           class="hidden"
           accept="image/*">

    <div v-if="facingMode !== 'file'">
      <div class="camera scale-to-display">
        <video @click.stop="touchHandler8" v-show="!preview" ref="video" id="video">Video stream not available.</video>
      </div>
      <canvas
        class="scale-to-display"
        v-show="preview"
        ref="canvas"
        id="canvasSelfie"></canvas>
    </div>


  </q-page>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  export default {
    name: 'selfie',
    mixins: [mixinGeneral, mixinDropbox, mixinIllustrate],
    data () {
      return {
        nameset: this.activeFolder,
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.selfie = this

      this.videoRef = this.$refs.video

      this.getUserMedia(this.videoRef)

      this.clearPhoto()
    },
    computed: {},
    methods: {

      async completedTitle () {
        if (this.bookTitle) {
          // this.$q.dialog
          // for now, make this the book
          await this.startBook(this.bookTitle)
        }
        else {
          alert('no title, huh?')
        }
      },
      async useImage () {
        if (!this.activeFolder && !this.bookTitle) {
          this.$q.notify({type: 'warning', message: 'Please enter the book title'})
          this.$refs.bookTitle.focus()
          return false
        }
        let v = this
        this.$store.commit('saveThumbnail', {
          entry: this.activeFolder,
          thumbnail: this.dataURL,
        })
        if (this.dataURL && this.dataURL !== 'data:,') {
          let fileName = this.generateImageName()

          await this.uploadFileBlobImage(this.dataURL, fileName, this.width * this.height)

          this.clearPhoto()
          v.$router.push('/')
        }
        else {
          alert('Image not available')
        }

      },

      generateImageName () {
        return this.activeFolder.path_display + '/' + 'book_cover.png'
      },

    },
  }
</script>

<style>
  .scale-to-display {
    width: 98vw;
    height: auto;
  }
</style>
