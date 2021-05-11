(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('MatriculasDetallesCtrl', [
    '$scope',
    'App',
    '$state',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    function($scope,
    App,
    $state,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http) {
      AuthService.verificar_acceso();
      $scope.year_ant = $scope.USER.year - 1;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.matricula_detalle = false;
      $scope.matric_cargando = false;
      $scope.detallesAlumno = function() {
        return $http.put('::detalles/alumno',
    {
          year_id: $scope.USER.year_id,
          alumno_id: parseInt($state.params.alumno_id)
        }).then(function(r) {
          return $scope.matriculas = r.data;
        });
      };
      $scope.detallesAlumno();
      $scope.matricSeleccionada = function(row) {
        var datos,
    i,
    len,
    matric,
    ref;
        ref = $scope.matriculas;
        for (i = 0, len = ref.length; i < len; i++) {
          matric = ref[i];
          if (matric.matricula_id === row.matricula_id) {
            matric.seleccionada = true;
          } else {
            matric.seleccionada = false;
          }
        }
        datos = {
          alumno_id: row.alumno_id,
          year_id: row.year_id,
          matricula_id: row.matricula_id
        };
        $scope.matric_cargando = true; // Para que gire el spinner
        $scope.matricula_detalle = false;
        return $http.put('::detalles/grupos-periodos',
    datos).then(function(r) {
          var j,
    len1,
    matri,
    ref1,
    results;
          r = r.data;
          $scope.matricula_detalle = r;
          $scope.matric_cargando = false;
          ref1 = $scope.matricula_detalle;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            matri = ref1[j];
            results.push(matri.year = row.year);
          }
          return results;
        });
      };
      $scope.eliminarMatric = function(matricula_id) {
        var res;
        res = false;
        res = confirm('¿Está seguro que quiere eliminar la matricula ' + matricula_id + ' definitivamente?');
        if (res) {
          return $http.put('::detalles/eliminar-matricula-destroy',
    {
            matricula_id: matricula_id
          }).then(function(r) {
            if (parseInt(r.data) === 0) {
              return toastr.warning('No se eliminó matricula');
            } else {
              toastr.success('Matricula ' + matricula_id + ' eliminada.');
              return $scope.matriculas = $filter('filter')($scope.matriculas,
    {
                matricula_id: '!' + matricula_id
              },
    true);
            }
          },
    function(r2) {
            return toastr.error('No se pudo eliminar la matricula ' + matricula_id,
    'Error');
          });
        }
      };
    }
  ]);

}).call(this);

//MatriculasDetallesCtrl.js.map
