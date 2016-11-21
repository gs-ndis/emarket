'use strict';

angular.module('emarket').controller('ContentCtrl', function($scope, Content, $stateParams) {
  console.log('ContentCtrl controller');
  $scope.data = Content.get({id: $stateParams.id});
//  if ($stateParams.id) {
//    if (!$rootScope.contentfulData || !$rootScope.contentfulData.$promise) {
//      $rootScope.contentfulData = Content.query();
//    }
//    $rootScope.contentfulData.$promise.then(function() {
//      $scope.data = _.find($rootScope.contentfulData.items, function(item) {
//        return item.sys.id === $stateParams.id;
//      });
//    });
//    console.log($scope.data);
//  }
});
