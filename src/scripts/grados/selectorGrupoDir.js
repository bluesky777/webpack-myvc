(function() {
  angular.module('myvcFrontApp').directive('selectorGrupoDir', [
    'App',
    'Perfil',
    function(App,
    Perfil) {
      return {
        restrict: 'EA',
        templateUrl: "==grados/selectorGrupoDir.tpl.html",
        controller: function($scope,
    App) {}
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=selectorGrupoDir.js.map
