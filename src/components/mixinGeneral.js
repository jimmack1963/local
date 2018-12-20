import { mapGetters } from 'vuex'

export const mixinGeneral = {
  data () {
    return {
      myPages: [],
      myImages: [],
      sourcePages: {}
    }
  },
  computed: {
    ...mapGetters(['TOC', 'activeFolder'])
  },
  methods: {
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
      this.$router.push('/carousel')
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
    },
  }
}
