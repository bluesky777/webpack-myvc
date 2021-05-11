(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('CandidatosCtrl', [
    '$scope',
    '$filter',
    '$http',
    'toastr',
    'App',
    function($scope,
    $filter,
    $http,
    toastr,
    App) {
      $scope.perfilPath = App.images + 'perfil/';
      $scope.aspiraciones = [];
      $scope.allinscritos = [];
      $http.get('::candidatos/conaspiraciones').then(function(r) {
        return $scope.aspiraciones = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer las aspiraciones',
    'Problema');
      });
      $http.get('::participantes/allinscritos').then(function(r) {
        return $scope.allinscritos = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los inscritos',
    'Problema');
      });
      $scope.crearCandidato = function(aspiracion) {
        var datos;
        datos = {};
        datos.user_id = aspiracion.newParticip.user_id;
        datos.plancha = aspiracion.newParticip.plancha;
        datos.numero = aspiracion.newParticip.numero;
        datos.aspiracion_id = aspiracion.id;
        return $http.post('::candidatos/store',
    datos).then(function(r) {
          r = r.data;
          aspiracion.candidatos = r;
          aspiracion.newParticip = null;
          return toastr.success('Candidato creado con éxito');
        },
    function(r2) {
          if (r2.data.error.message === 'Candidato ya inscrito') {
            return toastr.warning('Candidato ya inscrito en esta aspiración');
          } else {
            return toastr.warning('No se pudo crear el candidato',
    'Problema');
          }
        });
      };
      $scope.eliminarCandidato = function(candidato_id,
    aspiracion) {
        return $http.delete('::candidatos/destroy/' + candidato_id).then(function(r) {
          aspiracion.candidatos = $filter('filter')(aspiracion.candidatos,
    {
            candidato_id: '!' + candidato_id
          });
          return toastr.success('Candidato removido de la candidatura');
        },
    function(r2) {
          return toastr.error('No se pudo quitar de la candidatura',
    'Problema');
        });
      };
    }
  ]);

}).call(this);

//CandidatosCtrl.js.map
