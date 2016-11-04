'use strict';

angular.module('emarket').factory('Variant', function($resource) {
  return $resource('/api/variants/:action/:_id', {_id: '@_id'}, {
    query: {
      isArray: false
    },
    update: {
      method: 'PUT'
    }
  });
});
