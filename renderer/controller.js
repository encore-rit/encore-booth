const { remote } = require('electron');
const when = require('when');
const sequence = require('when/sequence');
const classname = require('classname');
const { equals, dec, compose, values, forEach, map, range } = require('ramda');
const fs = require('mz/fs');
const path = require('path');

const capture = remote.require('./main/capture');
const upload = remote.require('./main/upload');

/**
 * capture photo
 * publish photo
 * remove photo
 */

function streamWebcamTo(videoEl) {
  navigator.webkitGetUserMedia({video: true}, handleVideo, console.error);

  function handleVideo(stream) {
    videoEl.src = window.URL.createObjectURL(stream);
  }
}

/**
 * Given an HTML DOM node, give it the .hide CSS class
 */
function hide(node) {
  node.className = classname(node, {hide: true});
}

function show(node) {
  node.className = classname(node, {hide: false});
}

/**
 * Wait ms milliseconds before calling the hide function on given node
 */
function showFor(node, ms) {
  console.log(`Show node ${node} for ${ms}`);
  return when(node).delay(ms).then(hide)
}

/**
 * Takes a photo
 * Uploads it to imgur
 * Removes it from the filesystem
 * @returns {String} the imgur link
 */
function capturePhoto(filename) {
  const safePath = path.resolve(__dirname, `../data/${filename}`)
  console.log('(touch) Safe path: ', safePath);
  return capture(safePath)
}

function mvPhoto(filename) {
  const safePath = path.resolve(__dirname, `../data/${filename}`)
  console.log('(rm) Safe path: ', safePath)
  return upload(safePath)
  .then((link) => {
    /* Async but I don't really mind, fire and forget */
    fs.unlink(safePath);
    return link;
  })
  .catch((err) => { console.log(err); });
}

function sentPhoto() {
  // open a new window and load the image in it
  // http://www.w3schools.com/jsref/met_win_open.asp
  const pic = document.getElementById("snapCanvas").toDataURL();
  const windowName = "webcamPhoto";
}

function startTimer(countdownView, duration) {
  function timer(seconds) {
    if (equals(seconds, 0)) {
      countdownView.innerHTML = '';
      return when.resolve(seconds);
    }
    countdownView.innerHTML = seconds;
    return when(seconds).delay(1000).then(compose(timer, dec));
  }

  return timer(duration);
}

function reloadImgs(arrayOfQueries) {
  arrayOfQueries.forEach((query) => {
    const el = document.querySelector(query)
    const currentSrc = el.getAttribute('src');
    el.setAttribute('src', `${currentSrc}?v=1`);
  });
  return Promise.resolve(true);
}

function interactionLoop({ user, screens, countdownViewEl }) {
  const { screenIntroEl, screenColorEl, screenBWEl,
    screenTakePictureEl, screenExitEl } = screens;

  const fnames = map((i) => `${user._id}-${user.artistKey}-${i}.jpg`,
                            range(1, 4));

  hide(screenIntroEl);

  return      showFor(screenColorEl, 3000)
  .then(() => showFor(screenBWEl, 3000))

  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(fnames[0]))

  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(fnames[1]))

  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(fnames[2]))

  .then(() => reloadImgs(['.pose-res-1', '.pose-res-2', '.pose-res-3']))

  .then(() => showFor(screenTakePictureEl, 1000))
  .delay(10000)
  .then(() => {
    forEach(show, values(screens));
    return Promise.all(map(mvPhoto, fnames));
  })
  .catch((err) => {
    console.log(err);
  });
}

module.exports = {
  interactionLoop,
  streamWebcamTo,
}
