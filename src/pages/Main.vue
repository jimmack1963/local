<template>
  <q-page
    padding
    class="row items-start flex flex-start">

    <div class="row" v-if="!access_token">
      <h1>{{title}}</h1>

      <q-btn
        class="col-6 offset-3 text-center shadow-6 q-mb-md"
        color="primary"
        id="authlink"
        :label="$t('Login with Dropbox')"
        @click="openURL(authURL)"
      >
        <img class="col-12" src="/statics/Dropbox.svg" alt="">
      </q-btn>

      <p v-html="$t('whole idea')"></p>
      <p v-html="$t('intro_function')"></p>

      <br><br>
      <p v-html="$t('intro_signin')"></p>
      <br>
      {{$t('intro_disclaimer')}}
    </div>

    <q-card class="card-itself col-lg-4 col-xs-12" v-if="access_token && TOCSorted.length === 0">
      <q-card-title>{{$t('Make your first book')}}</q-card-title>
      <q-card-main v-html="$t('first_book_intro')">

      </q-card-main>

    </q-card>

    <q-card class="card-itself col-lg-2 col-5 q-mr-md" v-for="(folder, offset) in TOCSorted" v-bind:key="folder.id"

            v-if="access_token && (!activeFolder || activeFolder.id === folder.id )">
      <q-card-media
        class="media-on-card"
        overlay-position="bottom"
        v-if="folder.thumbnail"
        @mousedown.native="mouseDown($event, folder)"
        @mouseup.native="mouseUp($event, folder)"

      >
        <!--<q-parallax :height="100"   :src="playing.length > 0 ? folder.imageOrder[activeScene] || folder.thumbnail : folder.thumbnail" :alt="folder.name"></q-parallax>-->
        <img
          class="book-on-card"
          :id="'folder_' + offset"
          :src="playing.length > 0 ? folder.imageOrder[activeScene] || folder.thumbnail : folder.thumbnail"
          :alt="folder.name">
        <q-card-title slot="overlay">
          {{folder.name}}&nbsp;
          <!--<span slot="subtitle">{{folder.size}}</span>-->
        </q-card-title>
      </q-card-media>

      <q-card-title v-else>
        {{folder.name}}
        <span slot="subtitle">Take a selfie!</span>
      </q-card-title>

      <q-card-main v-show="playingPage">
        <div

          ref="playingPage"
          class="pageIndicatorStart text-center"
          v-html="`<small>pg</small>&nbsp;<b><big>${playingPage}</big></b>`"
          animate-bounce></div>
      </q-card-main>
      <div v-if="!locked">
        <!--if book (folder)-->
        <q-card-actions v-if="folder['.tag'] === 'folder'">

          <q-btn-dropdown color="primary" :label="$t('Playing')" class="q-mr-sm">
            <q-list link>
              <q-item
                @click.native="selfie(folder)"
                v-if="!folder.thumbnail"
              >
                <q-item-main>
                  <q-item-tile label>
                    Take Selfie
                  </q-item-tile>
                </q-item-main>
              </q-item>
              <q-item
                @click.native="carousel(folder)"
                v-if="pageCount(folder) > 0"
              >
                <q-item-main>
                  <q-item-tile label>
                    {{$t('Carousel')}}
                  </q-item-tile>
                </q-item-main>
              </q-item>

              <q-item
                @click.native="playBook(folder)"
                v-if="pageCount(folder) > 0"
              >
                <q-item-main>
                  <q-item-tile label>
                    {{$t('Play All')}}
                  </q-item-tile>
                </q-item-main>
              </q-item>

              <q-item
                v-for="p in pageOrder(folder)"
                v-if="p"
                v-bind:key="p"
                @click.native="playBookPage(folder, p, true)"
              >
                <q-item-main>
                  <q-item-tile label>
                    {{$t('Page')}} {{p}}
                  </q-item-tile>
                </q-item-main>
              </q-item>

            </q-list>

          </q-btn-dropdown>

          <q-btn-dropdown color="primary" :label="$t('Creating')" class="q-mr-sm">
            <q-list link>
              <q-item
                @click.native="record(folder)"
              >
                <q-item-side icon="add a photo">

                </q-item-side>
                <q-item-main>
                  <q-item-tile  label>
                    {{$t('Illustrate')}}
                  </q-item-tile>
                </q-item-main>
              </q-item>
              <q-item
                @click.native="narrateBook(folder)"
              >
                <q-item-side icon="mic">

                </q-item-side>
                <q-item-main>
                  <q-item-tile  label>
                    {{$t('Narrate')}}
                  </q-item-tile>
                </q-item-main>
              </q-item>
              <q-item
                @click.native="manage_UI(folder)"
              >
                <q-item-main>
                  <q-item-tile label>
                    {{$t('Manage')}}
                  </q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            flat
            color="secondary"
            icon="stop"
            :label="$t('Silence')"
            @click="endHowlPlay(folder)"
            v-if="(pageCount(folder) > 0) && (playing.length > 0)"
          ></q-btn>


        </q-card-actions>
        <!--if sound-->
        <q-card-actions v-if="folder.ext === 'mp3'">
          <q-btns
            v-if="savedEntry(folder).howl"
            flat
            color="primary"
            :label="$t('play')"
            @click="play(folder)"
          ></q-btns>
        </q-card-actions>
        <q-card-actions v-if="folder.ext === 'png' && !folder.thumbnail">
          <q-btn
            flat
            color="primary"
            :label="$t('view')"
            @click="view(folder)"
          ></q-btn>
        </q-card-actions>
      </div>
    </q-card>
  </q-page>
</template>

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

<script>
  import { mixinSound } from '../components/mixinSound'
  import { mixinGeneral } from '../components/mixinGeneral'
  import { openURL } from 'quasar'

  export default {
    name: 'Main',
    components: {},
    mixins: [mixinGeneral, mixinSound],
    methods: {
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
        if (diff < 100) {
          vue.$store.commit('delayPlayNext', 0)
          console.log('********************************************** Started play one ' + diff)
        } else {
          vue.$store.commit('delayPlayNext', 2000)
          console.log('********************************************** Changed to play after 2 seconds ' + diff)
        }

        vue.carousel(vue.pendingFolder)

      },
      handlePress (event, folder) {
        let vue = this

        if (event.duration < 100) {
          vue.$store.commit('delayPlayNext', 0)
          console.log(event.duration + ' ********************************************** Started play one')
        } else {
          vue.$store.commit('delayPlayNext', 2000)
          console.log(event.duration + ' ********************************************** Changed to play after 2 seconds')
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

          if (event.duration < 100) {
            vue.$store.commit('delayPlayNext', 0)
            console.log('********************************************** Started play one')
          } else {
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
        } else {
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
      if (Object.keys(this.TOC).length < 1) {
        this.readDropboxFolder()
      }
      window.oncontextmenu = function (event) {
        console.log('******** skipped onContextMenu')
        event.preventDefault()
        // event.stopPropagation()

        vue.$store.commit('delayPlayNext', 2000)
        console.log('********************************************** Changed to play all on context menu ')

        let targetID = event.target.id
        let parted = targetID.split('_')
        let offset = parseInt(parted[1])
        vue.pendingFolder = vue.TOCSorted[offset]

        vue.carousel(vue.pendingFolder)

      }
    },
  }
</script>
