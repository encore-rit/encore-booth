const imgur = require('imgur');

imgur.secClientId('665e91941704f23');

module.exports = function(path) {
  return imgur.uploadFile(`./data/${path}`)
  .then((json) => json.data.link)
}
