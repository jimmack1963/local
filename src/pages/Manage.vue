<template>
  <q-page padding class="row">
    <!--
        <folderCardDisplay :folder="activeFolder">
        </folderCardDisplay>
    -->
    <h3 class="col-12">{{activeFolder.name}}</h3>
    <q-card class="q-ma-sm">
      <q-card-main>
        <h4>Quick Recording New Pages</h4>
        <q-field
          label="Next Illustration:"
        >
          <q-input
            v-model="bulk.nextIllustration"
          >

          </q-input>
        </q-field>
        <q-field
          label="Next Narration:"
        >
          <q-input
            v-model="bulk.nextNarration"
          >

          </q-input>
        </q-field>


      </q-card-main>
      <q-card-actions vertical align="center">
        <q-btn
          flat
          icon="mic"
          color="primary"
          label="narrate"
          @click="narrate(activeFolder, 'bulk')"
        ></q-btn>

        <q-btn
          flat
          icon="add a photo"
          color="primary"
          label="Illustrate"
          @click="illustrate(activeFolder, 'bulk')"
        ></q-btn>
      </q-card-actions>
      <q-card-main>

        <RecordAudio
          v-if="recording['bulk']"
          v-on:completed="completedBulkNarration"
          :pageName="bulk.nextNarration"
        >
        </RecordAudio>
        <RecordCamcord
          v-if="illustrating['bulk']"
          v-on:completed="completedBulkIllustration"
          :pageName="bulk.nextIllustration"
          :quality="0.5"
        >
          Page {{bulk.nextIllustration}}
        </RecordCamcord>

      </q-card-main>
    </q-card>

    <q-card class="q-ma-sm" v-for="(pageName, offset) in activeFolder.pageOrder" v-bind:key="pageName">
      <q-card-media
        overlay-position="bottom"
        v-show="activeFolder.imageOrder[offset]"
      >
        <img :src="activeFolder.imageOrder[offset]" :alt="'Image #' + offset">
        <q-card-title slot="overlay">
          {{pageName}}
          <!--<span slot="subtitle"></span>-->
        </q-card-title>
      </q-card-media>
      <q-card-title v-show="!activeFolder.imageOrder[offset]">
        Page {{pageName}} (No Image)
        <!--<span slot="subtitle"></span>-->
      </q-card-title>

      <q-card-actions vertical align="center">
        <q-btn
          flat
          icon="mic"
          color="primary"
          label="narrate"
          @click="narrate(activeFolder, pageName)"
        ></q-btn>

        <q-btn
          v-if="activeFolder.soundOrder[offset]"
          flat
          icon="play arrow"
          color="primary"
          label="play"
          @click="setDelayPlayNext(0); playBookPage(activeFolder, pageName)"
        ></q-btn>

        <q-btn
          flat
          icon="add a photo"
          color="primary"
          label="Illustrate"
          @click="illustrate(activeFolder, pageName)"
        ></q-btn>
      </q-card-actions>

      <q-card-main>
        <RecordAudio
          v-if="recording[pageName]"
          :pageName="pageName"
          :start="true"
          :autoclose="true"
          v-on:autoclose="narrate(activeFolder, pageName)"
        >
        </RecordAudio>
        <RecordCamcord
          v-if="illustrating[pageName]"
          :pageName="pageName"
          :quality="0.5"
        >
          Page {{pageName}}
        </RecordCamcord>
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
        this.bulk.nextNarration += 1
      },
      completedBulkIllustration () {
        this.bulk.nextIllustration += 1
      },
      narrate (folder, pageName) {
        debugger
        // only one at a time
        let toggled = {}
        if (!this.recording[pageName]) {
          toggled[pageName] = !(toggled[pageName])
        }
        this.$set(this, 'recording', toggled)
      },
      illustrate (folder, pageName) {
        // only one at a time
        let toggled = {}
        if (!this.illustrating[pageName]) {
          toggled[pageName] = !(toggled[pageName])
          debugger
          this.$q.fullscreen.request()
        }
        this.$set(this, 'illustrating', toggled)
      },
    },
    data () {
      return {
        recording: {},
        illustrating: {},
        bulk: {
          nextNarration: 0,
          nextIllustration: 0,
        },
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.manage = this

      this.bulk.nextNarration = parseInt(this.activeFolder.pageOrder[this.activeFolder.pageOrder.length - 1]) + 1 || 0
      this.bulk.nextIllustration = this.bulk.nextNarration || 0
    },
    name: 'manage',
  }
</script>

<style>
</style>
