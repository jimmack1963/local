import { mapGetters } from 'vuex'

export const mixinSound = {
  data () {
    return {
      howls: {}
    }
  },
  computed: {
    ...mapGetters(['ids', 'TOC'])
  },
  methods: {
    async playSound () {

    }
  }
}
