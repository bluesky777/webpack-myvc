(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('ProfesoresNewCtrl', [
    '$scope',
    '$http',
    'toastr',
    '$filter',
    '$state',
    function($scope,
    $http,
    toastr,
    $filter,
    $state) {
      $scope.profesor = {
        'sexo': 'M',
        'password': '1234567',
        'fecha_nac': new Date('1990-01-01')
      };
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
      $http.get('::paises').then(function(r) {
        return $scope.paises = r.data;
      });
      $http.get('::tiposdocumento').then(function(r) {
        return $scope.tipos_doc = r.data;
      });
      $scope.crear = function() {
        $scope.profesor.fecha_nac = $filter('date')($scope.profesor.fecha_nac,
    'yyyy-MM-dd');
        return $http.post('::profesores/store',
    $scope.profesor).then(function(r) {
          toastr.success('Profesor creado');
          $scope.$emit('profesorcreado',
    r.data);
          return $state.go('panel.profesores');
        },
    function(r2) {
          return toastr.error('Profesor NO creado',
    'Problema');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.profesor.pais_doc === 'undefined') {
            $scope.profesor.pais_doc = $item;
            return $scope.paisSelecionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.profesor.departamento_doc === 'undefined') {
            $scope.profesor.departamento_doc = $item;
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
        formatYear: 'yy'
      };
    }
  ]);

}).call(this);

//ProfesoresNewCtrl.js.map
