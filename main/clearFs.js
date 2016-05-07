var fs = require('mz/fs');
var { map, range } = require('ramda');

module.exports = function(userId, artistKey) {
  const root = path.resolve(__dirname, 'data');
  const filenames = map((i) =>
                        `${root}/${userId}-${artistKey}-${i}.jpg`,
                        range(1, 4));
  return Promise.all(map(fs.unlink, filenames));
}
