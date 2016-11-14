'use strict';

angular.module('emarket').controller('ContentCtrl', function($scope, Content, $stateParams, $rootScope) {
  console.log('ContentCtrl controller');
  if ($stateParams.id) {
    console.log('_______-----------------------');
    if (!$rootScope.contentfulData || !$rootScope.contentfulData.$promise) {
      $rootScope.contentfulData = Content.query();
    }
    $rootScope.contentfulData.$promise.then(function() {
      $scope.data = _.find($rootScope.contentfulData.items, function(item) {
        return item.sys.id === $stateParams.id;
      });
    });
    console.log($scope.data);
  }
});
