import { mapGetters } from 'vuex'
import { animate } from 'quasar'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC', 'folders', 'playing', 'playingPage', 'uid'])
  },
  methods: {
    next () {

    },
    playBookPage (folder, page) {
      if (window.jim_DEBUG_FULL) console.log('playBookPageplayBookPageplayBookPageplayBookPage')

      let vue = this
      animate.start({
        name: 'page-for-attention',
        from: 30,
        to: 100,
        duration: 1000,
        apply (pos) {
          vue.$refs.playingPage.forEach( r => {
            r.style.left = `${100 - pos}%`
            // r.style.fontsize = `${pos}px`
            // r.style.top = `${pos}px`
          })
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
                if (nextTargetProperties.mp3.length > 0 && nextTargetProperties.mp3[0].howl) {
                  // cue up next page
                  // TODO: generally, this should be kept so it can be cancelled

                  setTimeout(function () {
                      vue.playBookPage(folder, nextPageNumber)
                  }, 1000)
                  // TODO: set the seconds
                }
                else {
                  alert('No narrator when next page = ' + nextPageNumber)
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
    endHowlPlay () {
      this.$store.commit('silence')
    },
    playBook (folder) {
      return this.playBookPage(folder, -1)
    },
    pageCount (folder) {
      let destFolders = this.folders[folder.path_lower]
      if (destFolders) {
        return Object.keys(destFolders.pages).length
      }
      else {
        return 0
      }
    },
    pageOrder (folder) {
      let numberTest = /^\d|$/
      let assemble = []
      let sourceFolder = this.folders[folder.path_lower]

      if (sourceFolder) {

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
      if (window.jim_DEBUG_FULL) {
        console.log('assemble')
        console.dir(assemble)
        }

      let myArray = assemble.filter( function (x) {
        return (x !== (undefined || null || ''))
      })

      if (window.jim_DEBUG_FULL) {
        console.log('myArray')
        console.dir(myArray)
        }

      return myArray
    },
    async playSound () {

    }
  }
}
