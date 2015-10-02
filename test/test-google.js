'use strict';
var rewire = require('rewire');
var assert = require('assert');
var googleLib = rewire('../backend/route/google');

describe('google.js', function() {

  var gk;

  before(function() {
    gk=process.env.GOOGLE_API_KEY;
  })
  it('should set the value of google_key correctly', function() {
    assert.equal(googleLib.__get__('google_key'), gk);
  })

  describe('#getGoogleDirections', function() {
    var ggd;

    before(function() {
      ggd = googleLib.__get__('getGoogleDirections');
    })
    it('should throw if `from` undefined', function() {
      assert.throws(function() { ggd(); }, /'from' must be defined/);
    });
    it('should throw if `to` undefined', function() {
      assert.throws(function() { ggd('from'); }, /'to' must be defined/);
    });
    it('should work, setting default `DRIVING` if `mode` undefined', function() {
      assert(false, 'Need to complete this assertion');
    });
  })
});
