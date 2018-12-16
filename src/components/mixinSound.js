import { mapGetters } from 'vuex'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC', 'folders'])
  },
  methods: {
    next () {

    },
    playBookPage (folder, page) {
      let vue = this
      let played = false
      let myFolder = this.folders[folder.path_lower.substr(1)]
      if (myFolder) {
        let currentPageProperties = myFolder.pages[page.toString()]

        let pagesOrdered = this.pageOrder(folder)
        let offset = pagesOrdered.indexOf(page)
        let nextPageNumber = false
        if (offset < pagesOrdered.length) {
          nextPageNumber = pagesOrdered[offset + 1]
        }

        if (currentPageProperties.mp3.length > 0) {
          let target = currentPageProperties.mp3[0]
          if (target.howl) {

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
                  vue.playBookPage(folder, nextPageNumber)
                }
                else {
                  alert('No narrator when next page = ' + nextPageNumber)
                }
              }
              else {
                alert('NO NEXT PAGE after ' + page)
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
    playBook (folder) {
      alert('play book ' + folder.name)
    },
    pageOrder (folder) {

      let numberTest = /^\d|$/
      let assemble = []
      let sourceFolder = this.folders[folder.path_lower.substr(1)]

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

      return assemble
    },
    async playSound () {

    }
  }
}
