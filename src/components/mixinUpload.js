export const mixinUpload = {
  methods: {
    async onImageTaken () {

      switch (this.selectedInfo.type) {
        case 'camera': {
          return this.onImage()
        }
        case 'file': {
          return this.onFile()
        }
        case 'native': {
          return this.onImage()
        }
      }
    },
    onImage () {

      console.log('Image was taken')
      this.uploadImage(JSON.parse(JSON.stringify(this.pageName)), this.latestImageAsDataURL)
      this.pageName = (parseInt(this.pageName) + 1).toString()
    },
    async onFile (settings) {

      let file
      let overridePage = false
      if (typeof settings === 'object') {
        file = settings.val
        overridePage = settings.pageName
      } else {
        file = settings
      }

      console.log('File was selected')
      await this.uploadFileWithName(JSON.parse(JSON.stringify(overridePage || this.pageName)), file)
      if (!overridePage) this.pageName = (parseInt(this.pageName) + 1).toString()
    },

    async uploadImage (overridePage, image, folder) {

      if (image && image !== 'data:,') {
        let wholeFileName = this.generateImageName(overridePage, folder)
        console.log('filename in useImage: ' + wholeFileName)
        await this.uploadFileBlobImage(image, wholeFileName, image.length)
        console.log('useImage done')
        // this.clearPhoto()
        // TODO: clear this taken image from VUEX stuff
      }
      else {
        alert('Image not available')
      }
    },
    async uploadFileWithName (overridePage, file, folder) {

      if (file && file !== 'data:,') {
        let wholeFileName = this.generateImageName(overridePage, folder)
        console.log('filename in useImage: ' + wholeFileName)
        await this.uploadFile(file, wholeFileName, file.size)
        console.log('useImage done')
        // this.clearPhoto()
        // TODO: clear this taken image from VUEX stuff
      }
      else {
        alert('Image not available')
      }
    },
    generateImageName (overridePage, overrideFolder) {
      if (this.wholeFileName) {
        return this.wholeFileName
      }
      let pageFileName
      if (/^[0-9]+$/.test(overridePage)) {
        // numeric page numbers start with 'p'
        pageFileName = 'p' + overridePage
      }
      else {
        pageFileName = overridePage
      }
      return `${(overrideFolder || this.activeFolder.path_display)}/${pageFileName}.png`
    },
  }
}
