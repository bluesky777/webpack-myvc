(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('RespuestasCtrl', [
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
      var alumno,
    grupo,
    i,
    j,
    k,
    len,
    len1,
    len2,
    pregunta,
    ref,
    ref1,
    ref2;
      AuthService.verificar_acceso();
      $scope.actividad_id = $stateParams.actividad_id;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.plantilla = $scope.views + 'notas/popoverAlumnoInfo.tpl.html?' + Math.random().toString(36).slice(2);
      $scope.actividad = datos.actividad;
      $scope.grupos = datos.grupos;
      $rootScope.menucompacto = true;
      $scope.alumnos_unidos = [];
      ref = $scope.grupos;
      // Los alumnos están en cada Grupo. Necesito agregarlos juntos en un solo Array
      for (i = 0, len = ref.length; i < len; i++) {
        grupo = ref[i];
        ref1 = grupo.alumnos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          alumno = ref1[j];
          $scope.alumnos_unidos.push(alumno);
        }
      }
      // Cantidad de Opciones Maximas
      $scope.cantOpcMaxi = 0;
      ref2 = $scope.actividad.preguntas;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        pregunta = ref2[k];
        $scope.cantOpcMaxi = pregunta.opciones.length > $scope.cantOpcMaxi ? pregunta.opciones.length : $scope.cantOpcMaxi;
      }
      $scope.getOpcionesMaximas = function() {
        return new Array($scope.cantOpcMaxi);
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

