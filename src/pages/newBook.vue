<template>
  <q-page id="newbook" class="row">
    <!--<div class="strip">{{$t('Create a new book')}}</div>
    -->
    <div
      v-show="currentStep !== 'title'"
      :class="pOrL + ' row'"
    >
      <q-img
        id="camera--output"
        alt="your camera"
        class="col-6"
        v-if="latestImageAsDataURL || (latestImage !== '//:0')"
        :src="latestImage || latestImageAsDataURL"
      />

<!--      <q-card
        v-for="url in urls"
        :key="url"
        class="col-2"
      >
        <img
          id="camera&#45;&#45;output"
          alt="Your Image"
          :src="url"
        >
      </q-card>-->

     <!-- <RecordCamcord
        ref="recordCamCord"
        :class="pOrL"
        :fileable=false
        :showLocalMenu="currentStep === 'coverXXX'"
        :wholeFileName="'/' + cleanFileNameForDropbox(bookTitle) + '/book_cover.png'"
        pageName="book_cover.png"
        v-on:completed="newBookIllustrated"
      >
      </RecordCamcord>-->
    </div>

    <q-stepper
      ref="newBookCycle"
      v-model="currentStep"
      :class="'rest' + ' col-12'"
      :vertical="true"
      contractable>

      <q-step
        :order="10"
        :title="$t('Title')"
        name="title">
        <q-field
          :label="$t('Book Title')"
          class="col-xs-12 q-mx-sm">
          <q-input
            id="bookTitle"
            v-model.lazy="bookTitle"
            autofocus
            @keyup.enter="$refs.newBookCycle.next()"
          ></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            :label="$t('Next')"
            color="primary"
            @click="next"
          />
          <q-btn
            :label="$t('Cancel')"
            color="secondary"
            @click="$router.push('/')"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :order="20"
        :title="$t('Cover ')"
        name="cover">


        <TakeOrFind
          ref="TakeOrFind"
          v-on:onImageTaken="imageReady = true"
          v-on:onFile="imageReady = true"
          :takeCaption="$t('Take Selfie')"
          pageName="book_cover.png"
        >
        </TakeOrFind>

        <div v-if="!(imageTaken || imageReady)">
        </div>

        <div v-else>
          <q-btn
            @click="clearImages"
            class="bg-warning"
          >
            {{ $t('Retake') }}
          </q-btn>
        </div>
        <q-stepper-navigation>
          <q-btn
            v-if="imageTaken || imageReady"
            :label="$t('Next')"
            color="primary"
            @click="next"
          />

          <q-btn
            color="secondary"
            label="Back"
            @click="$refs.newBookCycle.previous()"
          />
          <q-btn
            :label="$t('Cancel')"
            color="secondary"
            @click="$router.push('/')"
          />
          <!-- <q-btn
             color="secondary"
             @click="$refs.newBookCycle.previous()"
             label="Back"
           />-->
          <!--    <q-btn
                color="secondary"
                @click="$router.push('/')"
                :label="$t('Cancel')"
              />-->
        </q-stepper-navigation>
      </q-step>

      <!--<q-step
        name="tags"
        :title="$('Tags')"
        :order="20">
        <q-field
          class="col-xs-12 q-mx-sm"
          label="Tags for organizing playback (optional)">
          <q-input @keyup.enter="next" autofocus id="bookTags" v-model.lazy="tags"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            :label="$t('Next')"
          />
          <q-btn
            color="secondary"
            :label="$t('Previous')"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            :label="$t('Cancel')"
          />
        </q-stepper-navigation>
      </q-step>-->

      <!--<q-step
        name="numbering"
        :title="$t('Page Numbering')"
        @keyup.enter="$refs.newBookCycle.next()"
        :order="30">
        <q-field
          class="col-xs-12 q-mx-sm q-mt-sm q-mb-md"
          label="Will each page be its own recording (Mostly Text), or one recording for each set of facing pages (Mostly Illustrations)?">
          <q-radio autofocus class="q-mr-sm" v-model.lazy="pageStyle" val="page">&nbsp;&nbsp;Each Page (1, 2, 3, 4, 5)
          </q-radio>
          <q-radio class="q-mr-sm" v-model="pageStyle" val="2page">&nbsp; Facing Pages (1, 2+3, 4+5)</q-radio>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            :label="$t('Next')"
          />
          <q-btn
            color="secondary"
            :label="$t('Previous')"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            :label="$t('Cancel')"
          />
        </q-stepper-navigation>
      </q-step>-->

      <q-step
        :order="40"
        :title="$t('Plan')"
        class="row"
        name="plan"
      >


        <q-btn
          class="col-12 col-xs-6 q-mb-sm full-width"
          color="primary"
          icon="photo_library"
          no-caps
          @click="illustrate"

        >
          &nbsp;{{ beforeParen('Illustrating the whole book (Take a snapshot of each page)') }}
          <br>
          &nbsp;{{ afterParen('Illustrating the whole book (Take a snapshot of each page)') }}
        </q-btn>
        <q-btn
          class="col-12 col-xs-6  q-mb-sm full-width"
          color="primary"
          icon="mic"
          no-caps
          @click="narrate"
        >
          &nbsp;{{ beforeParen('Narrating the whole book (Read each page)') }}
          <br>
          &nbsp;{{ afterParen('Narrating the whole book (Read each page)') }}

        </q-btn>

        <!--
        <q-btn
        class=q-mb-sm
          icon="library books"
          color="primary"
          @click="pageByPage"
          label="Page by Page"
        />
-->
        <q-stepper-navigation>
          <q-btn
            class="q-mb-sm q-mr-sm"
            color="secondary"
            label="Back"
            @click="$refs.newBookCycle.previous()"
          />
          <q-btn
            :label="$t('Cancel')"
            class="q-mb-sm q-mr-sm"
            color="secondary"
            @click="$router.push('/')"
          />
        </q-stepper-navigation>
      </q-step>

      <!-- <q-step
         name="illustrating"
         :title="$t('Illustrating')"
         :order="120">

         <q-stepper-navigation>
           <q-btn
             color="primary"
             @click="next"
             :label="$t('Next')"
           />
           <q-btn
             color="secondary"
             :label="$t('Previous')"
             label="Back"
           />
           <q-btn
             color="secondary"
             @click="$router.push('/')"
             :label="$t('done')"
           />
         </q-stepper-navigation>
       </q-step>

       <q-step
         name="narrating"
         :title="$t('Narrating')"
         :order="120">

         <q-stepper-navigation>
           <q-btn
             color="primary"
             @click="next"
             :label="$t('Next')"
           />
           <q-btn
             color="secondary"
             :label="$t('Previous')"
             label="Back"
           />
           <q-btn
             color="secondary"
             @click="$router.push('/')"
             :label="$t('done')"
           />
         </q-stepper-navigation>
       </q-step>


       <q-step
         name="pageByPage"
         :title="$t('Page By Page')"
         :order="130">

         <q-stepper-navigation>
           <q-btn
             color="secondary"
             :label="$t('Previous')"
             label="Back"
           />
           <q-btn
             color="secondary"
             @click="$router.push('/')"
             :label="$t('done')"
           />
         </q-stepper-navigation>
       </q-step>
     -->
    </q-stepper>

  </q-page>
</template>

<script>
import {mixinDropbox} from '../components/mixinDropbox'
import {mixinUpload} from '../components/mixinUpload'
// import { mixinBook } from '../components/mixinBook'
// import { mixinCamera } from '../components/mixinCamera'
// import RecordCamcord from '../components/RecordCamcord'

import {mapGetters} from 'vuex'
import TakeOrFind from '../components/TakeOrFind'

export default {
  computed: {
    ...mapGetters('devices', [
      'latestImage',
      'urls',
      'latestImageAsDataURL',
      'externals',
      'files',
      'selectedInfo'
    ]),
    activeDevice: {
      get: function () {
        return this.currentVideo
      },
      set: function (val) {
        this.$store.commit('setCurrentVideo', val)
      }
    },
    pOrL () {
      if (this.$q.screen.height > this.$q.screen.width) {
        console.log('orientation: Portrait')
        return 'col-12'
      }
      else {
        console.log('orientation: landscape')
        return 'col-8'
      }
    },
    rest () {
      if (this.$q.screen.height > this.$q.screen.width) {
        return 'col-12'
      }
      else {
        return 'col-4'
      }
    },
    imageTaken () {
      return (this.latestImage !== '//:0')
    },
  },
  methods: {
    beforeParen (key) {
      let phrase = this.$t(key)
      let parts = phrase.split('(')
      return parts[0]
    },
    afterParen (key) {
      let phrase = this.$t(key)
      let parts = phrase.split('(')
      return '(' + parts[1]
    },
    newBookIllustrated (completed) {

      this.imageTaken = completed
      this.$store.commit('unlock')
      // run when image correctly taken in RecordCamcord
    },
    async narrate () {

      await this.createBookAndAdvance()

      this.$router.push('/narrate')
    },
    async illustrate () {

      await this.createBookAndAdvance()

      this.$router.push('/illustrate')
    },
    async pageByPage () {

      await this.createBookAndAdvance()

      this.$router.push('/pageByPage')
    },
    async createBookAndAdvance () {

      this.filename = 'book_cover'
      let newFolder = this.cleanFileNameForDropbox(this.bookTitle)
      await this.createActiveFolder(newFolder)

      if (!this.selectedInfo.useInput) {

        await this.uploadImage(this.filename, this.latestImageAsDataURL, '/' + newFolder)
      } else {

        if (this.files.length < 1) {
          alert('no file chosen')
          return false
        }
        await this.uploadFileWithName(this.filename, this.files[0], '/' + newFolder)
      }

      // await this.$refs.recordCamCord.createNewBookCoverPage(this.filename, this.tags, this.pageStyle)
    },
    next () {
      this.$refs.newBookCycle.next()
    },
    previous () {
      this.$refs.newBookCycle.previous()
    },
    clearImages () {
      this.$store.commit('devices/clearImages')
    },
  },
  name: 'newBook',
  mixins: [mixinUpload, mixinDropbox],
  components: {TakeOrFind},
  props: ['step'],
  data () {
    return {
        currentStep: 'title',

        bookTitle: '',
      tags: '',
      pageStyle: 'page',
      illustrating: false,
      imageReady: false,
      image: false,
      available: 'general',
    }
  },
  async mounted () {
    // this.date = date
    window.jim = window.jim || {}
    window.jim.newBook = this

    this.clearImages()
    await navigator.mediaDevices.getUserMedia({video: true, audio: false})
    // this.$store.dispatch('getDevices')
  },
}
</script>

<style>
.snapshot-medium {
  height: 100% !important;
  max-height: 60vh;
}

.strip {
  height: 1em;
}
</style>
