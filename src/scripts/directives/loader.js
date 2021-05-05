(function() {
  angular.module('myvcFrontApp').directive('loader', [
    function() {
      return {
        restrict: 'E',
        templateUrl: "==directives/loader.tpl.html",
        scope: {
          cargando: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {}
      };
    }
  ]);

  // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
// y eso lo puedo hacer con el ng-if

}).call(this);

//# sourceMappingURL=loader.js.map
