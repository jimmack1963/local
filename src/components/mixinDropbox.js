const pathParse = require('path-parse')
import { mapGetters } from 'vuex'

export const mixinDropbox = {
  data () {
    return {
      UPLOAD_FILE_SIZE_LIMIT: 150 * 1024 * 1024,
    }
  },
  computed: {
    ...mapGetters(['TOC', 'activeFolder']),
    ...mapGetters('dropbox', ['quality']),
  },
  methods: {
    async replaceSelfie () {
      await this.$store.dispatch('removeEntry', {
        TOC: this.activeFolder,
        pageNumber: 'book_cover',
        family: 'png',
        dbx: this.$dbx,
      })

      this.$router.push('/selfie')
    },
    renameFolder (folder) {
      let v = this
      // TODO make renameFolder happen in VUEX #2hr
      this.$dbx.filesMoveV2({
        from_path: folder.path_lower,
        to_path: '/jim',
      }).then(() => {
        v.$root.$emit('reload')
      })

    },
    deleteFolder (folder) {
      // TODO make deleteFolder happen in VUEX #2hr
      let self = this
      this.$q.dialog({
        title: 'Delete ' + folder.path_lower,
        message: `Will delete ${folder.path_lower} from your dropbox folder`,
        ok: 'Delete',
        cancel: 'Keep',
      })
        .then(function () {
          self.$dbx.filesDeleteV2({
            path: folder.path_lower,
          })
            .then(function () {
              self.$root.$emit('reload')
              self.$router.push('/')
            })
        })
    },
    _base64ToArrayBuffer (base64) {
      // base64 = base64.split('data:image/png;base64,').join('')

      base64 = base64.substr('data:image/png;base64,'.length + 1)
      let binaryString = window.atob(base64),
        len = binaryString.length,
        bytes = new Uint8Array(len)

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes.buffer
    },
    uploadFile: async function (sourceFile, fileName) {

      let v = this
      if (sourceFile.size < this.UPLOAD_FILE_SIZE_LIMIT) {
        try {
          let response = await this.$dbx.filesUpload({
            path: fileName,
            contents: sourceFile,
          })


          response.parts = pathParse(response.path_lower)
          response.ext = response.parts.ext.toLowerCase().replace('.', '')
          response.dir = response.parts.dir
          response.fname = response.parts.name
          response['.tag'] = 'file'

          v.$store.dispatch('registerFile', {
            folder: response.dir,
            entry: response,
            dbx: v.$dbx,
            calc: true,
          })

          let folder = v.$store.state.dropbox._TOC[response.dir]
          if (folder) {
            v.$store.commit('dropbox/calc', {
              TOC: folder,
            })
          }

          // v.$store.commit('dropbox/saveThumbnail', {
          //   entry: response,
          //   thumbnail: thumbnail,
          // })

          // TODO: this has .id, .path_lower and should be used on insert #4hr
          if (window.jim_DEBUG_FULL) {
            console.log('@response')
            console.dir(response)
          }
        }
 catch (error) {
          if (window.jim_DEBUG_FULL) {
            console.log('@uploadFile error')
            console.dir(error)
          }
        }

      }
      else {
        // TODO: big file upload #8hr
        alert('Size of file exceeds ' + this.UPLOAD_FILE_SIZE_LIMIT + ' bytes, need to write more code in' +
          ' mixinDropBox.uploadFileBlobImage')
        /**
         const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

         var workItems = [];

         var offset = 0;

         while (offset < file.size) {
          var chunkSize = Math.min(maxBlob, file.size - offset);
          workItems.push(file.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }

         const task = workItems.reduce((acc, blob, idx, items) => {
          if (idx == 0) {
            // Starting multipart upload of file
            return acc.then(function() {
              return dbx.filesUploadSessionStart({ close: false, contents: blob})
                        .then(response => response.session_id)
            });
          } else if (idx < items.length-1) {
            // Append part to the upload session
            return acc.then(function(sessionId) {
             var cursor = { session_id: sessionId, offset: idx * maxBlob };
             return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId);
            });
          } else {
            // Last chunk of data, close session
            return acc.then(function(sessionId) {
              var cursor = { session_id: sessionId, offset: file.size - blob.size };
              var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };
              return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });
            });
          }
        }, Promise.resolve());

         task.then(function(result) {
          var results = document.getElementById('results');
          results.appendChild(document.createTextNode('File uploaded!'));
        }).catch(function(error) {
          console.error(error);
        });


         */
      }
    },
    uploadFileBlobImage: async function (dataURL, fileName, size) {

      let v = this
      if (size < this.UPLOAD_FILE_SIZE_LIMIT) {
        if (dataURL) {
          let thumbnail = this._base64ToArrayBuffer(dataURL)
          try {
            let response = await this.$dbx.filesUpload({
              path: fileName,
              contents: thumbnail,
            })

            response.parts = pathParse(response.path_lower)
            response.ext = response.parts.ext.toLowerCase().replace('.', '')
            response.dir = response.parts.dir
            response.fname = response.parts.name
            response['.tag'] = 'file'

            v.$store.dispatch('registerFile', {
              folder: response.dir,
              entry: response,
              dbx: v.$dbx,
              calc: true,
            })

            let folder = v.$store.state.dropbox._TOC[response.dir]
            if (folder) {
              v.$store.commit('dropbox/calc', {
                TOC: folder,
              })
            }

            v.$store.commit('dropbox/saveThumbnail', {
              entry: response,
              thumbnail: thumbnail,
            })

            // TODO: this has .id, .path_lower and should be used #2hr
            if (window.jim_DEBUG_FULL) {
              console.log('@response')
              console.dir(response)
            }
          }
 catch (error) {
            if (window.jim_DEBUG_FULL) {
              console.log('@uploadFileBlobImage error')
              console.dir(error)
            }
          }
        }
      }
      else {
        // TODO: big file upload #2hr
        alert('Size of file exceeds ' + this.UPLOAD_FILE_SIZE_LIMIT + ' bytes, need to write more code in' +
          ' mixinDropBox.uploadFileBlobImage')
        /**
         const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

         var workItems = [];

         var offset = 0;

         while (offset < file.size) {
          var chunkSize = Math.min(maxBlob, file.size - offset);
          workItems.push(file.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }

         const task = workItems.reduce((acc, blob, idx, items) => {
          if (idx == 0) {
            // Starting multipart upload of file
            return acc.then(function() {
              return dbx.filesUploadSessionStart({ close: false, contents: blob})
                        .then(response => response.session_id)
            });
          } else if (idx < items.length-1) {
            // Append part to the upload session
            return acc.then(function(sessionId) {
             var cursor = { session_id: sessionId, offset: idx * maxBlob };
             return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId);
            });
          } else {
            // Last chunk of data, close session
            return acc.then(function(sessionId) {
              var cursor = { session_id: sessionId, offset: file.size - blob.size };
              var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };
              return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });
            });
          }
        }, Promise.resolve());

         task.then(function(result) {
          var results = document.getElementById('results');
          results.appendChild(document.createTextNode('File uploaded!'));
        }).catch(function(error) {
          console.error(error);
        });


         */
      }
    },
    uploadFileBlobAudio (blob, fileName, size) {
      let v = this
      if (size < this.UPLOAD_FILE_SIZE_LIMIT) {
        if (blob) {
          this.$dbx.filesUpload({
            path: fileName,
            contents: blob,
          })
            .then((response) => {
              response.parts = pathParse(response.path_lower)
              response.ext = response.parts.ext.toLowerCase().replace('.', '')
              response.dir = response.parts.dir
              response.fname = response.parts.name
              response['.tag'] = 'file'

              v.$store.dispatch('registerFile', {
                folder: response.dir,
                entry: response,
                dbx: v.$dbx,
                calc: true,
              })

              let folder = v.$store.state.dropbox._TOC[response.dir]
              if (folder) {
                v.$store.commit('dropbox/calc', {
                  TOC: folder,
                })
              }

              // TODO: this has .id, .path_lower and should be used #2hr
              if (window.jim_DEBUG_FULL) {
                console.log('@response')
                console.dir(response)
              }
            })
            .catch((error) => {

              if (window.jim_DEBUG_FULL) {
                console.log('@uploadFileBlobImage error')
                console.dir(error)
              }

            })
        }
      }
      else {
        // TODO: big file upload #2hr
        alert('Size of file exceeds ' + this.UPLOAD_FILE_SIZE_LIMIT + ' bytes, need to write more code in' +
          ' mixinDropBox.uploadFileBlobImage')
        /**
         const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

         var workItems = [];

         var offset = 0;

         while (offset < file.size) {
          var chunkSize = Math.min(maxBlob, file.size - offset);
          workItems.push(file.slice(offset, offset + chunkSize));
          offset += chunkSize;
        }

         const task = workItems.reduce((acc, blob, idx, items) => {
          if (idx == 0) {
            // Starting multipart upload of file
            return acc.then(function() {
              return dbx.filesUploadSessionStart({ close: false, contents: blob})
                        .then(response => response.session_id)
            });
          } else if (idx < items.length-1) {
            // Append part to the upload session
            return acc.then(function(sessionId) {
             var cursor = { session_id: sessionId, offset: idx * maxBlob };
             return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId);
            });
          } else {
            // Last chunk of data, close session
            return acc.then(function(sessionId) {
              var cursor = { session_id: sessionId, offset: file.size - blob.size };
              var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };
              return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });
            });
          }
        }, Promise.resolve());

         task.then(function(result) {
          var results = document.getElementById('results');
          results.appendChild(document.createTextNode('File uploaded!'));
        }).catch(function(error) {
          console.error(error);
        });


         */
      }
    },
  },
}
