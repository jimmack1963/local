<template>
  <q-page padding class="row items-start flex flex-start">
    <div v-if="!access_token">
      <h1>{{title}}</h1>
      <p v-html="$t('intro_function')"></p>

      <div class="col-12 text-center">
        <a class="flex-center button" id="authlink" :href="authURL" >
          {{$t('Authenticate with Dropbox')}}: <img src="/statics/Dropbox.svg" alt="">
        </a>
      </div>
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

    <q-card class="card-itself col-5 q-mr-md" v-for="folder in TOCSorted" v-bind:key="folder.id" v-if="access_token && (!activeFolder || activeFolder.id === folder.id )">
      <q-card-media
        overlay-position="bottom"
        v-if="folder.thumbnail"
        @click.native.stop="carousel(folder)"
      >
        <!--<q-parallax :height="100"   :src="playing.length > 0 ? folder.imageOrder[activeScene] || folder.thumbnail : folder.thumbnail" :alt="folder.name"></q-parallax>-->
        <img
          class="book-on-card"
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


      <q-card-main>
        <div
          v-show="playingPage"
          ref="playingPage"
          class="pageIndicatorStart text-center"
          v-html="`<small>pg</small>&nbsp;<b><big>${playingPage}</big></b>`"
          animate-bounce></div>
      </q-card-main>

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
              <q-item-main>
                <q-item-tile label>
                  {{$t('Illustrate')}}
                </q-item-tile>
              </q-item-main>
            </q-item>
            <q-item
              @click.native="narrateBook(folder)"
            >
              <q-item-main>
                <q-item-tile label>
                  {{$t('Narrate')}}
                </q-item-tile>
              </q-item-main>
            </q-item>
            <q-item
              @click.native="manage(folder)"
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

        <!--
                <q-btn
                  flat
                  color="primary"
                  label="Take Selfie"
                  @click="selfie(folder)"
                  v-if="!folder.thumbnail"
                ></q-btn>

                <q-btn
                  flat
                  color="primary"
                  label="carousel"
                  @click="carousel(folder)"
                  v-if="pageCount(folder) > 0"
                ></q-btn>

        <q-btn
          flat
          color="primary"
          label="play All"
          @click="playBook(folder)"
          v-if="pageCount(folder) > 0"
        ></q-btn>

<q-btn
          flat
          color="primary"
          :label="p"
          v-for="p in pageOrder(folder)"
          v-if="p"
          v-bind:key="p"
          @click="playBookPage(folder, p)"
        ></q-btn>

        <q-btn
          flat
          color="secondary"
          label="Illustrate"
          @click="record(folder)"

        ></q-btn>
        <q-btn
          flat
          color="secondary"
          label="Narrate"
          @click="narrateBook(folder)"

        ></q-btn>
        <q-btn
          flat
          color="secondary"
          label="Manage"
          @click="manage(folder)"

        ></q-btn>



        <q-btn
          flat
          color="primary"
          label="continue play"
          @click="continuePlaying(folder)"
          v-if="pageCount(folder) > 0"
        ></q-btn>

        -->

      </q-card-actions>

      <!--if sound-->
      <q-card-actions v-if="folder.ext === 'mp3'">
        <q-btn
          v-if="savedEntry(folder).howl"
          flat
          color="primary"
          :label="$t('play')"
          @click="play(folder)"
        ></q-btn>
      </q-card-actions>
      <q-card-actions v-if="folder.ext === 'png' && !folder.thumbnail">
        <q-btn
          flat
          color="primary"
          :label="$t('view')"
          @click="view(folder)"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>


  @media (orientation: portrait) {
    .book-on-card {
      width: auto;
      height: auto;
      min-width: 100%;
      max-width: 100%;
      min-height: 100%;
      max-height: 100%;
    }

    .card-itself {
      width: 100%;
      margin-bottom: 0.3em;
    }
  }

  @media (orientation: landscape) {
    .book-on-card {
      width: auto;
      height: auto;
      min-width: 100%;
      max-width: 100%;
      min-height: 100%;
      max-height: 100%;
    }

    .card-itself {
      width: 49%;
      margin-right: 0.3em;
      margin-bottom: 0.3em;
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

  export default {
    name: 'Main',
    components: {},
    mixins: [mixinGeneral, mixinSound],
    methods: {
      savedEntry (returnedEntry) {

        let found = this.ids[returnedEntry.id]
        return found
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
      }
    },
    mounted () {
      window.jim = window.jim || {}
      window.jim.main = this
      if (Object.keys(this.TOC).length < 1) {
        this.readDropboxFolder()
      }
    },
  }
</script>
