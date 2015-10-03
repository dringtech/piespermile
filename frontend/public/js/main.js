var piespermileApp = angular.module('piespermileApp', [
  'ngRoute', 'ngResource', 'mgcrea.ngStrap', 'leaflet-directive', 'nemLogging'
]);

piespermileApp.filter('pievalue', ['$log', function($log) {
  var standard_pie=314; // A standard pie is 314 calories
  return function(calories) {
    var pies = calories / standard_pie;
    return pies.toFixed(1);
  }
}]);

piespermileApp.filter('calories', ['$log', function($log) {
  var biking  = 40/1000; // cals per metre
  var walking = 94/1000; // cals per metre

  return function(aRoute) {
    var calories = aRoute.modes['walking'] * walking + aRoute.modes['bicycling'] * biking;
    return calories;
  };
}]);

piespermileApp.filter('mileize', ['$log', function($log) {
  return function(distanceInMetres) {
    var distance = distanceInMetres * 0.000621371;
    return distance.toFixed(2) + " Miles";
  };
}]);

piespermileApp.filter('getModes', ['$log', function($log) {
  return function(aRoute) {
    return Object.keys(aRoute.modes).filter(function(x) {
      return aRoute.modes[x] > 0;
    }).join(', ');
  };
}]);

piespermileApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'piespermileMainController as ctrl'
      }).
      when('/route', {
        templateUrl: '/partials/route.html',
        controller: 'piespermileRouteController as ctrl'
      }).
      when('/map', {
        templateUrl: '/partials/map.html',
        controller: 'piespermileMapController as ctrl'
      }).
      when('/about', {
        templateUrl: '/partials/about.html',
        controller: 'piespermileAboutController as ctrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

piespermileApp.controller('piespermileMainController', ['$log', '$location', 'piespermileRoute',
    function( $log, $location, piespermileRoute ) {
      $log.info('main controller initialising');
    }
    ]);

piespermileApp.controller('piespermileRouteController', ['$log', 'piespermileRoute',
  function($log, piespermileRoute) {
    var controller = this;
    var self = this;
    self.start = 'Hebden Bridge Town Hall, St George\'s St, Hebden Bridge, West Yorkshire HX7 7BY';
    self.end = 'Town Hall, Crossley Street, Halifax, West Yorkshire, HX1 1UJ.';
    self.go = function() {
      piespermileRoute.getRoute(self.start, self.end);
    }
    controller.routes = piespermileRoute.result;
  }
  ]);

piespermileApp.controller('piespermileMapController', ['$log', 'piespermileRoute',
    function($log, piespermileRoute) {
      var controller = this;

      var stamenTiles='//stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg';
      var tonerTiles='//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
      var osmTiles='http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
      var ocmTiles='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
      controller.result=piespermileRoute.result;
      angular.extend(controller, {
        defaults: {
          tileLayer: osmTiles,
          path: {
            weight: 10,
            color: '#800000',
            opacity: 1
          }
        }
      })
      // Centre this on Hebden Bridge...
      angular.extend(controller, {
        center: {
          lat: 53.7399227,
          lng: -1.989244,
          zoom: 13
        }
      });
    }
    ]);

piespermileApp.controller('piespermileAboutController', ['$log',
    function($log) {
        $log.info('about controller initialising');
    }
    ]);

piespermileApp.factory('piespermileRoute', ['$log', '$resource',
  function($log, $resource) {
    // factory function body that constructs shinyNewServiceInstance
    var route = $resource('/api/route/:from/:to');
    var routeInfo = null;
    var getRoute = function(start, end) {
      $log.info('getting route');
      if (start != null || end != null) {
        $log.info('Route ' + start + ' -> ' + end)
        var call = route.query({from: start, to: end}, function(returned) {
            $log.info(returned);
            routeInfo = returned;
          });
      }
      return null;
    }
    return {
      getRoute: getRoute,
      result: function() { return routeInfo; }
    };
  }
  ]);

// Copyright 2015 Giles Dring

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
