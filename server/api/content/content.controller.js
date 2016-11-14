'use strict';

var config = require('../../config/environment');
var errorSender = require('../../util/errorSender');
var fs = require('fs');

exports.index = function(req, res) {
  fs.readFile(config.contentfulFilePath, 'utf-8', function(err, data) {
    res.json(200, JSON.parse(data) || {});
  });
//  var data = require(config.contentfulFilePath) || {};
//  return res.json(200, data);
};