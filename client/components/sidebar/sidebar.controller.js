'use strict';

angular.module('emarket').controller('SidebarCtrl', function($scope, $rootScope, Auth, socket, $state, $timeout, dialogs, screenSize) {
  $scope.desktop = screenSize.is('md, lg');
  $scope.mobile = screenSize.is('xs, sm');

  $rootScope.yesNoOptions = [
    {key: 1, value: 'Yes'},
    {key: 0, value: 'No'}
  ];

  $rootScope.highlightBlock = function(selector, targetState) {
    if (targetState && ($state.current.name !== targetState.name || !_.isMatch($state.params, targetState.params))) {
      $state.go(targetState.name, targetState.params).then(function() {
        $timeout(function() {
          $rootScope.highlightBlock(selector);
        }, 100);
      });
      return;
    }
    var block = $(selector);
    if (!block.length) {
      return;
    }
    block.find('input').focus();
    $('html, body').animate({
      scrollTop: block.offset().top - 100
    });
    block.removeClass('blink_me');
    $timeout(function() {
      block.addClass('blink_me');
    });
  };

  $scope.itemsCollapse = {
    instant: true,
    seller: true,
    offer: true,
    leads: true,
    contacts: true,
    education: true,
    buyers: true,
    system: true,
    admin: true
  };

  $scope.toggleMenu = function(item) {
    $scope.itemsCollapse[item] = !$scope.itemsCollapse[item];
  };
});
