(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('GradosCtrl', [
    '$scope',
    '$filter',
    '$state',
    'App',
    'niveles',
    '$uibModal',
    'toastr',
    '$http',
    function($scope,
    $filter,
    $state,
    App,
    niveles,
    $modal,
    toastr,
    $http) {
      var btGrid1,
    btGrid2,
    editNivel;
      $scope.grados = {
        nivel: {}
      };
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.niveles = niveles;
      $scope.editar = function(row) {
        return $state.go('panel.grados.editar',
    {
          grado_id: row.id
        });
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==grados/removeGrado.tpl.html',
          controller: 'RemoveGradoCtrl',
          size: 'sm',
          resolve: {
            grado: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(grado) {
          $scope.grados = $filter('filter')($scope.grados,
    {
            id: '!' + grado.id
          });
          return $scope.gridOptions.data = $scope.grados;
        });
      };
      editNivel = "==grados/editCellNivel.tpl.html";
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-times "></i></a>';
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            name: 'edicion',
            displayName: 'Edición',
            maxWidth: 50,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid2,
            enableCellEdit: false
          },
          {
            field: 'nombre',
            enableHiding: false
          },
          {
            field: 'abrev',
            displayName: 'abreviatura',
            maxWidth: 50,
            enableSorting: false
          },
          {
            field: 'orden',
            type: 'number',
            maxWidth: 50
          },
          {
            field: 'nivel_educativo_id',
            displayName: 'Nivel Educativo',
            editDropdownOptionsArray: niveles,
            cellFilter: 'mapNivel:grid.appScope.niveles',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'nombre'
          },
          {
            name: 'nn',
            displayName: '',
            maxWidth: 20,
            enableSorting: false,
            enableFiltering: false
          }
        ],
        multiSelect: false,
        //filterOptions: $scope.filterOptions,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            if (newValue !== oldValue) {
              $http.put('::grados/update/' + rowEntity.id,
    rowEntity).then(function(r) {
                return toastr.success('Grado actualizado con éxito',
    'Actualizado');
              },
    function(r2) {
                return toastr.error('Cambio no guardado',
    'Error');
              });
            }
            return $scope.$apply();
          });
        }
      };
      $http.get('::grados').then(function(data) {
        $scope.grados = data.data;
        return $scope.gridOptions.data = $scope.grados;
      });
      $scope.$on('gradocreado',
    function(ev,
    grado) {
        $scope.grados.push(grado);
        return $scope.gridOptions.data = $scope.grados;
      });
    }
  ]).filter('mapNivel', [
    '$filter',
    function($filter) {
      return function(input,
    niveles) {
        var niv;
        if (!input) {
          return '';
        } else {
          niv = $filter('filter')(niveles,
    {
            id: input
          })[0];
          return niv.nombre;
        }
      };
    }
  ]).controller('RemoveGradoCtrl', [
    '$scope',
    '$uibModalInstance',
    'grado',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    grado,
    $http,
    toastr) {
      $scope.grado = grado;
      $scope.ok = function() {
        $http.delete('::grados/destroy/' + grado.id).then(function(r) {
          return toastr.success('Grado ' + r.nombre + ' eliminado con éxito',
    'Eliminado');
        },
    function(r) {
          return toastr.error('No se pudo eliminar a ' + row.nombre);
        });
        return $modalInstance.close(grado);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=GradosCtrl.js.map
