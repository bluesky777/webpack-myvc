(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VerTodosLosCertificadosCtrl', [
    '$scope',
    'App',
    '$state',
    '$interval',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    function($scope,
    App,
    $state,
    $interval,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http) {
      AuthService.verificar_acceso();
      console.log($state);
      $http.put('::certificados-persona',
    {
        alumno_id: $state.params.alumno_id
      }).then(function(r) {
        console.log(r.data);
        return $scope.certificados = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los requisitos');
      });
    }
  ]);

}).call(this);

//VerTodosLosCertificadosCtrl.js.map
