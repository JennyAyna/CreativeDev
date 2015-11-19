var logo,
    radiusX,
    radiusY,
    magnets = [],
    triesForTarget;

//SETUP_________________________________________________________________________
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var myState = audioCtx.state;

audioCtx.onstatechange = function() {
  console.log(audioCtx.state);
}

var analyser = audioCtx.createAnalyser();
var frequencyData = new Uint8Array(analyser.frequencyBinCount);

var audioBuffer;
var audioSource;
var filter;
var request = new XMLHttpRequest();

var polygons = [];
var s = [];

var currentTime = 0;
var dt = 0;
var now = Date.now();
var lt = now;

var size = 0;

//LOAD IMAGE & SONG_____________________________________________________________
function preload() {
  /** SONG **/
  request.open('GET', '/song/song6.mp3', true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {

  audioCtx.decodeAudioData(request.response, function(buffer) {

  // success callback
  audioBuffer = buffer;

  // Create sound from buffer
  audioSource = audioCtx.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(analyser);
  // connect the audio source to context's output
  analyser.connect(audioCtx.destination);

  // Create filter
  filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";

  // Pipe the song into the filter, and the filter into the offline context
  audioSource.connect(filter);
  filter.connect(audioCtx.destination);

  // play sound
  audioSource.start(0);

  }, function(){
  // error callback
  });
  }
  request.send();

  /** IMAGE **/
  logo = loadImage(setImageSize());

}

//TARGET IMAGE__________________________________________________________________
function setImageSize() {
    //nbre de coordonées à checker pour savoir où le pixel 255 se trouve
  	triesForTarget = 80;
    return "note.jpg";
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    colorMode(HSB, 100, 100, 100, 100);

    for(var l = 0; l < 1; l++){
      var polygon = new Pulse({
        x: 0,
        y: 0,
        radius: 0,
        npoints: 5 * 1.5,
        alpha: 0.1
      });

      polygons.push(polygon);

    }
}

function draw() {

    now = Date.now();
    dt = now - lt;
    lt = now;

    currentTime += dt;

    analyser.getByteFrequencyData(frequencyData);

    background(600, 25, 19, 100);

    // var x = (Math.random()*200)-100;
    // var y = (Math.random()*2)-100;

    var x = 100;
    var y = 200;

    var position = createVector(x, y); // Position d'où viennent les particules
    var target = findTarget(); // Position de la coordonnée targetée sur l'image

    var cumul = 0;

    for(var k = 0; k < frequencyData.length; k++){
      cumul += frequencyData[k];
      stroke('rgba(255, 255, 255, 0.25)');
      strokeWeight(15);
      ellipse(0+k*5, window.innerHeight, 400, (frequencyData[k]+11));
    }

    // Moyenne des fréquences de la song
    var average = cumul/frequencyData.length;

    if(currentTime > 1813 && average > 10){
      currentTime = 0;
      var polygon = new Pulse({
        x: 0,
        y: 0,
        radius: 200,
        npoints: average,
        alpha: 0.1
      });
      polygons.push(polygon);
    }

    size = average/2;

    var elapsedSeconds = millis() / 1000.0;

    //SUN_______________________________________________________________________
    var sun = new Sun({
      radius: size * 5
    });

    sun.draw();

    if(average > 10){
      var magnet = new Magnet({
        position: position,
        target: target,
        size: size,
        alpha: noise(
            40000,
            target.y,
            // peut être changé par les valeurs frequencyData[i] ?
            12
        )
      });
      magnets.push(magnet);
    }

    for (var i = 0; i < magnets.length; i++) {
        magnets[i].update();
        magnets[i].draw(size);
        magnets[i].size -= 1;


        if(magnets[i].lifespan == 0){
          magnets.splice(i, 1);
        }
    }



    translate(width*0.5, height*0.5);
    rotate(frameCount / 50.0);

    //POLYGON___________________________________________________________________
    for(k = 0; k < polygons.length; k++){

      if(!polygons[k].isAlive){
        polygons.splice(k, 1);
      }

      if(polygons[k]){
        polygons[k].draw();
        polygons[k].update();
      }
    }
}

//CRÉER UNE COORDONNÉE SUR L'IMAGE______________________________________________
function findTarget() {
    var x, y;
    for (var i = 0; i < triesForTarget; i++) {
        x = floor(random(logo.width));
        y = floor(random(logo.height));
        if (red(logo.get(x, y)) < 255) break;
    }
    return createVector(x + (width / 2 - logo.width / 2), y + (height / 2 -
      logo.height / 2));
}
