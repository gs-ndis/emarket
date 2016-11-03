'use strict';

angular.module('emarket').controller('AdminSupportItemListCtrl', function($scope, SupportItem, dialogs, $cookieStore, $state, Upload, $timeout, $filter) {
  $scope.stTable = {};
  $scope.stTable.itemsPerPage = $cookieStore.get('itemsPerPage') || 10;
  $scope.paginationNumbers = [10, 25, 50, 100, 500, 1000];
  $scope.tableState = {};
  $scope.users = [];

  $scope.activeOptions = [
    {key: 'true', value: 'Yes'},
    {key: 'false', value: 'No'}
  ];

  SupportItem.query({number: -1}, function(result) {
    $scope.supportItems = result.data;
    if (!$scope.tableState.pagination) {
      $scope.tableState.pagination = {};
    }
    $scope.tableState.pagination.numberOfPages = Math.ceil(result.count / $scope.tableState.pagination.number);
    updateSupportItemList();
  });

  function updateSupportItemList() {
    $timeout(function() {
      var pagination = $scope.tableState.pagination;
      var output;
      var filtered = $scope.tableState.search && $scope.tableState.search.predicateObject ? $filter('customFilter')($scope.users, $scope.tableState.search.predicateObject) : $scope.users;
      $scope.filteredLength = filtered.length;
      if ($scope.tableState.sort && $scope.tableState.sort.predicate) {
        filtered = $filter('orderBy')(filtered, $scope.tableState.sort.predicate, $scope.tableState.sort.reverse);
      }
      pagination.totalItemCount = filtered.length;
      if (pagination.number !== undefined) {
        pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
        pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
        output = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
      }
      $scope.displayed = output || filtered;
    });
  }
  $scope.tableUpdate = function(tableState) {
    $scope.tableState = tableState;
    $cookieStore.put('itemsPerPage', $scope.stTable.itemsPerPage);
    updateSupportItemList();
  };
});
