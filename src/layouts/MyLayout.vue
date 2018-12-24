<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header @click.native.stop="home">
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Play It Again, Kid
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >

<!--        <q-item to="/selfie" >
          <q-item-side icon="add a photo" />
          <q-item-main label="Selfie" sublabel="You, the book, your kid" />
        </q-item>

        <q-item to="/carousel" >
          <q-item-side icon="playlist_play" />
          <q-item-main label="Carousel" sublabel="See the pages" />
        </q-item>-->

        <q-list-header>Essential Links</q-list-header>
        <q-item to="/selfie" >
          <q-item-side icon="add a photo" />
          <q-item-main label="Selfie" sublabel="You, the book, your kid" />
        </q-item>

        <q-item @click.native="setDelayPlayNext(1)">
          <q-item-side icon="playlist_play" />
          <q-item-main label="Play All" sublabel="Continue to end of book" />
        </q-item>

        <q-item @click.native="setDelayPlayNext(0)">
          <q-item-side icon="play arrow" />
          <q-item-main label="Play One" sublabel="Waits for you to advance" />
        </q-item>

        <q-item @click.native="readDropboxFolder()">
          <q-item-side icon="refresh" />
          <q-item-main label="Refresh" sublabel="Reload from DropBox" />
        </q-item>

        <q-item @click.native="logout()">
          <q-item-side icon="logout" />
          <q-item-main label="Logout" sublabel="Log out from DropBox" />
        </q-item>

        <!--        <q-item @click.native="openURL('http://quasar-framework.org')">
                  <q-item-side icon="school" />
                  <q-item-main label="Docs" sublabel="quasar-framework.org" />
                </q-item>-->

      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  import { mixinGeneral } from '../components/mixinGeneral'
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  mixins: [ mixinGeneral ],
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
  }
}
</script>

<style>
</style>
