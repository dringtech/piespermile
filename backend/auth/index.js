'use strict';

var express = require('express');
var debug = require('debug')('backend/auth');

var twitter = require('./twitter');

var router = express();

router.route('/auth/twitter').
  get(twitter.getRequestToken);

router.route('/auth/twitter/callback')
  .get(function(req, res) {
    twitter.handleCallback(req, res);
  });

module.exports = router;
