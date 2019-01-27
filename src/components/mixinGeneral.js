import { mapGetters } from 'vuex'

export const mixinGeneral = {
  data () {
    return {
      bookTitle: '',
      myPages: [],
      myImages: [], // TODO: should be in VUEX as TOC element
      sourcePages: {}, // TODO: maybe should be a getter in VUEX
    }
  },
  computed: {
    ...mapGetters(['TOC',
      'facingMode',
      'cameraPreference',
      'TOCSorted',
      'camera',
      'folders',
      'activeFolder',
      'activeScene',
      'access_token',
      'title',
      'verb',
      'subtitle',
      'dataPrefix',
      'authURL',
      'hostname']),
    currentSlide: {
      get: function () {
        if (window.jim_DEBUG_FULL) console.log('currentSlide??')

        return this.activeScene
      },
      set: function (value) {
        if (window.jim_DEBUG_FULL) console.log('currentSlide!!')
        if (this.activeScene !== value) {
          this.$store.commit('activeScene', {
            activeScene: value,
          })
        }
      },
    },
    appTitle () {
      if (this.activeFolder) {
        return this.activeFolder.name
      }
      else {
        return this.title
      }
    },
    page () {
      if (!this.activeFolder) { return 0 }
      if (this.activeFolder.pageOrder && this.activeFolder.pageOrder.length > 0) {
        let lastPage = this.activeFolder.pageOrder[this.activeFolder.pageOrder.length - 1]
        let pnum = parseInt(lastPage)
        if (isNaN(pnum)) return this.activeFolder.pageOrder.length
        return pnum + 1
      }
 else {
        return 0
      }
    },

  },
  methods: {
    maxSound (folder) {
      let testing = folder.soundOrder
      let keys = Object.keys(testing)
      let last = false
      let possible = false
      do {
        possible = keys.pop()
        last = testing[possible]
      } while (!last && keys.length > 0)
      return possible
    },
    nextSound (folder) {
      let testing = folder.soundOrder
      let keys = Object.keys(testing)
      let last = false
      let possibleKey = false
      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)

      if (/^\d+$/.test(possibleKey)) {
        let converted = parseInt(possibleKey) + 1
        return converted
      }
      else {
        return possibleKey + '.1'
      }
    },
    maxIllustration (folder) {
      let testing = folder.imageOrder
      let keys = Object.keys(testing)
      let last = false
      let possibleKey = false
      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)
    },
    nextIllustration (folder) {
      let testing = folder.imageOrder
      let keys = Object.keys(testing)
      let last = false
      let possibleKey = false
      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)
      if (/^\d+$/.test(possibleKey)) {
        let converted = parseInt(possibleKey) + 1
        return converted
      }
      else {
        return possibleKey + '.1'
      }
    },
    async startBook (bookTitle) {

      if (!bookTitle) {


        let data = await this.$q.dialog({
          title: 'Title Round!',
          message: 'What is the book title?',
          prompt: {
            model: '',
            type: 'text'
          },
          cancel: true
        })
        bookTitle = data
        if (!data) {
          return false
        }
      }

      // createFolder
      let v = this
      let result = await this.$dbx.filesCreateFolderV2({path: '/' + bookTitle})

      let entry = result.metadata

      await v.$store.dispatch('registerFile', {
        entry,
        folder: '_TOC',
        '.tag': 'folder',
        dbx: v.$dbx,
        calc: true,
      })

      v.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })

      // redirect to selfie
      v.$router.push('/selfie')
    },
    logout () {
      this.$router.push('/')
      this.leftDrawerOpen = false
      this.$q.localStorage.set('access_token', false)
      this.purgeLocalStorageFromDropbox()
      this.$store.commit('dropboxCredentials', {
        access_token: false,
        token_type: false,
        uid: false,
        account_id: false,
      })
    },
    pageOrder (aFolder) {
      if (aFolder.pageOrder) {
        return aFolder.pageOrder
      }
 else {
        return []
      }
    },
    imageOrder (aFolder) {
      if (aFolder.imageOrder) {
        return aFolder.imageOrder
      }
 else {
        return []
      }
    },
    soundOrder (aFolder) {
      if (aFolder.soundOrder) {
        return aFolder.soundOrder
      }
 else {
        return []
      }
    },
    slideTrigger (oldIndex, newIndex, direction) {
      if (window.jim_DEBUG_FULL) console.log('slideTrigger: ', oldIndex, newIndex, direction)

      let desiredPage = this.myPages[newIndex]
      this.playBookPage(this.activeFolder, desiredPage)
    },
    imageForPage (page) {
      let collection = this.sourcePages[page] || this.sourcePages.pages[page]
      let possible = false
      if (collection) {
        if (collection.jpg.length > 0) {
          possible = collection.jpg[0].thumbnail
        }
 else if (collection.png.length > 0) {
          possible = collection.png[0].thumbnail
        }
      }
      if (!possible) {
        possible = this.activeFolder.thumbnail
      }
      return possible
    },

    purgeLocalStorageFromDropbox () {
      let all = this.$q.localStorage.get.all()
      Object.keys(all).forEach(key => {
        if (key.startsWith('id:')) {
          this.$q.localStorage.remove(key)
        }
      })

      all = this.$q.localStorage.get.all()
      if (window.jim_DEBUG_FULL) {
        console.log('all')
        console.dir(all)
        }
    },
    readDropboxFolder () {
      this.leftDrawerOpen = false
      this.$store.commit('clearData')
      this.purgeLocalStorageFromDropbox()
      let self = this
      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      // TODO: if .has_more call /continue
      dbx.filesListFolder({
        path: this.folder || '',
        include_media_info: true,
        recursive: true,
      })
        .then(function (response) {
          self.$store.dispatch('saveLevel', {
            folder: self.folder,
            response,
            dbx: self.$dbx,
          })

          self.isLoading = false
          // self.$set(self, 'contents', response.entries)
          console.dir(response)
        })
        .catch(function (error) {
          console.error(error)
        })
    },
    home () {
      // this.$q.fullscreen.request()
      this.$store.commit('silence')
      this.$router.push('/')
      this.$store.commit('setActiveFolder', {
        activeFolder: false
      })
    },
    selfie (entry) {
      // this.$q.fullscreen.request()
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/selfie')
    },
    manage (entry) {
      // this.$q.fullscreen.request()
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/manage')
    },
    carousel (entry) {
      // this.$q.fullscreen.request()
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      if (this.pageCount(entry) > 0) {
        this.$router.push('/carousel')
      }
 else {
        // I don't know why this is here, but it interferes with taking multiple images in a row
        // this.$router.push('/Illustrate')
      }
    },
    setDelayPlayNext (seconds) {
      this.leftDrawerOpen = false
      this.$store.commit('delayPlayNext', seconds * 1000)
      this.$store.dispatch('recalc')
    },
  },
}
