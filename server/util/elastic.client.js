var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
//  log: 'trace',
  defer: function() {
    return Promise.defer();
  }
});

module.exports = client;
