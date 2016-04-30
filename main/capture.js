const { exec } = require('child-process-promise');

/**
 * @param {String} path path to where to store photo
 * @returns {Promise<Int>} resolves to 0 or rejects
 */
module.exports = function capture(path) {
  // Dangerously kill all PTP processes in an effort to free up the camera
  // Then take the picture
  const CAPTURE_COMMAND = `pkill PTP ; gphoto2 --capture-image-and-download --filename ${path}`;

  console.log(`Capture photo and write to ${path}`);
  return exec(CAPTURE_COMMAND)
  .then((res) => {
    console.log('stdout: ', res.stdout);
    console.log('stderr: ', res.stderr); 
    return res;
  })
  .catch((err) => {
    console.error('ERROR, trying again: ', err);
    return exec(CAPTURE_COMMAND);
  });
};
