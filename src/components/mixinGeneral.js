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
        this.$store.commit('activeScene', {
          activeScene: value,
        })
      },
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
    startBook (bookTitle) {
      // alert('Are you sure about ' + bookTitle + '?')
      // createFolder
      let v = this
      this.$dbx.filesCreateFolderV2({path: '/' + bookTitle})
        .then((result) => {
          let entry = result.metadata

          v.$store.dispatch('registerFile', {
            entry,
            folder: '/',
            dbx: v.$dbx,
            calc: true,
          })
          v.$store.commit('setActiveFolder', {
            activeFolder: entry,
          })
          v.$router.push('/selfie')

        })

      // redirect to selfie
    },
    logout () {
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
      let self = this
      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      // TODO: if .has_more call /continue
      dbx.filesListFolder({
        path: this.folder,
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
          self.$set(self, 'contents', response.entries)
          console.dir(response)
          self.listItems(response.entries)
        })
        .catch(function (error) {
          console.error(error)
        })
    },
    home () {
      this.$store.commit('silence')
      this.$router.push('/')
    },
    selfie (entry) {
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/selfie')
    },
    manage (entry) {
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/manage')
    },
    carousel (entry) {
      this.$store.commit('setActiveFolder', {
        activeFolder: entry,
      })
      if (this.pageCount(entry) > 0) {
        this.$router.push('/carousel')
      }
 else {
        // I don't know why this is here, but it interferes with taking multiple images in a row
        // this.$router.push('/simpleRecord')
      }
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
      this.$store.dispatch('recalc')
    },
  },
}
