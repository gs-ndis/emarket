'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, SupportItem, $stateParams) {
  console.log('Search controller', $stateParams);
  $scope.searchQuery = $stateParams.query;
  SupportItem.search({query: $scope.searchQuery}, function(result) {
    $scope.results = result.data;
    $scope.count = result.count;
  });
//  $scope.results = _.range(10);
});
