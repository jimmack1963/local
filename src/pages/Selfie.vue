<template>
  <q-page

  >
    <div v-if="!activeFolder">
      <!--
      v-touch-swipe="swipeHandler"
      <slot></slot>
      -->
      <!--<q-field
        v-if="!nameset"
        class="col-xs-12 q-mx-sm"
      >
        <q-input float-label="Create a book titled:" @blur="completedTitle" ref="bookTitle" id="bookTitle"
                 v-model="bookTitle"></q-input>
      </q-field>-->

      <!-- TODO: should this be a card for consistency? -->
      <!--
            <q-btn color="primary" v-if="camera" :disable="!bookTitle" @click="startBook(bookTitle)"> Take a selfie with the
              book and your kid
            </q-btn>
      <q-btn @click="nameset = true">Set Name</q-btn>
      <p>You can take a picture by touching the screen after you have entered the book title.</p>
      -->
    </div>
    <div >
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
