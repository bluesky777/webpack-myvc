(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('UsuariosEditCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'toastr',
    function($scope,
    $rootScope,
    $state,
    $http,
    toastr) {
      $scope.data = {}; // Para el popup del Datapicker
      $scope.usuario = {};
      $scope.tipos = [
        {
          'tipo': 'Alumno'
        },
        {
          'tipo': 'Profesor'
        },
        {
          'tipo': 'Acudiente'
        },
        {
          'tipo': 'Solo usuario'
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
      $http.get('::usuarios/show/' + $state.params.usuario_id).then(function(r) {
        return $scope.usuario = r.data;
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
          $scope.departamentosNac = r;
          if (typeof $scope.alumno.pais_doc === 'undefined') {
            $scope.alumno.pais_doc = $item;
            return $scope.paisSelecionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).get().then(function(r) {
          $scope.ciudadesNac = r;
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

//# sourceMappingURL=UsuariosEditCtrl.js.map
