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
          @click="toggleLeftDrawer"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{appTitle}}
          <div slot="subtitle">Version {{version}}</div>
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          id="settings"
          @click.native.stop="rightDrawerOpen = !rightDrawerOpen"
          icon="settings"/>

      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      side="right"
      v-model="rightDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        inset-delimiter
      >
        <q-list-header>{{$t('Settings')}}</q-list-header>
        <q-item @click.native="$store.commit('playAfterRecord')" >
          <q-item-side icon="replay" />
          <q-item-main :label="$t(playAfterRecord ? 'Don\'t replay after recording' : 'Replay after recording')" :sublabel="$t('Immediately hear your Narration')" />
        </q-item>


        <q-list-header>{{$t('Image Quality')}}</q-list-header>
        <q-item>

          <q-item-side icon="photo_size_select_small" />
          <q-item-main>
            <q-slider
              :value="thumbnailSizeIndex"
              @change="val => {thumbnailSizeIndex = val}"
              :min="0"
              :max="thumbnailSizes.length - 1"
               />
          </q-item-main>
          <q-item-side right icon="photo size select actual" />
        </q-item>




        <q-item @click.native="setDelayPlayNext(1)" v-if="delayPlayNext < 0.01">
          <q-item-side icon="playlist_play" />
          <q-item-main :label="$t('Autoplay pages')" :sublabel="$t('Continue to end of book')" />
        </q-item>

        <q-item @click.native="setDelayPlayNext(0)" v-else >
          <q-item-side icon="play arrow" />
          <q-item-main :label="$t('One page at a time')" :sublabel="$t('Waits for you to advance')" />
        </q-item>


        <q-item @click.native="rightDrawerOpen = false" >
          <q-item-side icon="settings" />
          <q-item-main :label="$t('Done')" :sublabel="$t('Close this menu')" />
        </q-item>
        <q-item>
          <q-item-main :label="$t('Released') + ' '  + version "></q-item-main>
        </q-item>
        <q-item>
          <q-item-main labelc="(c) 2019, James R. Mack"></q-item-main>
        </q-item>

      </q-list>
      <a href="mailto:jim@less2do.com?Subject=Play It Again, Kid" target="_top">Email: Jim@Less2Do.com</a>
    </q-layout-drawer>


    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >

<!-- $t('       <q-item to="/selfi')e" >
          <q-item-side icon="add a photo" />
          <q-item-main :label="$t('Selfie')" :sublabel="You, the book, your kid" />
        </q-item>

        <q-item to="/carousel" >
          <q-item-side icon="playlist_play" />
          <q-item-main :label="$t('Carousel')" :sublabel="See the pages" />
        </q-item>-->

        <q-item @click.native="startBook(false)" >
          <q-item-side icon="add a photo" />
          <q-item-main :label="$t('message.menu.newBook')" :sublabel="$t('Take a selfie of you, the book, your kid')" />
        </q-item>
        <q-item v-if="activeFolder" @click.native="manage(activeFolder)" >
          <q-item-side icon="add a photo" />
          <q-item-main :label="$t('Manage')" :sublabel="$t('manage sound and images for every page')" />
        </q-item>

        <q-item @click.native="readDropboxFolder()">
          <q-item-side icon="refresh" />
          <q-item-main :label="$t('Refresh')" :sublabel="$t('Reload from DropBox')" />
        </q-item>

        <q-item @click.native="openURL('https://www.dropbox.com/home/Apps/PlayItAgainKid')">
          <q-item-side icon="open in browser" />
          <q-item-main :label="$t('Open Dropbox Folder')" :sublabel="$t('See your files')" />
        </q-item>



        <q-item @click.native="logout()">
          <q-item-side icon="logout" />
          <q-item-main :label="$t('Logout')" :sublabel="$t('Log out from DropBox')" />
        </q-item>

        <!-- $t('       <q-item @click.native="openURL('http://quasar-framework.org')')">
                  <q-item-side icon="school" />
                  <q-item-main :label="$t('Docs')" :sublabel="quasar-framework.org" />
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
  import { mixinSound } from '../components/mixinSound'
import { openURL } from 'quasar'
  import v from '../statics/version.json'

export default {
  name: 'MyLayout',
  mixins: [ mixinSound, mixinGeneral ],
  computed: {
    leftDrawerOpenOrNoBooks: {
      get: function () {

        return this.TOCSorted.length === 0 || this.leftDrawerOpen
      },
      set: function (value) {

        this.leftDrawerOpen = value
      }
    }
  },
  data () {
    return {
      leftDrawerOpen: false, // this.TOCSorted.length === 0,
      rightDrawerOpen: false,
      version: v.version
    }
  },
  methods: {
    openURL,
    toggleLeftDrawer: function () {

      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  mounted: function () {
    window.jim = window.jim || {}
    window.jim.layout = this
    this.$root.$on('reload', this.readDropboxFolder)
    // this.leftDrawerOpen = this.TOCSorted.length === 0
    // $root.$emit('reload')
  }
}
</script>

<style>

  .camera-portrait {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: calc(98vw) !important;
    width: calc(96vw);
  }
  .camera-landscape {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-height: calc(98vh - 110px) !important;
    height: calc(98vh - 110px);
    width: auto;
  }
</style>
