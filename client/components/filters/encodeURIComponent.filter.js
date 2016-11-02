'use strict';

angular.module('emarket').filter('encodeURIComponent', function ($window)
{
  return $window.encodeURIComponent;
});
