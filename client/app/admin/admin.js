'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminCtrl',
    authenticate : true,
    access : 'admin'
  });
});
