'use strict';

var contentful = require('contentful');
var config = require('../config/environment');
var _ = require('lodash');
var Promise = require('bluebird');

var client = contentful.createClient({
  accessToken: config.contentful.accessToken,
  space: config.contentful.space
});


var refreshCache = Promise.method(function() {
  console.log('Refreshing contentful cache...');
  var query = {};
//query.content_type = '2PqfXUJwE8qSYKuM0U6w8M';
//query.content_type = 'helpBlock';

  var p = client.getEntries(query);

  return p.then(function(data) {
    var fs = require('fs');
    fs.writeFileSync(config.contentfulFilePath, JSON.stringify(data, null, 2));
  });
});

function print(json) {
  console.log(JSON.stringify(json, null, 2));
}

//client.getEntry('iZG4tZCe1Gag6ogsweM6Q').then(function(data) {
//  print(data);
//});


module.exports = client;

module.exports.refreshCache = refreshCache;

