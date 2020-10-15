<template>
  <div>
    <div class="row">
      <q-btn-dropdown
        class="col q-ma-sm"
        color="grey"
        no-caps
        push
        split
       >

        <template
          v-if="selectedInfo.useInput"
          v-slot:label
          class="q-mr-sm full-width col-12 row"
        >
          <q-file
            v-if="!selectedInfo.showMedia"
            v-model="fileImages"
            accept=".jpg, image/*"
            bg-color="primary"
            class="q-mr-sm full-width col-12"
            filled
            icon="camera"

            label="Add Image From File"
            label-color="white"
            style="max-width: 300px"
          >

            <template v-slot:prepend>
              <q-icon color="white" name="attachment"></q-icon>
            </template>
          </q-file>
        </template>

        <template
          v-else
          v-slot:label

          @click="takeImage"
        >
          <q-btn
            :icon="selectedInfo.icon"
            class="bg-secondary"
            @click="takeImage"
          > &nbsp;
            <!--{{ takeCaption || selectedInfo.caption }}--> {{ $t('Touch image to take selfie') }}
          </q-btn>

        </template>

        <q-list>
          <q-item
            v-for="opt in videoDevicesAsOptions"
            :key="opt.value"
            v-close-popup
            clickable
            @click="selectedDevice = opt.value"
          >
            {{ opt.label }}
          </q-item>

        </q-list>
      </q-btn-dropdown>

      <!--

          <div class="col-12 q-mb-sm">
            <q-btn
              v-if="showTake"
              class="q-mx-md"
              @click="takeImage"
            >
              {{ takeCaption || 'oops' }}
            </q-btn>
            <q-icon
              v-if="showConfigure"
              name="settings"
              size="lg"
              @click="pickInput = !pickInput"
            ></q-icon>
          </div>
      -->
    </div>
    <div
      v-show="selectedInfo.showMedia"
      @click.stop="takeImage"
    >
      <video
        id="camera--view"
        ref="video" autoplay
        playsinline
      >
        Video stream not available.
      </video>

      <div class="hide-outer">
        <div class="hide-inner">
          <canvas id="camera--sensor" ref="canvas"/>
        </div>
      </div>
    </div>

    <q-card
      v-if="pickInput"
      class="col-12 row q-ma-sm"
    >
      <q-tabs
        v-model="tab"
        active-color="primary"
        align="justify"
        class="text-grey col-12"
        dense
        indicator-color="primary"
        narrow-indicator
      >
        <q-tab label="Details" name="details"></q-tab>
        <q-tab label="Camera" name="camera"></q-tab>
        <!--
                <q-tab label="Picker" name="picker"></q-tab>
                <q-tab label="File" name="file"></q-tab>
        -->
        <q-tab label="Dropbox" name="dropbox"></q-tab>
      </q-tabs>
      <q-separator/>
      <q-tab-panels
        v-model="tab"
        animated
        class="col-12 full-width"
      >
        <q-tab-panel
          class="col-12 full-width"
          name="details"
        >
          Sadly, taking picture from the web changes periodically,
          depending on your device and version,
          disrupting our website. Here are the options, for you to pick
          what works best for you.

          <br>
          <br>
          Generally, the 'CAMERA' choices are the fewest clicks, the 'PICKER' offers
          the most device choices, and 'FILE' or 'DROPBOX' gives you
          the most power.

        </q-tab-panel>

        <q-tab-panel
          class="col-12 full-width"
          name="camera"
        >
          <h6>Input Choices</h6>
          <q-option-group
            v-model="selectedDevice"
            :options="videoDevicesAsOptions"
          />


        </q-tab-panel>
        <!--
                <q-tab-panel
                  class="col-12 full-width"
                  name="picker"
                >
                  This option uses your device's internal camera controls.
                  On some devices, the initial prompt helps set a default, but
                  it may not matter. Please try all three and choose what you like.

                  <q-btn @click="selectAndTake({input: 'user'})">User</q-btn>
                  <q-btn @click="selectAndTake({input: 'environment'})">Environment</q-btn>

                </q-tab-panel>
                <q-tab-panel
                  class="col-12 full-width"
                  name="file"
                >
                  You of course can use existing photos.
                  <q-btn @click="selectAndTake({input: 'file'})">File</q-btn>
                </q-tab-panel>
            -->
        <q-tab-panel
          class="col-12 full-width"
          name="dropbox"
        >
          <p>
            In your Dropbox account, there is a folder called Apps, which Dropbox uses to protect your other files from
            application developers like us.

          </p>
          <p>
            Inside, there is our folder, PlayItAgainKid.
          </p>
          <p>
            For each book, there is a folder with the name of the book you created. Inside, there are a bunch of
            files, that become your book.
          </p>
          <p>
            First, there is a file called book_cover.png. This is the selfie that your kid would use to select the
            correct book.
          </p>
          <p>
            Second, for each page, there may be both an image file and a sound recording. For page 1, the image file
            would be called p1.png, and the sound file would be called p1.m4a
          </p>
          <p>
            These are your files. You are free to use these files in any way you want. You could also create a
            book entirely from scratch just by putting files in a another folder in the Apps/PlayItAgainKid folder.
          </p>

          <p>
            To take advantage of this, you may want to install the dropbox app itself. It would be easier to do
            this on a laptop/desktop, but possible to change things on a smartphone itself.
          </p>

          <q-item
            @click.native="openURL('https://www.dropbox.com/home/Apps/PlayItAgainKid')">

            <q-item-section avatar>
              <q-icon name="open_in_browser"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('Open Dropbox Folder') }}</q-item-label>
              <q-item-label caption>{{ $t('See your files') }}</q-item-label>
            </q-item-section>


          </q-item>
        </q-tab-panel>
      </q-tab-panels>

    </q-card>

   <!-- <div class="hide-outer">
      <div class="hide-inner">
        <input
          id="manual-input-user"
          ref="input"
          :capture="selectedInfo.capture"
          accept="image/*"
          type="file"
          @change="dispatch('handleImageNative')">
      </div>
    </div>-->

  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import {mixinUpload} from '../components/mixinUpload'

export default {
  mixins: [mixinUpload],
  name: 'TakeOrFind',
  data () {
    return {
      pickInput: false,
      val_fileImages: [],
      tab: 'camera', // 'details'
      // tab: 'dropbox' // 'picker' // 'camera', // 'details'
    }
  },
  props: ['takeCaption',
    'externalElements',
    'pageName',
    'touchToTake',
    'showTake',
    'showConfigure'],
  beforeDestroy () {
    this.$store.commit('devices/externals', false)
  },
  async mounted () {
    console.log('pickInput mounted:::: ' + this.pickInput)
    console.log('selectedDevice mounted:::: ' + this.selectedDevice)

    await this.$store.dispatch('devices/requestPermission')
    this.$store.commit('devices/externals', {
      video: this.$refs.video,
      canvas: this.$refs.canvas,
      image: this.$refs.image,
      // input: this.$refs.input,
    })
    console.dir(this.externals)
    if (this.videoDevices.length === 0) {
      await this.$store.dispatch('devices/enumerateDevices')
    }

    if (this.selectedDevice) {
      await this.$store.dispatch('devices/prepUserMedia', {
          command: this.selectedDevice,
        },
      )
    }
    else {
      this.pickInput = true
    }

    // this.selectedDevice = 'user'
  },
  methods: {
    async takeImage () {

      await this.$store.dispatch('devices/captureImage')
      const dataImage = this.latestImageAsDataURL()
      this.$store.commit('devices/latestImageAsDataURL', dataImage)
      this.$emit('onImageTaken')
//      this.uploadImage(this.pageName, dataImage)
    },
    /*
      selectAndTake (aDevice) {
      this.selectedDevice = aDevice
      this.takeImage()
      console.log(this.latestImageAsDataURL())
      this.$store.commit('devices/latestImageAsDataURL', this.latestImageAsDataURL())
    },
    */
    latestImageAsDataURL () {
      const self = this
      const can = self.externals.canvas || self.$refs.canvas
      if (can) {
        return can.toDataURL('image/jpeg')
      }
      else {
      }
    },
  },
  computed: {
    ...mapGetters('devices', [
      'videoDevices',
      'videoDevicesAsOptions',
      'mediaState',
      'selected',
      'selectedInfo',
      'latestImage',
      'externals',
    ]),
    fileImages: {
      get: function () {
        return this.val_fileImages
      },
      set: function (val) {

        this.val_fileImages = val
        this.$store.dispatch('devices/handleFiles', val)
        // this.$store.commit('devices/files', event.target.files)
        this.$emit('onFile', {val, pageName: this.pageName})
        // this.onFile(val, this.pageName)
      },
    },
    selectedDevice: {
      get: function () {
        return this.selected
      },
      set: async function (val) {
        this.pickInput = false
        const reset = (val === 'environment') ? 'user' : 'environment'
        await this.$store.dispatch('devices/prepUserMedia', {
            command: reset,
          },
        )

        await this.$store.dispatch('devices/prepUserMedia', {
            command: val,
          },
        )
      },
    },
  },
  /*
  renderTriggered () {
  },
  updated () {
  },
  activated () {
  }, */
}
</script>

<style>
.hide-outer {
  overflow: hidden;
  position: relative;
}

.hide-inner {
  position: absolute;
  height: 100px;
  width: 100px;
  right: -50px;
  top: 50px;
}
</style>
