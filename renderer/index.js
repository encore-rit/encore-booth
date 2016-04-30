const { injectTemplate } = require('./renderer');
const { streamWebcamTo, interactionLoop } = require('./controller');
const template = require('lodash/template');
const socket = require('socket.io-client')('http://localhost:1339');

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

const testUser = {
  userId: 'blah-blah-blah',
  artistKey: 'elvis',
  artist: 'Elvis',
};
 
function start(user) {
  const { videoEl, countdownViewEl,
    screenIntroEl, screenColorEl,
    screenBWEl, screenTakePictureEl,
    screenExitEl } = injectTemplate(rootTmplEl, screenTemplate, user);

  const screens = { screenIntroEl, screenColorEl, screenBWEl,
    screenTakePictureEl, screenExitEl };

  streamWebcamTo(videoEl);

  return new Promise((resolve, reject) => {
    document.addEventListener('keydown', (e) => {
      interactionLoop({ user, screens, countdownViewEl })
        .then(resolve, reject);
    });
  })
}

socket.on('connect', () => {
  console.log('connected to server');
});

socket.emit('CONSUME_TAKER');

socket.on('CONSUME_TAKER_JOB', (job) => {
  console.log('New taker job', job.data.payload);

  start(job.data.payload).then((res) => {
    socket.emit('CONSUMED_TAKER');
    socket.emit('CONSUME_TAKER');
  });
})

// start(testUser);


