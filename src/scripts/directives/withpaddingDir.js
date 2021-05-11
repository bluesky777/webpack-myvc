(function() {
  angular.module('myvcFrontApp').directive('withpaddingDir', [
    '$rootScope',
    '$state',
    function($rootScope,
    $state) {
      return {
        link: function(scope,
    element) {
          var listener,
    listener2;
          listener = function(event,
    toState,
    toParams) {
            if ($state.includes('panel.actividades') || $state.includes('panel.mis_actividades')) {
              return $(element).addClass('no-padding');
            } else {
              return $(element).removeClass('no-padding');
            }
          };
          listener2 = function(event,
    viewConfig) {
            if ($state.includes('panel.actividades') || $state.includes('panel.mis_actividades')) {
              return $(element).addClass('no-padding');
            } else {
              return $(element).removeClass('no-padding');
            }
          };
          $rootScope.$on('$stateChangeSuccess',
    listener);
          return $rootScope.$on('$viewContentLoaded',
    listener2);
        }
      };
    }
  ]);

}).call(this);

//withpaddingDir.js.map
