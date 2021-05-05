(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('GruposNewCtrl', [
    '$scope',
    '$http',
    'toastr',
    function($scope,
    $http,
    toastr) {
      $scope.grupo = {
        orden: 1,
        caritas: false,
        valormatricula: 0,
        valorpension: 0
      };
      $http.get('::grados').then(function(data) {
        return $scope.grados = data.data;
      });
      $http.get('::contratos').then(function(data) {
        return $scope.profesores = data.data;
      });
      $scope.restarOrden = function() {
        if ($scope.grupo.orden > 0) {
          return $scope.grupo.orden = $scope.grupo.orden - 1;
        }
      };
      $scope.sumarOrden = function() {
        if ($scope.grupo.orden < 40) {
          return $scope.grupo.orden = $scope.grupo.orden + 1;
        }
      };
      return $scope.crear = function() {
        return $http.post('::grupos/store',
    $scope.grupo).then(function(r) {
          $scope.$emit('grupocreado',
    r.data);
          return toastr.success('Grupo ' + r.data.nombre + ' creado');
        },
    function(r2) {
          return toastr.error('No se pudo crear el grupo',
    'Error');
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=GruposNewCtrl.js.map
