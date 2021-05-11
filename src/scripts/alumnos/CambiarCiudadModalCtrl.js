(function() {
  angular.module("myvcFrontApp").controller('CambiarCiudadModalCtrl', [
    '$scope',
    '$uibModalInstance',
    'persona',
    'paises',
    'tipo_ciudad',
    'tipo_persona',
    '$http',
    'toastr',
    '$filter',
    function($scope,
    $modalInstance,
    persona,
    paises,
    tipo_ciudad,
    tipo_persona,
    $http,
    toastr,
    $filter) {
      $scope.persona = persona;
      $scope.paises = paises;
      $scope.tipo_ciudad = tipo_ciudad;
      $scope.modificarCiudades = false;
      $scope.datos = {};
      $scope.creando_ciudad = false;
      $scope.creando_departamento = false;
      $scope.creando_pais = false;
      $scope.ciudad_new = '';
      $scope.departamento_new = '';
      $scope.pais_new = '';
      $scope.modificando_depart = false;
      $scope.crearCiudad = function() {
        $scope.creando_ciudad = true;
        return $scope.$broadcast('paisSeleccionadoEvent2');
      };
      $scope.crearDepartamento = function() {
        return $scope.creandodepartamento = true;
      };
      $scope.crearPais = function() {
        return $scope.creandopais = true;
      };
      $scope.guardarCiudad = function(ciudad_new,
    departamento_new) {
        var depart_guardar;
        if (!$scope.datos.pais) {
          toastr.warning('Debes seleccionar un pais.');
          return;
        }
        if (!$scope.datos.departamento && departamento_new === '') {
          toastr.warning('Debe seleccionar departamento o escribir uno nuevo.');
          return;
        }
        if (ciudad_new === '') {
          toastr.warning('Debe escribir la nueva ciudad.');
          return;
        }
        if ($scope.datos.departamento) {
          depart_guardar = departamento.departamento;
        } else {
          depart_guardar = departamento_new;
        }
        return $http.post('::ciudades/guardar-ciudad',
    {
          ciudad: ciudad_new,
          departamento: depart_guardar,
          pais_id: $scope.datos.pais.id
        }).then(function(r) {
          toastr.success('Creado correctamente: ' + r.data.ciudad);
          if ($scope.datos.departamento) {
            $scope.ciudades.push(r.data);
          }
          $scope.creandociudad = false;
          $scope.ciudad_new = ''; // No sé por qué no funciona!
          $scope.departamento_new = '';
          $scope.guardar = true;
          return $http.get('::paises').then(function(r) {
            $scope.paises = r.data;
            return $scope.paisSelect($filter('filter')($scope.paises,
    {
              id: 1
            })[0]);
          },
    function(r2) {
            return toastr.error('No se pudo traer las ciudades.');
          });
        },
    function(r2) {
          return toastr.error('No se pudo crear',
    'Error');
        });
      };
      $scope.guardarPais = function() {
        return $http.post('::paises/guardar',
    $scope.pais_new).then(function(r) {
          toastr.success('Creado correctamente: ' + r.data.paisnuevo);
          $scope.paises.push(r.data);
          return $scope.paisSelect($scope.ciudad_new.pais);
        },
    function(r2) {
          return toastr.error('No se pudo crear',
    'Error');
        });
      };
      $scope.escribeEnDepartamentoNew = function() {
        return $scope.datos.departamento = void 0;
      };
      $scope.actualizarCiudad = function(ciudad) {
        return $http.put('::ciudades/actualizar-ciudad',
    ciudad).then(function(r) {
          toastr.success('Actualizado: ' + ciudad.ciudad);
          return ciudad.editandoCiudad = false;
        },
    function(r2) {
          return toastr.error('No se pudo actualizar',
    'Error');
        });
      };
      $scope.actualizarDepartamento = function(ciudad) {
        return $http.put('::ciudades/actualizar-departamento',
    ciudad).then(function(r) {
          var ciud,
    i,
    len,
    pais,
    ref;
          toastr.success('Actualizado: ' + ciudad.departamento);
          ciudad.editandoDepart = false;
          pais = $scope.ciudad_new.pais;
          ref = $scope.ciudades;
          for (i = 0, len = ref.length; i < len; i++) {
            ciud = ref[i];
            ciud.departamento = ciudad.departamento;
          }
          return $scope.modificando_depart = true;
        },
    function(r2) {
          return toastr.error('No se pudo actualizar',
    'Error');
        });
      };
      $scope.actualizarPais = function(pais) {
        return $http.put('::paises/actualizar',
    pais).then(function(r) {
          toastr.success('Actualizado: ' + pais.pais);
          pais.editandoPais = false;
          return pais.editandoAbrev = false;
        },
    function(r2) {
          return toastr.error('No se pudo actualizar',
    'Error');
        });
      };
      $scope.paisSelect = function($item,
    numero) {
        return $http.put("::ciudades/departamentos-by-id",
    {
          pais_id: $item.id
        }).then(function(r) {
          $scope.departamentos = r.data.departamentos;
          if (typeof $scope.datos.pais === 'undefined') {
            $scope.datos.pais = $item;
          }
          return $scope.$broadcast('paisSeleccionadoEvent' + numero);
        });
      };
      // Que inicialmente aparezca la primera opción, Colombia.
      $scope.paisSelect($filter('filter')($scope.paises,
    {
        id: 1
      })[0],
    1);
      $scope.departamentoSelect = function($item,
    numero) {
        if ($item) {
          $scope.departamento_new = '';
          return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
            $scope.ciudades = r.data;
            if (typeof $scope.datos.departamento === 'undefined') {
              $scope.datos.departamento = $item;
            }
            return $scope.$broadcast('departamentoSeleccionadoEvent' + numero);
          });
        }
      };
      $scope.eliminarCiudad = function(ciudad) {
        return $http.delete('::ciudades/destroy/' + ciudad.id).then(function(r) {
          toastr.success('Ciudad enviada a la papelera.',
    'Eliminado');
          return $scope.ciudades = $filter('filter')($scope.ciudades,
    {
            id: '!' + ciudad.id
          });
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
      };
      $scope.ok = function(ciudad) {
        var ciudad_selec,
    datos;
        if ($scope.seleccionandoCiudad) {
          return;
        }
        $scope.seleccionandoCiudad = true;
        ciudad_selec = $scope.datos.ciudad;
        if (ciudad) {
          ciudad_selec = ciudad;
        }
        datos = {
          propiedad: tipo_ciudad,
          valor: ciudad_selec.id
        };
        if (tipo_persona === 'acudiente') {
          datos.acudiente_id = persona.id;
          datos.parentesco_id = persona.parentesco_id;
          datos.user_acud_id = persona.user_id;
        } else {
          datos.alumno_id = persona.alumno_id;
        }
        return $http.put('::' + tipo_persona + 's/guardar-valor',
    datos).then(function(r) {
          toastr.success('Seleccionado.');
          persona[tipo_ciudad + '_nombre'] = ciudad_selec.ciudad;
          persona[tipo_ciudad] = ciudad_selec.id;
          return $modalInstance.close(persona);
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

//CambiarCiudadModalCtrl.js.map
