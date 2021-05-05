(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('AlumnosEditCtrl', [
    '$scope',
    '$state',
    '$http',
    'toastr',
    function($scope,
    $state,
    $http,
    toastr) {
      $scope.data = {}; // Para el popup del Datapicker
      $scope.alumno = {};
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
      $http.get('::alumnos/show/' + $state.params.alumno_id).then(function(r) {
        $scope.alumno = r.data;
        if (r.data.user) {
          $scope.alumno.username = r.data.user.username;
        }
        if (r.data.user) {
          $scope.alumno.email2 = r.data.user.email;
        }
        $scope.alumno.ciudad_nac_id = r.data.ciudad_nac;
        $scope.alumno.ciudad_doc_id = r.data.ciudad_doc;
        if ($scope.alumno.ciudad_nac === null) {
          $scope.alumno.pais_nac = {
            id: 1,
            pais: 'COLOMBIA',
            abrev: 'CO'
          };
          $scope.paisNacSelect($scope.alumno.pais_nac,
    $scope.alumno.pais_nac);
        } else {
          $http.get('::ciudades/datosciudad/' + $scope.alumno.ciudad_nac_id).then(function(r2) {
            $scope.paises = r2.data.paises;
            $scope.departamentosNac = r2.departamentos;
            $scope.ciudadesNac = r2.ciudades;
            $scope.alumno.pais_nac = r2.pais;
            $scope.alumno.departamento_nac = r2.departamento;
            return $scope.alumno.ciudad_nac = r2.ciudad;
          });
        }
        if ($scope.alumno.ciudad_doc > 0) {
          return $http.get('::ciudades/datosciudad/' + $scope.alumno.ciudad_doc_id).then(function(r2) {
            $scope.paises = r2.data.paises;
            $scope.departamentos = r2.departamentos;
            $scope.ciudades = r2.ciudades;
            $scope.alumno.pais_doc = r2.pais;
            $scope.alumno.departamento_doc = r2.departamento;
            return $scope.alumno.ciudad_doc = r2.ciudad;
          });
        }
      });
      $http.get('::paises').then(function(r) {
        return $scope.paises = r.data;
      });
      $http.get('::tiposdocumento').then(function(r) {
        return $scope.tipos_doc = r.data;
      });
      $scope.guardar = function() {
        return $http.put('::alumnos/update/' + $scope.alumno.id,
    $scope.alumno).then(function(r) {
          return toastr.success('Alumno actualizado correctamente');
        },
    function(r2) {
          return toastr.error('No se pudo guardar el alumno');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.alumno.pais_doc === 'undefined') {
            $scope.alumno.pais_doc = $item;
            return $scope.paisSelecionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.alumno.departamento_doc === 'undefined') {
            $scope.alumno.departamento_doc = $item;
            return $scope.departSeleccionado($item);
          }
        });
      };
      $scope.paisSelecionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentos = r.data;
        });
      };
      $scope.departSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $scope.dateOptions = {
        formatYear: 'yyyy'
      };
      $scope.restarEstrato = function() {
        if ($scope.alumno.estrato > 0) {
          return $scope.alumno.estrato = $scope.alumno.estrato - 1;
        }
      };
      $scope.sumarEstrato = function() {
        if ($scope.alumno.estrato < 10) {
          return $scope.alumno.estrato = parseInt($scope.alumno.estrato) + 1;
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AlumnosEditCtrl.js.map
