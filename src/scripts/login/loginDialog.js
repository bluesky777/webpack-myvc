(function() {
  angular.module('myvcFrontApp').directive('loginDialog', [
    'AUTH_EVENTS',
    'App',
    function(AUTH_EVENTS,
    App) {
      return {
        restrict: 'A',
        templateUrl: '==login/login-form.html',
        //controller: 'LoginCtrl'
        link: function(scope) {
          var showDialog;
          showDialog = function() {
            return scope.visible = true;
          };
          scope.visible = false;
          scope.$on(AUTH_EVENTS.notAuthenticated,
    showDialog);
          return scope.$on(AUTH_EVENTS.sessionTimeout,
    showDialog);
        }
      };
    }
  ]);

}).call(this);

//loginDialog.js.map
