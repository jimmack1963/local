import { mapGetters } from 'vuex'
import { dom } from 'quasar'
const { height, width } = dom

export const mixinIllustrate = {
  data () {
    return {
      sizeClasses: 'camera-landscape',
      orientation: '',
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
  watch: {
    'facingMode': function (newVal, oldVal) {
      this.getUserMedia(this.videoRef)
    },
  },
  methods: {
    getUserMedia (videoRef) {
      // note:  VUE instance must have videoRef defined
      navigator.mediaDevices.getUserMedia({video: {facingMode: this.facingMode}, audio: false})
        .then(function (stream) {
          videoRef.srcObject = stream
          videoRef.play()
        })
        .catch(function (err) {
          console.log('An error occured! ' + err)
        })

      videoRef.addEventListener('canplay', this.captureCanvas, false)

    },
    swipeHandler (obj) {
      if (window.jim_DEBUG_FULL) console.log('swipeHandler disabled - all is by touch/click')
      if (this.activeFolder) {
        let message = false
        if (window.jim_DEBUG_FULL) console.log('swipe: ' + obj.direction)
        switch (obj.direction) {
          case 'left': {
            this.$store.commit('nextCamera')
            break
          }
          case 'right': {
            this.$store.commit('nextCamera')
            break
          }
          case 'up': {
            this.$router.push('/')
            break
          }
          case 'down': {
            this.$router.push('/')
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
    onResize (size) {
      let canvas = this.$refs.canvas
      if (canvas) {
        let h = height(canvas.parentElement.parentElement)
        let w = width(canvas.parentElement.parentElement)
        if (h > w) {
          // portrait
          this.sizeClasses = 'camera-portrait'
          this.orientation = 'portrait'
          canvas.setAttribute('width', this.height)
          canvas.setAttribute('height', this.width)
/*
          this.width = w
          this.height = this.videoRef.videoHeight / (this.videoRef.videoWidth / this.width)
          this.width = w
          this.height = h
*/
        }
        else {
          // landscape
          this.sizeClasses = 'camera-landscape'
          this.orientation = 'landscape'
          canvas.setAttribute('width', this.width)
          canvas.setAttribute('height', this.height)

/*
          this.height = h
          this.width = this.videoRef.videoHeight / (this.videoRef.videoWidth / this.height)
          this.width = h
          this.height = w
*/
        }

/*        if (window.jim_DEBUG_FULL_junk) {
          console.log(JSON.stringify({
            h,
            w,
            thisH: this.height,
            thisW: this.width,
            vH: this.videoRef.videoHeight,
            vW: this.videoRef.videoWidth,
          }))
        } */

        // this.videoRef.setAttribute('width', this.width)
        // this.videoRef.setAttribute('height', this.height)
        // canvas.setAttribute('width', this.width)
        // canvas.setAttribute('this.height', this.height)
      }
    },
    captureCanvas (ev) {
      if (!this.streaming) {
        this.onResize()
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
