'use strict';

angular.module('emarket').controller('SupportItemDetailsCtrl', function($stateParams, SupportItem, Variant, dialogs, $scope) {
  console.log('SupportItemDetailsCtrl controller', $stateParams);
  function updateVariantList() {
    Variant.query({supportItemId: _.get($scope.supportItem, 'fields.supportItemId.en-US')}, function(result) {
      $scope.variants = result.data;
    });

  }
  $scope.supportItem = SupportItem.get({_id: $stateParams.id}, function() {
    updateVariantList();
  });
  $scope.editVariant = function(variant) {
    var dialog = dialogs.create('app/supportItem/dialogs/edit.variant.dialog.html', 'EditVariantDialogCtrl', {variant: variant, supportItem: $scope.supportItem}, {size: 'sm', keyboard: true, backdrop: true});
    dialog.result.then(function() {
      updateVariantList();
    });
  };
  $scope.deleteVariant = function(variant) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this variant!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false
    }, function() {
      Variant.remove({_id: variant._id}, function() {
        swal('Deleted!', 'Variant has been deleted.', 'success');
        var index = $scope.variants.indexOf(variant);
        if (index >= 0) {
          $scope.variants.splice(index, 1);
        }
      });
    });
  };
});


angular.module('emarket').controller('EditVariantDialogCtrl', function($stateParams, SupportItem, Variant, $scope, $modalInstance, data) {
  $scope.variant = new Variant(data.variant);
  $scope.supportItem = data.supportItem;
  if (!$scope.variant.supportItemId) {
    $scope.variant.supportItemId = $scope.supportItem.fields.supportItemId['en-US'];
  }

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };
  $scope.save = function() {
    swal('Processing...');
    swal.disableButtons();
    $scope.variant.$save(function() {
      swal('Success', 'Variant successfully saved!', 'success');
      $modalInstance.close($scope.variant);
    }).catch(function(err) {
      console.error(err);
      swal('', 'Something went wrong. Please try again later', 'warning');
    }).finally(function() {
      swal.enableButtons();
    });
  };
});
