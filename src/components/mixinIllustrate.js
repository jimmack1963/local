import { mapGetters } from 'vuex'
import { dom } from 'quasar'

const {height, width} = dom

export const mixinIllustrate = {
  data () {
    return {
      cameraMode: 'front',
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
      theStream: false,
    }
  },
  mounted () {
    this.onResize()
  },
  computed: {
    ...mapGetters([]),

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
  beforeDestroy () {
    if (this.videoRef) {
      this.videoRef.removeEventListener('canplay', this.captureCanvas, false)
    }

    if (this.theStream) {
      console.log('Stopped theStream')
      this.stopMediaTracks(this.theStream)
    }
  },
  watch: {
    'facingMode': function (newVal, oldVal) {
      if (newVal === 'user' || newVal === 'environment') {
        this.getUserMedia(this.videoRef)
      }
      else {

      }
    },
  },
  methods: {
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
    clickFile () {
      this.$store.commit('facingMode', {facingMode: 'file'})
      this.$refs.hiddenInput.click()
      console.log('clickFile')
    },
    onResize (size) {
      console.log(JSON.stringify(size))
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
    inputElChanged (e) {
      if (e.cypress) {
        // this.$store.commit('image', 'data:image/png;base64,' + e.cypress)
      }
      else {
        let files = e.target.files
        // this.$emit('usePickedImage', e, files)
        this.useFile(files[0])

        this.$router.push('/')
      }
    },
    stopMediaTracks (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
      })
    },
    getUserMedia (videoRef) {
      let self = this
      if (this.theStream) {
        console.log('Stopped theStream')
        this.stopMediaTracks(this.theStream)
      }
      // note:  VUE instance must have videoRef defined
      navigator.mediaDevices.getUserMedia({video: {facingMode: this.facingMode}, audio: false})
        .then(function (stream) {

          console.log('assigned th')
          self.theStream = stream
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
            // this.$store.commit('nextCamera')
            break
          }
          case 'right': {
            // this.$store.commit('nextCamera')
            break
          }
          case 'up': {

            // this.$router.push('/')
            break
          }
          case 'down': {

            // this.$router.push('/')
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

        // TODO: make this settable preference #2hrs

        console.log('Saving page # ' + this.pageName)
        this.useImage(this.pageName)
      }
      else {
        // Brand new image taken, book does not yet exist...
        // where to save?
        this.lockCameraImage()
        this.saveImage()
      }
    },
    captureCanvas (ev) {
      if (!this.streaming) {
        this.onResize()
        this.streaming = true
      }
    },
    async saveImage () {
      this.$emit('completed', true)
      if (this.dataURL && this.dataURL !== 'data:,') {
        // let wholeFileName = this.generateImageName()
        window.savedImage = this.dataURL
        // await this.uploadFileBlobImage(this.dataURL, wholeFileName, this.width * this.height)
        // this.clearPhoto()
      }
      else {
        alert('Image not available')
      }
    },
    async useImage (overridePage) {

      console.log('Dest page = ' + overridePage)
      this.$emit('completed', true)

      // let v = this

      //        Problem: below sets the image on the folder holder, not the target page

/*
      this.$store.commit('dropbox/saveThumbnail', {
        entry: this.activeFolder,
        overridePageName: overridePage,
        thumbnail: this.dataURL,
      })
*/


      this.pageName = (parseInt(this.pageName) + 1).toString()

      if (this.dataURL && this.dataURL !== 'data:,') {
        let wholeFileName = this.generateImageName(overridePage)
        console.log('filename in useImage: ' + wholeFileName)

        await this.uploadFileBlobImage(this.dataURL, wholeFileName, this.width * this.height)
        console.log('useImage done')
        this.clearPhoto()
      }
      else {
        alert('Image not available')
      }
    },
    async useFile (file) {

      this.$emit('completed', true)

      if (file) {
        let wholeFileName = this.generateImageName(this.pageName)

        await this.uploadFile(file, wholeFileName)
      }
      else {
        alert('File not available')
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
      if (this.width && this.height) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

        this.dataURL = canvas.toDataURL('image/jpeg', this.quality)
      }
      else {
        this.clearPhoto()
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

  },
}
