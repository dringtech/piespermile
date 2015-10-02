var q = require('q');
var google_key=process.env.GOOGLE_API_KEY;
var request = require('request');

const WALKING_MODE='walking';
const DRIVING_MODE='driving';
const CYCLING_MODE='bicycling'
const TRANSIT_MODE='transit';

var getGoogleDirections=function(from, to, mode) {
  if (from == null) throw "'from' must be defined";
  if (to == null) throw "'to' must be defined";
  if (mode == null) mode = DRIVING_MODE;
  var deferred = q.defer();
  var options = {
    origin: from,
    destination: to,
    mode: mode,
    key: google_key
  }
  params = Object.keys(options).map(function(k) { return k + '=' + encodeURIComponent(options[k]) ;}).join('&')
  var api_call = 'https://maps.googleapis.com/maps/api/directions/json?'+params;
  request(api_call, function (error, response, body) {
    if (error != null) throw error;
    if (response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    } else {
      throw response.statusMessage + ' (HTTP ' + response.statusCode + ')';
    }
  })
  return deferred.promise;
}

var getCarRoute=function(from, to) {
  return getGoogleDirections(from, to, DRIVING_MODE);
}

var getWalkingRoute=function(from, to) {
  return getGoogleDirections(from, to, WALKING_MODE);
}

var getCyclingRoute=function(from, to) {
  return getGoogleDirections(from, to, CYCLING_MODE);
}


var getTransitRoute=function(from, to) {
  return getGoogleDirections(from, to, TRANSIT_MODE);
}

var getRoutes = function(from, to) {
  return q.all([
    getCarRoute(from,to),
    getWalkingRoute(from,to),
    getCyclingRoute(from,to),
    getTransitRoute(from,to)
  ]);
}


module.exports = {
  getRoute: getRoutes
}
