(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('MisActividadesCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$http',
    '$uibModal',
    '$filter',
    'AuthService',
    'datos',
    '$stateParams',
    'toastr',
    function($scope,
    App,
    $rootScope,
    $state,
    $http,
    $modal,
    $filter,
    AuthService,
    datos,
    $stateParams,
    toastr) {
      var asign,
    i,
    len,
    ref;
      AuthService.verificar_acceso();
      $scope.grupo_id = $stateParams.grupo_id; // Puede que solo esté este
      $scope.asign_id = $stateParams.asign_id; // o solo este
      $scope.grupos = datos.grupos;
      $scope.otras_asignaturas = datos.otras_asignaturas;
      $scope.mis_asignaturas = datos.mis_asignaturas;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $rootScope.menucompacto = true;
      if ($stateParams.asign_id) {
        ref = $scope.mis_asignaturas;
        for (i = 0, len = ref.length; i < len; i++) {
          asign = ref[i];
          if (asign.asignatura_id === parseInt($scope.asign_id)) {
            $scope.actividades = asign.actividades;
            $scope.asignatura = asign;
          }
        }
      }
      $scope.crear = function(asignatura_id) {
        return $http.post('::actividades/crear',
    {
          asignatura_id: asignatura_id
        }).then(function(r) {
          r = r.data;
          toastr.success('Actividad creada',
    'Ahora a editar');
          return $state.go('panel.editar_actividad',
    {
            actividad_id: r.id
          });
        },
    function(r2) {
          return toastr.error('No se pudo crear actividad.',
    'Error');
        });
      };
      $scope.eliminarActividad = function(row,
    asignatura) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: App.views + 'actividades/removeActividad.tpl.html',
          controller: 'RemoveActividadCtrl',
          resolve: {
            actividad: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(activ) {
          return asignatura.actividades = $filter('filter')(asignatura.actividades,
    {
            id: '!' + activ.id
          });
        });
      };
    }
  ]).controller('RemoveActividadCtrl', [
    '$scope',
    '$uibModalInstance',
    'actividad',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    actividad,
    $http,
    toastr) {
      $scope.actividad = actividad;
      $scope.ok = function() {
        $http.delete('::actividades/destroy/' + actividad.id).then(function(r) {
          return toastr.success('Actividad enviada a la papelera.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
        return $modalInstance.close(actividad);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=MisActividadesCtrl.js.map
