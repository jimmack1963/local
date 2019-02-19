export default {
  thumbnailSize: 'w2048h1536',
  thumbnailSizeSmall: 'w480h320',
  thumbnailSizes: 'w32h32|w64h64|w128h128|w256h256|w480h320|w640h480|w960h640|w1024h768|w2048h1536'.split('|'),

  thumbnails: {},
  activeFolder: false,
  activeScene: false, // 0 based carousel offset
  _TOC: {},
  folders: {},
  ids: {},
  access_token: false,
  token_type: false,
  uid: false,
  account_id: false,
}
