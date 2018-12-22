import { mapGetters } from 'vuex'

export const mixinDropbox = {
  data () {
    return {
      UPLOAD_FILE_SIZE_LIMIT: 150 * 1024 * 1024,
    }
  },
  computed: {
    ...mapGetters(['TOC', 'activeFolder']),
  },
  methods: {
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
    uploadImage (dataURL, fileName, size) {
      if (size < this.UPLOAD_FILE_SIZE_LIMIT) {
        if (dataURL) {
          this.$dbx.filesUpload({
            path: fileName,
            contents: this._base64ToArrayBuffer(dataURL),
          })
            .then((response) => {
              if (window.jim_DEBUG_FULL) {
                console.log('@response')
                console.dir(response)
              }
            })
            .catch((error) => {
              if (window.jim_DEBUG_FULL) {
                console.log('@uploadImage error')
                console.dir(error)
              }

            })
        }
      }
      else {
        // TODO: big file upload
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
