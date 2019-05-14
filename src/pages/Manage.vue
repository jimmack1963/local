<template>
  <q-page padding class="row">
    <!--
        <folderCardDisplay :folder="activeFolder">
        </folderCardDisplay>
    -->
    <h3 class="col-12">{{activeFolder.name}}</h3>
    <q-card class="q-ma-sm">
      <q-card-media
        overlay-position="bottom"
        v-if="activeFolder.thumbnail"
      >
        <img :src="activeFolder.thumbnail" :alt="activeFolder.name">
        <q-card-title slot="overlay">
          {{activeFolder.name}}&nbsp;
          <!--<span slot="subtitle">{{folder.size}}</span>-->
        </q-card-title>
      </q-card-media>

      <q-card-main><!--
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


      --></q-card-main>
      <q-card-actions vertical align="center">
        <q-btn
          :label="$t('narrate multiple new pages')"
          @click="narrateBook(activeFolder)"
          flat
          icon="mic"
          color="primary"
        ></q-btn>
        <!--@click="narratePage(activeFolder, 'bulk', -1, 'bulk')"-->
        <q-btn
          :label="$t('Illustrate multiple new pages')"
          @click="$router.push('/Illustrate')"
          flat
          icon="add a photo"
          color="primary"
        ></q-btn>

        <q-btn
          :label="$t('Replace Selfie')"
          @click="replaceSelfie(activeFolder)"
          flat
          icon="label"
        ></q-btn>
<!--
  // TODO: fix rename
        <q-btn
          :label="$t('Rename')"
          @click="renameFolder(activeFolder)"
          flat
          icon="label"
        ></q-btn>

-->
        <q-btn
          :label="$t('Delete  Book')"
          @click="deleteFolder(activeFolder)"
          flat
          icon="delete"
        ></q-btn>
      </q-card-actions>
      <q-card-main>

        <RecordAudio
          v-if="activeNow['bulk']"
          v-on:completed="completedBulkNarration"
          :pageName="bulk.nextNarration"
        >
        </RecordAudio>
        <RecordCamcord
          v-if="illustrating['bulk']"
          v-on:completed="completedBulkIllustration"
          :pageName="bulk.nextIllustration"
          :quality="quality"
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
      <q-card-title v-if="!activeFolder.imageOrder[offset]">
        {{$t('Page')}} {{pageName}} ({{$t('No Image')}})
        <!--<span slot="subtitle"></span>-->
      </q-card-title>

      <q-card-actions vertical align="center">
        <q-btn
          :id="`narrate_${offset}`"
          :label="$t(activeRecorderOffset !== offset.toString() ?  'Narrate' : likelyAction)"
          @click="narratePage(activeFolder, pageName, offset)"
          v-if="!activeFolder.soundOrder[offset]"
          flat
          :icon="activeRecorderOffset !== offset.toString() ?  'mic' : likelyIcon"
          color="primary"
        ></q-btn>

        <q-btn
          :label="$t('play')"
          @click="playOnePage(activeFolder, pageName)"
          v-if="activeFolder.soundOrder[offset]"
          flat
          icon="play arrow"
          color="primary"
        ></q-btn>

        <q-btn
          :label="$t('erase recording')"
          @click="deleteBookSound(activeFolder, pageName)"
          v-if="activeFolder.soundOrder[offset]"
          flat
          icon="delete"
          color="primary"
        ></q-btn>

        <q-btn
          :label="$t('Illustrate')"
          @click="illustrate(activeFolder, pageName)"
          v-if="!activeFolder.imageOrder[offset]"
          flat
          icon="add a photo"
          color="primary"
        ></q-btn>
        <q-btn
          :label="$t('erase image')"
          @click="deleteBookImage(activeFolder, pageName)"
          v-if="activeFolder.imageOrder[offset]"
          flat
          icon="delete"
          color="primary"
        ></q-btn>
      </q-card-actions>

      <q-card-main>
        <RecordAudio
          :ref="`record_audio_${offset}`"
          v-if="activeNow[pageName]"
          :pageName="pageName"
          :start="true"
          :autoclose="true"
          :showButtons="false"
        >
        </RecordAudio>
        <!--v-on:autoclose="narrate(activeFolder, pageName, offset)"-->
        <RecordCamcord
          v-if="illustrating[pageName]"
          :pageName="pageName"
          :quality="quality"
        >
          Page {{pageName}}
        </RecordCamcord>
      </q-card-main>
    </q-card>


  </q-page>
</template>

<script>
  import {mixinDropbox} from '../components/mixinDropbox'
  import {mixinGeneral} from '../components/mixinGeneral'
  import {mixinSound} from '../components/mixinSound'
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
        let last = parseInt(this.bulk.nextNarration)
        if (isNaN(last)) {
          this.bulk.nextNarration += '.1'
        } else {
          this.bulk.nextNarration = last + 1
        }
      },
      playOnePage (activeFolder, pageName) {
        this.setDelayPlayNext(0)
        this.playBookPage(activeFolder, pageName)
      },
      completedBulkIllustration () {
        let last = parseInt(this.bulk.nextIllustration)
        if (isNaN(last)) {
          this.bulk.nextIllustration += '.1'
        } else {
          this.bulk.nextIllustration = last + 1
        }
      },
      narratePageAndroid (folder, pageName, offset, childName) {
        if (!this.activeRecorderOffset) {
          // start the recorder
          this.activeRecorderOffset = offset.toString()
          // only one at a time
          let toggled = {}
          if (!this.activeNow[pageName]) {
            toggled[pageName] = !(toggled[pageName])
          }
          this.$set(this, 'recording', toggled)
        }
        else {
          // close Recorder
          if (this.$refs['record_audio_' + (childName || offset.toString())]) {
            let child = this.$refs['record_audio_' + (childName || offset.toString())]
            if (child.length > 0) {
              child[0].doAction()
            }
          }
          else {
            if (window.jim_DEBUG_FULL) console.log('can not find record_audio_' + offset)
          }
          this.activeRecorderOffset = false
          this.$set(this, 'recording', {})
        }
      },
      illustrate (folder, pageName) {
        this.$router.push('/Illustrate/' + pageName)
      },
      illustrateLocal (folder, pageName) {
        // only one at a time
        let toggled = {}
        if (!this.illustrating[pageName]) {
          toggled[pageName] = !(toggled[pageName])
          // this.$q.fullscreen.request()
        }
        this.$set(this, 'illustrating', toggled)
      },
    },
    data () {
      return {
        activeNow: {},
        activeRecorderOffset: false,
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
