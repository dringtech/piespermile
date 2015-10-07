'use strict';

var cradle = require('cradle');
var debug = require('debug')('backend/database');

cradle.setup({
  host: '192.168.99.100',
  cache: true,
  raw: false,
  forceSave: true
});

module.exports = function(dbName) {
  var db = new (cradle.Connection)().database(dbName);

  db.exists(function (err, exists) {
    if (err) {
      throw err;
    } else if (!exists) {
      debug('Creating "' + dbName + '" database');
      db.create();
      /* populate design documents */
    } else {
      debug('"' + dbName + '" database exists');
    }
  });
  return db;
};
