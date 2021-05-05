(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('MiActividadCtrl', [
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
      AuthService.verificar_acceso();
      $scope.actividad_id = $stateParams.actividad_id;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.actividad = datos.actividad;
      $scope.actividad_resuelta = datos.actividad_resuelta;
      $rootScope.menucompacto = true;
      $scope.seleccionar_opcion = function(pregunta,
    opcion) {
        var i,
    len,
    opc,
    ref;
        datos = {
          actividad_resuelta_id: $scope.actividad_resuelta.id,
          pregunta_id: pregunta.id,
          tipo_pregunta: pregunta.tipo_pregunta,
          opcion_id: opcion.id,
          opcion_cuadricula_id: null
        };
        if ($scope.actividad.one_by_one) {

        } else {
          // Abrir un modal de confirmación para pasar a la siguiente pregunta
          $http.put('::mis-actividades/seleccionar-opcion',
    datos).then(function() {
            return toastr.success('Selección guardada');
          },
    function() {
            return toastr.error('No se pudo guardar selección');
          });
        }
        ref = pregunta.opciones;
        for (i = 0, len = ref.length; i < len; i++) {
          opc = ref[i];
          opc.seleccionada = false;
        }
        return opcion.seleccionada = true;
      };
      $scope.finalizar_actividad = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: App.views + 'actividades/finalizarActividad.tpl.html',
          controller: 'FinalizarActividadCtrl',
          resolve: {
            actividad: function() {
              return $scope.actividad;
            }
          }
        });
        return modalInstance.result.then(function(activ) {
          return $state.go('panel.mis_actividades',
    {
            alumno_id: $scope.USER.persona_id
          });
        });
      };
    }
  ]).controller('FinalizarActividadCtrl', [
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
        return $http.put('::mis-actividades/finalizar-actividad',
    {
          actividad_resuelta_id: actividad.actividad_resuelta_id
        }).then(function() {
          toastr.info('Has finalizado actividad');
          return $modalInstance.close(actividad);
        },
    function() {
          return toastr.error('No se pudo guardar selección');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=MiActividadCtrl.js.map
