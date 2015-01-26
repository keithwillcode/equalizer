var audioController = function audioController() {
    this.download = function (request, response) {
        var fs = require('fs');
        var songName = request.params.name;
        var songBytes = [];

        fs.readFile('./audio/' + songName, function(err, data) {
            if (err) {
                console.log('Encountered an error: ' + err);
                return;
            }

            var headers = {
                'Content-Length': data.length,
                'Content-Disposition': 'inline; filename="' + songName + '"'
            };

            response.writeHead(200, headers);
            response.write(data);            
            response.end();
        });        
    };
};

module.exports = audioController;