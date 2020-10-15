<template>
  <q-page class="row col-12">
    <div :class="pOrL">
      <TakeOrFind
        ref="TakeOrFind"
        class="full-width"
        v-on:onImageTaken="onImageTaken"
        v-on:onFile="onFile"
        :touchToTake="true"
        :takeCaption="$t('Take')"
      >
      </TakeOrFind>

   <!--   Latest Image:
      <q-img
        v-if="latestImage !== '//:0'"
        id="camera&#45;&#45;output"
        :src="latestImage"
        alt="your camera"
      />
-->
      <!-- <RecordCamcord
        :showLocalMenu="false"
        :class="pOrL"
        :fileable=false
        :pageName="pageName"
        v-on:completed="onImage"
        ref="recordCamCord"
      >
      </RecordCamcord> -->


    </div>
    <div
      :class="rest"
      class="q-pa-sm"
    >
      <div v-if="this.selectedInfo.showMedia && false">
        <div v-if="!imageTaken">
          {{ $t('Touch image to take selfie') }}
        </div>
        <div v-else>
          {{ $t('You can retake the cover') }}
        </div>
      </div>

      <div class="row">
<!--
        <q-file
          class="col q-mr-sm"
          style="max-width: 300px"
          v-model="fileImages"
          v-if="!this.selectedInfo.showMedia"
          filled
          bg-color="secondary"
          label-color="white"

          label="Add Image From File"
          icon="camera"
          accept=".jpg, image/*"
        >
          <template v-slot:prepend>
            <q-icon color="white" name="camera"></q-icon>
          </template>
          <template v-slot:append>
            <q-icon color="white" name="cloud_upload"></q-icon>
          </template>
        </q-file>
        -->
        <!--
          @rejected="onRejected"

          <input
          id="manual-input-user"
          ref="input"
          @change="dispatchStoreImage"
          :capture="selectedInfo.capture"
          accept="image/*"
          type="file">
          -->
        <!-- <q-btn
          :id="`illustrate_${pageName}`"
          :label=" $t('Take') "
          color="primary"

          v-if="this.selectedInfo.showMedia"
          icon="camera"
          @click="triggerRecord"
        /> -->

        <q-field
          :label="$t('keep as page')"
          class="col q-mx-sm"
          orientation="horizontal"
        >
          <q-input
            v-model="pageName"
          >
          </q-input>
        </q-field>

        <q-btn
          class="col"
          id="done"
          :label="$t('done')"
          color="secondary"

          icon="stop"
          @click="home_UI"
        />

        <q-btn
          class="col"
        id="manage"
        :label="$t('manage')"
        icon="dashboard"
        @click="manage_UI(activeFolder)"
      />
      </div>

    </div>

    <div
      v-for="(blob, index) in activeFolder.imageOrder"
      v-bind:key="index"
      class="col-xs-3"
    >
      <q-img
        v-if="blob"
        :src="blob"
      >

        <q-badge
          floating
        >
          {{ activeFolder.pageOrder[index] }}

        </q-badge>
      </q-img>
    </div>

  </q-page>
</template>

<script>
import {mixinGeneral} from '../components/mixinGeneral'
import {mixinDropbox} from '../components/mixinDropbox'
import {mixinIllustrate} from '../components/mixinIllustrate'
import {mixinUpload} from '../components/mixinUpload'
// import RecordCamcord from '../components/RecordCamcord'
import TakeOrFind from '../components/TakeOrFind'
import {mapGetters} from 'vuex'

export default {
  name: 'Illustrate',
  /* props: ['pageName'], */
  components: {TakeOrFind},
  mixins: [mixinGeneral, mixinDropbox, mixinUpload, mixinIllustrate],
  // mixins: [mixinGeneral, mixinDropbox],

  data () {
    return {
      pageName: '',
      action: 'click to keep',
      imageTaken: false,
      val_fileImages: []
    }
  },
  computed: {
    ...mapGetters('devices', [
      'latestImage',
      'files',
      'urls',
      'selected',
      'selectedInfo',
      'latestImageAsDataURL',
      'externals']),
    fileImages: {
      get: function () {
        return this.val_fileImages
      },
      set: function (val) {
        this.val_fileImages = val
        this.onFile(val)
      }
    }
  },
  mounted () {
    window.jim = window.jim || {}
    window.jim.Illustrate = this

    if (this.$route.params.pageName) {
      this.pageName = this.$route.params.pageName
    }
    else {
      this.pageName = this.nextIllustration(this.activeFolder)
    }

  },
  methods: {
    dispatchStoreImage (event) {
      this.$store.dispatch('devices/handleImageNative', event)
    },
    triggerRecord () {
      this.$refs.TakeOrFind.takeImage()
    },


  },
}
</script>

<style>
</style>
