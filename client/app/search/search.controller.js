'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, SupportItem, $stateParams) {
  $scope.searchQuery = decodeURIComponent($stateParams.query);
  $scope.category = decodeURIComponent($stateParams.category);
  $scope.tableState = {};
  $scope.loading = true;
  function search() {
    $scope.loading = true;
    var queryData = {};
    queryData.query = $stateParams.query? $scope.searchQuery : undefined;
    queryData.registrationGroup = $stateParams.category? $scope.category : undefined;
    _.extend(queryData, $scope.tableState.pagination);
    SupportItem.search(queryData, function(result) {
      $scope.results = result.data;
      $scope.count = result.count;
      $scope.tableState.pagination.numberOfPages = Math.ceil(result.count / $scope.tableState.pagination.number);
      $scope.loading = false;
    });
  }

  $scope.tableUpdate = function(tableState) {
    $scope.tableState = tableState;
    search();
  };
});
