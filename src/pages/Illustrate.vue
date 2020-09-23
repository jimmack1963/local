<template>
  <q-page class="row">

    <div :class="pOrL">
      <RecordCamcord
        :showLocalMenu="false"
        :class="pOrL"
        :fileable=false
        :pageName="pageName"
        v-on:completed="onImage"
        ref="recordCamCord"
      >
      </RecordCamcord>

      <!--
        :clearPhotoProp="clearPhoto"
      v-on:completed="newBookIllustrated"
      :wholeFileName="'/' + cleanFileNameForDropbox(bookTitle) + '/book_cover.png'"
      -->
    </div>
    <div
      :class="rest"
      class="q-pa-sm"
    >
      <div v-if="!imageTaken">
        {{$t('Touch image to take selfie')}}
      </div>
      <div v-else>
        {{$t('You can retake the cover')}}
      </div>

      <q-field
        :label="$t('keep as page')"
        orientation="horizontal"
      >
        <q-input
          v-model="pageName"
        >
        </q-input>
      </q-field>


      <q-btn
        :id="`illustrate_${pageName}`"
        :label=" $t('Take') "
        @click="triggerRecordCamcord"

        icon="camera"
        color="primary"
      />

      <q-btn
        id="done"
        :label="$t('done')"
        @click="home_UI"

        icon="stop"
        color="secondary"
      />

      <q-btn
        id="manage"
        :label="$t('manage')"
        @click="manage_UI(activeFolder)"
        icon="dashboard"
      />

      <q-option-group
        v-model="activeDevice"
        v-if="videoDevicesAsOptions.length > 1"
        :options="videoDevicesAsOptions"
      />

    </div>

        <div
          v-for="(blob, index) in activeFolder.imageOrder"
          v-bind:key="index"
            class="col-xs-3"
        >
          <q-img
            :src="blob"
            v-if="blob"
          >

            <q-badge
              floating
            >
              {{activeFolder.pageOrder[index]}}

            </q-badge>
          </q-img>
        </div>


  </q-page>
</template>

<script>
    import {mixinGeneral} from '../components/mixinGeneral'
    import {mixinDropbox} from '../components/mixinDropbox'
    import {mixinIllustrate} from '../components/mixinIllustrate'
    import RecordCamcord from '../components/RecordCamcord'
    import {mapGetters} from 'vuex'

    export default {
        name: 'Illustrate',
        /* props: ['pageName'], */
        components: {RecordCamcord},
        mixins: [mixinGeneral, mixinDropbox, mixinIllustrate],
        // mixins: [mixinGeneral, mixinDropbox],

        data () {
            return {
                pageName: '',
                action: 'click to keep',
                imageTaken: false,

            }
        },
        computed: {
          ...mapGetters(['videoDevicesAsOptions', 'currentVideo']),
          activeDevice: {
            get: function () {
              return this.currentVideo
            },
            set: function (val) {
              this.$store.commit('setCurrentVideo', val)
            }
          },
        },
        mounted () {
            window.jim = window.jim || {}
            window.jim.Illustrate = this

            if (this.$route.params.pageName) {
                this.pageName = this.$route.params.pageName
            }
            else {
                this.pageName = this.nextIllustration(this.activeFolder)
            }

        },
        methods: {
            triggerRecordCamcord () {

                this.$refs.recordCamCord.touchImageFeedback()
            },
            onImage () {
                console.log('Image was taken')
                this.pageName = (parseInt(this.pageName) + 1).toString()
            },
        },
    }
</script>

<style>
</style>
