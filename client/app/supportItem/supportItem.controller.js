'use strict';

angular.module('emarket').controller('SupportItemDetailsCtrl', function($stateParams, SupportItem, Variant, $scope) {
  console.log('SupportItemDetailsCtrl controller', $stateParams);
  $scope.supportItem = SupportItem.get({_id: $stateParams.id}, function(supportItem) {
    Variant.query({supportItemId: _.get(supportItem, 'fields.supportItemId.en-US')}, function(result) {
      $scope.variants = result.data;
    });
  });
  
});
