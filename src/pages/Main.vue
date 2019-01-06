<template>
  <q-page padding class="row items-start flex flex-start">
    <div v-if="!access_token">
      <h1>{{title}}</h1>
      We help you {{verb}} books for your loved ones, however they may be behaving currently.
      This version used DropBox to store images and recordings.  Specifically, it uses <em>your</em> DropBox account,
      making a folder called \Apps\PlayItAgainKid.    It's your own disk in the cloud, easy to copy anywhere.

      This means you always will have your originals, and that we never even see anything you create.
      <br><br>
      <a id="authlink" :href="authURL" class="button">Authenticate with Dropbox</a>
      <br><br>
      If you are not a current user, you may want to sign up on <a href="https://www.dropbox.com/register" targt="_blank">their site first</a>.  Or, install their app.
      <br>

      {{hostname}}  is not affiliated with or otherwise sponsored by Dropbox, Inc.
    </div>

    <q-card class="card-itself col-lg-4 col-xs-12" v-if="TOCSorted.length === 0" >
      <q-card-title>Make your first Book</q-card-title>
      <q-card-main>
        <p>The menu at the left has an entry, "Make a new book." </p>

        <p>You can open the menu, if it is closed, by hitting the icon
          <q-icon name="menu"></q-icon>
        </p>

          <p>To take a picture, when you can see the camera active on the screen, you can take a picture by hitting anywhere on the screen.  You can always replace it if you want a second chance.</p>
      </q-card-main>

    </q-card>

    <q-card class="card-itself" v-for="folder in TOCSorted" v-bind:key="folder.id">
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
        <q-card-title slot="overlay" >
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
      <q-card-actions v-if="folder['.tag'] === 'folder'" >
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
          color="secondary"
          label="Silence"
          @click="endHowlPlay(folder)"
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
          color="primary"
          label="continue play"
          @click="continuePlaying(folder)"
          v-if="pageCount(folder) > 0"
        ></q-btn>

        <q-btn
          flat
          color="secondary"
          label="Create"
          @click="record(folder)"

        ></q-btn>
        <q-btn
          flat
          color="secondary"
          label="Manage"
          @click="manage(folder)"

        ></q-btn>

      </q-card-actions>

      <!--if sound-->
      <q-card-actions v-if="folder.ext === 'mp3'">
        <q-btn
          v-if="savedEntry(folder).howl"
          flat
          color="primary"
          label="play"
          @click="play(folder)"
        ></q-btn>
      </q-card-actions>
      <q-card-actions v-if="folder.ext === 'png' && !folder.thumbnail">
        <q-btn
          flat
          color="primary"
          label="view"
          @click="view(folder)"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style>


  @media (orientation: portrait) {
    .book-on-card {
      height: 40vh;
      width: 60vw;
    }
    .card-itself {
      width: 100%;
      margin-bottom: 0.3em;
    }
  }
  @media (orientation: landscape) {
    .book-on-card {
      height: 40vh;
      width: 60vw;
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
  mixins: [ mixinGeneral, mixinSound ],
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
      this.$dbx.filesGetThumbnail({path: entry.path_lower})
        .then((response) => {

          console.log(response.fileBlob.size)

          this.$set(entry, 'thumbnail', window.URL.createObjectURL(response.fileBlob))
          // TODO: save these blobs, they are not that large.
          /* let img = document.createElement('img')
          img.src = window.URL.createObjectURL(response.fileBlob)
          document.body.appendChild(img) */
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
    }
  },
  data () {
    return {
      contents: [],
      folder: '',
      folder3: '',
      isLoading: true
    }
  },
  mounted () {
    window.jim = window.jim || {}
    window.jim.main = this
    if (Object.keys(this.TOC).length < 1) {
      this.readDropboxFolder()
    }
  }
}
</script>
