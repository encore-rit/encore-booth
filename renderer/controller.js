const { remote } = require('electron');
const when = require('when');
const sequence = require('when/sequence');
const classname = require('classname');
const { equals, dec, compose, values, forEach } = require('ramda');

const capture = remote.require('./main/capture');

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
  return when(node).delay(ms).then(hide)
}

function capturePhoto(filename) {
  return capture(`./data/${filename}.jpg`);
}

function sentPhoto() {
  // open a new window and load the image in it
  // http://www.w3schools.com/jsref/met_win_open.asp
  console.log("function sentPhoto called");
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
    console.log(seconds)
    return when(seconds).delay(1000).then(compose(timer, dec));
  }

  return timer(duration);
}

function reloadImgs(arrayOfQueries) {
  arrayOfQueries.forEach((query) => {
    const el = document.querySelector(query)
    const currentSrc = el.getAttribute('src');
    console.log(el, currentSrc);
    el.setAttribute('src', `${currentSrc}?v=1`);
  });
  return Promise.resolve(true);
}

function interactionLoop({ user, screens, countdownViewEl }) {
  const { screenIntroEl, screenColorEl, screenBWEl,
    screenTakePictureEl, screenExitEl } = screens;

  console.log(user)
  document.onkeypress = undefined;
  hide(screenIntroEl);

  return      showFor(screenColorEl, 3000)
  .then(() => showFor(screenBWEl, 3000))

  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(`${user.userId}-${user.artistKey}-1`))
  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(`${user.userId}-${user.artistKey}-2`))
  .then(() => startTimer(countdownViewEl, 5))
  .then(() => capturePhoto(`${user.userId}-${user.artistKey}-3`))

  .then(() => reloadImgs(['.pose-res-1', '.pose-res-2', '.pose-res-3']))

  .then(() => showFor(screenTakePictureEl, 1000))
  .delay(10000)
  .then(() => forEach(show, values(screens)));

  // .then(() => startTimer(countdownViewEl, 5).delay(3000))
  // .then(() => startTimer(countdownViewEl, 5).delay(3000))
  // .then(() => startTimer(countdownViewEl, 5).delay(3000))
}

module.exports = {
  interactionLoop,
  streamWebcamTo,
}
