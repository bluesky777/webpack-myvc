(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('RequisitosCtrl', [
    '$scope',
    'App',
    '$state',
    '$interval',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    function($scope,
    App,
    $state,
    $interval,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http) {
      AuthService.verificar_acceso();
      $scope.requisitos = [];
      $scope.mostrar_crear = false;
      $scope.guardando = false;
      $scope.req_nuevo = {
        requisito: '',
        descripcion: ''
      };
      $http.put('::requisitos').then(function(r) {
        return $scope.years_requisitos = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los requisitos');
      });
      $scope.crear_requisito = function(year) {
        $scope.mostrar_crear = true;
        $scope.req_nuevo.year_id = year.id;
        return $scope.req_nuevo.year = year.year;
      };
      $scope.guardar_nuevo = function() {
        $scope.guardando = true;
        return $http.post('::requisitos/store',
    $scope.req_nuevo).then(function(r) {
          var i,
    len,
    ref,
    requi;
          ref = $scope.years_requisitos;
          for (i = 0, len = ref.length; i < len; i++) {
            requi = ref[i];
            console.log('oNO',
    requi,
    r.data.requisito.year_id);
            if (requi.id === r.data.requisito.year_id) {
              console.log(requi,
    r.data.requisito.year_id);
              requi.requisitos.push(r.data.requisito);
            }
          }
          $scope.mostrar_crear = false;
          $scope.guardando = false;
          return $scope.req_nuevo = {
            requisito: '',
            descripcion: ''
          };
        },
    function(r2) {
          toastr.error('No se pudo crear');
          return $scope.guardando = false;
        });
      };
      $scope.guardar_cambios = function(req_edit) {
        $scope.guardando = true;
        return $http.put('::requisitos/update',
    req_edit).then(function(r) {
          $scope.mostrar_editar = false;
          return $scope.guardando = false;
        },
    function(r2) {
          toastr.error('No se pudo crear');
          return $scope.guardando = false;
        });
      };
      $scope.editar = function(requisito,
    year) {
        requisito.year = year.year;
        requisito.year_id = year.id;
        $scope.mostrar_editar = true;
        return $scope.req_edit = requisito;
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/removeRequisito.tpl.html',
          controller: 'RemoveRequisitoCtrl',
          resolve: {
            elemento: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(elem) {
          var i,
    index,
    len,
    ref,
    requisito,
    results;
          ref = $scope.requisitos;
          results = [];
          for (index = i = 0, len = ref.length; i < len; index = ++i) {
            requisito = ref[index];
            if (elem.id === requisito.id) {
              results.push($scope.requisitos.splice(index,
    1));
            } else {
              results.push(void 0);
            }
          }
          return results;
        },
    function() {});
      };
    }
  // nada
  ]).controller('RemoveRequisitoCtrl', [
    '$scope',
    '$uibModalInstance',
    'elemento',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    elemento,
    $http,
    toastr,
    App) {
      $scope.elemento = elemento;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.ok = function() {
        $http.delete('::requisitos/destroy/' + elemento.id).then(function(r) {
          return toastr.success('Requisito removido.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
        return $modalInstance.close(elemento);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//RequisitosCtrl.js.map
