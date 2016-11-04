'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('admin.variant', {
    url: '/variant',
    template: '<div ui-view/>',
    abstract: true,
    authenticate: true,
    access: 'admin'
  });
  $stateProvider.state('admin.variant.list', {
    url: '',
    templateUrl: 'app/admin/variant/variant.list.html',
    controller: 'AdminVariantListCtrl',
    authenticate: true,
    access: 'admin'
  });
  $stateProvider.state('admin.variant.edit', {
    url: '/:id',
    templateUrl: 'app/admin/variant/variant.edit.html',
    controller: 'AdminVariantEditCtrl',
    authenticate: true,
    access: 'admin'
  });
});
