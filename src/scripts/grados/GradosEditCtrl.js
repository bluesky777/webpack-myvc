(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('GradosEditCtrl', [
    '$scope',
    '$state',
    '$http',
    'toastr',
    function($scope,
    $state,
    $http,
    toastr) {
      $http.get('::grados/show/' + $state.params.grado_id).then(function(r) {
        return $scope.grado = r.data;
      });
      $scope.guardar = function() {
        return $http.put('::grados/update/' + $scope.grado.id,
    $scope.grado).then(function(r) {
          return toastr.success('Se guardaron los cambios.');
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
      $scope.restarOrden = function() {
        if ($scope.grado.orden > 0) {
          return $scope.grado.orden = $scope.grado.orden - 1;
        }
      };
      return $scope.sumarOrden = function() {
        if ($scope.grado.orden < 40) {
          return $scope.grado.orden = $scope.grado.orden + 1;
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=GradosEditCtrl.js.map
