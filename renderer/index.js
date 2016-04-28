const { injectTemplate } = require('./renderer');
const { streamWebcamTo, interactionLoop } = require('./controller');
const template = require('lodash/template');

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
 
let currentInteraction = null;

function start(user) {
  const { videoEl, countdownViewEl,
    screenIntroEl, screenColorEl,
    screenBWEl, screenTakePictureEl,
    screenExitEl } = injectTemplate(rootTmplEl, screenTemplate, user);

  const screens = { screenIntroEl, screenColorEl, screenBWEl,
    screenTakePictureEl, screenExitEl };

  streamWebcamTo(videoEl);

  document.addEventListener('keydown', (e) => {
    let currentInteraction =
      interactionLoop({ user, screens, countdownViewEl });
  });

  return currentInteraction;
}

start(testUser);


