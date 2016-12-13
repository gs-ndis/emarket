'use strict';

angular.module('emarket').controller('ContentCtrl', function($scope, Content, $stateParams, contentType) {
  console.log('ContentCtrl controller');
  $scope.data = Content.get({slug: $stateParams.slug, contentType: contentType});
});
