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
        :label="'keep as page ' + nextIllustration(activeFolder)"
        @click="touchHandler8"
        icon="camera"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="front"
        :label="modeCaption"
        @click="modeClick"
        :icon="modeIcon"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="file"
        label="file"
        @click="clickFile"
        icon="attachment"
        slot="title"
      >
      </q-tab>

      <q-tab
        name="done"
        label="done"
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
    mixins: [ mixinGeneral, mixinDropbox, mixinIllustrate ],
    data () {
      return {}
    },
    computed: {
      pageName () {
        if (this.activeFolder.pageOrder.length > 0) {
          let po = this.activeFolder.pageOrder
          return parseInt(po[po.length - 1]) + 1
        }
        else {
          return 0
        }
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.Illustrate = this

      this.videoRef = this.$refs.video

      this.getUserMedia(this.videoRef)

      this.clearPhoto()
    },
    methods: {

    },
  }
</script>

<style>
</style>
