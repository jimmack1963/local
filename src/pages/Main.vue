<template>
  <q-page padding class="flex flex-center">
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

    <q-card class="q-ma-sm" v-for="folder in TOC" v-bind:key="folder.id">
      <q-card-media
        overlay-position="bottom"
        v-if="folder.thumbnail"
        @click.native.stop="carousel(folder)"
      >
        <img    :src="folder.imageOrder[activeScene] || folder.thumbnail" :alt="folder.name">
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
          label="Record"
          @click="record(folder)"

        ></q-btn>
        <q-btn
          flat
          color="secondary"
          label="illustrate"
          @click="illustrate(folder)"

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

    <div v-if="access_token">

      <q-field
        class="col-xs-12 q-mx-sm"
    label="Create a book titled:">
    <q-input autofocus id="bookTitle" v-model="bookTitle"></q-input>
    </q-field>
      <!-- TODO: should this be a card for consistency? -->
    <q-btn color="primary" v-if="camera" :disable="!bookTitle" @click="startBook(bookTitle)"> Take a selfie with the book and your kid
    </q-btn>
    </div>

<!--    <q-input
      id="folder"
      v-model="folder"
      autofocus
      placeholder="folder"
    ></q-input>

    <q-btn @click="readDropboxFolder">Get</q-btn>
    -->

  </q-page>
</template>

<style>
  /*
  .pageIndicatorLeave {
    font-size: 1em;
    font-weight: bolder;
    position: absolute;
    top: 40%;
    height: 100%;
    width: 100%;
    z-index: 100;
  }
  */

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
    listItems (items) {
      console.dir(items)
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
