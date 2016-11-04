'use strict';

angular.module('emarket').controller('AdminSupportItemEditCtrl', function($scope, SupportItem, $cookieStore, $state, growl, $timeout, $stateParams) {
  $scope.supportItem = {};

  if ($stateParams.id) {
    $scope.supportItem = SupportItem.get({_id: $stateParams.id}, function() {
      $scope.supportItem.priceControlled = Boolean($scope.supportItem.priceControlled);
      $scope.supportItem.quoteNeeded = Boolean($scope.supportItem.quoteNeeded);
    });
  } else {
    $scope.supportItem = new SupportItem();
    $scope.supportItem.priceControlled = Boolean($scope.supportItem.priceControlled);
    $scope.supportItem.quoteNeeded = Boolean($scope.supportItem.quoteNeeded);
  }

  $scope.save = function() {
    swal('Processing...');
    swal.disableButtons();
    $scope.supportItem.$save().then(function() {
      swal('Success', 'Support items successfully saved!', 'success');
      $state.go('admin.supportItem.list');
    }).catch(function(err) {
      console.error(err);
      swal('', 'Something went wrong. Please try again later', 'warning');
    }).finally(function() {
      swal.enableButtons();
    });
  };
});
