var ppmAuth = angular.module('ppm.auth', []);

ppmAuth.factory('ppmAuthTwitter', ['$http', '$window', '$log',
  'ppmAuthSession',
  function ($http, $window, $log, Session) {
    var twitterAuthService = {};
    var authUrl = 'https://api.twitter.com/oauth/authenticate?oauth_token=';

    twitterAuthService.loginWithTwitter = function () {
      return $http
        .get('/auth/twitter')
        .then(function (res) {
          // Redirect to twitter login
          $window.location.href = authUrl + res.data.request_token;
        });
    };

    return twitterAuthService;
  }]);

ppmAuth.service('ppmAuthSession', [
  function () {
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };
  }]);
