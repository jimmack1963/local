<template>
  <q-expansion-item
    caption="Videos"
    expand-separator
    default-opened
    @before-show="getAllBrands"
    label="Tutorials"
  >
    <template
      v-for="category in brandInfo"
    >
      <q-item
        :href="category.url"
        :key="category.title"
        clickable
        tag="a"
        target="_blank">
        <q-item-section avatar>
          <q-icon :name="category.icon"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ category.title }}</q-item-label>
          <q-item-label caption v-html="category.caption"></q-item-label>
        </q-item-section>
      </q-item>

      <MenuLink
        :caption="link.caption"
        :inset="1"
        :key="link.title"
        :link="link.link"
        :title="link.title"
        icon="slideshow"
        v-for="link in category.videos"
      />
    </template>


  </q-expansion-item>
</template>

<script>
import MenuLink from './MenuLink'

export default {
  name: 'MenuTutorials',
  components: { MenuLink },
  mounted () {
    // initially displayed, so load here
    this.getAllBrands()
  },
  methods: {
    async getAllBrands () {
      const file = 'videos.json'
      let source
      if (window.location.origin.includes('localhost')) {
        source = 'https://brand.GamieJamie.com/' + file
      } else {
        source = window.location.origin.replace('https://', 'https://brand.') + '/' + file
      }
      // source = source.replace('https://GamieJamie', 'https://brand.GamieJamie')
      console.log('Route using source file : ' + source)

      await this.$axios.get(source)
      .then((response) => {
        const { games, literacy, school, ...rest } = response.data
        // const { games, literacy, ...rest } = response.data
        // const together = { games, ...rest }
        const together = { literacy, school, games, ...rest }
        this.brandInfo = together
      })
      .catch(() => {
        this.$q.notify({
          color: 'negative',
          message: 'Loading ' + source + ' failed',
          icon: 'report_problem'
        })
      })
    }
  },
  data () {
    return {
      brandInfo: {
        games: {
          title: 'Gamie Jamie',
          url: 'https://gamiejamie.com/#/',
          caption: 'Old school DIY games',
          icon: 'chat',
          videos: [
            {
              family: 'Interview',
              title: 'Interview Game Family',
              caption: 'How to play the "What would you do if.." social DIY game.',
              link: 'https://youtu.be/nmyYvprljdM'
            },
          ]
        },
      }
    }
  }
}
</script>
