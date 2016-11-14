'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/emarket-dev'
  },
  domain: 'localhost:9000',
  seedDB: true,
  contentful: {
    accessToken: '65ea9057d1642391752e0dc304fb58e5ab3f8dccd4c2281a5c3980e70fdf88df',
    space: 'mt72vq0fhcvu'
  }
};