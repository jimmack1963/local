<template>
  <q-card v-model="folder" v-bind:key="folder.id">
    <q-card-media
      overlay-position="bottom"
      v-if="folder.thumbnail"
      @click.native.stop="carousel(folder)"
    >
      <img    :src="folder.thumbnail" :alt="folder.name">
      <q-card-title slot="overlay" >
        {{folder.name}}&nbsp;
        <!--<span slot="subtitle">{{folder.size}}</span>-->
      </q-card-title>
    </q-card-media>
    <q-card-title v-else>
      {{folder.name}}
      <span slot="subtitle">Take a selfie!</span>
    </q-card-title>


    <q-card-main><!--
      <div
        v-show="playingPage"
        ref="playingPage"
        class="pageIndicatorStart text-center"
        v-html="`<small>pg</small>&nbsp;<b><big>${playingPage}</big></b>`"
        animate-bounce></div>
    --></q-card-main>

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
</template>

<script>
export default {
  name: 'folderCardDisplay',
  props: ['folder'],
  data () {
    return {}
  },
  mounted () {
    window.jim = window.jim || {}
    window.jim.folderCard = this
  },
}
</script>

<style>
</style>
