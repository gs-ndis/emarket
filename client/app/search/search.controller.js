'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, SupportItem, $stateParams) {
  $scope.searchQuery = $stateParams.query;
  $scope.category = $stateParams.category;
  $scope.tableState = {};
  function search() {
    var queryData = {};
    queryData.query = $scope.searchQuery;
    queryData.category = $scope.category;
    _.extend(queryData, $scope.tableState.pagination);
    SupportItem.search(queryData, function(result) {
      $scope.results = result.data;
      $scope.count = result.count;
      $scope.tableState.pagination.numberOfPages = Math.ceil(result.count / $scope.tableState.pagination.number);
    });
  }

  $scope.tableUpdate = function(tableState) {
    $scope.tableState = tableState;
    search();
  };
});
