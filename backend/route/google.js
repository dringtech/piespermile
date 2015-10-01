var q = require('q');
var google_key=process.env.GOOGLE_API_KEY;
var request = require('request');

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

module.exports = {
  getRoute: getCarRoute
}
