<template>
  <q-page class="row">

    <div :class="pOrL">
      <RecordCamcord
        :showLocalMenu="false"
        :class="pOrL"
        :fileable=false
        :pageName="pageName"

        ref="recordCamCord"
      >
      </RecordCamcord>

      <!--
         :touchHandler8Prop="touchHandler8"
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
        @click="touchHandler8"
        v-if="!activeFolder.soundOrder[pageName]"
        icon="camera"
        color="primary"
      ></q-btn>

      <q-btn
        name="front"
        :label="$t(modeCaption)"
        @click="modeClick"
        :icon="modeIcon"
      >

      </q-btn>

      <q-btn
        id="done"
        :label="$t('done')"
        @click="home_UI"

        icon="stop"
        color="secondary"
      ></q-btn>

    </div>
  </q-page>
</template>

<script>
    import {mixinGeneral} from '../components/mixinGeneral'
    import {mixinDropbox} from '../components/mixinDropbox'
    import {mixinIllustrate} from '../components/mixinIllustrate'
    import RecordCamcord from '../components/RecordCamcord'

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
        methods: {},
    }
</script>

<style>
</style>
