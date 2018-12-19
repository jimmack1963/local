import { mapGetters } from 'vuex'

export const mixinGeneral = {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['TOC', 'activeFolder'])
  },
  methods: {
    home () {
      this.$router.push('/')
    },
    selfie (entry) {
      this.$store.commit('setActiveFolder', {
        activeFolder: entry
      })
      this.$router.push('/selfie')
    },
    setDelayPlayNext (seconds) {
      this.$store.commit('delayPlayNext', seconds * 1000)
    },
  }
}
