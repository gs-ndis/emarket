'use strict';

angular.module('emarket').controller('SearchCtrl', function($scope, $rootScope, SupportItem, $stateParams) {
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
      $scope.results = result.hits.hits;
      $scope.count = result.hits.total;

      $scope.tableState.pagination.numberOfPages = Math.ceil(result.count / $scope.tableState.pagination.number);

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

  $scope.tableUpdate = function(tableState) {
    $scope.tableState = tableState;
    search();
  };
});
