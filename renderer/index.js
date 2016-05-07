// const API = 'http://localhost:1339';
const API = 'http://encore-api.herokuapp.com';

const { injectTemplate } = require('./renderer');
const { streamWebcamTo, interactionLoop } = require('./controller');
const template = require('lodash/template');
const socket = require('socket.io-client')(API);
const { merge } = require('ramda');
const ipcRenderer = require('electron').ipcRenderer;
require('whatwg-fetch');

const screenTemplate = template(require('./template'));
const rootTmplEl = document.querySelector('#screen-template');


/**
 * Insert socket.io logic
 *
 * Take latest user
 * Inject template DOM for user
 * Setup event handler
 *   Start interaction loop
 *   
 */ 

function start(user, cb) {
  const { videoEl, countdownViewEl,
    screenIntroEl, screenColorEl,
    screenBWEl, screenTakePictureEl,
    screenExitEl } = injectTemplate(rootTmplEl, screenTemplate, user);

  const screens = { screenIntroEl, screenColorEl, screenBWEl,
    screenTakePictureEl, screenExitEl };

  console.log('start() called with', user)

  streamWebcamTo(videoEl);

  ipcRenderer.on('buttonClick', (e) => {
    ipcRenderer.removeAllListeners('buttonClick');
    interactionLoop({ user, screens, countdownViewEl })
      .then(cb);
  });

  // document.onkeypress = (e) => {
  //   document.onkeypress = undefined;
  //   interactionLoop({ user, screens, countdownViewEl })
  //     .then(cb);
  // };
}

console.log(ipcRenderer)

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.emit('TAKE_TAKER');

socket.on('SEND_TAKER', (taker) => {
  console.log('received SEND_TAKER', taker)
  socket.emit('TOOK_TAKER', taker);

  start(taker, (res) => {
    console.log('sending READY_TAKER', taker, res);
    console.log(merge(taker, { photos: res }));

    fetch(`${API}/users/${taker._id}/ready`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        photos: res,
      })
    })
    .then(() => {
      console.log('finished posting')
      socket.emit('TAKE_TAKER') 
    });
  });
});
