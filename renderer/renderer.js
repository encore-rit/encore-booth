const { remote } = require('electron');
const capture = remote.require('./main/capture');

const video = document.querySelector("#webcamVideo");
const countdownView = document.getElementById('countdown');

document.onkeypress = countdownCB;

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.oGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, handleVideo, console.error);
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
  // Sending the image data to Server
  // $.ajax({
  //   type: 'POST',
  //   url: '/user/1254/photos',
  //   data: '{ "PictureData" : "' + pic + '" }',
  //   contentType: 'application/json; charset=utf-8',
  //   dataType: 'json',
  //   success: function (msg) {
  //     alert("Done, Picture Uploaded.");
  //   }
  // });
}

function countdownCB() {
  countdown(3);
}

//countdown and snap a photo from webcam once the countdown is finish
function countdown(length) {
  let second = 0,
  interval = setInterval(function() {
    console.log(countdownView);
    countdownView.innerHTML = (length - second);

    if (second >= length) {
      snapPhoto();
      clearInterval(interval);
    }
    second++;
  }, 1000);
}

