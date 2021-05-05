(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('ProfesoresEditCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$state',
    '$filter',
    function($scope,
    toastr,
    $http,
    $state,
    $filter) {
      $scope.data = {}; // Para el popup del Datapicker
      $scope.profesor = {};
      $scope.paises = [
        {
          id: 1,
          pais: 'COLOMBIA'
        }
      ];
      $scope.tipos_doc = [
        {
          id: 1,
          tipo: 'CC'
        }
      ];
      $scope.departamentos = [
        {
          id: 1,
          departamento: 'ANTIOQUIA'
        }
      ];
      $scope.ciudades = [
        {
          id: 1,
          ciudad: 'MEDELLÍN'
        }
      ];
      $scope.sangres = [
        {
          sangre: 'O+'
        },
        {
          sangre: 'O-'
        },
        {
          sangre: 'A+'
        },
        {
          sangre: 'A-'
        },
        {
          sangre: 'B+'
        },
        {
          sangre: 'B-'
        },
        {
          sangre: 'AB+'
        },
        {
          sangre: 'AB-'
        }
      ];
      $scope.estados_civiles = [
        {
          estado_civil: 'Soltero'
        },
        {
          estado_civil: 'Casado'
        },
        {
          estado_civil: 'Divorciado'
        },
        {
          estado_civil: 'Viudo'
        }
      ];
      $http.get('::profesores/show/' + $state.params.profe_id).then(function(r) {
        var estado,
    i,
    len,
    ref;
        $scope.profesor = r.data[0];
        $scope.profesor.fecha_nac = new Date($scope.profesor.fecha_nac);
        $scope.profesor.password = '';
        $scope.profesor.password2 = '';
        if ($scope.profesor.estado_civil) {
          ref = $scope.estados_civiles;
          for (i = 0, len = ref.length; i < len; i++) {
            estado = ref[i];
            if (estado.estado_civil === $scope.profesor.estado_civil) {
              $scope.profesor.estado_civil = estado;
            }
          }
        } else {
          $scope.profesor.estado_civil = $scope.estados_civiles[0];
        }
        if ($scope.profesor.ciudad_nac === null) {
          $scope.profesor.pais_nac = {
            id: 1,
            pais: 'COLOMBIA',
            abrev: 'CO'
          };
          $scope.paisNacSelect($scope.profesor.pais_nac,
    $scope.profesor.pais_nac);
        } else {
          $http.get('::ciudades/datosciudad/' + $scope.profesor.ciudad_nac).then(function(r2) {
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
                $scope.profesor.pais_nac = pais;
              }
            }
            ref2 = $scope.departamentosNac;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              depart = ref2[k];
              if (depart.departamento === r2.data.departamento.departamento) {
                $scope.profesor.departamento_nac = depart;
              }
            }
            ref3 = $scope.ciudadesNac;
            results = [];
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              ciudad = ref3[l];
              if (ciudad.id === r2.data.ciudad.id) {
                results.push($scope.profesor.ciudad_nac = ciudad);
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        }
        if ($scope.profesor.ciudad_doc === null) {
          $scope.profesor.pais_doc = {
            id: 1,
            pais: 'COLOMBIA',
            abrev: 'CO'
          };
          $scope.paisDocSelect($scope.profesor.pais_doc,
    $scope.profesor.pais_doc);
        } else {
          $http.get('::ciudades/datosciudad/' + $scope.profesor.ciudad_doc).then(function(r2) {
            r2 = r2.data;
            $scope.paises = r2.paises;
            $scope.departamentos = r2.departamentos;
            $scope.ciudades = r2.ciudades;
            $scope.profesor.pais_doc = r2.pais;
            $scope.profesor.departamento_doc = r2.departamento;
            return $scope.profesor.ciudad_doc = r2.ciudad;
          });
        }
        return $http.get('::tiposdocumento').then(function(r) {
          var j,
    len1,
    ref1,
    results,
    tipo_d;
          $scope.tipos_doc = r.data;
          if ($scope.profesor.tipo_doc === null) {
            return $scope.profesor.tipo_doc = $scope.tipos_doc[0];
          } else {
            ref1 = $scope.tipos_doc;
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              tipo_d = ref1[j];
              if ($scope.profesor.tipo_doc === tipo_d.id) {
                results.push($scope.profesor.tipo_doc = tipo_d);
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        });
      });
      $http.get('::paises').then(function(r) {
        return $scope.paises = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los paises');
      });
      $scope.guardar = function() {
        if ($scope.profesor.password.length === 0) {
          if ($scope.profesor.password.length > 0) {
            toastr.warning('Si lo quieres es cambiar la contraseña, debes copiarla 2 veces.');
            return;
          }
        } else {
          if ($scope.profesor.password.length < 3) {
            toastr.warning('La contraseña debe tener al menos 3 caracteres');
            return;
          } else {
            if ($scope.profesor.password !== $scope.profesor.password2) {
              toastr.warning('Las contraseñas deben ser iguales');
              return;
            }
          }
        }
        return $http.put('::profesores/update/' + $scope.profesor.profesor_id,
    $scope.profesor).then(function(r) {
          return toastr.success('Profesor actualizado con éxito');
        },
    function(r2) {
          return toastr.error('No se guardaron los cambios',
    'Problemas');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.profesor.pais_doc === 'undefined') {
            $scope.profesor.pais_doc = $item;
            return $scope.paisDocSelect($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.profesor.departamento_doc === 'undefined') {
            $scope.profesor.departamento_doc = $item;
            return $scope.departDocSelect($item);
          }
        });
      };
      $scope.paisDocSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentos = r.data;
        });
      };
      $scope.departDocSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $scope.dateOptions = {
        formatYear: 'yyyy'
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ProfesoresEditCtrl.js.map
