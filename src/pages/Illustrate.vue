<template>
  <div
    v-touch-swipe="swipeHandler"
    class="row fit"
    ref="background"
  >
    <q-window-resize-observable @resize="onResize" />
    <div class=" row">
      <q-card id="image" :class="imageCardClass">
        <q-card-media
          class="camFeedback"
          overlay-position="bottom"
        >
          <div class="camera camFeedback ">
            <video :class="sizeClasses" @click.stop="touchHandler8" v-show="!preview" ref="video" id="video">Video stream
              not available.
            </video>
            <canvas :class="sizeClasses" v-show="preview" ref="canvas" id="canvas"></canvas>
          </div>

          <q-card-title slot="overlay">{{$t(action)}}</q-card-title>
        </q-card-media>

        <q-card-main class="orientation-portrait">

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
        <q-card-actions vertical align="center" class="orientation-portrait">
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
            @click="home_UI"

            icon="stop"
            color="secondary"
          ></q-btn>
        </q-card-actions>


      </q-card>
      <q-card id="buttons" class=" col-6 orientation-landscape">

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
            @click="home_UI"

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

  export default {
    name: 'Illustrate',
    /* props: ['pageName'], */
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    data () {
      return {
        pageName: false,
        action: 'click to keep'
      }
    },
    computed: {
      imageCardClass () {
        return this.orientation === 'portrait' ? 'col-12' : 'col-6'
  }
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

      this.videoRef = this.$refs.video

      this.getUserMedia(this.videoRef)

      this.clearPhoto()

      if (this.$route.params.pageName) {
        this.pageName = this.$route.params.pageName
      }
      else {
        this.pageName = this.nextIllustration(this.activeFolder)
      }

    },
    methods: {

    },
  }
</script>

<style>
</style>
