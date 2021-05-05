(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('EditarPreguntaCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$http',
    '$uibModal',
    '$filter',
    'AuthService',
    'datos',
    'toastr',
    '$stateParams',
    '$location',
    '$anchorScroll',
    '$timeout',
    function($scope,
    App,
    $rootScope,
    $state,
    $http,
    $modal,
    $filter,
    AuthService,
    datos,
    toastr,
    $stateParams,
    $location,
    $anchorScroll,
    $timeout) {
      AuthService.verificar_acceso();
      $scope.pregunta_id = $stateParams.pregunta_id;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.pregunta = datos;
      $scope.editor_options = {
        allowedContent: true,
        entities: false
      };
      $timeout(function() {
        $location.hash('scroll-pregunta');
        return $anchorScroll();
      });
      $scope.onEditorReady = function() {
        return console.log('Editor listo');
      };
      $scope.guardar_cambios = function(finalizar) {
        return $http.put('::preguntas/guardar',
    $scope.pregunta).then(function(r) {
          r = r.data;
          $scope.$parent.cambios_pregunta_guardados($scope.pregunta);
          toastr.success('Cambios guardados');
          if (finalizar) {
            return $state.go('panel.editar_actividad',
    {
              actividad_id: $scope.pregunta.actividad_id
            });
          }
        },
    function(r2) {
          return toastr.error('No se pudo guardar cambios');
        });
      };
      $scope.restar = function(modelo) {
        if ($scope.pregunta[modelo] > 0) {
          return $scope.pregunta[modelo] = $scope.pregunta[modelo] - 1;
        }
      };
      $scope.sumar = function(modelo) {
        if ($scope.pregunta[modelo] < 1000) {
          return $scope.pregunta[modelo] = parseInt($scope.pregunta[modelo]) + 1;
        }
      };
      $scope.cancelar = function() {
        return $state.go('panel.editar_actividad',
    {
          actividad_id: $scope.pregunta.actividad_id
        });
      };
      $scope.add_opcion = function() {
        var cant,
    opcion;
        cant = $scope.pregunta.opciones.length;
        opcion = {
          definicion: 'Opcion ' + (cant + 1),
          orden: cant,
          pregunta_id: $scope.pregunta.id,
          is_correct: false
        };
        return $http.put('::opciones/add-opcion',
    opcion).then(function(r) {
          r = r.data;
          toastr.success('Opción agregada');
          return $scope.pregunta.opciones.push(r);
        },
    function(r2) {
          return toastr.error('No se pudo agregar');
        });
      };
      $scope.toggle_opcion_otra = function(otra) {
        return $http.put('::preguntas/toggle-opcion-otra',
    {
          id: $scope.pregunta.id,
          opcion_otra: otra
        }).then(function(r) {
          r = r.data;
          toastr.success('Opción OTRA agregada');
          return $scope.pregunta.opcion_otra = otra;
        },
    function(r2) {
          return toastr.error('No se pudo agregar OTRA');
        });
      };
      $scope.setOpcionCorrect = function(opcion) {
        return $http.put('::opciones/set-opcion-correct',
    opcion).then(function(r) {
          var i,
    len,
    opc,
    ref,
    results;
          r = r.data;
          ref = $scope.pregunta.opciones;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            opc = ref[i];
            results.push(opc.is_correct = opcion === opc ? true : false);
          }
          return results;
        },
    function(r2) {
          return toastr.error('No se pudo establecer correcta');
        });
      };
      $scope.eliminarOpcion = function(opcion) {
        return $http.delete('::opciones/destroy/' + opcion.id).then(function(r) {
          r = r.data;
          toastr.success('Opción eliminada');
          return $scope.pregunta.opciones = $filter('filter')($scope.pregunta.opciones,
    {
            id: '!' + opcion.id
          });
        },
    function(r2) {
          return toastr.error('No se pudo establecer correcta');
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=EditarPreguntaCtrl.js.map
