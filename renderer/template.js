module.exports = `
  <div id="screen-exit" class="screen">
    <header class="screen-exit-header header">
      <h1>ROCK ON!!</h1>

      <img src="images/<%= artistKey %>/color.jpg"
           class="pose-res pose-res-1" />
      <img src="images/<%= artistKey %>/color.jpg"
           class="pose-res pose-res-2" />
      <img src="images/<%= artistKey %>/color.jpg"
           class="pose-res pose-res-3" />
    </header>

    <h4 class="pose-exit">Exit to the lounge to edit your</br>
        photo and add your memory</h4>
  </div>

  <div id="screen-take-picture" class="screen">
    <header class="screen-take-picture-header header">
      <h1>STAND BACK</h1>
      <p>You have 3 chances to get it right!</p>
    </header>

    <h1 id="countdown" class="countdown"></h1>

    <video autoplay="true" id="webcamVideo" class="webcamVideo"></video>
    <img src="images/<%= artistKey %>/cutout.png" class="pose-img-overlay" />
  </div>

  <div id="screen-bw" class="screen">
    <header class="screen-bw-header header">
      <h1>STAND BACK</h1>
      <p>You have 3 chances to get it right!</p>

      <img src="images/<%= artistKey %>/bw-color.png" class="pose-img" />
    </header>
  </div>

  <div id="screen-color" class="screen">
    <header class="screen-color-header header">
      <h1>LET'S DO THIS</h1>
      <p>
        You're about to take 3<br />
        consecutive photos mimicking<br />
        <%= artist %>
      </p>

      <img src="images/<%= artistKey %>/color.jpg" class="pose-img" />
    </header>
  </div>

  <div id="screen-intro" class="screen">

    <video autoplay loop muted src="images/<%= artistKey %>/video.mp4"
      id="music-video" class="music-video"></video>

    <header class="screen-intro-header header">
      <h2>ARE YOU READY</h2>
      <h1>TO ROCK?</h1>
    </header>
  </div>
`;
