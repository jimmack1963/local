<template>
  <q-card v-model="folder" v-bind:key="folder.id">
    <q-card-media
      overlay-position="bottom"
      v-if="folder.thumbnail"
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
