<template>
  <q-page class="flex flex-center">
    <h1>&nbsp;</h1>

    <q-card v-for="a in TOC" v-bind:key="a.id">
      <q-card-media overlay-position="bottom" v-if="a.thumbnail">
        <img    :src="a.thumbnail" :alt="a.name">
        <q-card-title slot="overlay" >
          {{a.name}}&nbsp;
          <!--<span slot="subtitle">{{a.size}}</span>-->
        </q-card-title>
      </q-card-media>
      <q-card-title v-else>
        {{a.name}}
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
      <q-card-actions v-if="a['.tag'] === 'folder'" >
        <q-btn
          flat
          color="primary"
          label="Take Selfie"
          @click="selfie(a)"
          v-if="!a.thumbnail"
        ></q-btn>

        <q-btn
          flat
          color="primary"
          label="carousel"
          @click="carousel(a)"
          v-if="pageCount(a) > 0"
        ></q-btn>
        <q-btn
          flat
          color="primary"
          label="play All"
          @click="playBook(a)"
          v-if="pageCount(a) > 0"
        ></q-btn>
        <q-btn
          flat
          color="secondary"
          label="Silence"
          @click="endHowlPlay(a)"
          v-if="pageCount(a) > 0"
        ></q-btn>


        <q-btn
          flat
          color="primary"
          :label="p"
          v-for="p in pageOrder(a)"
          v-if="p"
          v-bind:key="p"
          @click="playBookPage(a, p)"
        ></q-btn>
        <q-btn
          flat
          color="primary"
          label="continue"
          @click="continuePlaying(a)"
          v-if="pageCount(a) > 0"
        ></q-btn>

      </q-card-actions>

      <!--if sound-->
      <q-card-actions v-if="a.ext === 'mp3'">
        <q-btn
          v-if="savedEntry(a).howl"
          flat
          color="primary"
          label="play"
          @click="play(a)"
        ></q-btn>
      </q-card-actions>
      <q-card-actions v-if="a.ext === 'png' && !a.thumbnail">
        <q-btn
          flat
          color="primary"
          label="view"
          @click="view(a)"
        ></q-btn>
      </q-card-actions>
    </q-card>

    <a v-if="!uid" id="authlink" :href="authURL" class="button">Authenticate</a>

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
