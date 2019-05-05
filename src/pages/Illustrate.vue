<template>
  <div
    class="row fit"
    ref="background"
  >
    <q-window-resize-observable @resize="onResize" />
    <q-card class="q-ma-sm col-12 orientation-portrait">
      <q-card-media
        class="camFeedback"
        overlay-position="bottom"
      >
        <div class="camera camFeedback ">
          <video :class="sizeClasses" @click.stop="touchHandler8" v-show="!preview" ref="Pvideo" id="video">Video stream
            not available.
          </video>
          <canvas :class="sizeClasses" v-show="preview" ref="Pcanvas" id="canvas"></canvas>
        </div>

        <q-card-title slot="overlay">{{$t(action)}}</q-card-title>
      </q-card-media>

      <q-card-main>

        <q-field
          :label="$t('keep as page')"
          orientation="horizontal"
        >
          <q-input
            v-model="pageName"
          >
          </q-input>
        </q-field>

      </q-card-main>
      <q-card-actions vertical align="center">
        <q-btn
          :id="`illustrate_${pageName}`"
          :label=" $t('Take') "
          @click="touchHandler8"
          v-if="!activeFolder.soundOrder[pageName]"
          icon="camera"
          color="primary"
        ></q-btn>

        <q-btn
          name="front"
          :label="$t(modeCaption)"
          @click="modeClick"
          :icon="modeIcon"
        >

        </q-btn>

        <q-btn
          id="done"
          :label="$t('done')"
          @click="home()"

          icon="stop"
          color="secondary"
        ></q-btn>
      </q-card-actions>
    </q-card>
    <div class="orientation-landscape row">
      <q-card class=" col-6 orientation-landscape">
        <q-card-media
          class="camFeedback"
          overlay-position="bottom"
        >
          <div class="camera camFeedback orientation-landscape">
            <video :class="sizeClasses" @click.stop="touchHandler8" v-show="!preview" ref="Lvideo" id="video">Video stream
              not available.
            </video>
            <canvas :class="sizeClasses" v-show="preview" ref="Lcanvas" id="canvas"></canvas>
          </div>

          <q-card-title slot="overlay">{{$t(action)}}</q-card-title>
        </q-card-media>

      </q-card>
      <q-card class=" col-6 orientation-landscape">

        <q-card-main>

          <q-field
            :label="$t('keep as page')"
            orientation="horizontal"
          >
            <q-input
              v-model="pageName"
            >
            </q-input>
          </q-field>

        </q-card-main>
        <q-card-actions vertical align="center">
          <q-btn
            :id="`illustrate_${pageName}`"
            :label=" $t('Take') "
            @click="touchHandler8"
            v-if="!activeFolder.soundOrder[pageName]"
            icon="camera"
            color="primary"
          ></q-btn>

          <q-btn
            name="front"
            :label="$t(modeCaption)"
            @click="modeClick"
            :icon="modeIcon"
          >

          </q-btn>

          <q-btn
            id="done"
            :label="$t('done')"
            @click="home()"

            icon="stop"
            color="secondary"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>


  </div>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinIllustrate } from '../components/mixinIllustrate'

  /*
    v-touch-swipe="swipeHandler"
    v-touch-hold.prevent="touchHandler"
    @click.native="touchHandler"
   */
  export default {
    name: 'Illustrate',
    /* props: ['pageName'], */
    mixins: [mixinGeneral, mixinDropbox, mixinIllustrate],
    data () {
      return {
        pageName: false,
        action: 'click to keep'
      }
    },
    computed: {
      /*
            pageNameOld () {
              if (this.$route.params.pageName) {

                return this.$route.params.pageName
              }
              // else if (this.activeFolder.pageOrder.length > 0) {
              //   let po = this.activeFolder.pageOrder
              //   return parseInt(po[po.length - 1]) + 1
              // }
              else {
                return false
              }
            }
      */
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.Illustrate = this

      this.videoRef = this.orientation === 'portrait' ? this.$refs.Pvideo : this.$refs.Lvideo

      this.getUserMedia(this.videoRef)

      this.clearPhoto()

      if (this.$route.params.pageName) {
        this.pageName = this.$route.params.pageName
      } else {
        this.pageName = this.nextIllustration(this.activeFolder)
      }

    },
    methods: {
    },
  }
</script>

<style>
</style>
