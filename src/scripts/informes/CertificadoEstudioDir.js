(function() {
  angular.module('myvcFrontApp').directive('certificadoEstudioDir', [
    'App',
    'Perfil',
    function(App,
    Perfil) {
      return {
        restrict: 'EA',
        templateUrl: "==informes/certificadoEstudioDir.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "=",
          espaciado: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          var d,
    monthNames;
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          monthNames = ["Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"];
          d = new Date();
          scope.fecha_dia = d.getDate();
          scope.fecha_mes = monthNames[d.getMonth()];
          return scope.fecha_year = d.getFullYear();
        }
      };
    }
  ]);

  //console.log 'scope.alumno', scope.alumno

}).call(this);

//# sourceMappingURL=CertificadoEstudioDir.js.map
