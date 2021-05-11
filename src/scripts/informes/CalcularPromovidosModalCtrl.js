(function() {
  angular.module('myvcFrontApp').controller('CalcularPromovidosModalCtrl', [
    '$scope',
    '$uibModalInstance',
    'USER',
    '$http',
    'toastr',
    '$interval',
    'grupos',
    function($scope,
    $modalInstance,
    USER,
    $http,
    toastr,
    $interval,
    grupos) {
      $scope.USER = USER;
      $scope.grupos = grupos;
      $scope.calcularTodos = function() {
        $scope.porcentajePromov = 0;
        $scope.bloqueadoPromov = true;
        $scope.grupo_temp_calculado_promov = true;
        $scope.grupo_temp_indce_promov = 0;
        return $scope.intervalo_promov = $interval(function() {
          var grupo;
          if ($scope.grupo_temp_calculado_promov) {
            $scope.grupo_temp_calculado_promov = false;
            grupo = $scope.grupos[$scope.grupo_temp_indce_promov];
            $scope.porcentajePromov = parseInt(($scope.grupo_temp_indce_promov + 1) * 100 / $scope.grupos.length);
            return $http.put('::promovidos/calcular-grupo',
    {
              grupo_id: grupo.grupo_id
            }).then(function(r) {
              toastr.success(grupo.nombre + ' calculado con éxito');
              $scope.grupo_temp_calculado_promov = true;
              $scope.grupo_temp_indce_promov = $scope.grupo_temp_indce_promov + 1;
              if ($scope.grupo_temp_indce_promov === $scope.grupos.length) {
                return $interval.cancel($scope.intervalo_promov);
              }
            },
    function(r2) {
              $scope.grupo_temp_calculado_promov = true;
              return toastr.warning('No se pudo calcular ' + grupo.nombre + '. Intentaremos de nuevo.');
            });
          }
        },
    20);
      };
      $scope.calcularGrupo = function(grupo) {
        if (grupo.calculando) {
          return console.log('Calculando');
        } else {
          grupo.calculando = true;
          return $http.put('::promovidos/calcular-grupo',
    {
            grupo_id: grupo.grupo_id
          }).then(function(r) {
            toastr.success(grupo.nombre + ' calculado con éxito');
            return grupo.calculando = false;
          },
    function(r2) {
            grupo.calculando = false;
            return toastr.warning('No se pudo calcular ' + grupo.nombre);
          });
        }
      };
      $scope.ok = function() {
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//CalcularPromovidosModalCtrl.js.map
