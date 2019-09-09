import { mapGetters } from 'vuex'
// import { animate } from 'quasar'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC', 'folders', 'playing', 'playingPage', 'delayPlayNext', 'mostRecentPage', 'micRecording', 'micUninitialized', 'micAvailable', 'micSaving']),
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
        return 'Narrate'
      }
      else if (this.micRecording) {
        return 'Stop'
      }
      else if (this.micSaving) {
        return 'Saving... page'
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
    narrateBook (folder) {
      this.$store.dispatch('setActiveFolder', {
        activeFolder: folder
      })
      this.$router.push('/Narrate')
    },
    narratePage (folder, pageName, offset, childName) {
      console.log('Disabled: narratePageAndroid')
      this.narratePageIOS(folder, pageName, offset, childName)
    },
    narratePageIOS (folder, pageName, offset, childName) {

      if (window.currentAudioContext.state === 'suspended') {

        window.currentAudioContext.resume().then(() => {
          this.narratePageIOS(folder, pageName, offset, childName)
        })
      }
      else {
        console.log('recording in IOS!')
        if (!this.activeRecorderOffset) {
          // start the recorder
          this.activeRecorderOffset = offset.toString()
          // only one at a time
          let toggled = {}
          if (!this.activeNow[(childName || pageName)]) {
            toggled[(childName || pageName)] = !(toggled[(childName || pageName)])
          }

          this.$set(this, 'activeNow', toggled)
        }
        else {
          // close Recorder
          if (this.$refs['record_audio_' + (childName || offset.toString())]) {
            let child = this.$refs['record_audio_' + (childName || offset.toString())]
            if (child) {
              if (Array.isArray(child)) {
                if (child.length > 0) {
                  child[0].doAction()
                }
                else {
                  alert('Empty Array for ' + 'record_audio_' + (childName || offset.toString()))
                }
              }
              else {
                child.doAction()
              }
            }

          }
          else {
            if (window.jim_DEBUG_FULL) console.log('can not find record_audio_' + offset)
          }
          this.activeRecorderOffset = false

          // this.$set(this, 'activeNow', {})
        }
      }
    },
    record (folder) {
      // this.$q.fullscreen.request()
      this.$store.dispatch('setActiveFolder', {
        activeFolder: folder
      })
      // I don't know why this is here, but it interferes with taking multiple images in a row
      // jim: this should be triggered ONLY when you want to record, so the above line is weird
      this.$router.push('/Illustrate')
    },
    doAction () {

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
    async deleteBookSound (TOC, pageNumber) {
      let self = this
      this.$q.dialog({
        title: 'Delete?',
        message: 'Remove dialog for Page ' + pageNumber,
        ok: 'Delete',
        cancel: 'Keep',
      }).onOk(async function () {

        self.$store.dispatch('dropbox/removeEntry', {
          TOC,
          pageNumber,
          family: 'mp3',
          dbx: self.$dbx
        })
      })
    },
    async deleteBookImage (TOC, pageNumber) {
      let v = this
      this.$q.dialog({
        title: 'Delete?',
        message: 'Remove illustration for Page ' + pageNumber,
        ok: 'Delete',
        cancel: 'Keep',
      }).onOk(async function () {

        v.$store.dispatch('dropbox/removeEntry', {
          TOC,
          pageNumber,
          family: 'png',
          dbx: v.$dbx
        })
      })
        .onCancel(() => {
           if (window.jim_DEBUG_FULL) console.log('Page Image not deleted: ' + pageNumber)

        })
    },
    playOnePage (activeFolder, pageName) {
      this.setDelayPlayNext(0)
      this.playBookPage(activeFolder, pageName)
    },
    playBookPage (folder, pageNumber, stopAtOne) {

      if (stopAtOne) {
        this.setDelayPlayNext(0)
      }
      this.endHowlPlay()
      if (window.jim_DEBUG_FULL) console.log('playBookPageplayBookPageplayBookPageplayBookPage')
      this.$store.dispatch('setActiveFolder', {
        activeFolder: folder
      })

      this.$store.commit('setActivePage', {
        activePage: pageNumber
      })
      this.latestPage = pageNumber

      let vue = this

      // if (!folder.imageOrder[this.activeScene]) {
      //   animate.start({
      //     name: 'page-for-attention',
      //     from: 30,
      //     to: 100,
      //     duration: 1000,
      //     apply (pos) {
      //       if (vue.$refs.playingPage) {
      //         vue.$refs.playingPage.forEach(r => {
      //           r.style.left = `${100 - pos}%`
      //           // r.style.fontsize = `${pos}px`
      //           // r.style.top = `${pos}px`
      //         })
      //       }
      //     },
      //     done () {
      //
      //       if (vue.$refs.playingPage) {
      //         vue.$refs.playingPage.forEach(r => {
      //           r.style.left = '-2000px'
      //           // r.style.fontsize = `${pos}px`
      //           // r.style.top = `${pos}px`
      //         })
      //       }
      //     }
      //   })
      // }
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

        let offset = pagesOrdered.indexOf(pageNumber.toString())
        let nextPageNumber = false
        if (offset < pagesOrdered.length) {
          nextPageNumber = pagesOrdered[offset + 1]
        }


        if (currentPageProperties && currentPageProperties.mp3.length > 0) {
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
                  // TODO: generally, this should be kept so it can be cancelled #2hrs

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
          else {

            // why can't it play?
            console.log('surprise howl fail')
            if (target.promisePending) {
              let promises = [target.promisePending]
              Promise.all(promises).then(() => {
                vue.$nextTick(() => {
                    console.log('recursive wait for howl to be logged')
                    vue.playBookPage(folder, pageNumber, stopAtOne)
                  }
                )
                console.log('waiting?')
              })
              return
            }
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
      this.rightDrawerOpen = false
    },
    endHowlPlay () {
      this.$store.commit('silence')
    },
    playBook (folder) {
      this.setDelayPlayNext(1)
      this.$store.dispatch('setActiveFolder', {
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
