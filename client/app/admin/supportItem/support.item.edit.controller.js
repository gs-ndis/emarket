'use strict';

angular.module('emarket').controller('AdminSupportItemEditCtrl', function($scope, SupportItem, $cookieStore, $state, growl, $timeout, $stateParams) {
  $scope.supportItem = {};

  if ($stateParams.id) {
    $scope.supportItem = SupportItem.get({_id: $stateParams.id});
  } else {
    $scope.supportItem = new SupportItem();
  }
  console.log($scope.supportItem);

  $scope.save = function() {
    console.log('save...');
    swal('Processing...');
    swal.disableButtons();
    $scope.supportItem.$save().then(function() {
      swal('Success', 'Support items successfully saved!', 'success');
    }).catch(function(err) {
      console.error(err);
      swal('', 'Something went wrong. Please try again later', 'warning');
    }).finally(function() {
      swal.enableButtons();
    });
  };
});
