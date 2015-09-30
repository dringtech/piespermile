var piespermileApp = angular.module('piespermileApp', [
  'ngRoute', 'ngResource', 'mgcrea.ngStrap'
]);

piespermileApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'piespermileMainController as ctrl'
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

piespermileApp.controller('piespermileAboutController', ['$log',
    function($log) {
        $log.info('about controller initialising');
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
