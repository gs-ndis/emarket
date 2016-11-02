'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/',
    templateUrl: 'app/dashboard/dashboard.html',
    controller: 'DashboardCtrl',
    authenticate: true
  });
});
