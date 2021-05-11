(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('NotasPerdidasProfesorEditCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    '$filter',
    'App',
    'AuthService',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    $filter,
    App,
    AuthService) {
      AuthService.verificar_acceso();
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.datos = {};
      $scope.grupos = [];
      $scope.profesores = [];
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      if (AuthService.hasRoleOrPerm(['profesor'])) {
        $http.put('::notas-perdidas/profesor-grupos',
    {
          profesor_id: $scope.USER.persona_id,
          periodo_a_calcular: $scope.USER.numero_periodo
        }).then(function(r) {
          return $scope.grupos = r.data;
        },
    function(r2) {
          return toastr.error('No se trajeron las notas');
        });
      } else {
        $http.get('::contratos').then(function(r) {
          return $scope.profesores = r.data;
        },
    function(r2) {
          return toastr.error('No se trajeron los profesores');
        });
      }
      $scope.verNotasPerdidasProfesor = function() {
        if ($scope.datos.profesor) {
          return $http.put('::notas-perdidas/profesor-grupos',
    {
            profesor_id: $scope.datos.profesor.profesor_id,
            periodo_a_calcular: 10
          }).then(function(r) {
            return $scope.grupos = r.data;
          },
    function(r2) {
            return toastr.error('No se trajeron las notas');
          });
        } else {
          return toastr.warning('Debes elegir profesor');
        }
      };
      $scope.cambiaNota = function(nota) {
        return $http.put('::notas/update/' + nota.nota_id,
    {
          nota: nota.nota,
          num_periodo: nota.numero_periodo
        }).then(function(r) {
          r = r.data;
          return toastr.success('Cambiada: ' + nota.nota);
        },
    function(r2) {
          if (r2.status === 400) {
            return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
          } else {
            return toastr.error('No pudimos guardar la nota ' + nota.nota,
    '',
    {
              timeOut: 8000
            });
          }
        });
      };
    }
  ]);

}).call(this);

//NotasPerdidasProfesorEditCtrl.js.map
