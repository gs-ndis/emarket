'use strict';

var _ = require('lodash');
var VariantConfiguration = require('./variant.configuration.model');
var errorSender = require('../../util/errorSender');

exports.index = function(req, res) {
  VariantConfiguration.find().then(function(variantConfigurations) {
    return res.json(200, variantConfigurations);
  }).catch(function(err) {
    return errorSender.handleError(res, err);
  });
};
