(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('GradosNewCtrl', [
    '$scope',
    'toastr',
    '$http',
    function($scope,
    toastr,
    $http) {
      $scope.grado = {
        orden: 1
      };
      $scope.restarOrden = function() {
        if ($scope.grado.orden > 0) {
          return $scope.grado.orden = $scope.grado.orden - 1;
        }
      };
      $scope.sumarOrden = function() {
        if ($scope.grado.orden < 40) {
          return $scope.grado.orden = $scope.grado.orden + 1;
        }
      };
      return $scope.crear = function() {
        return $http.post('::grados/store',
    $scope.grado).then(function(r) {
          r = r.data;
          $scope.$emit('gradocreado',
    r);
          return toastr.success('Grado ' + r.nombre + ' creado');
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
    }
  ]);

}).call(this);

//GradosNewCtrl.js.map
