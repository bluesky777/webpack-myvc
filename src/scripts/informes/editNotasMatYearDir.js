(function() {
  angular.module('myvcFrontApp').directive('editNotasMatYearDir', [
    'App',
    'Perfil',
    function(App,
    Perfil) {
      return {
        restrict: 'EA',
        templateUrl: "==informes/editNotasMatYearDir.tpl.html",
        scope: {
          asignatura: "=",
          alumno: "=",
          alumnosasigs: "="
        },
        controller: function($scope,
    App,
    $http,
    EscalasValorativasServ,
    AuthService,
    toastr) {
          var datos;
          $scope.USER = Perfil.User();
          $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
          $scope.perfilPath = App.images + 'perfil/';
          $scope.periodos_materia = [];
          $scope.solo_notas_perdidas = true;
          $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
          EscalasValorativasServ.escalas().then(function(r) {
            return $scope.escalas = r;
          });
          datos = {
            alumno_id: $scope.alumno.alumno_id,
            asignatura_id: $scope.asignatura.asignatura_id,
            periodos_a_calcular: 'de_usuario'
          };
          $http.put('::editnota/alum-asignatura',
    datos).then(function(r) {
            return $scope.periodos_materia = r.data;
          },
    function(r2) {});
          //console.log r2
          return $scope.cambiaNota = function(nota,
    otra) {
            return $http.put('::notas/update/' + nota.id,
    {
              nota: nota.nota
            }).then(function(r) {
              return toastr.success('Cambiada: ' + nota.nota);
            },
    function(r2) {
              return toastr.error('No pudimos guardar la nota ' + nota.nota);
            });
          };
        }
      };
    }
  ]);

}).call(this);

//editNotasMatYearDir.js.map
