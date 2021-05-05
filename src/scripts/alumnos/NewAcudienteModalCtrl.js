(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('NewAcudienteModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'alumno',
    'paises',
    'tipos_doc',
    'parentescos',
    '$http',
    'toastr',
    '$filter',
    '$rootScope',
    '$timeout',
    function($scope,
    App,
    $modalInstance,
    alumno,
    paises,
    tipos_doc,
    parentescos,
    $http,
    toastr,
    $filter,
    $rootScope,
    $timeout) {
      var i,
    len,
    paren,
    ref;
      $scope.alumno = alumno;
      $scope.paises = paises;
      $scope.parentescos = parentescos;
      $scope.datos = {};
      $scope.tipos_doc = tipos_doc;
      $scope.crearTabSelected = false;
      $scope.selectTabSelected = true;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.acudiente_cambiar = $rootScope.acudiente_cambiar;
      $scope.acudiente = {
        sexo: 'M',
        parentesco: $scope.parentescos[0],
        tipo_doc: $scope.tipos_doc[0]
      };
      $scope.acudientes = [];
      if ($scope.acudiente_cambiar) {
        if ($scope.acudiente_cambiar.parentesco) {
          ref = $scope.parentescos;
          for (i = 0, len = ref.length; i < len; i++) {
            paren = ref[i];
            if (paren.parentesco.toLowerCase() === $scope.acudiente_cambiar.parentesco.toLowerCase()) {
              $scope.acudiente.parentesco = paren;
            }
          }
        }
      }
      $scope.selectCrearTab = function() {
        $scope.crearTabSelected = true;
        return $scope.selectTabSelected = false;
      };
      $scope.selectSelectTab = function() {
        $scope.crearTabSelected = false;
        return $scope.selectTabSelected = true;
      };
      $scope.selecAcudOption = function(acudiente) {
        var j,
    len1,
    parentesc,
    ref1,
    results;
        ref1 = $scope.parentescos;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          parentesc = ref1[j];
          if (parentesc.parentesco === 'Madre' && acudiente.sexo === 'F') {
            $scope.acudiente.parentesco = parentesc;
          }
          if (parentesc.parentesco === 'Padre' && acudiente.sexo === 'M') {
            results.push($scope.acudiente.parentesco = parentesc);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
      $scope.$on('modal.closing',
    function(event,
    reason,
    closed) {
        switch (reason) {
          case "backdrop click":
          case "escape key press":
            if (!confirm('¿Seguro que quiere cerrar sin guardar acudiente?')) {
              return event.preventDefault();
            }
        }
      });
      $http.put('::acudientes/ultimos').then(function(r) {
        return $scope.sin_repetir(r.data);
      });
      $scope.refreshAcudientes = function(termino) {
        if (termino) {
          return $http.put('::acudientes/buscar',
    {
            termino: termino
          }).then(function(r) {
            return $scope.sin_repetir(r.data);
          },
    function(r2) {
            return toastr.warning('No se pudo encontrar nada.',
    'Problema');
          });
        }
      };
      $scope.sin_repetir = function(respuesta) {
        var acudi,
    j,
    k,
    len1,
    len2,
    pariente,
    parientes,
    res;
        res = [];
        for (j = 0, len1 = respuesta.length; j < len1; j++) {
          acudi = respuesta[j];
          $scope.existe = false;
          parientes = alumno.subGridOptions ? alumno.subGridOptions.data : alumno.parientes;
          for (k = 0, len2 = parientes.length; k < len2; k++) {
            pariente = parientes[k];
            if (pariente.id === acudi.id) {
              $scope.existe = true;
            }
          }
          if (!$scope.existe) {
            res.push(acudi);
          }
        }
        return $scope.acudientes = res;
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
          var j,
    len1,
    ref1,
    results,
    un_pais;
          $scope.departamentos = r.data;
          if (typeof $scope.acudiente.pais_nac === 'undefined') {
            ref1 = $scope.paises;
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              un_pais = ref1[j];
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
      return $scope.ocupacionCheck = function(texto) {
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
    }
  ]);

}).call(this);

//# sourceMappingURL=NewAcudienteModalCtrl.js.map
