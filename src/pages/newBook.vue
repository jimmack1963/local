<template>
  <q-page padding>
    <b>Create a new book:</b>
    <q-stepper
      v-model="currentStep"
      :vertical="false"
      contractable
      ref="newBookCycle">
      <q-step
        name="title"
        title="Title"
        :order="10">
        <q-field
          class="col-xs-12 q-mx-sm"
          label="Book Title">
          <q-input @keyup.enter="$refs.newBookCycle.next()" autofocus id="bookTitle" v-model.lazy="bookTitle"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            v-if="bookTitle"
            label="Next"
          />
          <!-- <q-btn
             color="secondary"
             @click="$refs.newBookCycle.previous()"
             label="Back"
           />-->
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        name="tags"
        title="Tags"
        :order="20">
        <q-field
          class="col-xs-12 q-mx-sm"
          label="Tags for grouping (optional)">
          <q-input @keyup.enter="next" autofocus id="bookTags" v-model.lazy="tags"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="previous"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        name="plan"
        title="Plan"
        :order="25"
      >
        <q-list>
          <q-list-header>
            You can start by
          </q-list-header>
          <q-item>
            <q-item-side icon="mic"></q-item-side>
            <q-item-main label="narrating the whole book"></q-item-main>
          </q-item>
          <q-item>
            <q-item-side icon="photo library"></q-item-side>
            <q-item-main label="illustrating the whole book"></q-item-main>
          </q-item>
          <q-item>
            <q-item-side icon="library books"></q-item-side>
            <q-item-main label="or work page-by-page"></q-item-main>
          </q-item>
        </q-list>

        (At any time, you can stop what you are doing, and restart in any way you like).

        <q-stepper-navigation>
          <q-btn
            icon="mic"
            color="primary"
            @click="narrate"
            label="Narrate"
          />
          <q-btn
            icon="photo library"
            color="primary"
            @click="illustrate"
            label="Illustrate"
          />
          <q-btn
            icon="library books"
            color="primary"
            @click="pageByPage"
            label="Page by Page"
          />

          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>

      </q-step>

      <q-step
        name="recording"
        title="Recording"
        :order="30">
        <q-field
          class="col-xs-12 q-mx-sm q-mt-sm q-mb-md"
          label="Record">
          <q-radio autofocus class="q-mr-sm" v-model.lazy="pageStyle" val="page">&nbsp;&nbsp;Each Page (1, 2, 3, 4, 5)
          </q-radio>
          <q-radio class="q-mr-sm" v-model="pageStyle" val="2page">&nbsp; Facing Pages (1, 2+3, 4+5)</q-radio>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="next"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="previous"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        name="selfie"
        title="Selfie"
        :order="25">
    <!--    <anyCamera
          class="col full-width row"
          :takeImage="takeImage"
          :buttonCreate="false"

          messageTakeImage="message.book.takeImage"
          messageReuseImage="message.book.reuseImage"
          messageComplete="message.book.complete"
          v-on:resetSnapshot="resetSnapshot"
          v-on:usePickedImage="usePickedImage"
          v-on:create="false"
        >
        v-if="illustrating[pageName]"
        </anyCamera>-->
        <RecordCamcord
          :pageName="pageName"
          :quality="quality"
          v-on:completed="newBookIllustrated"
        >
          Page {{pageName}}
        </RecordCamcord>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            v-if="image"
            @click="next"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="previous"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        name="create"
        title="Create"
        :order="50">
        <!--v-if="image && buttonCreate"-->
        <h4>Ready to go!</h4>
        <q-stepper-navigation>
          <q-btn color="primary"
                 id="btnCompleteImage"
                 icon="library add"
                 ref="createButton"
                 @click="createBookAndAdvance">{{$t('message.book.complete.' + available, { title: bookTitle })}}
          </q-btn>
          <q-btn
            color="secondary"
            @click="previous"
            label="Back"
          />
          <q-btn
            color="secondary"
            @click="$router.push('/')"
            label="Cancel"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        name="record"
        title="Record"
        :order="60">
        <h4>Your book is being created. Next, record each page</h4>

        <q-stepper-navigation>
          <q-btn
            color="secondary"
            @click="$router.push('/scroll')"
            label="Done"
          />
        </q-stepper-navigation>
      </q-step>
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
      newBookIllustrated () {
        alert('newBookIllustrated')
      },
      narrate () {
        alert('narrate')
      },
      illustrate () {
        alert('illustrate')
      },
      pageByPage () {
        alert('pageByPage')
      },
      createBookAndAdvance () {

        this.commitAnySource()
        this.next()
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
        currentStep: 'title',

        bookTitle: '',
        tags: '',
        pageName: 'CoverSelfie',
        pageStyle: 'page',
        illustrating: false,
        image: false,
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
</style>
