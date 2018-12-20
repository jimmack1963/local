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
          class="text-white full-height"
          :thumbnails="myImages"
        >
          <q-carousel-slide
            v-for="(p, n) in myPages" :key="`full-${n}`"
            class="flex flex-center"
            :class="`bg-${colors[n % 5]}`"

          >
            <img :src="imageForPage(p)" :alt="imageForPage(p)">
            <!--<div class="q-display-3">Page {{ p }} {{ imageForPage(p)}}</div>-->
          </q-carousel-slide>

          <q-carousel-control
            slot="control-full"
            slot-scope="carousel"
            position="bottom-right"
            :offset="[18, 22]"
          >
            <q-btn
              rounded push
              color="amber"
              icon="close"
              label="Close me"
              @click="home()"
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
        slide: 0,
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
      this.myImages = this.myPages.map((p) => {
        return this.imageForPage(p)
      })
    }
  }
</script>

<style>
</style>
