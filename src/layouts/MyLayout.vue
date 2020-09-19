<template>
  <q-layout view="hHh Lpr lFf">
    <q-header @click.native.stop="home_UI">
      <q-toolbar
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
        color="primary"
      >
        <q-btn
          @click.stop="toggleLeftDrawer"
          aria-label="Menu"
          dense
          flat
          round
          v-if="access_token"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-btn
          @click.native.stop="home_UI"
          dense
          flat
          icon="home"
          id="home"
          round
          v-if="activeFolder"
        />

        <q-toolbar-title>
          {{ appTitle }}
          <div slot="subtitle">Version {{ version }}</div>
        </q-toolbar-title>

        <q-btn
          @click.native.stop="rightDrawerOpen = !rightDrawerOpen"
          dense
          flat
          icon="settings"
          id="settings"
          round
          v-if="access_token"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
      side="right"
      v-model="rightDrawerOpen"
    >
      <q-list inset-delimiter no-border>
        <q-item-label header>{{ $t("Settings") }}</q-item-label>

        <q-item @click.native="unlock_UI" v-if="locked">
          <q-item-section avatar>
            <q-icon name="lock_open" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("unlock_UI") }}</q-item-label>
            <q-item-label caption>{{
              $t("Enable Editing Books")
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item @click.native="lock_UI" v-else>
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("lock_UI") }}</q-item-label>
            <q-item-label caption>{{
              $t("Disable Editing Books")
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          @click.native="
            $store.commit('playAfterRecord');
            rightDrawerOpen = false;
          "
        >
          <q-item-section avatar>
            <q-icon name="replay" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              >{{
                $t(
                  playAfterRecord
                    ? "Don't replay after recording"
                    : "Replay after recording"
                )
              }}
            </q-item-label>
            <q-item-label caption>{{
              $t("Immediately hear your Narration")
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <!--<q-item-label header>{{ $t("Image Quality") }}</q-item-label>

        <q-item>
          <q-item-section avatar>
            <q-icon name="photo_size_select_small" />
          </q-item-section>
          <q-item-section>

          <q-item-label>
            <q-slider
              :max="thumbnailSizes.length - 1"
              :min="0"
              :value="thumbnailSizeIndex"
              @change="
                val => {
                  this.thumbnailSizeIndex = val;
                }
              "
            />
          </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="photo size select actual"></q-icon>
          </q-item-section>
        </q-item>-->

        <q-item @click.native="setDelayPlayNext(1)" v-if="delayPlayNext < 0.01">
          <q-item-section avatar>
            <q-icon name="playlist_play" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Autoplay pages") }}</q-item-label>
            <q-item-label caption>{{
              $t("Continue to end of book")
              }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item @click.native="setDelayPlayNext(0)" v-else>
          <q-item-section avatar>
            <q-icon name="play_arrow" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("One page at a time") }}</q-item-label>
            <q-item-label caption>{{
              $t("Waits for you to advance")
              }}</q-item-label>
          </q-item-section>

        </q-item>

        <q-item @click.native="rightDrawerOpen = false">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t("Done") }}</q-item-label>
            <q-item-label caption>{{
              $t("Close this menu")
              }}</q-item-label>
          </q-item-section>

        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label >{{$t('Released') + ' ' + version}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-label labelc="(c) 2019, James R. Mack"></q-item-label>
        </q-item>
      </q-list>
      <a href="mailto:jim@less2do.com?Subject=Play It Again, Kid" target="_top"
        >Email: Jim@Less2Do.com</a
      >
    </q-drawer>

    <q-drawer
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
      v-model="leftDrawerOpen"
    >
      <q-list inset-delimiter link no-border>
        <q-item @click.native="startBook_UI(false)">
          <q-item-section avatar>
            <q-icon name="add_a_photo" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('message.menu.newBook')}}</q-item-label>
            <q-item-label caption>{{$t('Take a selfie of you, the book, your kid')}}</q-item-label>
          </q-item-section>

        </q-item>
        <q-item @click.native="manage_UI(activeFolder)" v-if="activeFolder">

          <q-item-section avatar>
            <q-icon name="add_a_photo" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Manage')}}</q-item-label>
            <q-item-label caption>{{$t('manage sound and images for every page')}}</q-item-label>
          </q-item-section>

        </q-item>

        <q-item @click.native="home_UI">

          <q-item-section avatar>
            <q-icon name="collections_bookmark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('List of Books')}}</q-item-label>
            <q-item-label caption>{{$t('Or click the top bar')}}</q-item-label>
          </q-item-section>

        </q-item>

        <q-item @click.native="readDropboxFolder()">
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Refresh')}}</q-item-label>
            <q-item-label caption>{{$t('Reload from DropBox')}}</q-item-label>
          </q-item-section>

        </q-item>

        <q-item
          @click.native="
            openURL('https://www.dropbox.com/home/Apps/PlayItAgainKid')
          "
        >
          <q-item-section avatar>
            <q-icon name="open_in_browser" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Open Dropbox Folder')}}</q-item-label>
            <q-item-label caption>{{$t('See your files')}}</q-item-label>
          </q-item-section>


        </q-item>

        <q-item @click.native="logout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{$t('Logout')}}</q-item-label>
            <q-item-label caption>{{$t('Log out from DropBox')}}</q-item-label>
          </q-item-section>

        </q-item>
        <q-item>
          <a href='https://ko-fi.com/D1D31W2QH' target='_blank'><img alt='Buy Me a Coffee at ko-fi.com' border='0' height='36' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=2' style='border:0px;height:36px;' /></a>
        </q-item>
        <MenuTutorials></MenuTutorials>
      </q-list>
    </q-drawer>

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
import MenuTutorials from 'src/components/MenuTutorials'

export default {
  name: 'MyLayout',
  mixins: [mixinSound, mixinGeneral],
  computed: {
    alwaysTrue: {
      get: function () {
        return true
      },
      set: function (value) {}
    },
    leftDrawerOpenOrNoBooks: {
      get: function () {
        return this.TOCSorted.length === 0 || this.leftDrawerOpen
      },
      set: function (value) {
        this.leftDrawerOpen = value
      }
    }
  },
  components: {
    MenuTutorials,
  },
  data () {
    return {
      leftDrawerOpen: false, // this.TOCSorted.length === 0,
      rightDrawerOpen: true,

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

<style></style>
