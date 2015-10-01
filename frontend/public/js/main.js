var piespermileApp = angular.module('piespermileApp', [
  'ngRoute', 'ngResource', 'mgcrea.ngStrap', 'leaflet-directive', 'nemLogging'
]);

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
      when('/about', {
        templateUrl: '/partials/about.html',
        controller: 'piespermileAboutController as ctrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

piespermileApp.controller('piespermileMainController', ['$log', '$location',
    function( $log, $location ) {
      $log.info('main controller initialising');
      var self = this;
    }
    ]);

piespermileApp.controller('piespermileRouteController', ['$log', 'piespermileRoute',
    function($log, piespermileRoute) {
      var controller = this;
      $log.info('route controller initialising');
      $log.info(piespermileRoute.start);
      var stamenTiles='//stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg';
      var tonerTiles='//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
      var osmTiles='http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
      var ocmTiles='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
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

piespermileApp.factory('piespermileRoute', ['$log',
  function($log) {
    // factory function body that constructs shinyNewServiceInstance
    return {
      start: 'the start',
      end: 'the end'
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
