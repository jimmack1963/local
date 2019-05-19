<template>
  <q-page padding class="row">
    <q-card class="q-ma-sm">
      <q-card-media
        overlay-position="bottom"
        v-if="activeFolder.thumbnail"
      >
        <img :src="activeFolder.imageOrder[sceneFromPage(nextNarration)] || activeFolder.thumbnail" :alt="activeFolder.name">
        <q-card-title slot="overlay">
          {{activeFolder.name}}&nbsp;
          <!--<span slot="subtitle">{{folder.size}}</span>-->
        </q-card-title>
      </q-card-media>

      <q-card-main>

        <q-field
          :label="$t('Next Page to Narrate')"
        >
          <q-input
            v-model="nextNarration"
          >
          </q-input>
        </q-field>

        <RecordAudio
          :ref="`record_audio_${nextNarration}`"
          v-if="activeNow[nextNarration.toString()]"
          v-on:nextitem="nextitemplease"
          :pageName="nextNarration.toString()"
          :start="true"
          :autoclose="true"
          :showButtons="false"
        >
        </RecordAudio>

      </q-card-main>
      <q-card-actions vertical align="center">
        <q-btn
          :id="`narrate_${nextNarration}`"
          :label="activeRecorderOffset !== nextNarration.toString() ?  $t('narrate page') + ' ' + nextNarration : $t(likelyAction)"
          @click="narratePage(activeFolder, nextNarration.toString(), nextNarration)"
          v-if="!activeFolder.soundOrder[nextNarration]"
          :icon="activeRecorderOffset !== nextNarration.toString() ?  'mic' : likelyIcon"
          color="primary"
        ></q-btn>

        <q-btn
          id="done"
          v-if="!activeRecorderOffset"
          :label="$t('done')"
          @click="doneAndClosed"
          icon="stop"
          color="secondary"
        >

        </q-btn>
      </q-card-actions>
      <q-card-main>


      </q-card-main>
    </q-card>

  </q-page>
</template>

<script>
  import { mixinDropbox } from '../components/mixinDropbox'
  import { mixinGeneral } from '../components/mixinGeneral'
  import { mixinSound } from '../components/mixinSound'
  import RecordAudio from '../components/RecordAudio'
  import RecordCamcord from '../components/RecordCamcord'
  import folderCardDisplay from '../components/folderCardDisplay'

  export default {
    components: {RecordCamcord, RecordAudio, folderCardDisplay},
    mixins: [mixinSound, mixinGeneral, mixinDropbox],
    computed: {
      myFolder () {
        return this.folders[this.activeFolder.path_lower]
      },
    },
    methods: {
      async doneAndClosed () {

        if (this.activeRecorderOffset) {
          await this.narratePage(this.activeFolder, this.nextNarration.toString(), this.nextNarration)
        }

        this.home()
      },
      nextitemplease () {

        let last = parseInt(this.nextNarration)
        if (isNaN(last)) {
          this.nextNarration += '.1'
        } else {
          this.nextNarration = last + 1
        }
      },
      startRecord (folder, pageName, offset, recursive, childName) {
        if (window.currentAudioContext.state === 'suspended') {

          console.log('RESUME audioContext')
          window.currentAudioContext.resume().then(() => {
            this.startRecord(folder, pageName, offset, recursive)
          })
        } else {

          this.activeRecorderOffset = offset

          this.$set(this.activeNow, 'bulk', true)
          this.$nextTick(() => {

            let child = this.$refs[childName || 'record_audio_bulk']
            if (!child) {
              this.startRecord(folder, pageName, offset, recursive)
            } else {
              // child.doAction()
            }
          })
        }
      },
      endRecord (childName) {

        let child = this.$refs[childName || 'record_audio_bulk']
        if (!child) {
          this.endRecord()
        } else {
          child.doAction()
          // this.$set(this.recording, 'bulk', false)
        }
      },

    },
    data () {
      return {
        activeRecorderOffset: false,
        activeNow: {},
        illustrating: {},
        nextNarration: 1,

      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.narrate = this

      this.nextNarration = this.nextSound(this.activeFolder)

    },
    name: 'narrate',
  }
</script>

<style>
</style>
