'use strict';

var config = require('../../config/environment');
var errorSender = require('../../util/errorSender');
var contentfulClient = require('../../util/contentful.client');
var fs = require('fs');

exports.index = function(req, res) {
  fs.readFile(config.contentfulFilePath, 'utf-8', function(err, data) {
    res.json(200, JSON.parse(data) || {});
  });
};

exports.refreshCache = function(req, res) {
  contentfulClient.refreshCache().then(function() {
    res.send(200);
  }, function(err) {
    res.send(500, err);
  });
};

