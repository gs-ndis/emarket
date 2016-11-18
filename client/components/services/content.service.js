'use strict';

angular.module('emarket').factory('Content', function($resource) {
  return $resource('/api/content/:action/:id', {id: '@id'}, {
    query: {
      isArray: true
    }
  });
});
