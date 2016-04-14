// initialize some globals
var canvas = document.querySelector('#snapCanvas');
var ctx = canvas.getContext('2d');
var video = document.querySelector("#webcamVideo");

document.querySelector('#snapPhoto').onclick = snapPhoto;
document.querySelector('#sentPhoto').onclick = sentPhoto;
document.querySelector('#startCountdownButton').onclick = countdown;
navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  navigator.oGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
  video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
  // do something
}

function snapPhoto() {
  ctx.drawImage(video,0,0,700,500);
}

function sentPhoto() {
  // open a new window and load the image in it
  // http://www.w3schools.com/jsref/met_win_open.asp
  console.log("function sentPhoto called");
  var pic = document.getElementById("snapCanvas").toDataURL();
  var windowName = "webcamPhoto";
  // Sending the image data to Server
  $.ajax({
    type: 'POST',
    url: '/user/1254/photos',
    data: '{ "PictureData" : "' + pic + '" }',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
      alert("Done, Picture Uploaded.");
    }
  });
}

//countdown and snap a photo from webcam once the countdown is finish
function countdown() {
  var countdown = document.getElementById('countdown'),
  seconds = 4,
  second = 0,
  interval;
  interval = setInterval(function() {
    countdown.firstChild.data = (seconds - second);
    if (second >= seconds) {
      snapPhoto();
      clearInterval(interval);
    }
    second++;
  }, 1000);
}

