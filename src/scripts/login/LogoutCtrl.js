(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('LogoutCtrl', [
    '$scope',
    '$state',
    'Perfil',
    function($scope,
    $state,
    Perfil) {
      console.log('A salir!!');
      return $state.go('login');
    }
  ]);

}).call(this);

//LogoutCtrl.js.map
