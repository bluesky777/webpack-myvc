(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('EditAcudienteModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'acudiente',
    'paises',
    'tipos_doc',
    'parentescos',
    '$http',
    'toastr',
    '$filter',
    '$rootScope',
    function($scope,
    App,
    $modalInstance,
    acudiente,
    paises,
    tipos_doc,
    parentescos,
    $http,
    toastr,
    $filter,
    $rootScope) {
      var i,
    len,
    ref,
    tipo_d;
      $scope.acudiente = acudiente;
      $scope.paises = paises;
      $scope.parentescos = parentescos;
      $scope.datos = {};
      $scope.tipos_doc = tipos_doc;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentosNac = r.data;
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.acudiente.departamento_doc === 'undefined') {
            $scope.acudiente.departamento_doc = $item;
            return $scope.departSeleccionado($item);
          }
        });
      };
      $scope.paisSelecionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          var i,
    len,
    ref,
    results,
    un_pais;
          $scope.departamentos = r.data;
          if (typeof $scope.acudiente.pais_nac === 'undefined') {
            ref = $scope.paises;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              un_pais = ref[i];
              if (un_pais.id === $item.id) {
                $scope.acudiente.pais_nac = un_pais;
                results.push($scope.paisNacSelect(un_pais));
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        });
      };
      $scope.departSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $scope.dateOptions = {
        formatYear: 'yy'
      };
      $scope.restarEstrato = function() {
        if ($scope.alumno.estrato > 0) {
          return $scope.alumno.estrato = $scope.alumno.estrato - 1;
        }
      };
      $scope.sumarEstrato = function() {
        if ($scope.alumno.estrato < 10) {
          return $scope.alumno.estrato = $scope.alumno.estrato + 1;
        }
      };
      $scope.crearAcudiente = function() {
        $scope.acudiente.alumno_id = alumno.alumno_id;
        return $http.post('::acudientes/crear',
    $scope.acudiente).then(function(r) {
          toastr.success('Acudiente creado con éxito.');
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo crear al alumno.',
    'Problema');
        });
      };
      $scope.seleccionarAcudiente = function() {
        var datos;
        datos = {
          acudiente_id: $scope.datos.acudiente.id,
          alumno_id: alumno.alumno_id,
          parentesco: $scope.acudiente.parentesco.parentesco,
          ocupacion: $scope.acudiente.ocupacion
        };
        if ($rootScope.acudiente_cambiar) {
          datos.parentesco_acudiente_cambiar_id = $rootScope.acudiente_cambiar.parentesco_id;
        }
        return $http.put('::acudientes/seleccionar-parentesco',
    datos).then(function(r) {
          toastr.success('Acudiente seleccionado.');
          delete $rootScope.acudiente_cambiar;
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo seleccionar.',
    'Problema');
        });
      };
      $scope.ocupacionCheck = function(texto) {
        $scope.verificandoOcupacion = true;
        return $http.put('::acudientes/ocupaciones-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.ocupaciones_match = r.data.ocupaciones;
          $scope.verificandoOcupacion = false;
          return $scope.ocupaciones_match.map(function(item) {
            return item.ocupacion;
          });
        });
      };
      if ($scope.acudiente.tipo_doc === null) {
        $scope.acudiente.tipo_doc = $scope.tipos_doc[0];
      } else {
        ref = $scope.tipos_doc;
        for (i = 0, len = ref.length; i < len; i++) {
          tipo_d = ref[i];
          if ($scope.acudiente.tipo_doc === tipo_d.id) {
            $scope.acudiente.tipo_doc = tipo_d;
          }
        }
      }
      if ($scope.acudiente.ciudad_nac === null) {
        $scope.acudiente.pais_nac = {
          id: 1,
          pais: 'COLOMBIA',
          abrev: 'CO'
        };
        return $scope.paisNacSelect($scope.acudiente.pais_nac,
    $scope.acudiente.pais_nac);
      } else {
        $http.get('::ciudades/datosciudad/' + $scope.acudiente.ciudad_nac).then(function(r2) {
          var ciudad,
    depart,
    j,
    k,
    l,
    len1,
    len2,
    len3,
    pais,
    ref1,
    ref2,
    ref3,
    results;
          $scope.paises = r2.data.paises;
          $scope.departamentosNac = r2.data.departamentos;
          $scope.ciudadesNac = r2.data.ciudades;
          ref1 = $scope.paises;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            pais = ref1[j];
            if (pais.id === r2.data.pais.id) {
              $scope.acudiente.pais_nac = pais;
            }
          }
          ref2 = $scope.departamentosNac;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            depart = ref2[k];
            if (depart.departamento === r2.data.departamento.departamento) {
              $scope.acudiente.departamento_nac = depart;
            }
          }
          ref3 = $scope.ciudadesNac;
          results = [];
          for (l = 0, len3 = ref3.length; l < len3; l++) {
            ciudad = ref3[l];
            if (ciudad.id === r2.data.ciudad.id) {
              results.push($scope.acudiente.ciudad_nac = ciudad);
            } else {
              results.push(void 0);
            }
          }
          return results;
        });
        if ($scope.acudiente.ciudad_doc === null) {
          $scope.acudiente.pais_doc = {
            id: 1,
            pais: 'COLOMBIA',
            abrev: 'CO'
          };
          return $scope.paisDocSelect($scope.acudiente.pais_doc,
    $scope.acudiente.pais_doc);
        } else {
          return $http.get('::ciudades/datosciudad/' + $scope.acudiente.ciudad_doc).then(function(r2) {
            r2 = r2.data;
            $scope.paises = r2.paises;
            $scope.departamentos = r2.departamentos;
            $scope.ciudades = r2.ciudades;
            $scope.acudiente.pais_doc = r2.pais;
            $scope.acudiente.departamento_doc = r2.departamento;
            return $scope.acudiente.ciudad_doc = r2.ciudad;
          });
        }
      }
    }
  ]);

}).call(this);

//EditAcudienteModalCtrl.js.map
