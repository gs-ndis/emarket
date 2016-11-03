'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('admin.supportItem', {
    url: '/supportItem',
    template: '<div ui-view/>',
    abstract: true,
    authenticate: true,
    access: 'admin'
  });
  $stateProvider.state('admin.supportItem.list', {
    url: '',
    templateUrl: 'app/admin/supportItem/support.item.list.html',
    controller: 'AdminSupportItemListCtrl',
    authenticate: true,
    access: 'admin'
  });
  $stateProvider.state('admin.supportItem.edit', {
    url: '/:id',
    templateUrl: 'app/admin/supportItem/support.item.edit.html',
    controller: 'AdminSupportItemEditCtrl',
    authenticate: true,
    access: 'admin'
  });
});
