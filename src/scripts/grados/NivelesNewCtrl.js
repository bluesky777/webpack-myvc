(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('NivelesNewCtrl', [
    '$scope',
    '$http',
    'toastr',
    '$state',
    function($scope,
    $http,
    toastr,
    $state) {
      $scope.nivel = {
        'orden': 0
      };
      $scope.restarOrden = function() {
        if ($scope.nivel.orden > 0) {
          return $scope.nivel.orden = $scope.nivel.orden - 1;
        }
      };
      $scope.sumarOrden = function() {
        if ($scope.nivel.orden < 40) {
          return $scope.nivel.orden = $scope.nivel.orden + 1;
        }
      };
      $scope.crear = function() {
        return $http.post('::niveles_educativos/store',
    $scope.nivel).then(function(r) {
          toastr.success('Nivel creado.');
          return $state.go('panel.niveles',
    {},
    {
            reload: true
          });
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
    }
  ]);

}).call(this);

//NivelesNewCtrl.js.map
