'use strict';

angular.module('emarket').controller('DashboardCtrl', function($rootScope, $scope, Content) {
  console.log('Dashboard controller');
  $scope.page = {};
  Content.query({'sys.contentType.sys.id': 'page', sortBy: '-fields.displayPriority', limit: 1}, function(data) {
    $scope.page = _.head(data);
  });
});
