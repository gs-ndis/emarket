'use strict';

angular.module('emarket').controller('AdminVariantEditCtrl', function($scope, Variant, $cookieStore, $state, growl, $timeout, $stateParams) {
  $scope.variant = {};
  $scope.unitOptions = [
    {key: 'Hour', value: 'Hour'},
    {key: 'Day', value: 'Day'},
    {key: 'Week', value: 'Week'},
    {key: 'Annual', value: 'Annual'},
    {key: 'Each', value: 'Each'}
  ];
  if ($stateParams.id) {
    $scope.variant = Variant.get({_id: $stateParams.id});
  } else {
    $scope.variant = new Variant();
  }

  $scope.save = function() {
    swal('Processing...');
    swal.disableButtons();
    $scope.variant.$save().then(function() {
      swal('Success', 'Support items successfully saved!', 'success');
      $state.go('admin.variant.list');
    }).catch(function(err) {
      console.error(err);
      swal('', 'Something went wrong. Please try again later', 'warning');
    }).finally(function() {
      swal.enableButtons();
    });
  };
});
