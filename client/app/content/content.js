'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('content', {
    url: '/content/:id',
    templateUrl: 'app/content/content.html',
    controller: 'ContentCtrl',
    authenticate: false
  });
});
