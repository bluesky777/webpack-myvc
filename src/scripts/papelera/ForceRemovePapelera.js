(function() {
  angular.module("myvcFrontApp").controller('ForceRemoveAlumnoCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    alumno,
    $http,
    toastr) {
      $scope.alumno = alumno;
      $scope.ok = function() {
        $http.delete('::alumnos/forcedelete/' + alumno.alumno_id).then(function(r) {
          return toastr.success('Alumno eliminado con éxito.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar al alumno.',
    'Problema');
        });
        return $modalInstance.close(alumno);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('ForceRemoveGrupoCtrl', [
    '$scope',
    '$uibModalInstance',
    'grupo',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    grupo,
    $http,
    toastr) {
      $scope.grupo = grupo;
      $scope.ok = function() {
        $http.delete('::grupos/forcedelete/' + grupo.id).then(function(r) {
          return toastr.success('Grupo eliminado con éxito.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar al grupo.',
    'Problema');
        });
        return $modalInstance.close(grupo);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('ForceRemoveUnidadCtrl', [
    '$scope',
    '$uibModalInstance',
    'unidad',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    unidad,
    $http,
    toastr) {
      $scope.unidad = unidad;
      $scope.ok = function() {
        $http.delete('::unidades/forcedelete/' + unidad.id).then(function(r) {
          return toastr.success('Unidad eliminada con éxito.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar la unidad.',
    'Problema');
        });
        return $modalInstance.close(unidad);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ForceRemovePapelera.js.map
