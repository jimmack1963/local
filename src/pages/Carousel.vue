<template>
  <q-page padding>
    <div>
<!--
      <br/>
      <br/>
      <q-btn @click="modal = true" class="glossy" color="primary">
        Play "{{activeFolder.name}}"
      </q-btn>
-->


      <!--
            :thumbnails="true"
                @slide-trigger="slideTrigger"
            -->
      <q-carousel
        @before-transition="beforeTransition"
        @transition="afterTransition"
        animated
        arrows
        class="text-white full-height"

        color="white"

        fullscreen
        handle-arrow-keys
        :thumbnails="thumbnails"
        :navigation="!thumbnails"
        swipeable


        :class="`bg-${colors[currentSlide % 5]}`"
        transition-next="slide-left"
        transition-prev="slide-right"
        v-model="currentSlide"
      >
        <q-carousel-slide
          v-if="thumbnails"

          :key="`full-${n}`"
          :name="n"
          @mousedown.native="mouseDown($event)"
          :img-src="imageForPage(p)"
          @mouseup.native="mouseUp($event)"
          v-for="(p, n) in myPages"
        >

          <!--
          navigation
          thumbnails

        :class="`bg-${colors[n % 5]}`"

          class="flex flex-center"
           <q-img :alt="imageForPage(p)" :src="imageForPage(p)" contain/>


          slot="control-full"
          slot-scope="carousel"

           -->
        </q-carousel-slide>
        <q-carousel-slide
          v-if="!thumbnails"

          :key="`full-${n}`"
          :name="n"
          @mousedown.native="mouseDown($event)"

          @mouseup.native="mouseUp($event)"
          v-for="(p, n) in myPages"
        >
          <q-img :alt="imageForPage(p)" :src="imageForPage(p)" contain/>
          <!--
          navigation
          thumbnails
 :img-src="imageForPage(p)"
        :class="`bg-${colors[n % 5]}`"

          class="flex flex-center"
           <q-img :alt="imageForPage(p)" :src="imageForPage(p)" contain/>


          slot="control-full"
          slot-scope="carousel"

           -->
        </q-carousel-slide>

        <template
          v-slot:control
        >
          <q-carousel-control
            :offset="[18, 66]"
            position="bottom-right"
          >
            <q-btn
              :label="$t('List of Books')" @click="home_UI"
              color="secondary"
              icon="home"
              push
              rounded
            />
          </q-carousel-control>

        </template>
      </q-carousel>


    </div>
  </q-page>
</template>

<script>
  // import { easing } from 'quasar'
  import { mixinSound } from '../components/mixinSound'
  import { mixinGeneral } from '../components/mixinGeneral'

  export default {
    name: 'Carousel',
    mixins: [mixinGeneral, mixinSound],
    data () {
      return {
        thumbnails: true,
        jim: 0,
        pendingTimeMark: false,
        latestPage: false,
        autoplay: true,

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

    },
  }
</script>

<style>
</style>
