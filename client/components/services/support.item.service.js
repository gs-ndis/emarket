'use strict';

angular.module('emarket').factory('SupportItem', function($resource) {
  return $resource('/api/supportItems/:action/:_id', {_id: '@_id'}, {
    query: {
      isArray: false
    },
    update: {
      method: 'PUT'
    }
  });
});
