let fs = require('fs')
let stream = fs.createWriteStream('src/statics/version.json')
let obj = {
  version: new Date().toLocaleString()
}
stream.once('open', function (fd) {
  stream.write(JSON.stringify(obj))
  stream.end()
})
