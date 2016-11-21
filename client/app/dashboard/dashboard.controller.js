'use strict';

angular.module('emarket').controller('DashboardCtrl', function($rootScope, $scope, Content) {
  console.log('Dashboard controller');
  $scope.page = {};
  Content.query({'sys.contentType.sys.id': 'page', sortBy: '-fields.displayPriority.en-US', limit: 1}, function(data) {
    $scope.page = _.head(data);
  });
//  $rootScope.contentfulData.$promise.then(function() {
//    $timeout(function() {
//      console.log($rootScope.menu);
//      $scope.page = _.head($rootScope.menu);
//    });
//  });
});
