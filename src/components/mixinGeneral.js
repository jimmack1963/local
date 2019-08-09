import { mapGetters } from 'vuex'

export const mixinGeneral = {
  data () {
    return {
      bookTitle: '',
      myPages: [],
      currentBookThumbnails: [],
      sourcePages: {},
    }
  },
  computed: {
    ...mapGetters([
      'showDemos',
      'facingMode',
      'cameraPreference',
      'TOC',
      'TOCSorted',
      'thumbs',
      'camera',
      'folders',
      'activeFolder',
      'activeScene',
      'title',
      'verb',
      'subtitle',
      'dataPrefix',
      'authURL',
      'locked',
      'playAfterRecord',

      'hostname']),
    ...mapGetters('dropbox', [
      'access_token',
      'thumbnailSize',
      'thumbnailSizes',
    ]),
    thumbnailSizeIndex: {
      get: function () {
        return this.thumbnailSizes.indexOf(this.thumbnailSize)
      },
      set: function (index) {
        this.$store.commit('thumbnailSize', {thumbnailSize: this.thumbnailSizes[index]})
        this.readDropboxFolder()
      },
    },
    currentSlide: {
      get: function () {
        if (window.jim_DEBUG_FULL) console.log('currentSlide??')

        return this.activeScene || 0
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
        return this.activeFolder.name + ' (Click here for main menu)'
      } else {
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
      } else {
        return 0
      }
    },

  },
  methods: {
    lock_UI () {
      this.$store.commit('lock')
      this.rightDrawerOpen = false
    },
    unlock_UI () {
      this.$store.commit('unlock')
      this.rightDrawerOpen = false
    },
    sceneFromPage (pageName) {

      let possible = this.activeFolder.pageOrder.indexOf(pageName.toString())
      if (possible >= 0) {
        return possible
      }
      else {
        console.log(`missing page ${pageName} in ${JSON.stringify(this.activeFolder.pageOrder)}`)
        return -1
      }
    },
    lastPageWithFile (folder, lookFor, increment) {
      if (!('contents' in folder)) return increment
      let pages = folder.contents.pages
      let order = JSON.parse(JSON.stringify(folder.pageOrder))

      while (order.length > 0) {
        let lastPageKey = order.pop()
        let examine = pages[lastPageKey]
        if (examine[lookFor].length > 0) {
          // there is a record/entry for that page matching mp3/png whatever
          if (/^\d+$/.test(lastPageKey)) {
            return parseInt(lastPageKey) + increment
          } else {

            return lastPageKey + '.' + increment
          }
        }
      }
      return increment
    },

    maxSound (folder) {
      return this.lastPageWithFile(folder, 'mp3', 0)
    },
    nextSound (folder) {
      return this.lastPageWithFile(folder, 'mp3', 1)
    },
    maxIllustration (folder) {
      return Math.max(this.lastPageWithFile(folder, 'png', 0), this.lastPageWithFile(folder, 'jpg', 0))
    },
    nextIllustration (folder) {
      if (this.pageName) { return this.pageName }
      let it = Math.max(this.lastPageWithFile(folder, 'png', 1), this.lastPageWithFile(folder, 'jpg', 1), 1)
      return it
    },
    /*
    maxSound (folder) {
      let testing = folder.soundOrder
      let keys = Object.keys(testing)
      if (keys.length < 1) {
        return '0'
      }
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
      if (keys.length < 1) {
        return '0'
      }

      let last = false
      let possibleKey = false
      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)

      if (/^\d+$/.test(possibleKey)) {
        let converted = parseInt(possibleKey) + 1
        return converted
      } else {

        return possibleKey + '.1'
      }
    },
    maxIllustration (folder) {
      let testing = folder.imageOrder
      let keys = Object.keys(testing)
      if (keys.length < 1) {
        return '0'
      }

      let last = false
      let possibleKey = false
      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)
    },
    nextIllustration (folder) {
      if (!folder) {
        return this.pageName
      }
      let testing = folder.imageOrder
      if (testing.length === 0) {
        return '0'
      }
      let keys = Object.keys(testing)
      if (keys.length < 1) {
        return '0'
      }
      let last = false
      let possibleKey = false

      do {
        possibleKey = keys.pop()
        last = testing[possibleKey]
      } while (!last && keys.length > 0)
      if (/^\d+$/.test(possibleKey)) {
        let converted = parseInt(possibleKey) + 1
        return converted
      } else {

        return possibleKey + '.1'
      }
    }, */
    async startBook_UI (bookTitle) {
      this.$gtm.logEvent('book', 'start', 'x', false)
      this.$store.commit('unlock')
      this.$router.push('/book/new/step/0')
    },
    async startBookOld (bookTitle) {

      if (!bookTitle) {
        let data = await this.$q.dialog({
          title: 'Title Round!',
          message: 'What is the book title?',
          prompt: {
            model: '',
            type: 'text',
          },
          cancel: true,
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

      await v.$store.dispatch('dropbox/registerFile', {
        entry,
        folder: '_TOC',
        '.tag': 'folder',
        dbx: v.$dbx,
        calc: true,
      })

      v.$store.dispatch('setActiveFolder', {
        activeFolder: entry,
      })

      // redirect to selfie
      v.$router.push('/selfie')
    },
    logout () {
      /*
      // TODO: implement usersGetCurrentAccount #4hrs

      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      dbx.usersGetCurrentAccount()
        .then(function (response) {

          console.dir(response)
          // useful:
          /!*
          country
          email
          email_verified
          locale
          name.display_name
          name.familiar_name
          profile_photo_url
          referral_link
           *!/
        })
        .catch(function (error) {
          console.error(error)
        })

      return false
      */

      this.$router.push('/')
      this.leftDrawerOpen = false
      this.$q.localStorage.set('dropbox/access_token', false)
      this.purgeLocalStorageFromDropbox()
      this.$store.commit('dropbox/Credentials', {
        access_token: false,
        token_type: false,
        uid: false,
        account_id: false,
      })
    },
    pageOrder (aFolder) {
      if (aFolder.pageOrder) {
        return aFolder.pageOrder
      } else {
        return []
      }
    },
    imageOrder (aFolder) {
      if (aFolder.imageOrder) {
        return aFolder.imageOrder
      } else {
        return []
      }
    },
    soundOrder (aFolder) {
      if (aFolder.soundOrder) {
        return aFolder.soundOrder
      } else {
        return []
      }
    },
    playCurrent () {
      this.playBookPage(this.activeFolder, this.latestPage)
    },
    beforeTransition (newIndex, oldIndex) {
      if (oldIndex < newIndex) {
        // was a slide back, so odds are good the autoplay isn't required
        this.$store.commit('delayPlayNext', 0)
        console.log('********** Started play one at time because backwards scroll')
      }
      this.latestPage = this.myPages[newIndex]
      this.playBookPage(this.activeFolder, this.latestPage)
    },
    afterTransition (newIndex, oldIndex) {
    },
    slideTriggerDEAD (oldIndex, newIndex, direction) {
      if (oldIndex < newIndex) {
        // was a slide back, so odds are good the autoplay isn't required
        this.$store.commit('delayPlayNext', 0)
        console.log('********** Started play one at time because backwards scroll')
      }
      if (window.jim_DEBUG_FULL) console.log('slideTrigger>> ', oldIndex, newIndex, direction)

      this.latestPage = this.myPages[newIndex]
      this.playBookPage(this.activeFolder, this.latestPage)
    },
    imageForPage (page) {
      let collection = this.sourcePages[page] || this.sourcePages.pages[page]
      let possible = false
      if (collection) {
        if (collection.jpg.length > 0) {
          possible = collection.jpg[0].thumbnail
        } else if (collection.png.length > 0) {
          possible = collection.png[0].thumbnail
        }
      }
      if (!possible) {
        possible = this.activeFolder.thumbnail
      }
      return possible
    },

    purgeLocalStorageFromDropbox () {
      let all = this.$q.localStorage.getAll()
      Object.keys(all).forEach(key => {
        if (key.startsWith('id:')) {
          this.$q.localStorage.remove(key)
        }
      })

      all = this.$q.localStorage.getAll()
      if (window.jim_DEBUG_FULL) {
        console.log('all')
        console.dir(all)
      }
    },

    readDemoFile (folder, name, tag, index) {

      // let link = require('.statics/recordings' + folder + name)

      // let linkData = require('../statics/recordings/' + folder + '/' + name)
      let link = '../statics/recordings/' + folder + '/' + name
      let entry = {
        source: 'demos/',
        link,
        name,
        id: 'demo: ' + name,
        '.tag': tag,
        pageNumber: index,
        ext: tag,
      }

      if (name === 'book_cover.jpg') {
        // childrenLoaded probably not stored in correct structure
        entry.childrenLoaded = false
      }
      else {
        entry.deferLoading = true
      }
      this.$store.dispatch('demos/registerFile', {
        folder,
        entry
      })
    },
    readDemos () {
      let base = 'How To Use'
      this.readDemoFile(base, 'book_cover.jpg', 'png')
      for (let pageCtr = 1; pageCtr <= 6; pageCtr++) {
        let page = 'p' + pageCtr
        this.readDemoFile(base, page + '.jpg', 'png', pageCtr)
        this.readDemoFile(base, page + '.m4a', 'm4a', pageCtr)

      }
    },
    readDropboxFolder () {
      this.leftDrawerOpen = false
      this.$store.commit('clearData')
      if (!process.env.DEV) this.readDemos()

      this.purgeLocalStorageFromDropbox()
      let self = this
      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      // TODO: if .has_more call /continue  #4hrs
      dbx.filesListFolder({
        path: this.folder || '',
        include_media_info: true,
        recursive: true,
      })
        .then(function (response) {
          self.$store.dispatch('dropbox/saveLevel', {
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
    home_UI () {
      this.leftDrawerOpen = false

      // this.$q.fullscreen.request()
      this.$store.commit('silence')

      this.$router.push('/')
      this.$store.dispatch('setActiveFolder', {
        activeFolder: false,
      })
    },
    selfie (entry) {
      // this.$q.fullscreen.request()
      this.$store.dispatch('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/selfie')
    },
    manage_UI (entry) {
      // this.$q.fullscreen.request()
      this.$store.dispatch('setActiveFolder', {
        activeFolder: entry,
      })
      this.$router.push('/manage')
    },
    carousel (entry) {

      // this.$q.fullscreen.request()
      this.$store.dispatch('setActiveFolder', {
        activeFolder: entry,
      })
      if (this.pageCount(entry) > 0) {
        this.$router.push('/carousel')
      } else {
        // I don't know why this is here, but it interferes with taking multiple images in a row
        // this.$router.push('/Illustrate')
      }
    },
    setDelayPlayNext (seconds) {
      this.leftDrawerOpen = false
      this.$store.commit('delayPlayNext', seconds * 1000)
      // this.$store.dispatch('recalc')
    },
  },
}
