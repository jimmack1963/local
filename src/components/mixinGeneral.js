import { mapGetters } from 'vuex'

export const mixinGeneral = {
  data () {
    return {
      myPages: [],
      myImages: [], // TODO: should be in VUEX as TOC element
      sourcePages: {} // TODO: maybe should be a getter in VUEX
    }
  },
  computed: {
    ...mapGetters(['TOC', 'activeFolder', 'activeScene', 'access_token']),
    currentSlide: {
      get: function () {
        if (window.jim_DEBUG_FULL) console.log('currentSlide??')

        return this.activeScene
      },
      set: function (value) {
        if (window.jim_DEBUG_FULL) console.log('currentSlide!!')
        this.$store.commit('activeScene', {
          activeScene: value
        })
      }
    },
    page () {
      if (!this.activeFolder) { return 0 }
      let lastPage = this.activeFolder.pageOrder[this.activeFolder.pageOrder.length - 1]
      let pnum = parseInt(lastPage)
      if (isNaN(pnum)) return this.activeFolder.pageOrder.length
      return pnum + 1
    }

  },
  methods: {
    logout () {
      this.$q.localStorage.set('access_token', false)
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
    readDropboxFolder () {
      let self = this
      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      // TODO: if .has_more call /continue
      dbx.filesListFolder({
        path: this.folder,
        include_media_info: true,
        recursive: true
      })
        .then(function (response) {
          self.$store.dispatch('saveLevel', {
            folder: self.folder,
            response,
            dbx: self.$dbx
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
        activeFolder: entry
      })
      this.$router.push('/selfie')
    },
    carousel (entry) {
      this.$store.commit('setActiveFolder', {
        activeFolder: entry
      })
      if (this.pageCount(entry) > 0) {
        this.$router.push('/carousel')
      }
      else {
        this.$router.push('/simpleRecord')
      }
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
      this.$store.dispatch('recalc')
    },
  }
}
