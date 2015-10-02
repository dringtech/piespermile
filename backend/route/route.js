'use strict';

var Route = function Route() {
  this.distance = null;
  this.modes = {};
  this.source = null;
};

Route.prototype.setDistance = function(dist) {
  this.distance = dist;
};

Route.prototype.setModes = function(props) {
  var self = this;
  var mapMode = function(k, v) {
    if (self.modes.hasOwnProperty(k)) {
      self.modes[k] += v;
    } else {
      self.modes[k] = v;
    }
  };
  Object.keys(props).map(function(k) {
    mapMode(k, props[k]);
  });
};

Route.prototype.setSource = function(source) {
  this.source = source;
};

Route.prototype.getDistanceForMode = function(mode) {
  if (mode == null) mode = 'walking';
  return this.modes[mode];
};

module.exports = {
  Route: Route
};
