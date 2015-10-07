'use strict';

var debug = require('debug')('backend/auth/twitter');
var q = require('q');
var qs = require('querystring');
var request = require('request');

var db = require('../database')('twitter_oauth');

var twitterEndpoint = 'https://api.twitter.com/';

var key = process.env.TWITTER_CONSUMER_KEY;
var secret = process.env.TWITTER_CONSUMER_SECRET;

var getCallback = function(req) {
  return req.protocol + '://' + req.get('host') + '/' + 'auth/twitter/callback';
};

var getRequestToken = function(req, res) {
  var apiUrl = twitterEndpoint + 'oauth/request_token';

  var oauth = {
    consumer_key: key,
    consumer_secret: secret,
    callback: getCallback(req)
  };

  request.post({url: apiUrl, oauth: oauth}, function(error, response) {
    if (error) { throw error; }
    var oauth = qs.parse(response.body);
    oauth.timestamp = Date.now();
    oauth.type = 'request_token';
    if ( oauth.oauth_callback_confirmed ) {
      delete oauth.oauth_callback_confirmed;
      db.save( oauth, function(err, dbRes) {
        res.json({ request_token: oauth.oauth_token });
      });
    } else {
      res.status('500').send({error: 'something bad happened...'});
    }
  });

  // return deferred.promise;
};

var handleCallback = function(req, res) {
  convertRequestToAccess(req, req.query.oauth_verifier)
    .then(function(output) {
      res.cookie('oauth_token', output.oauth_token);
      res.json(output);
    });
};

var convertRequestToAccess = function(req, verifier) {
  var apiUrl = twitterEndpoint + '/oauth/access_token';
  var deferred = q.defer();

  var oauth = {
    consumer_key: key,
    consumer_secret: secret,
    token: req.query.oauth_token,
    verifier: req.query.oauth_verifier
  };

  request.post({url: apiUrl, oauth: oauth}, function(error, response) {
      if (error) { throw error; }
      var output = qs.parse(response.body);
      deferred.resolve(output);
    });
  return deferred.promise;
};

module.exports = {
  getRequestToken: getRequestToken,
  handleCallback: handleCallback
};
