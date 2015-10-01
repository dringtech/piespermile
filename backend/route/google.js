var q = require('q');
var google_key=process.env.GOOGLE_API_KEY;
var request = require('request');

// TODO REFACTOR this

var getCarRoute=function(from, to) {
  var deferred = q.defer();
  var api_call = 'https://maps.googleapis.com/maps/api/directions/json?origin='+from+'&destination='+to+'&sensor=false&key='+google_key

  request(api_call, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    }
  })

  return deferred.promise;
}

var getCyclingRoute=function(from, to) {
  var deferred = q.defer();
  var api_call = 'https://maps.googleapis.com/maps/api/directions/json?mode=bicycling&origin='+from+'&destination='+to+'&sensor=false&key='+google_key

  request(api_call, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    }
  })

  return deferred.promise;
}

var getWalkingRoute=function(from, to) {
  var deferred = q.defer();
  var api_call = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin='+from+'&destination='+to+'&sensor=false&key='+google_key

  request(api_call, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    }
  })

  return deferred.promise;
}

var getTransitRoute=function(from, to) {
  var deferred = q.defer();
  var api_call = 'https://maps.googleapis.com/maps/api/directions/json?mode=transit&origin='+from+'&destination='+to+'&sensor=false&key='+google_key

  request(api_call, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    }
  })

  return deferred.promise;
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
