'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('supportItem', {
    url: '/supportItem',
    abstract: true,
    template: '<div ui-view/>'
  });
  $stateProvider.state('supportItem.details', {
    url: '/:slug',
    templateUrl: 'app/supportItem/supportItem.html',
    controller: 'SupportItemDetailsCtrl',
    authenticate: false
  });
});
