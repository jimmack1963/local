<template>
  <q-page padding class="row">
    <!--
        <folderCardDisplay :folder="activeFolder">
        </folderCardDisplay>
    -->
    <h3 class="col-12">{{activeFolder.name}}</h3>

   <!-- <q-card class="q-ma-sm" v-for="(pageName, offset) in activeFolder.pageOrder" v-bind:key="pageName">
      <q-card-media
        overlay-position="bottom"
        v-show="activeFolder.imageOrder[offset]"
      >
        <img :src="activeFolder.imageOrder[offset]" :alt="'Image #' + offset">
        <q-card-title slot="overlay">
          {{pageName}}
          &lt;!&ndash;<span slot="subtitle"></span>&ndash;&gt;
        </q-card-title>
      </q-card-media>
      <q-card-title v-show="!activeFolder.imageOrder[offset]">
        Page {{pageName}} (No Image)
        &lt;!&ndash;<span slot="subtitle"></span>&ndash;&gt;
      </q-card-title>

      <q-card-actions vertical align="center">
        <q-btn
          :id="`narrate_${offset}`"
          :label="(activeRecorderOffset != offset.toString() ?  'Narrate'  : likelyAction)  + ' ' + pageName"
          @click="narratePage(activeFolder, pageName, offset)"
          v-if="!activeFolder.soundOrder[offset]"
          flat
          :icon="activeRecorderOffset != offset.toString() ?  'mic' : likelyIcon"
          color="primary"
        ></q-btn>

        <q-btn
          label="play"
          @click="setDelayPlayNext(0); playBookPage(activeFolder, pageName)"
          v-if="activeFolder.soundOrder[offset]"
          flat
          icon="play arrow"
          color="primary"
        ></q-btn>

        <q-btn
          label="erase recording"
          @click="deleteBookSound(activeFolder, pageName)"
          v-if="activeFolder.soundOrder[offset]"
          flat
          icon="delete"
          color="primary"
        ></q-btn>

      </q-card-actions>

      <q-card-main>
        <div v-if="recording[pageName]">
          Recording Component present
        </div>
        <div v-else>
          NO COMPONENT YET
        </div>
        <RecordAudio
          :ref="`record_audio_${offset}`"
          v-if="recording[pageName]"
          :pageName="pageName"
          :start="true"
          :autoclose="true"
          :showButtons="false"
        >
        </RecordAudio>
        &lt;!&ndash;v-on:autoclose="narrate(activeFolder, pageName, offset)"&ndash;&gt;
        <RecordCamcord
          v-if="illustrating[pageName]"
          :pageName="pageName"
          :quality="quality"
        >
          Page {{pageName}}
        </RecordCamcord>
      </q-card-main>
    </q-card>
-->
    <q-card class="q-ma-sm">
      <q-card-media
        overlay-position="bottom"
        v-if="activeFolder.thumbnail"
      >
        <img    :src="activeFolder.thumbnail" :alt="activeFolder.name">
        <q-card-title slot="overlay" >
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
        <div v-if="recording['bulk']">
          {{$t('Recording Component present')}}
        </div>
        <div v-else>
          {{$t('NO RECORDING YET')}}
        </div>
        <RecordAudio
          ref="record_audio_bulk"
          v-if="recording['bulk']"
          v-on:completed="completedBulkNarration"
          :pageName="nextNarration"
        >
        </RecordAudio>
      </q-card-main>
      <q-card-actions vertical align="center">
        <q-btn
          :label="$t(activeRecorderOffset != 'bulk' ? 'narrate multiple new pages' : likelyAction)"
          @click="narratePage(activeFolder, 'bulk', -1)"
          flat
          :icon="activeRecorderOffset != 'bulk' ? 'mic' : likelyIcon"
          color="primary"
        ></q-btn>
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
      /*      play (folder, pageName) {
              pageName = pageName.toString()
              let targetPage
              if (pageName in this.myFolder) {
                targetPage = this.myFolder[pageName]
              }
              else {
                targetPage = this.myFolder.pages[pageName]
              }

              if (pageName) {
                this.playBookPage(folder, pageName)
              }
              else {
                 if (window.jim_DEBUG_FULL) console.log('illustrate.page: PageName not found: ' + pageName)
              }
            }, */
      completedBulkNarration () {
        let last = parseInt(this.nextNarration)
        if (isNaN(last)) {
          this.nextNarration += '.1'
        } else {
          this.nextNarration = last + 1
        }
      },

      narratePage (folder, pageName, offset, recursive) {
        let refName = `record_audio_${offset >= 0 ? offset : 'bulk'}`

        if (!this.activeRecorderOffset && offset === -1) {
          this.activeRecorderOffset = 'bulk'
          if (!recursive) {
            let toggled = {}
            toggled[pageName] = true
            this.$set(this, 'recording', toggled)
          }
          this.$nextTick(() => {
            let child = this.$refs[refName]
            if (child) {
              child.doAction()
            }
            else {
              this.$nextTick(() => {
                this.narratePage(folder, pageName, offset, true)
              })
            }
          })

          // record a bunch of new ones, starting at ...

          // this.narratePage(folder, this.nextNarration, this.nextNarration)
        }
        else if (!this.activeRecorderOffset) {

          // start the recorder
          this.activeRecorderOffset = offset.toString()
          // only one at a time
          let toggled = {}
          if (!this.recording[pageName]) {
            toggled[pageName] = !(toggled[pageName])
          }
          this.$set(this, 'recording', toggled)
        }
        else {

          // close Recorder
          if (this.$refs[refName]) {
            let child = this.$refs[refName]
            if (child) {
              if (Array.isArray(child)) {
                if (child.length > 0) {
                  child[0].doAction()
                }
              } else {
                child.doAction()
              }
            }
          }
          else {
            if (window.jim_DEBUG_FULL) console.log('can not find ' + refName)
          }
          this.activeRecorderOffset = false
          // this.$set(this, 'recording', {})
        }
      },
      illustrate (folder, pageName) {
        this.$router.push('/Illustrate')
      },
      illustrateLocal (folder, pageName) {
        // only one at a time
        let toggled = {}
        if (!this.illustrating[pageName]) {
          toggled[pageName] = !(toggled[pageName])
          // this.$q.fullscreen.request()
        }
        this.$set(this, 'illustrating', toggled)
      }
    },
    data () {
      return {
        activeRecorderOffset: false,
        recording: {},
        illustrating: {},
        nextNarration: 0,

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
