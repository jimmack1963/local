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
        :class="`bg-${colors[currentSlide % 5]}`"
        :navigation="!thumbnails"
        :thumbnails="thumbnails"
        @before-transition="beforeTransition"
        @transition="afterTransition"

        animated

        arrows
        class="text-white full-height"
        color="white"
        fullscreen
        handle-arrow-keys


        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        v-model="currentSlide"
      >
        <q-carousel-slide
          :img-src="activeFolder.imageOrder[n] || activeFolder.thumbnail"

          :key="`full-${n}`"
          :name="n"
          :style="backgroundStyle(activeFolder.imageOrder[n])"

          @mousedown.native="mouseDown($event)"
          @mouseup.native="mouseUp($event)"
          v-for="(p, n) in myPages"
          v-if="thumbnails && activeFolder.imageOrder[n]"
        >
          <!--
          :img-src="imageForPage(p)"
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
          :key="`full-${n}`"

          :name="n"
          @mousedown.native="mouseDown($event)"
          @mouseup.native="mouseUp($event)"

          v-for="(p, n) in myPages"
          v-if="!thumbnails && activeFolder.imageOrder[n]"
        >
          <q-img :alt="imageForPage(p)" :src="activeFolder.imageOrder[n] || activeFolder.thumbnail" contain/>
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
              @click="setDelayPlayNext(2); playNext();"
              color="secondary"
              icon="playlist_play"
              v-if="!delayPlayNext"
              rounded
            />
            <q-btn
              @click="home_UI"
              color="secondary"
              icon="home"
              rounded
            />
            <!--
                        :label="$t('List of Books')"
                          :label="$t('Continue to end of book')"
            -->
          </q-carousel-control>

        </template>
      </q-carousel>


    </div>
  </q-page>
</template>

<script>
    // import { easing } from 'quasar'
    import {mixinSound} from '../components/mixinSound'
    import {mixinGeneral} from '../components/mixinGeneral'

    export default {
        name: 'Carousel',
        mixins: [mixinGeneral, mixinSound],
        data () {
            return {
                thumbnails: true,
                jim: 0,
                pendingTimeMark: false,

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
            // this.currentBookThumbnails = this.myPages.map((p) => {
            //   return this.imageForPage(p)
            // })
            this.currentSlide = 0

            this.waitAndStart(0)

        },
        methods: {
            waitAndStart (attempts) {
                console.log('waitAndStart ' + attempts)
                if (attempts < 20) {
                    if (this.activeFolder && this.activeFolder.soundOrder[0]) {
                        this.playBookPage(this.activeFolder, this.myPages[0])
                    }
                    else {
                        // wait a second and try again
                        setTimeout(() => {
                            this.waitAndStart(attempts + 1)
                        }, 1000)
                    }
                }
            },
            backgroundStyle (url) {
                return `background-image: url('${url}'); background-size: contain; background-position: 50% center;background-repeat: no-repeat;`
            },
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
                if (diff < 1000) {
                    vue.$store.commit('delayPlayNext', 0)
                    console.log('********************************************** Started play one ' + diff)
                }
                else {
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
