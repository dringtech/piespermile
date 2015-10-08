'use strict';

var debug = require('debug')('backend/auth/twitter');
var q = require('q');
var qs = require('querystring');
var request = require('request');

var db = require('../database')('twitter_oauth');
var profile = require('../profile').api;

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
};

var handleCallback = function(req, res) {
  convertRequestToAccess(req, req.query.oauth_verifier)
    .then(getOrCreateProfile)
    .then(function(output) {
      res.cookie('profile_id', output.id);
      res.json(output);
    });
};

// Asynchronous calls

var convertRequestToAccess = function(req, verifier) {
  var deferred = q.defer();
  var apiUrl = twitterEndpoint + '/oauth/access_token';

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

var getOrCreateProfile = function( twitterDetails ) {
  var deferred = q.defer();

  profile.getByTwitter(twitterDetails.user_id)
    .then(function(result) {
      debug('Got a Profile');
      deferred.resolve(result);
    })
    .fail(function(error) {
      debug('Creating new Profile');
      profile.create()
        .then(function(result) {
          debug('Adding twitter details Profile');
          return profile.addTwitter(result,twitterDetails);
        })
        .then(function(result) {
          deferred.resolve(result);
        })
        .done();
    })
    .done();
  return deferred.promise;
};

module.exports = {
  getRequestToken: getRequestToken,
  handleCallback: handleCallback
};
