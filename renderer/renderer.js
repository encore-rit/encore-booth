function injectTemplate(rootEl, template, view) {
  rootEl.innerHTML = template(view);

  const video = document.querySelector("#webcamVideo");
  const countdownView = document.querySelector('#countdown');

  const screenIntro = document.querySelector('#screen-intro')
  const screenColor = document.querySelector('#screen-color');
  const screenBW = document.querySelector('#screen-bw');
  const screenTakePicture = document.querySelector('#screen-take-picture');
  const screenExit = document.querySelector('#screen-exit');
  
  return {
    videoEl: document.querySelector("#webcamVideo"),
    countdownViewEl: document.querySelector('#countdown'),

    screenIntroEl: document.querySelector('#screen-intro'),
    screenColorEl: document.querySelector('#screen-color'),
    screenBWEl: document.querySelector('#screen-bw'),
    screenTakePictureEl: document.querySelector('#screen-take-picture'),
    screenExitEl: document.querySelector('#screen-exit'),
  };
}

module.exports = {
  injectTemplate,
}
