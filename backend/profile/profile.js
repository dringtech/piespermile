'use strict';

var debug = require('debug')('backend/profile');
var q = require('q');

var db = require('../database')('profile');

db.save('_design/profile', {
  views: {
    all: {
      map: function(doc) {
        emit(doc.id, doc);
      }
    },
    byTwitter: {
      map: function(doc) {
        if (doc.social.twitter.handle) {
          emit(doc.social.twitter.userId, doc);
        }
      }
    }
  }
});

var create = function() {
  var deferred = q.defer();
  db.save({}, function (err, res) {
    // Handle response
    if (err) { deferred.reject(err); }
    deferred.resolve(res);
  });
  return deferred.promise;
};

var addTwitter = function( doc, details ) {
  var deferred = q.defer();
  var update = {
    social: {
      twitter: {
        userId: details.user_id,
        handle: details.screen_name
      }}};
  db.merge(doc.id, update, function(err, res) {
    if (err) { deferred.reject(err); }
    deferred.resolve(res);
  });
  return deferred.promise;
};

var getByTwitter = function( id ) {
  var deferred = q.defer();
  if ( id == null ) { throw new Error('No ID provided '); }
  db.view('profile/byTwitter', { key: id }, function (err, doc) {
    if (err) { throw err; }
    if (!doc) { throw new Error('No document defined'); }
    if (doc.length != 1) {
      deferred.reject(new Error('Can\'t find id'));
    } else {
      deferred.resolve(doc[0]);
    }
  });
  return deferred.promise;
};

module.exports = {
  create: create,
  addTwitter: addTwitter,
  getByTwitter: getByTwitter
};
