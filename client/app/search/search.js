'use strict';

angular.module('emarket').config(function($stateProvider) {
  $stateProvider.state('search', {
    url: '/search?query&category&registrationGroup&quote&priceCap&start&number',
    templateUrl: 'app/search/search.html',
    controller: 'SearchCtrl',
    authenticate: false
  });
});
