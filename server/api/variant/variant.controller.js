'use strict';

var _ = require('lodash');
var Variant = require('./variant.model');
var errorSender = require('../../util/errorSender');

exports.index = function(req, res) {
  Variant.find().then(function(variants) {
    return res.json(200, variants);
  }).catch(function(err) {
    return errorSender.handleError(res, err);
  });
};
