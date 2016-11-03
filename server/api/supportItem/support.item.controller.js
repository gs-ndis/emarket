'use strict';

var _ = require('lodash');
var SupportItem = require('./support.item.model');
var errorSender = require('../../util/errorSender');

exports.index = function(req, res) {
  SupportItem.find().then(function(supportItems) {
    return res.json(200, supportItems);
  }).catch(function(err) {
    return errorSender.handleError(res, err);
  });
};
