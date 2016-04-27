const { exec } = require('child_process');

function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
    console.log(child.addListener)
    child.addListener("error", reject);
    child.addListener("exit", resolve);
  });
}

/**
 * @param {String} path path to where to store photo
 * @returns {Promise<Int>} resolves to 0 or rejects
 */
module.exports = function capture(path) {
  // Dangerously kill all PTP processes in an effort to free up the camera
  // Then take the picture
  const CAPTURE_COMMAND = `pkill PTP ; gphoto2 --capture-image-and-download --filename ${path}`;

  console.log(`Capture photo and write to ${path}`);
  return promiseFromChildProcess(exec(CAPTURE_COMMAND));
};
