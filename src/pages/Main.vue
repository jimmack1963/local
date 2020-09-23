<style>
img {
  xxpointer-events: none;
}

.unselectable3 {
}

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.camera-landscape {
  height: 60vh !important;
  width: auto !important;
}

.camera-portrait {
  height: auto !important;
  width: 100vw !important;
}

@media (orientation: portrait) {
  .vid {

  }

  .media-on-card {
    height: 60%;
  }

  .book-on-card {
    width: auto;
    height: auto;
  }

  .card-itself {
    width: 100%;
    margin-bottom: 0.3em;
    /*height: 40vh !important;*/
  }

  .camFeedback {
    max-height: 60vh;
  }
}

@media (orientation: landscape) {
  .camFeedback {
    max-height: 90vh;
  }

  .media-on-card {
    height: 60vh;
  }

  .book-on-card {
    width: auto;
    height: auto;
  }

  .card-itself {
    width: 49%;
    margin-right: 0.3em;
    margin-bottom: 0.3em;
    /*height: 80vh !important;*/
  }
}

.pageIndicatorStart {
  font-size: 4em;
  /*font-weight: bolder;*/
  /*position: absolute;*/
  position: fixed;
  top: 10%;
  /*height: 50px;*/
  /*width: 100%;*/
  z-index: 100;
}
</style>

<template>
  <q-page
    class="row items-start flex flex-start justify-center"
    padding>

    <!--<div v-if="devFeedback" class="col-12"></div>-->

    <div v-if="!access_token" class="row col-12 justify-center">

      <span class="text-center col-12">Overview Video:</span>

      <q-video
        class="flex-center"
        src="https://youtube.com/embed/8o_5JZJc7j4"
      />

      <div
        class="col-12"
      > &nbsp;

      </div>

      <q-btn
        id="authlink"
        :label="$t('Login with Dropbox')"
        class="text-center col-2 col-xs-6 col-sm-4"
        color="primary"
        @click="openURL(authURL)"
      >
        <img alt="" class="col-12" src="/statics/Dropbox.svg">
      </q-btn>

      <p class="q-mt-sm" v-html="$t('whole idea').replace('Play It Again Kid', title)"></p>

      <span class="text-center col-12">Create a book:</span>
      <q-video
        class="flex-center" src="https://youtube.com/embed/i0k7DuqAwv4"/>

      <p class="q-mt-sm col-12" v-html="$t('intro_function')"></p>

      <br><br>
      <p v-html="$t('intro_signin')"></p>
      <br>


      <!--
      <iframe src="https://youtube.com/embed/i0k7DuqAwv4" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              frameborder="0"
              height="315"
              width="560">
      </iframe>
      -->
      <br>
      {{ $t('intro_disclaimer') }}
    </div>

    <q-card v-if="access_token && TOCSorted.length === 0" id="new-card"
            class="card-itself col-xs-12 col-sm-6 col-md-4 col-lg-2 ">
      <q-card-section>{{ $t('Make your first book') }}</q-card-section>
      <q-card-section v-html="$t('first_book_intro')">

      </q-card-section>

    </q-card>




    <q-card
      v-for="(folder, offset) in TOCSorted"
      v-if="access_token && (!activeFolder || activeFolder.id === folder.id )"
      v-bind:key="folder.id"
      class="col-xs-12 col-sm-6 col-md-4 col-lg-2 "
    >
      <q-card-section
        overlay-position="bottom"
        @mousedown.native="mouseDown($event, folder)"
        @mouseup.native="mouseUp($event, folder)"
      >
        <!--
        v-if="folder.thumbnail"
        <q-parallax :height="100"   :src="playing.length > 0 ? folder.imageOrder[activeScene] || folder.thumbnail : folder.thumbnail" :alt="folder.name"></q-parallax>-->
        <q-img
          :id="'folder_' + offset"
          :alt="folder.name"
          :src="playing.length > 0 ? folder.imageOrder[activeScene] || folder.thumbnail : folder.thumbnail"
          basic
        >


          <div class="absolute-bottom text-subtitle2 text-center">
            {{ folder.name }}&nbsp;
          </div>
        </q-img>
        <!--
                class="media-on-card" -- section
                  class="book-on-card" -- image
                <q-card-section slot="overlay">
                </q-card-section>
        -->
      </q-card-section>

      <!--
            <q-card-section v-else>
              {{folder.name}}
              <span slot="subtitle">Take a selfie!</span>
            </q-card-section>
      -->

      <q-card-section v-show="playingPage">
        <div

          ref="playingPage"
          animate-bounce
          class="pageIndicatorStart text-center"
          v-html="`<small>pg</small>&nbsp;<b><big>${playingPage}</big></b>`"></div>
      </q-card-section>
      <div v-if="!locked">
        <!--if book (folder)-->
        <q-card-actions v-if="folder['.tag'] === 'folder'">

          <q-btn-dropdown
            :label="$t('Playing')"
            auto-close
            class="q-mr-sm"
            color="primary"
            dense
            no-caps
          >
            <q-list dense>
              <q-item
                v-if="!folder.thumbnail"
                @click.native="selfie(folder)"
              >
                <q-item-label header>
                  Take Selfie
                </q-item-label>
              </q-item>
              <q-item
                v-if="pageCount(folder) > 0"
                @click.native="carousel(folder)"
              >
                <q-item-label header>{{ $t('Carousel') }}</q-item-label>
              </q-item>

              <q-item
                v-if="pageCount(folder) > 0"
                @click.native="playBook(folder)"
              >
                <q-item-label header>
                  {{ $t('Play All') }}
                </q-item-label>
              </q-item>

              <q-item
                v-for="p in pageOrder(folder)"
                v-if="p"
                v-bind:key="p"
                dense
                @click.native="playBookPage(folder, p, true)"
              >
                <q-item-label header>{{ $t('Page') }} {{ p }}</q-item-label>
              </q-item>

            </q-list>

          </q-btn-dropdown>

          <q-btn-dropdown
            v-if="folder.source !== 'demos/'"
            :label="$t('Creating')"
            auto-close
            class="q-mr-sm"
            color="secondary"
            dense

            no-caps>
            <q-list link>
              <q-item
                @click.native="record(folder)"
              >

                <q-item-section avatar>
                  <q-icon name="add_a_photo"/>
                </q-item-section>

                <q-item-label header>
                  {{ $t('Illustrate') }}
                </q-item-label>
              </q-item>
              <q-item
                @click.native="narrateBook(folder)"
              >
                <q-item-section avatar>
                  <q-icon name="mic"/>
                </q-item-section>

                <q-item-label header>
                  {{ $t('Narrate') }}
                </q-item-label>
              </q-item>
              <q-item
                @click.native="manage_UI(folder)"
              >
                <q-item-section avatar>
                  <q-icon name="dashboard"/>
                </q-item-section>

                <q-item-label header>
                  {{ $t('Manage') }}
                </q-item-label>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            v-if="(pageCount(folder) > 0) && (playing.length > 0)"
            :label="$t('Silence')"
            color="secondary"
            flat
            icon="stop"
            @click="endHowlPlay(folder)"
          ></q-btn>


        </q-card-actions>
        <!--if sound-->
        <q-card-actions v-if="folder.ext === 'mp3'">
          <q-btns
            v-if="savedEntry(folder).howl"
            :label="$t('play')"
            color="primary"
            flat
            @click="play(folder)"
          ></q-btns>
        </q-card-actions>
        <q-card-actions v-if="folder.ext === 'png' && !folder.thumbnail">
          <q-btn
            :label="$t('view')"
            color="primary"
            flat
            @click="view(folder)"
          ></q-btn>
        </q-card-actions>
      </div>
    </q-card>
    <div class="col-12">
    &#169; Copyright 2018, 2019, 2020  James R. Mack, Jr.  All Rights Reserved
      <a href='https://ko-fi.com/D1D31W2QH' target='_blank'><img alt='Buy Me a Coffee at ko-fi.com' border='0' height='36' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' style='border:0px;height:36px;' /></a>
  </div>
  </q-page>
</template>

<script>
import {mixinSound} from '../components/mixinSound'
import {mixinGeneral} from '../components/mixinGeneral'
import {openURL} from 'quasar'
import {mapState} from 'vuex'

export default {
  name: 'Main',
  components: {},
  mixins: [mixinGeneral, mixinSound],
  methods: {
    async explore () {
      this.$store.dispatch('getDevices')
    },
    mouseDown (event, folder) {

      console.log('*********************** mouseDown')

      // event.target.unselectable = true
      let vue = this
      vue.pendingFolder = folder
      vue.pendingTimeMark = new Date()
    },
    mouseUp (event, folder) {
      console.log('*********************** mouseUp')
      let vue = this
      let diff = new Date() - vue.pendingTimeMark
      if (diff < 1000) {
        vue.$store.commit('delayPlayNext', 0)
        console.log('********************************************** Started play one ' + diff)
      }
      else {
        vue.$store.commit('delayPlayNext', 2000)
        console.log('********************************************** Changed to play after 2 seconds ' + diff)
      }

      vue.carousel(vue.pendingFolder)

    },
    handlePress (event, folder) {
      let vue = this

      if (event.duration < 1000) {
        vue.$store.commit('delayPlayNext', 0)
        console.log(event.duration + ' ********************************************** Started play one')
      }
      else {
        vue.$store.commit('delayPlayNext', 2000)
        console.log(
          event.duration + ' ********************************************** Changed to play after 2 seconds')
      }

    },
    handlePress2 (folder) {
      let vue = this
      return function (event) {
        vue.pendingFolder = folder

        vue.pendingTimeMark = setTimeout(function () {
          console.log('Timer went off')
          // vue.carousel(vue.pendingFolder)
          vue.pendingTimeMark = false
        }, 1000)

        if (event.duration < 1000) {
          vue.$store.commit('delayPlayNext', 0)
          console.log('********************************************** Started play one')
        }
        else {
          vue.$store.commit('delayPlayNext', 2000)
          console.log('********************************************** Changed to play after 2 seconds')
        }

        console.log(`********************************************** ${event.evt} @ ${event.duration}`)
      }
    },
    openURL (url) {
      openURL(url)
    },
    savedEntry (returnedEntry) {
      return this.ids[returnedEntry.id]
    },
    play (entry) {

      let howlable = this.savedEntry(entry)
      if (howlable) {

        howlable.howl.play()
      }
      else {
        if (window.jim_DEBUG_FULL) console.log('Can not play!')
      }
    },
    view (entry) {

      this.$dbx.filesGetThumbnail({path: entry.path_lower, size: this.thumbnailSize})
        .then((response) => {

          console.log(response.fileBlob.size)

          this.$set(entry, 'thumbnail', window.URL.createObjectURL(response.fileBlob))
        })
        .catch((error) => {

          if (window.jim_DEBUG_FULL) console.log('ERROR:')
          console.log(error)
        })
    },
  },
  computed: {
    ...mapState({
      devices: state => state.sounds.devices,
    }),
    authURL () {
      return this.$authURL
    },
  },
  data () {
    return {
      contents: [],
      folder: '',
      folder3: '',
      isLoading: true,
      pendingFolder: false,
      pendingTimeMark: false,
    }
  },
  mounted () {
    let vue = this
    window.jim = window.jim || {}
    window.jim.main = this
    this.explore()
    if (Object.keys(this.TOC).length < 1) {
      this.readDropboxFolder()
    }
    window.oncontextmenu = function (event) {
      console.log('******** skipped onContextMenu')
      event.preventDefault()
      // event.stopPropagation()

      vue.$store.commit('delayPlayNext', 2000)
      console.log('********************************************** Changed to play all on context menu ')

      let targetID = event.target.id || event.target.parentElement.id || event.target.parentElement.parentElement.id
      let parted = targetID.split('_')
      let offset = parseInt(parted[1])
      vue.pendingFolder = vue.pendingFolder || vue.TOCSorted[offset]

      vue.carousel(vue.pendingFolder)

    }
  },
}
</script>
