'use strict';

// var mongoose = require('mongoose');
var debug = require('debug')('backend/route');

// Make connection to MongoDB
// var mongoose = require('mongoose');
// var mongo_connection = process.env.MONGO_DB;
// debug('Mongoose connection = ' + mongo_connection);
// mongoose.connect(mongo_connection);

var express = require('express');
// var restify = require('express-restify-mongoose');
var google = require('./google');

// Set up routes
var router = express();
// var options = {
//     findOneAndUpdate: false,
//     lowercase: true,
//     strict: true,
//     fullErrors: true
// };
// restify.serve(router, model.DataSet, options);

router.route('/api/route/:from/:to')
  .all(function(req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next();
  })
  .get(function(req, res) {
    debug('Planning ' + req.params.from + ' -> ' + req.params.to);
    // res.json(...);
    var r = google.getRoute(req.params.from, req.params.to);
    r.then(function(output) {
      res.json(output);
    });
  });

module.exports = router;

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
