<template>
  <q-page class="flex flex-center">

    <q-card v-for="a in TOC" v-bind:key="a.id">
      <q-card-media overlay-position="bottom" v-if="a.thumbnail">
        <img    :src="a.thumbnail" :alt="a.name">
        <q-card-title slot="overlay" >
          {{a.name}}&nbsp;
          <!--<span slot="subtitle">{{a.size}}</span>-->
        </q-card-title>
      </q-card-media>
      <q-card-main>
<!--        <div  v-if="a.media_info">
          <h6>Media Info:</h6>
          [{{ a.media_info.metadata.dimensions.width }}px x {{a.media_info.metadata.dimensions.height}}px]
        </div>-->
<!--        <audio
          controls
          :src="a.link"
          v-if="a.link">

        </audio>-->

      </q-card-main>
      <q-card-actions v-if="a['.tag'] === 'folder'" >
        <q-btn
          flat
          color="primary"
          label="play book"
          @click="playBook(a)"
        ></q-btn>


        <q-btn
          flat
          color="primary"
          :label="'Page ' + p "
          v-for="p in pageOrder(a)"
          v-if="p"
          v-bind:key="p"
          @click="playBookPage(a, p)"
        ></q-btn>

      </q-card-actions>
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

    <a id="authlink" :href="authURL" class="button">Authenticate</a>

    <q-input
      id="folder"
      v-model="folder"
      autofocus
      placeholder="folder"
    ></q-input>
    <q-btn @click="readDropboxFolder">Get</q-btn>
    <h4
      v-if="!isLoading"
    >
      Content:
    </h4>


  </q-page>
</template>

<style>
</style>

<script>
import { mixinSound } from '../components/mixinSound'

export default {
  name: 'Main',
  components: {},
  mixins: [ mixinSound ],
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
    readDropboxFolder () {
      let self = this
      let dbx = this.$dbx
      // /PlayItAgainKid/book1
      // TODO: if .has_more call /continue
      dbx.filesListFolder({
        path: this.folder,
        include_media_info: true,
        recursive: true
      })
        .then(function (response) {
          self.$store.dispatch('saveLevel', {
            folder: self.folder,
            response,
            dbx: self.$dbx
          })

          self.isLoading = false
          self.$set(self, 'contents', response.entries)
          console.dir(response)
          self.listItems(response.entries)
        })
        .catch(function (error) {
          console.error(error)
        })
    }
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
  }
}
</script>
