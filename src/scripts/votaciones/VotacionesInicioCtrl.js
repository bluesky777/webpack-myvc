(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VotacionesInicioCtrl', [
    '$scope',
    '$rootScope',
    '$interval',
    'resolved_user',
    'App',
    'AuthService',
    '$state',
    function($scope,
    $rootScope,
    $interval,
    resolved_user,
    App,
    AuthService,
    $state) {
      AuthService.verificar_acceso();
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.USER = resolved_user;
      if ($state.is('panel.actividades.votaciones')) {
        if ($scope.hasRoleOrPerm(['alumno',
    'acudiente']) || $scope.USER.tipo === 'Alumno') {
          $state.go('panel.actividades.votaciones.votar');
        }
        if ($scope.hasRoleOrPerm(['admin',
    'profesor'])) {
          $state.go('panel.actividades.votaciones.config');
        }
      }
    }
  ]);

}).call(this);

//VotacionesInicioCtrl.js.map
