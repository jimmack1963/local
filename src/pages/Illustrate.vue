<template>
  <div
    v-touch-swipe="swipeHandler"
    class="row fit"
    ref="background"
    >
    <q-window-resize-observable @resize="onResize" />
    <q-tabs class="col-12" v-model="cameraMode">
      <q-tab
        name="take"
        :label="$t('keep as page') + ' ' + pageName"
        @click="touchHandler8"
        icon="camera"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="front"
        :label="$t(modeCaption)"
        @click="modeClick"
        :icon="modeIcon"
        slot="title"
      >
      </q-tab>

      <!--<q-tab
        name="file"
        :label="$t('file')"
        @click="clickFile"
        icon="attachment"
        slot="title"
      >
      </q-tab>-->

      <q-tab
        name="done"
        :label="$t('done')"
        @click="home"
        icon="stop"
        slot="title"
      >
      </q-tab>
    </q-tabs>

    <div class="camFeedback" >
<!--    <q-btn v-if="preview" color="secondary" ref="retakeButton" id="retakeButton" @click.stop="clearPhoto">Retake</q-btn>
    <q-btn v-if="!preview" color="primary" ref="startbutton" id="startbutton" @click.stop="lockCameraImage">Freeze Image</q-btn>
    <q-btn v-if="preview" :disabled="!dataURL" color="secondary" @click="useImage">Use</q-btn>-->
    <div class="camera camFeedback"   >
      <video :class="sizeClasses" @click.stop="touchHandler8" v-show="!preview" ref="video" id="video">Video stream not available.</video>
    </div>
    <canvas  v-show="preview" ref="canvas" id="canvas"></canvas>

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
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    data () {
      return {
        pageName: 1
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
