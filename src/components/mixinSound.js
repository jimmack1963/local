import { mapGetters } from 'vuex'
import { animate } from 'quasar'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC', 'folders', 'playing', 'playingPage', 'uid', 'delayPlayNext', 'mostRecentPage', 'micRecording', 'micUninitialized', 'micAvailable', 'micSaving']),
    likelyIcon () {
      if (this.micAvailable) {
        return 'mic'
      }
      else if (this.micRecording) {
        return 'stop'
      }
      else if (this.micSaving) {
        return 'save alt'
      }
      else if (this.micUninitialized) {
        return 'mic off'
      }
    },
    likelyAction () {
      if (this.micAvailable) {
        return 'Record Page '
      }
      else if (this.micRecording) {
        return 'Stop'
      }
      else if (this.micSaving) {
        return 'Saving... page ' + this.page
      }
      else if (this.micUninitialized) {
        return 'Not Ready to Record'
      }
      else {
        return 'mic variable not set?'
      }
    },
  },
  methods: {
    record (folder) {
      this.$q.fullscreen.request()
      this.$store.commit('setActiveFolder', {
        activeFolder: folder
      })
      // I don't know why this is here, but it interferes with taking multiple images in a row
      // jim: this should be triggered ONLY when you want to record, so the above line is weird
      this.$router.push('/simpleRecord')
    },
    doAction (ps) {

      if (this.micAvailable) {
        this.startRecording()
        this.$store.commit('setMicRecording')
        // this record is just of 'next'
        // this.$root.$emit('record', ps || new PageStructure((this.$route.params.groupkey || this.group.id), this.page, this.page ? this.page.toString() : 'cover'))
        if (window.jim_DEBUG_FULL) console.log('start recording emitted')
      }
      else if (this.micRecording) {

        this.stopRecording()
        this.$store.commit('setMicSaving')

        if (this.autoclose) {
          this.$emit('autoclose')
        }


        // this.$root.$emit('stopRecording')
        if (window.jim_DEBUG_FULL) console.log('stop recording emitted.')
      }
      else if (this.micSaving) {
        this.$store.commit('setMicAvailable')
        if (window.jim_DEBUG_FULL) console.log('Mic has saved, set as available')
      }
      else if (this.micUninitialized) {
        this.$store.commit('setMicAvailable')
        if (window.jim_DEBUG_FULL) console.log('Mic set available')
      }
    },
    rerecord () {
      // TODO: replace a recording before saving it
    },
    playLast () {
      // TODO: play recording in buffer before it is saved
    },
    pageAfter (folder, page) {

      let pagesOrdered = this.pageOrder(folder)
      let offset = pagesOrdered.indexOf(page)
      let nextPageNumber = false
      if (offset < pagesOrdered.length) {
        nextPageNumber = pagesOrdered[offset + 1]
      }
      return nextPageNumber
    },
    continuePlaying (folder) {
      this.setDelayPlayNext(1)
      let nextPage = this.pageAfter(folder, this.mostRecentPage)
      if (nextPage) {
        this.playBookPage(folder, nextPage)
      }
      else {
        this.playBook(folder)
      }
    },
    deleteBookSound (TOC, pageNumber) {
      this.$store.dispatch('removeEntry', {
        TOC,
        pageNumber,
        family: 'mp3',
        dbx: this.$dbx
      })
      /*
      let self = this
      let itemGroup
      let contents = TOC.contents
      if (pageNumber in contents) {
        itemGroup = contents[pageNumber]
      }
      else {
        itemGroup = contents.pages[pageNumber]
      }
      if (itemGroup) {
        let entry = itemGroup.mp3.find((recording) => {
          // TODO: selecting the sound must be more precise
          return recording.pageNumber === pageNumber
        })
        self.$dbx.filesDeleteV2({
          path: entry.path_lower
        })
          .then( function () {
            // self.$root.$emit('reload')

            // don't change location
            // self.$router.push('/')
          })
      }
      else {
       if (window.jim_DEBUG_FULL) console.log(`${pageNumber} Not found in TOC ${TOC.path_lower}`)
      }
*/ },
    deleteBookImage (TOC, pageNumber) {
      this.$store.dispatch('removeEntry', {
        TOC,
        pageNumber,
        family: 'png',
        dbx: this.$dbx
      })
    },
    playBookPage (folder, pageNumber) {
      if (window.jim_DEBUG_FULL) console.log('playBookPageplayBookPageplayBookPageplayBookPage')
      this.$store.commit('setActiveFolder', {
        activeFolder: folder
      })

      this.$store.commit('setActivePage', {
        activePage: pageNumber
      })

      let vue = this

      if (!folder.imageOrder[this.activeScene]) {
        animate.start({
          name: 'page-for-attention',
          from: 30,
          to: 100,
          duration: 1000,
          apply (pos) {
            if (vue.$refs.playingPage) {
              vue.$refs.playingPage.forEach(r => {
                r.style.left = `${100 - pos}%`
                // r.style.fontsize = `${pos}px`
                // r.style.top = `${pos}px`
              })
            }
          },
          done () {
            vue.$refs.playingPage.forEach(r => {
              r.style.left = '-2000px'
              // r.style.fontsize = `${pos}px`
              // r.style.top = `${pos}px`
            })

          }
        })
      }
      let played = false
      let myFolder = this.folders[folder.path_lower]
      let pagesOrdered = this.pageOrder(folder)

      if (myFolder && pagesOrdered.length > 0) {
        if (pageNumber === -1) {
          pageNumber = pagesOrdered[0]
        }
        let currentPageProperties
        if (pageNumber in myFolder) {
          currentPageProperties = myFolder[pageNumber]
        }
        else {
          currentPageProperties = myFolder.pages[pageNumber.toString()]
        }

        let offset = pagesOrdered.indexOf(pageNumber)
        let nextPageNumber = false
        if (offset < pagesOrdered.length) {
          nextPageNumber = pagesOrdered[offset + 1]
        }

        if (currentPageProperties.mp3.length > 0) {
          let target = currentPageProperties.mp3[0]
          if (target.howl) {

            // the function to play the next sound
            target.next = function () {

              // end current page playing
              vue.$store.commit('endHowlPlay', {
                page: target
              })

              // find the next page to play
              if (nextPageNumber) {
                // page will be set as side effect from playBookPage
                // vue.$store.commit('setActivePage', {
                //   activePage: nextPageNumber
                // })

                let nextTargetProperties = myFolder.pages[nextPageNumber]
                if (vue.delayPlayNext && nextTargetProperties.mp3.length > 0 && nextTargetProperties.mp3[0].howl) {
                  // cue up next page
                  // TODO: generally, this should be kept so it can be cancelled

                  setTimeout(function () {
                      vue.playBookPage(folder, nextPageNumber)
                  }, vue.delayPlayNext)
                }
                else {
                  vue.$store.commit('silence')
                  if (window.jim_DEBUG_FULL) {
                    console.log(vue.delayPlayNext
                      ? 'No mp3 in ' + nextPageNumber
                      : 'Not set to continue')
                  }
                }
              }
              else {
                // alert('NO NEXT PAGE after ' + page)
              }
            }

            if (window.jim_DEBUG_FULL) console.log('HOWL PLAYED: ' + target)

            vue.$store.commit('playHowl', {
              page: target
            })
            // target.mp3[0].howl.play()
            played = true
          }
        }
      }
      if (!played && myFolder && myFolder.length > 0) {
        alert('FAIL: play book ' + folder.name + ' page ' + pageNumber)
      }
      else if (!played) {
        if (window.jim_DEBUG_FULL) console.log('Not played: empty book')
      }
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
    },
    endHowlPlay () {
      this.$store.commit('silence')
    },
    playBook (folder) {
      this.$store.commit('setActiveFolder', {
        activeFolder: folder
      })
      this.setDelayPlayNext(1)
      if (folder.pageOrder.length > 0) {
        return this.playBookPage(folder, folder.pageOrder[0])
      }
    },
    pageCount (folder) {
      let destFolders = this.folders[folder.path_lower]
      if (destFolders && destFolders.pages) {
        return Object.keys(destFolders.pages).length
      }
      else {
        return 0
      }
    },
  }
}
