<template>
  <q-page id="newbook" class="row">
    <!--<div class="strip">{{$t('Create a new book')}}</div>
    -->

      <div class="col-12">
        <RecordCamcord
          ref="recordCamCord"
          class="col-12 "
          pageName="book_cover.png"
          :wholeFileName="'/' + cleanFileNameForDropbox(bookTitle) + '/book_cover.png'"
          :active="currentStep === 'cover'"
          v-on:completed="newBookIllustrated"
          :fileable=false
        >
        </RecordCamcord>
      </div>

    <q-stepper
      v-model="currentStep"
      class="q-mb-sm col-12"
      :vertical="true"
      contractable
      ref="newBookCycle">

      <q-step
        name="cover"
        :title="$t('Cover Selfie')"
        :order="10">
        <div v-if="!imageTaken">
          {{$t('Touch image to take selfie')}}
        </div>
        <div v-else>
          {{$t('You can retake the cover')}}
        </div>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            :label="$t('Next')"
            v-if="imageTaken"
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

      <q-step
        name="title"
        :title="$t('Title')"
        :order="20">
        <q-field
          class="col-xs-12 q-mx-sm"
          :label="$t('Book Title')">
          <q-input @keyup.enter="$refs.newBookCycle.next()" autofocus id="bookTitle" v-model.lazy="bookTitle"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            :label="$t('Next')"
          />
          <q-btn
            color="secondary"
            @click="$refs.newBookCycle.previous()"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            :label="$t('Cancel')"
          />
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
        name="plan"
        :title="$t('Plan')"
        :order="40"
        class="row"
      >


          <q-btn
            class="col-12 col-xs-6 q-mb-sm full-width"
            no-caps
            icon="photo_library"
            color="primary"
            @click="illustrate"

          >
            &nbsp;{{beforeParen('Illustrating the whole book (Take a snapshot of each page)')}}
            <br>
            &nbsp;{{afterParen('Illustrating the whole book (Take a snapshot of each page)')}}
          </q-btn>
          <q-btn
            class="col-12 col-xs-6  q-mb-sm full-width"
            no-caps
            icon="mic"
            color="primary"
            @click="narrate"
          >
            &nbsp;{{beforeParen('Narrating the whole book (Read each page)')}}
            <br>
            &nbsp;{{afterParen('Narrating the whole book (Read each page)')}}

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
            @click="$refs.newBookCycle.previous()"
            label="Back"
          />
          <q-btn
            class="q-mb-sm q-mr-sm"
            color="secondary"
            @click="$router.push('/')"
            :label="$t('Cancel')"
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
  import { mixinDropbox } from '../components/mixinDropbox'
  // import { mixinBook } from '../components/mixinBook'
  // import { mixinCamera } from '../components/mixinCamera'
  import RecordCamcord from '../components/RecordCamcord'

  export default {
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
        this.filename = 'book_cover.jpg'
        let newFolder = this.cleanFileNameForDropbox(this.bookTitle)
        await this.createActiveFolder(newFolder)
        await this.$refs.recordCamCord.createNewBookCoverPage(this.filename, this.tags, this.pageStyle)
        // this.uploadFile()
      },
      next () {
        this.$refs.newBookCycle.next()
      },
      previous () {
        this.$refs.newBookCycle.previous()
      },
    },
    name: 'newBook',
    mixins: [mixinDropbox],
    components: {RecordCamcord},
    props: ['step'],
    data () {
      return {
        currentStep: 'cover',

        bookTitle: '',
        tags: '',
        pageStyle: 'page',
        illustrating: false,
        image: false,
        imageTaken: false,
        available: 'general',
      }
    },
    mounted () {
      // this.date = date
      window.jim = window.jim || {}
      window.jim.newBook = this
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
