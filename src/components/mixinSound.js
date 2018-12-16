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
      let played = false
      let myFolder = this.folders[folder.path_lower.substr(1)]
      if (myFolder) {
        let target = myFolder.pages[page.toString()]
        if (target.mp3.length > 0) {
          if (target.mp3[0].howl) {
            debugger
            target.mp3[0].next = function () {
              debugger
              alert('Play next after page ' + page)
            }
            this.$store.commit('playHowl', {
              page: target.mp3[0]
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
