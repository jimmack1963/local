import { mapGetters } from 'vuex'

export const mixinIllustrate = {
  data () {
    return {
      videoRef: false,
      preview: false,
      dataURL: false,
      width: 480,
      height: 320,
      streaming: false,

      audioInputSelect: [],
      audioOutputSelect: [],
      videoSelect: [],
    }
  },
  computed: {
    ...mapGetters([]),
  },
  beforeDestroy () {
    if (this.videoRef) {
      this.videoRef.removeEventListener('canplay', this.captureCanvas, false)
    }
  },
  methods: {
    swipeHandler (obj) {
      if (this.activeFolder) {
        let message = 'Image Saved'
        if (window.jim_DEBUG_FULL) console.log('swipe: ' + obj.direction)
        switch (obj.direction) {
          case 'left': {
            message = false
            this.$router.push('/')
            break
          }
          case 'right': {
            if (this.preview) {
              this.useImage()
            }
            break
          }
          case 'up': {
            if (this.preview) { this.useImage() }
            break
          }
          case 'down': {
            if (this.preview) { this.clearPhoto() }
            break
          }
        }
        if (message) {
          this.$q.notify(message)
        }
      }
    },
    touchHandler8 (obj, count) {
      if (this.activeFolder) {
        this.lockCameraImage()

        // TODO: make this settable preference
        this.useImage()
      }
    },

    captureCanvas (ev) {
      let canvas = this.$refs.canvas
      if (!this.streaming) {
        this.height = this.videoRef.videoHeight / (this.videoRef.videoWidth / this.width)
        this.videoRef.setAttribute('width', this.width)
        this.videoRef.setAttribute('height', this.height)
        canvas.setAttribute('width', this.width)
        canvas.setAttribute('this.height', this.height)

        this.streaming = true
      }
    },
    async useImage () {
      this.$emit('completed')
      // let v = this
      // this.$store.commit('saveThumbnail', {
      //   entry: this.activeFolder,
      //   thumbnail: this.dataURL,
      // })
      if (this.dataURL && this.dataURL !== 'data:,') {
        let fileName = this.generateImageName()

        await this.uploadFileBlobImage(this.dataURL, fileName, this.width * this.height)
        this.clearPhoto()
      }
 else {
        alert('Image not available')
      }

    },

    clearPhoto () {
      this.preview = false
      let canvas = this.$refs.canvas
      if (canvas) {
        let context = canvas.getContext('2d')
        context.fillStyle = '#AAA'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
    },

    lockCameraImage () {
      this.preview = true
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
