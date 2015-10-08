'use strict';

var express = require('express');
var profile = require('./profile');

var app = express();

module.exports = {
  router: app,
  api: profile
};
