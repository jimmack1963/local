import { mapGetters } from 'vuex'
import { animate } from 'quasar'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC', 'folders', 'playing', 'playingPage', 'uid', 'delayPlayNext', 'mostRecentPage'])
  },
  methods: {
    pageAfter (folder, page) {
      debugger
      let pagesOrdered = this.pageOrder(folder)
      let offset = pagesOrdered.indexOf(page)
      let nextPageNumber = false
      if (offset < pagesOrdered.length) {
        nextPageNumber = pagesOrdered[offset + 1]
      }
      return nextPageNumber
    },
    continuePlaying (folder) {
      debugger
      this.setDelayPlayNext(1)
      let nextPage = this.pageAfter(folder, this.mostRecentPage)
      if (nextPage) {
        this.playBookPage(folder, nextPage)
      }
      else {
        this.playBook(folder)
      }
    },
    playBookPage (folder, page) {
      if (window.jim_DEBUG_FULL) console.log('playBookPageplayBookPageplayBookPageplayBookPage')
      this.$store.commit('setActivePage', {
        activePage: page
      })

      let vue = this
      animate.start({
        name: 'page-for-attention',
        from: 30,
        to: 100,
        duration: 1000,
        apply (pos) {
          if (vue.$refs.playingPage) {
            vue.$refs.playingPage.forEach( r => {
              r.style.left = `${100 - pos}%`
              // r.style.fontsize = `${pos}px`
              // r.style.top = `${pos}px`
            })
          }
        },
        done () {
        }
      })
      let played = false
      let myFolder = this.folders[folder.path_lower]
      if (myFolder) {
        let pagesOrdered = this.pageOrder(folder)
        if (page === -1) {
          page = pagesOrdered[0]
        }
        let currentPageProperties
        if (page in myFolder) {
          currentPageProperties = myFolder[page]
        }
        else {
          currentPageProperties = myFolder.pages[page.toString()]
        }

        let offset = pagesOrdered.indexOf(page)
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
                let nextTargetProperties = myFolder.pages[nextPageNumber]
                if (vue.delayPlayNext && nextTargetProperties.mp3.length > 0 && nextTargetProperties.mp3[0].howl) {
                  // cue up next page
                  // TODO: generally, this should be kept so it can be cancelled

                  setTimeout(function () {
                      vue.playBookPage(folder, nextPageNumber)
                  }, vue.delayPlayNext)
                }
                else {
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
            vue.$store.commit('playHowl', {
              page: target
            })
            // target.mp3[0].howl.play()
            played = true
          }
        }
      }
      if (!played) alert('FAIL: play book ' + folder.name + ' page ' + page)
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
    },
    endHowlPlay () {
      this.$store.commit('silence')
    },
    playBook (folder) {
      this.setDelayPlayNext(1)
      return this.playBookPage(folder, -1)
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
    pageOrder (folder) {
      // TODO: this should be a property on the TOC
      let numberTest = /^\d|$/
      let assemble = []
      let sourceFolder = this.folders[folder.path_lower]

      if (sourceFolder && sourceFolder.pages) {

        Object.keys(sourceFolder.pages).forEach((key) => {
          if (numberTest.test(key)) {
            let index = parseInt(key)
            assemble[index] = key
          }
          else {
            if (key === 'cover') {
              assemble[0] = key
            }
            else {
              // TODO: handle multiple string keys better
              let index = assemble.length + 10000
              assemble[index] = key
            }
          }
        })

        if (sourceFolder.cover) {
          assemble[0] = 'cover'
        }
      }

      let myArray = assemble.filter( function (x) {
        return (x !== (undefined || null || ''))
      })

      if (window.jim_DEBUG_FULL) {
        console.log('myArray SHOULD BE PROPERTY OF TOC TODO')
        console.dir(myArray)
        }

      return myArray
    },
  }
}
