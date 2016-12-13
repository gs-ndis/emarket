'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, $rootScope, $state, SupportItem, $anchorScroll, $stateParams, ipCookie) {
  var searchParams = _.clone($stateParams);
  $scope.searchQuery = decodeURIComponent(searchParams.query);
  $scope.category = decodeURIComponent(searchParams.category);
  $scope.registrationGroup = decodeURIComponent(searchParams.registrationGroup);
  $scope.stTable = {};
  $scope.stTable.itemsPerPage = $stateParams.number || 10;
  $scope.filter = {};
  $scope.tableState = {};
  $scope.loading = true;

  $scope.filter.quote = Boolean(searchParams.quote) || null;
  $scope.filter.priceCap = Boolean(searchParams.priceCap) || null;

  function search() {
    $scope.loading = true;
    var queryData = {};
    queryData.query = searchParams.query ? $scope.searchQuery : undefined;
    queryData.category = searchParams.category ? $scope.category : undefined;
    queryData.quote = searchParams.quote || undefined;
    queryData.priceCap = searchParams.priceCap || undefined;
    queryData.registrationGroup = searchParams.registrationGroup ? $scope.registrationGroup : undefined;

    ipCookie('search', searchParams, {path: '/'});//save current search state for back to search button
    $rootScope.searchParams = searchParams;

    _.extend(queryData, $scope.tableState.pagination);
    SupportItem.search(queryData, function(result) {
      $scope.results = result.hits.hits;
      $scope.count = result.hits.total;

      $scope.tableState.pagination.numberOfPages = Math.ceil(result.hits.total / $scope.tableState.pagination.number);
      $scope.currentPage = $scope.tableState.pagination.start / $scope.tableState.pagination.number;

      $anchorScroll('main');

      $rootScope.totalFacetsCount = _.sumBy(result.aggregations.categories.buckets, 'doc_count') + result.aggregations.categories.sum_other_doc_count;//jshint ignore:line
      var oldFacets = _.cloneDeep($rootScope.searchFacets);
      $rootScope.searchFacets = _.map(result.aggregations.categories.buckets, function(category) {
        category.urlId = encodeURIComponent(category.key);
        var oldFacet = _.find(oldFacets, {key: category.key});
        if (oldFacet) {
          category.isOpen = oldFacet.isOpen;
        }
        if (category.key === decodeURIComponent($stateParams.category)) {
          category.isOpen = true;
        }
        category.registrationGroups = _.map(category.registrationGroups.buckets, function(registrationGroup) {
          registrationGroup.urlId = encodeURIComponent(registrationGroup.key);
          return registrationGroup;
        });
        return category;
      });
      $scope.loading = false;
    });
  }

  var firstInit = true;

  $scope.tableUpdate = function(tableState) {
    if (firstInit) {
      tableState.pagination.start = $stateParams.start || 0;
      $scope.stTable.itemsPerPage = $stateParams.number || 10;
      firstInit = false;
    }
    searchParams.start = tableState.pagination.start;
    searchParams.number = tableState.pagination.number;

    if ($stateParams.start !== searchParams.start) {
      $state.go('search', searchParams);
      return;
    }

    $scope.tableState = tableState;
    search();
  };
});
