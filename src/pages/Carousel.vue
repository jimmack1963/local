<template>
  <q-page padding>
    <div>
      <br/>
      <br/>
      <q-btn color="primary" class="glossy" @click="modal = true">
        Play "{{activeFolder.name}}"
      </q-btn>
      <q-modal v-model="modal" maximized>
        <q-carousel
          color="white"
          arrows
          quick-nav
          handle-arrow-keys
          :animation="1000"
          :easing="overshoot"
          :swipe-easing="overshoot"
          class="text-white full-height"
          :thumbnails="currentBookThumbnails"
          @slide-trigger="slideTrigger"
          v-model="currentSlide"
        >
          <q-carousel-slide
            v-for="(p, n) in myPages" :key="`full-${n}`"
            class="flex flex-center"
            :class="`bg-${colors[n % 5]}`"
            @mousedown.native="mouseDown($event)"
            @mouseup.native="mouseUp($event)"

          >
            <img :alt="imageForPage(p)" class="fit"  :src="imageForPage(p)">
            <!--<div class="q-display-3">Page {{ p }} {{ imageForPage(p)}}</div>-->
          </q-carousel-slide>

          <q-carousel-control
            slot="control-full"
            slot-scope="carousel"
            position="bottom-right"
            :offset="[18, 66]"
          >
            <q-btn
              rounded push
              color="secondary"
              icon="home"
              :label="$t('List of Books')"
              @click="home_UI"
            />
          </q-carousel-control>
        </q-carousel>
      </q-modal>
    </div>
  </q-page>
</template>

<script>
  import { easing } from 'quasar'
  import { mixinSound } from '../components/mixinSound'
  import { mixinGeneral } from '../components/mixinGeneral'

  export default {
    name: 'Carousel',
    mixins: [ mixinGeneral, mixinSound ],
    data () {
      return {
        pendingTimeMark: false,
        latestPage: false,
        autoplay: true,
        overshoot: easing.overshoot,
        colors: [
          'primary',
          'secondary',
          'yellow',
          'red',
          'orange',
          'grey-2',
        ],
        modal: true,
        thumbnailsHorizontal: false,
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.carousel = this

      this.myPages = this.pageOrder(this.activeFolder)
      this.sourcePages = this.folders[this.activeFolder.path_lower]
      this.slide = 0
      this.currentBookThumbnails = this.myPages.map((p) => {
        return this.imageForPage(p)
      })
    },
    methods: {
      mouseDown (event) {

        console.log('*********************** mouseDown')

        // event.target.unselectable = true
        let vue = this
        vue.pendingTimeMark = new Date()
      },
      mouseUp (event) {
        console.log('*********************** mouseUp')
        let vue = this
        let diff = new Date() - vue.pendingTimeMark
        if (diff < 100) {
          vue.$store.commit('delayPlayNext', 0)
          console.log('********************************************** Started play one ' + diff)
        } else {
          vue.$store.commit('delayPlayNext', 2000)
          console.log('********************************************** Changed to play after 2 seconds ' + diff)
        }

        this.playCurrent()

      },

    }
  }
</script>

<style>
</style>
