const when = require('when');
const sequence = require('when/sequence');
const classname = require('classname');
const { equals, dec, compose, forEach } = require('ramda');

const { remote } = require('electron');
const capture = remote.require('./main/capture');

const video = document.querySelector("#webcamVideo");
const countdownView = document.getElementById('countdown');

const screenIntro = document.querySelector('#screen-intro')
const screenColor = document.querySelector('#screen-color');
const screenBW = document.querySelector('#screen-bw');
const screenTakePicture = document.querySelector('#screen-take-picture');
const screenExit = document.querySelector('#screen-exit');
const screens = [ screenIntro, screenColor, screenBW,
  screenTakePicture, screenExit ];

document.onkeypress = interactionLoop;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.oGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, handleVideo, console.error);
}

function display([prev, next]) {
  prev.className = classname(prev, {show: false});
  next.className = classname(next, {show: true});
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

function interactionLoop() {
  document.onkeypress = undefined;
  hide(screenIntro);

  return      showFor(screenColor, 3000)
  .then(() => showFor(screenBW, 3000))
  .then(() => timer(5).delay(1000))
  .then(() => timer(5).delay(1000))
  .then(() => timer(5).delay(1000))
  .then(() => showFor(screenTakePicture, 1000))
  .delay(8000)
  .then(() => {
    forEach(show, screens);
    document.onkeypress = interactionLoop;
  })
  ;
}

function handleVideo(stream) {
  video.src = window.URL.createObjectURL(stream);
}

function snapPhoto() {
  // ctx.drawImage(video,0,0,700,500);
  console.log(capture);
  return capture('./data/test-take.jpg')
  .then(x => console.log(x), e => console.error(e));
}

function sentPhoto() {
  // open a new window and load the image in it
  // http://www.w3schools.com/jsref/met_win_open.asp
  console.log("function sentPhoto called");
  const pic = document.getElementById("snapCanvas").toDataURL();
  const windowName = "webcamPhoto";
}

function timer(seconds) {
  if (equals(seconds, 0)) {
    countdownView.innerHTML = '';
    return when.resolve(seconds)  
  }

  countdownView.innerHTML = seconds;
  console.log(seconds)
  return when(seconds).delay(1000).then(compose(timer, dec))
}
