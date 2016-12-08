'use strict';

angular.module('emarket').controller('SupportItemDetailsCtrl', function($stateParams, SupportItem, Variant, dialogs, $scope) {
  $scope.locationOptions = [
    'ACT',
    'NSW',
    'QLD',
    'VIC',
    'TAS',
    'Remote',
    'Very Remote'
  ];
  $scope.selectedLocation = 'ACT';
  $scope.priceData = {};

  function updatePriceData() {
    $scope.priceData = {};
    if (!$scope.selectedLocation || !$scope.variants || !$scope.variants.length) {
      return;
    }
    _.each($scope.variants, function(variant) {
      _.each(variant.priceCap, function(priceCap) {
        if (priceCap.location.indexOf($scope.selectedLocation) !== -1) {
          $scope.priceData[variant.variantId] = priceCap.price;
          return false;
        }
      });
    });
  }

  $scope.$watch('selectedLocation', function() {
    updatePriceData();
  });

  $scope.$watch('variants', function() {
    updatePriceData();
  });

  function updateVariantList() {
    Variant.query({supportItemId: _.get($scope.supportItem, 'fields.supportItemId')}, function(result) {
      $scope.variants = result.data;
      var priceControlled = false;
      _.each($scope.variants, function(variant) {
        if (variant.priceCap.length > 0) {
          console.log(variant);
          priceControlled = true;
          return false;
        }
      });
      updatePriceData();
      $scope.supportItem.priceControlled = priceControlled;
    });
  }

  $scope.supportItem = SupportItem.get({_id: $stateParams.id}, function() {
    updateVariantList();
  });
  $scope.editVariant = function(variant) {
    var dialog = dialogs.create('app/supportItem/dialogs/edit.variant.dialog.html', 'EditVariantDialogCtrl', {variant: variant, supportItem: $scope.supportItem}, {size: 'md', keyboard: true, backdrop: true});
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
  $scope.data = {};
  $scope.data.locationOptions = [
    'ACT',
    'NSW',
    'QLD',
    'VIC',
    'TAS',
    'Remote',
    'Very Remote'
  ];
  $scope.variant = new Variant(data.variant);
  $scope.supportItem = data.supportItem;
  if (!$scope.variant.supportItemId) {
    $scope.variant.supportItemId = $scope.supportItem.fields.supportItemId;
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
      swal('', _.get(err, 'data.message', 'Something went wrong. Please try again later'), 'warning');
    }).finally(function() {
      swal.enableButtons();
    });
  };

  $scope.getLocationOptionsFor = function(target) {
    var locations = _.clone($scope.data.locationOptions);
    _.each($scope.variant.priceCap, function(priceCap, index) {
      if (index !== target) {
        locations = _.difference(locations, priceCap.location);
      }
    });

    return locations;
  };
});
