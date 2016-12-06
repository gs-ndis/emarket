'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, SupportItem, $stateParams, $timeout) {
  console.log('searchResults');
  $scope.searchQuery = decodeURIComponent($stateParams.query);
  $scope.category = decodeURIComponent($stateParams.category);
  $scope.registrationGroup = decodeURIComponent($stateParams.registrationGroup);
  $scope.filter = {};
  $scope.tableState = {};
  $scope.loading = true;

  $scope.filter.quote = Boolean($stateParams.quote) || null;
  $scope.filter.priceCap = Boolean($stateParams.priceCap) || null;

  function search() {
    $scope.loading = true;
    var queryData = {};
    queryData.query = $stateParams.query ? $scope.searchQuery : undefined;
    queryData.category = $stateParams.category ? $scope.category : undefined;
    queryData.quote = $stateParams.quote || undefined;
    queryData.priceCap = $stateParams.priceCap || undefined;
    queryData.registrationGroup = $stateParams.registrationGroup ? $scope.registrationGroup : undefined;
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
