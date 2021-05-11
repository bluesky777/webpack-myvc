(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('NivelesEditCtrl', [
    '$scope',
    'toastr',
    '$state',
    '$http',
    function($scope,
    toastr,
    $state,
    $http) {
      $scope.nivel = {};
      $http.get('::niveles_educativos/' + $state.params.nivel_id).then(function(r) {
        return $scope.nivel = r.data;
      });
      $scope.guardar = function() {
        return $http.put('niveles_educativos/' + $state.params.nivel_id,
    $scope.nivel).then(function(r) {
          return toastr.success('Se guardó nivel');
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
      $scope.restarOrden = function() {
        if ($scope.nivel.orden > 0) {
          return $scope.nivel.orden = $scope.nivel.orden - 1;
        }
      };
      return $scope.sumarOrden = function() {
        if ($scope.nivel.orden < 40) {
          return $scope.nivel.orden = $scope.nivel.orden + 1;
        }
      };
    }
  ]);

}).call(this);

//NivelesEditCtrl.js.map
