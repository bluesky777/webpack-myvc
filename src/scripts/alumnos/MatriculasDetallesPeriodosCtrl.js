(function() {
  'use strict';
  angular.module("myvcFrontApp").directive('matriculasDetallesPeriodosDir', [
    function() {
      return {
        restrict: 'E',
        templateUrl: "==alumnos/matriculasDetallesPeriodos.tpl.html",
        controller: 'MatriculasDetallesPeriodosCtrl'
      };
    }
  ]).controller('MatriculasDetallesPeriodosCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$interval',
    'uiGridConstants',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    function($scope,
    App,
    $rootScope,
    $state,
    $interval,
    uiGridConstants,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http) {
      $scope.eliminarNotasPeriodo = function(periodo,
    grupo) {
        var res;
        res = confirm('¿Está seguro? estas notas no se podrán recuperar si las borra.');
        if (res) {
          return $http.put('::detalles/eliminar-notas-periodo',
    {
            alumno_id: parseInt($state.params.alumno_id),
            grupo_id: grupo.id,
            periodo_id: periodo.id
          }).then(function(r) {
            if (parseInt(r.data) === 0) {
              return toastr.warning('No se eliminó ninguna nota');
            } else {
              return toastr.success('Notas eliminadas: ' + r.data);
            }
          },
    function(r2) {
            return toastr.error('No se pudo eliminar las notas',
    'Error');
          });
        }
      };
      $scope.eliminarMatriculaDestroy = function(matriculas_year_grupo,
    matricula_id) {
        var res;
        res = false;
        if (matriculas_year_grupo.length === 1) {
          res = confirm('Solo queda esta matricula para este grupo, ¿Está seguro que quiere eliminarla definitivamente?');
        } else {
          res = confirm('¿Está seguro que quiere eliminar la matricula ' + matricula_id + ' definitivamente?');
        }
        if (res) {
          return $http.put('::detalles/eliminar-matricula-destroy',
    {
            matricula_id: matricula_id
          }).then(function(r) {
            if (parseInt(r.data) === 0) {
              toastr.warning('No se eliminó matricula');
            } else {
              toastr.success('Matricula ' + matricula_id + ' eliminada.');
              $scope.matriculas = $filter('filter')($scope.matriculas,
    {
                matricula_id: '!' + matricula_id
              });
              matriculas_year_grupo = $filter('filter')(matriculas_year_grupo,
    {
                matricula_id: '!' + matricula_id
              });
            }
            return $scope.$parent.detallesAlumno();
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

//# sourceMappingURL=MatriculasDetallesPeriodosCtrl.js.map
