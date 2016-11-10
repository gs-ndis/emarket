'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope) {
  console.log('Search controller');
  $scope.results = _.range(10);
});
