<template>
  <q-page class="row" padding>
    <div :class="pOrL">
      <q-img
        :alt="activeFolder.name"
        :src="activeFolder.imageOrder[sceneFromPage(nextNarration)] || activeFolder.thumbnail"
        v-if="activeFolder.thumbnail"
        contain
      />
      <p
        v-else
      >
        No Image
      </p>
    </div>
    <q-card
      bordered
      v-bind:key="index"
      v-for="(blob, index) in activeFolder.soundOrder"
    >
      <q-card-section>
        Page {{activeFolder.pageOrder[index]}}
      </q-card-section>
      <q-img
        contain
        :src="imageForPage(index)"
        v-if="imageForPage(index)"
        :alt="'Image #' + index"
      ></q-img>

      <q-card-actions>


        <q-btn
          :label="$t('play')"
          @click="playOnePage(activeFolder, activeFolder.pageOrder[index])"
          v-if="activeFolder.soundOrder[index]"
          flat
          icon="play_arrow"
          color="primary"
        ></q-btn>

        <q-btn
          :label="$t('erase recording')"
          @click="deleteBookSound(activeFolder, activeFolder.pageOrder[index])"
          v-if="activeFolder.soundOrder[index]"
          flat
          icon="delete"
          color="primary"
        ></q-btn>
      </q-card-actions>
    </q-card>

    <!--<q-card class="col-12">
      <q-card-section
        overlay-position="bottom"
        v-if="activeFolder.thumbnail"
      >
        <q-img
          :alt="activeFolder.name"
          :src="activeFolder.imageOrder[sceneFromPage(nextNarration)] || activeFolder.thumbnail"
          contain
        />
        <q-card-section slot="overlay">
          {{activeFolder.name}}&nbsp;
          &lt;!&ndash;<span slot="subtitle">{{folder.size}}</span>&ndash;&gt;
        </q-card-section>
      </q-card-section>

      <q-card-section>

        <q-field
          :label="$t('Next Page to Narrate')"
        >
          <q-input
            v-model="nextNarration"
          >
          </q-input>
        </q-field>

        <RecordAudio
          :autoclose="true"
          :pageName="nextNarration.toString()"
          :ref="`record_audio_${nextNarration}`"
          :showButtons="false"
          :start="true"
          v-if="activeNow[nextNarration.toString()]"
          v-on:nextitem="nextitemplease"
        >
        </RecordAudio>

      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :icon="activeRecorderOffset !== nextNarration.toString() ?  'mic' : likelyIcon"
          :id="`narrate_${nextNarration}`"
          :label="activeRecorderOffset !== nextNarration.toString() ?  $t('narrate page') + ' ' + nextNarration : $t(likelyAction)"
          @click="narratePage(activeFolder, nextNarration.toString(), nextNarration)"
          color="primary"
          v-if="!activeFolder.soundOrder[nextNarration]"
        ></q-btn>

        <q-btn
          :label="$t('done')"
          @click="doneAndClosed"
          color="secondary"
          icon="stop"
          id="done"
          v-if="!activeRecorderOffset"
        >
        </q-btn>

        <q-btn
          :label="$t('manage')"
          @click="manage_UI(activeFolder)"
          icon="dashboard"
          id="manage"

        />
      </q-card-actions>
      <q-card-section>


      </q-card-section>
    </q-card>-->

    <div :class="rest" class="q-pa-sm">
      <q-field
        :label="$t('Next Page to Narrate')"
      >
        <q-input
          v-model="nextNarration"
        >
        </q-input>
      </q-field>

      <RecordAudio
        :autoclose="true"
        :pageName="nextNarration.toString()"
        :ref="`record_audio_${nextNarration}`"
        :showButtons="false"
        :start="true"
        v-if="activeNow[nextNarration.toString()]"
        v-on:nextitem="nextitemplease"
      >
      </RecordAudio>

      <q-btn
        :icon="activeRecorderOffset !== nextNarration.toString() ?  'mic' : likelyIcon"
        :id="`narrate_${nextNarration}`"
        :label="activeRecorderOffset !== nextNarration.toString() ?  $t('narrate page') + ' ' + nextNarration : $t(likelyAction)"
        @click="narratePage(activeFolder, nextNarration.toString(), nextNarration)"
        color="primary"
        v-if="!activeFolder.soundOrder[nextNarration]"
      ></q-btn>

      <q-btn
        :label="$t('done')"
        @click="doneAndClosed"
        color="secondary"
        icon="stop"
        id="done"
        v-if="!activeRecorderOffset"
      >
      </q-btn>

      <q-btn
        :label="$t('manage')"
        @click="manage_UI(activeFolder)"
        icon="dashboard"
        id="manage"

      />
    </div>
  </q-page>
</template>

<script>
    import {mixinDropbox} from '../components/mixinDropbox'
    import {mixinGeneral} from '../components/mixinGeneral'
    import {mixinSound} from '../components/mixinSound'
    import RecordAudio from '../components/RecordAudio'
    // import RecordCamcord from '../components/RecordCamcord'
    import folderCardDisplay from '../components/folderCardDisplay'

    export default {
        components: {RecordAudio, folderCardDisplay},
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

                this.home_UI()
            },
            nextitemplease () {

                let last = parseInt(this.nextNarration)
                if (isNaN(last)) {
                    this.nextNarration += '.1'
                }
                else {
                    this.nextNarration = last + 1
                }
            },
            startRecord (folder, pageName, offset, recursive, childName) {
                if (window.currentAudioContext.state === 'suspended') {

                    console.log('RESUME audioContext')
                    window.currentAudioContext.resume().then(() => {
                        this.startRecord(folder, pageName, offset, recursive)
                    })
                }
                else {

                    this.activeRecorderOffset = offset

                    this.$set(this.activeNow, 'bulk', true)
                    this.$nextTick(() => {

                        let child = this.$refs[childName || 'record_audio_bulk']
                        if (!child) {
                            this.startRecord(folder, pageName, offset, recursive)
                        }
                        else {
                            // child.doAction()
                        }
                    })
                }
            },
            endRecord (childName) {

                let child = this.$refs[childName || 'record_audio_bulk']
                if (!child) {
                    this.endRecord()
                }
                else {
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
