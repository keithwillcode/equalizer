
var output = document.getElementById('output');
var canvas = document.getElementById('equalizerCanvas');
var canvasContext = canvas.getContext('2d');
var color = 'rgba(88, 197, 67, 0.3)';
var filesDropped = null;
var audioIndex = 0;

var audio = document.createElement('audio');
var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var animationFrame = null;
var isPaused = false;

audio.addEventListener('ended', function() {
  audio.currentTime = 0;

  if (audioIndex <= filesDropped.length - 1)
    playAudio(filesDropped[audioIndex++]);
});
source = audioContext.createMediaElementSource(audio);
source.connect(analyser);

// GAIN
if (!audioContext.createGain)
    audioContext.createGain = audioContext.createGainNode;

var gainNode = audioContext.createGain();
source.connect(gainNode);
gainNode.connect(audioContext.destination);

function stopEvent (event) {
  event.preventDefault();
  event.stopPropagation();
}

function windowResize () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.onresize = windowResize;
windowResize();

function reduce (array, size) {
  if (size >= array.length) { return array; }
  var newArray = [];
  var step = parseInt(array.length / size);
  
  for (var i = 0; i < array.length; i += step) {
    var sum = 0;
    for (var j = 0; j < step && (i + j) < array.length; j++) {
      sum += array[i + j];
    }
    newArray.push(parseInt(sum / step));
  }
  
  return newArray;
}

function renderFrame (audio, analyser) {
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencyData);
  frequencyData = reduce(frequencyData, canvas.width / 10);
  
  var columnWidth = canvas.width / frequencyData.length;
  var columnHeight = canvas.height / 255;
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'rgba(0, 0, 0, 0.3)';
  canvasContext.strokeStyle = color;
  canvasContext.lineCap = 'round';
  
  canvasContext.beginPath();
  canvasContext.moveTo(0, canvas.height);
  for (var i = 1; i < frequencyData.length; i++) {
    canvasContext.lineTo(i * columnWidth, canvas.height - 10 - frequencyData[i] * columnHeight);
  }
  canvasContext.lineTo(canvas.width, canvas.height);
  canvasContext.closePath();
  canvasContext.fill();
  canvasContext.stroke();
  
  animationFrame = requestAnimationFrame(function () {
    renderFrame(audio, analyser);
  });
}

function playAudio (file) {
  var url = URL.createObjectURL(file);
  audio.autoplay = true;
  audio.src = url;
  audio.play();
  $('h1').html(file.name);
  cancelAnimationFrame(animationFrame);
  renderFrame(audio, analyser);
}

function continueAudio() {
  $('#toggleTunes').html('Pause Tunes');
  audio.play();
  isPaused = false;
}

function pauseAudio() {
  $('#toggleTunes').html('Continue Tunes');
  audio.pause();
  isPaused = true;
}

function dropAudio (event) {
  $('#controls').fadeIn().css('display', 'flex');
  stopEvent(event);
  filesDropped = event.originalEvent.dataTransfer.files;
  audioIndex = 0;
  playAudio(filesDropped[audioIndex++]);
}

function toggleAudio () {
  if (isPaused)
    continueAudio();
  else
    pauseAudio();
}

function changeVolume(rangeElement) {
  var volume = rangeElement.value;
  console.log(volume);
  var fraction = parseInt(rangeElement.value) / parseInt(rangeElement.max);
  gainNode.gain.value = fraction * fraction;
}

setInterval(function() {
  var r = getRandomNumberBetween(0, 256);
  var g = getRandomNumberBetween(0, 256);
  var b = getRandomNumberBetween(0, 256);

  color = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.6)';
}, 3000);

function getRandomNumberBetween(from, to) {
  return Math.floor((Math.random() * to) + from + 1);
}

$(window)
  .on('dragover', stopEvent)
  .on('dragenter', stopEvent)
  .on('drop', dropAudio)
  .keypress(function(e) {
    if (e.keyCode == 0 || e.keyCode == 32) {
      toggleAudio();
    }
  });

$('#toggleTunes').on('click', function(e) {
  toggleAudio();
  this.blur();
});