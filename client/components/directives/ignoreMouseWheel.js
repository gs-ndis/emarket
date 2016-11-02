'use strict';

// directive for disable scroll for input[number]
angular.module('emarket').directive('ignoreMouseWheel', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('mousewheel', function() {
        element.blur();
//        event.preventDefault();
      });
    }
  };
});
