<template>
  <q-card v-model="folder" v-bind:key="folder.id">
    <q-card-section
      overlay-position="bottom"
      v-if="folder.thumbnail"
    >
      <img    :src="folder.imageOrder[activeScene] || folder.thumbnail" :alt="folder.name">
      <q-card-section slot="overlay" >
        {{folder.name}}&nbsp;
        <!--<span slot="subtitle">{{folder.size}}</span>-->
      </q-card-section>
    </q-card-section>
    <q-card-section v-else>
      {{folder.name}}
      <span slot="subtitle">Take a selfie!</span>
    </q-card-section>


  </q-card>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'

export default {
  mixins: [ mixinGeneral ],
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
