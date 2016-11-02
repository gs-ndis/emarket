'use strict';

angular.module('emarket').factory('Permissions', function(Auth, $rootScope) {
  return {
    hasAccess: function() {
      if (!$rootScope.currentUser) {
        return false;
      }
      console.log('----------', $rootScope.currentUser._roleGroup);
      
      return true;
    }
  };
});
