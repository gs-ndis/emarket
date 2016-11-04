'use strict';

angular.module('emarket').filter('yesNo', function() {
  return function(value) {
    return Boolean(value) ? 'Yes' : 'No';
  };
});
