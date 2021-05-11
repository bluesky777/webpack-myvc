(function() {
  angular.module('myvcFrontApp').directive('boletinFinalAlumnoDir', [
    'App',
    'Perfil',
    function(App,
    Perfil) {
      return {
        restrict: 'EA',
        templateUrl: "==informes/boletinFinalAlumnoDir.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          return scope.views = App.views;
        }
      };
    }
  ]).directive('boletinFinalAlumnoPreescolarDir', [
    'App',
    'Perfil',
    '$http',
    'toastr',
    function(App,
    Perfil,
    $http,
    toastr) {
      return {
        restrict: 'EA',
        templateUrl: "==informes/boletinFinalAlumnoPreescolarDir.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          return scope.eliminar_frase = function(frase) {
            console.log(frase);
            return $http.put('::bolfinales-preescolar/eliminar-frase',
    {
              id: frase.id
            }).then(function(r) {
              return toastr.success('Frase eliminada. Recargue.');
            },
    function() {
              return toastr.error('No se pudo eliminar frase');
            });
          };
        }
      };
    }
  //console.log scope.config.orientacion
  ]).filter('promedioPeriodo', [
    function() {
      return function(input,
    periodo_id) {
        var asig,
    defini,
    i,
    j,
    len,
    len1,
    promedio,
    ref,
    suma;
        suma = 0;
        for (i = 0, len = input.length; i < len; i++) {
          asig = input[i];
          ref = asig.definitivas;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            defini = ref[j];
            if (defini.periodo_id) {
              if (parseFloat(defini.periodo_id) === parseFloat(periodo_id)) {
                suma += parseFloat(defini.DefMateria);
              }
            }
          }
        }
        promedio = suma / input.length;
        return promedio;
      };
    }
  ]);

}).call(this);

//BoletinFinalAlumnoDir.js.map
