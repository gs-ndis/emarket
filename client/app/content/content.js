'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('content', {
    url: '/content/:slug',
    templateUrl: 'app/content/content.html',
    controller: 'ContentCtrl',
    authenticate: false,
    resolve: {
      contentType: function() {
        return 'page';
      }
    }
  });
  $stateProvider.state('help', {
    url: '/help/:slug',
    templateUrl: 'app/content/content.html',
    controller: 'ContentCtrl',
    authenticate: false,
    resolve: {
      contentType: function() {
        return 'helpPage';
      }
    }
  });
});
