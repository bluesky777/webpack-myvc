(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('AsignarAcudienteAOtroModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'elemento',
    '$uibModal',
    '$http',
    'toastr',
    '$filter',
    '$rootScope',
    '$timeout',
    function($scope,
    App,
    $modalInstance,
    acudiente,
    $modal,
    $http,
    toastr,
    $filter,
    $rootScope,
    $timeout) {
      var i,
    len,
    parentesc,
    ref;
      $scope.acudiente = acudiente;
      $scope.datos = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.repetido = false;
      $scope.alumno = {};
      $scope.parentescos = App.parentescos;
      ref = $scope.parentescos;
      for (i = 0, len = ref.length; i < len; i++) {
        parentesc = ref[i];
        if (parentesc.parentesco === 'Madre' && acudiente.sexo === 'F') {
          $scope.acudiente.parentesco = parentesc;
        }
        if (parentesc.parentesco === 'Padre' && acudiente.sexo === 'M') {
          $scope.acudiente.parentesco = parentesc;
        }
      }
      $scope.seleccionarAcudiente = function() {
        var datos;
        datos = {
          acudiente_id: $scope.acudiente.id,
          alumno_id: $scope.alumno.alumno_id,
          parentesco: $scope.acudiente.parentesco.parentesco,
          ocupacion: $scope.acudiente.ocupacion
        };
        return $http.put('::acudientes/seleccionar-parentesco',
    datos).then(function(r) {
          if ($scope.acudiente.parentesco) {
            $scope.acudiente.parentesco = $scope.acudiente.parentesco.parentesco;
          }
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo seleccionar.',
    'Problema');
        });
      };
      $scope.quitarAcudiente = function(rowAlum,
    acudiente) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/quitarAcudienteModalConfirm.tpl.html',
          controller: 'QuitarAcudienteModalConfirmCtrl',
          resolve: {
            alumno: function() {
              return rowAlum;
            },
            acudiente: function() {
              return acudiente;
            }
          }
        });
        return modalInstance.result.then(function(acud) {
          var indice,
    j,
    len1,
    pariente,
    ref1,
    results;
          ref1 = $scope.acudientes;
          results = [];
          for (indice = j = 0, len1 = ref1.length; j < len1; indice = ++j) {
            pariente = ref1[indice];
            if (pariente) {
              if (pariente.id === acud.id) {
                results.push($scope.acudientes.splice(indice,
    1));
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        },
    function() {});
      };
      // nada
      $scope.personaCheck = function(texto) {
        $scope.verificandoPersona = true;
        return $http.put('::alumnos/personas-check',
    {
          texto: texto,
          todos_anios: true
        }).then(function(r) {
          $scope.personas_match = r.data.personas;
          $scope.personas_match.map(function(perso) {
            return perso.perfilPath = $scope.perfilPath;
          });
          $scope.verificandoPersona = false;
          return $scope.personas_match;
        });
      };
      $scope.seleccionarPersona = function($item,
    $model,
    $label) {
        $scope.alumno = $item;
        return $http.put('::acudientes/de-persona',
    {
          alumno_id: $item.alumno_id
        }).then(function(r) {
          var j,
    len1,
    pariente,
    ref1;
          ref1 = r.data.acudientes;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            pariente = ref1[j];
            if (pariente.id === $scope.acudiente.id) {
              toastr.warning('Ya tiene este acudiente.');
              $scope.repetido = true;
              pariente.repetido = true;
            }
          }
          return $scope.acudientes = r.data.acudientes;
        },
    function() {
          return toastr.error('Error trayendo acudientes de ' + $item.nombres);
        });
      };
      return $scope.cancel = function() {
        if ($scope.acudiente.parentesco) {
          $scope.acudiente.parentesco = $scope.acudiente.parentesco.parentesco;
        }
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('QuitarAcudienteModalConfirmCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'alumno',
    'acudiente',
    '$http',
    'toastr',
    function($scope,
    App,
    $modalInstance,
    alumno,
    acudiente,
    $http,
    toastr) {
      $scope.acudiente = acudiente;
      $scope.alumno = alumno;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.ok = function() {
        var datos;
        datos = {
          parentesco_id: $scope.acudiente.parentesco_id
        };
        return $http.put('::acudientes/quitar-parentesco-alumno',
    datos).then(function(r) {
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo seleccionar.',
    'Problema');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AsignarAcudienteAOtroModalCtrl.js.map
