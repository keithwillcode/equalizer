var express = require('express'); 
var utils = require('./utilities.js');
var audioController = require('./audioController.js');

var _audioController = new audioController();

var app = express();
app.use(express.query());
app.use(express.bodyParser());

app.get('/audio/download', _audioController.download);

app.use(express.static('static'));

var port = 8080;

if (process.argv[2])
  port = process.argv[2];

app.listen(port);
console.log('equalizer now running on port ' + port);

