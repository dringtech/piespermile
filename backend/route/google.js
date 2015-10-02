'use strict';

var q = require('q');
var googleKey=process.env.GOOGLE_API_KEY;
var request = require('request');
var Route = require('./route').Route;

const WALKING_MODE='walking';
const DRIVING_MODE='driving';
const CYCLING_MODE='bicycling';
const TRANSIT_MODE='transit';

var arraySum = function(prev, curr) {
  return prev + curr;
};

var getDistance = function(path) {
  if (path.length === 0) {
    return 0;
  } else {
    return path.
      map(function(x) { return x.distance.value; }).reduce(arraySum);
  }
};

var totalDistance = function(route) {
  return getDistance(route.legs);
};

var routeModes = function(route) {
  var modes = [WALKING_MODE, CYCLING_MODE, DRIVING_MODE, TRANSIT_MODE];

  var getModes = function(leg, mode) {
    var matching = leg.steps.
      filter(function(x) {
        return (x.travel_mode.toLowerCase() === mode);
      });
    return getDistance(matching);
  };
  var getDistances = function(segment, mode) {
    return segment.map(function(x) {
      return getModes(x, mode);
    }).reduce(arraySum);
  };

  return modes.
    map(function(mode) {
      return [
        mode,
        getDistances(route.legs, mode)
      ];
    }).
    reduce(function(result, current) {
      result[current[0]] = current[1];
      return result;
    }, {});
};

var getGoogleDirections=function(from, to, mode) {
  if (from == null) throw "'from' must be defined";
  if (to == null) throw "'to' must be defined";
  if (mode == null) mode = DRIVING_MODE;
  var deferred = q.defer();
  var options = {
    origin: from,
    destination: to,
    mode: mode,
    key: googleKey
  };
  var params = Object.keys(options).map(function(k) { return k + '=' + encodeURIComponent(options[k]) ;}).join('&');
  var apiCall = 'https://maps.googleapis.com/maps/api/directions/json?'+params;
  request(apiCall, function (error, response, body) {
    if (error !== null) { throw error; }
    if (response.statusCode === 200) {
      var res = JSON.parse(body);
      var route = new Route();
      route.setSource(JSON.parse(body));
      route.setDistance( totalDistance(res.routes[0]) );
      route.setModes( routeModes( res.routes[0] ));
      deferred.resolve(route);
    } else {
      throw response.statusMessage + ' (HTTP ' + response.statusCode + ')';
    }
  });
  return deferred.promise;
};

var getCarRoute=function(from, to) {
  return getGoogleDirections(from, to, DRIVING_MODE);
};

var getWalkingRoute=function(from, to) {
  return getGoogleDirections(from, to, WALKING_MODE);
};

var getCyclingRoute=function(from, to) {
  return getGoogleDirections(from, to, CYCLING_MODE);
};

var getTransitRoute=function(from, to) {
  return getGoogleDirections(from, to, TRANSIT_MODE);
};

var getRoutes = function(from, to) {
  return q.all([
    getCarRoute(from,to),
    getWalkingRoute(from,to),
    getCyclingRoute(from,to),
    getTransitRoute(from,to)
  ]);
};

module.exports = {
  getRoute: getRoutes
};
