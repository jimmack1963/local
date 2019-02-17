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
          <q-input autofocus id="bookTitle" v-model.lazy="bookTitle"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="$refs.newBookCycle.next()"
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
        name="author"
        title="Author"
        :order="20">
        <q-field
          class="col-xs-12 q-mx-sm"
          label="Author (optional)">
          <q-input autofocus id="bookAuthor" v-model.lazy="author"></q-input>
        </q-field>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="$refs.newBookCycle.next()"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="$refs.newBookCycle.previous()"
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
            @click="$refs.newBookCycle.next()"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="$refs.newBookCycle.previous()"
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
        name="image"
        title="Image"
        :order="40">
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
          :quality="0.5"
        >
          Page {{pageName}}
        </RecordCamcord>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            v-if="image"
            @click="$refs.newBookCycle.next()"
            label="Next"
          />
          <q-btn
            color="secondary"
            @click="$refs.newBookCycle.previous()"
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
                 @click="createBookAndAdvance">{{$t('message.book.complete.' + available, { title: title })}}
          </q-btn>
          <q-btn
            color="secondary"
            @click="$refs.newBookCycle.previous()"
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
  // import { mixinBook } from '../components/mixinBook'
  // import { mixinCamera } from '../components/mixinCamera'
  import RecordCamcord from '../components/RecordCamcord'

  export default {
    methods: {
      createBookAndAdvance () {

        this.commitAnySource()
        this.$refs.newBookCycle.next()
      }
    },
    name: 'newBook',
    // mixins: [mixinCamera],
    components: {RecordCamcord},
    props: ['step'],
    data () {
      return {
        currentStep: 'title',

        bookTitle: '',
        author: '',
        pageName: 'CoverSelfie',
        pageStyle: 'page',
        illustrating: false,
        image: false,
        available: 'general',
        title: false,
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
