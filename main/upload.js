const imgur = require('imgur');

imgur.setClientId('665e91941704f23');

module.exports = function(filepath) {
  return imgur.uploadFile(filepath)
  .then((json) => json.data.link)
}
