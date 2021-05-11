(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('GruposEditCtrl', [
    '$scope',
    '$state',
    '$http',
    'toastr',
    function($scope,
    $state,
    $http,
    toastr) {
      $http.get('::grupos/show/' + $state.params.grupo_id).then(function(r) {
        return $scope.grupo = r.data;
      });
      $http.get('::grados').then(function(data) {
        return $scope.grados = data.data;
      });
      $http.get('::contratos').then(function(data) {
        return $scope.profesores = data.data;
      });
      $scope.guardar = function() {
        var titular;
        if ($scope.grupo.titular.profesor_id) {
          $scope.grupo.titular_id = $scope.grupo.titular.profesor_id; // Así viene cuando ha sido seleccionado el titular mientras está editando
        } else {
          $scope.grupo.titular_id = $scope.grupo.titular.id; // Así viene originalmente al darle editar
        }
        titular = $scope.grupo.titular;
        delete $scope.grupo.titular;
        $scope.grupo.grado_id = $scope.grupo['grado'].id;
        return $http.put('::grupos/update',
    $scope.grupo).then(function(r) {
          toastr.success('Grupo ' + r.data.nombre + ' editado.');
          return $scope.grupo.titular = titular;
        },
    function(r2) {
          return $scope.grupo.titular = titular;
        });
      };
      $scope.restarOrden = function() {
        if ($scope.grupo.orden > 0) {
          return $scope.grupo.orden = $scope.grupo.orden - 1;
        }
      };
      return $scope.sumarOrden = function() {
        if ($scope.grupo.orden < 40) {
          return $scope.grupo.orden = $scope.grupo.orden + 1;
        }
      };
    }
  ]);

}).call(this);

//GruposEditCtrl.js.map
