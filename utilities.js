module.exports.jsonResponse = function jsonResponse(data, response) {
    var jsonData = JSON.stringify(data);
    response.writeHead(200, 'application/json');
    response.end(jsonData);	
};

module.exports.emptyResponse = function emptyResponse(response) {
    response.writeHead(200);
    response.end();
};

module.exports.statusResponse = function statusResponse(status, response) {
    response.writeHead(status);
    response.end();
};

module.exports.isAvailable = function isAvailable(arguments) {
  for (i = 0; i < arguments.length; i++)
    if (arguments[i] === undefined)
      return false;

  return true;
};

module.exports.clone = function clone(object) {
	var clone = {};
	
	for(var prop in object)
		clone[prop] = object[prop];
		
	return clone;
};
