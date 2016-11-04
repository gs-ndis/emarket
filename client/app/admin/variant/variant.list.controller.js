'use strict';

angular.module('emarket').controller('AdminVariantListCtrl', function($scope, Variant, dialogs, $cookieStore, $state, $stateParams) {
  $scope.stTable = {};
  $scope.stTable.itemsPerPage = $cookieStore.get('itemsPerPage') || 10;
  $scope.paginationNumbers = [10, 25, 50, 100, 500, 1000];
  $scope.tableState = {};
  $scope.users = [];

  $scope.tableUpdate = function(tableState) {
    $scope.tableState = tableState;
    $cookieStore.put('itemsPerPage', $scope.stTable.itemsPerPage);
    updateSupportItemList();
  };

  function updateSupportItemList() {
    var query = {};
    $scope.loading = true;
    $scope.searchStr = $stateParams.search;
    if ($stateParams.search) {
      query.search = $stateParams.search;
    }
    _.extend(query, $scope.tableState.pagination, {filterSearch: $scope.tableState.search});
    Variant.query(query, function(result) {
      $scope.loading = false;
      $scope.variants = result.data;
      $scope.tableState.pagination.numberOfPages = Math.ceil(result.count / $scope.tableState.pagination.number);
    });
  }

});
