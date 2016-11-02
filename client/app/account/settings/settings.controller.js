'use strict';

angular.module('emarket').controller('SettingsCtrl', function($scope, User, Auth, dialogs) {
  $scope.errors = {};
  $scope.user = User.get();

  $scope.changePassword = function(form) {
    $scope.submitted = true;
    if (form.$valid) {
      Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword).then(function() {
        $scope.message = 'Password successfully changed.';
      }).catch(function() {
        form.password.$setValidity('mongoose', false);
        $scope.errors.other = 'Incorrect password';
        $scope.message = '';
      });
    }
  };
  $scope.save = function() {
    User.update({id: 'me'}, angular.copy($scope.user)).$promise.then(function() {
      $scope.message = 'User info successfully saved';
    }).catch(function(err) {
      console.log(err);
    });
  };

  $scope.openSelectAddressDialog = function() {
    var dialog = dialogs.create('components/partials/select.address.dialog.html', 'SelectAddressDialogCtrl', {user: $scope.user}, {size: 'lg', keyboard: false});
    dialog.result.then(function(user) {
      $scope.user.address = user.address;
      Auth.setCurrentUser(user);
    });
  };
});
