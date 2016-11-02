'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/emarket-dev'
  },
  domain: 'dev.emarket.com:9000',
  seedDB: true
};