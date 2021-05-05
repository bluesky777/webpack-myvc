(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('NivelesCtrl', [
    '$scope',
    '$filter',
    '$state',
    'toastr',
    '$http',
    function($scope,
    $filter,
    $state,
    toastr,
    $http) {
      var btGrid1,
    btGrid2;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.editar = function(row) {
        return $state.go('panel.niveles.editar',
    {
          nivel_id: row.id
        });
      };
      $scope.eliminar = function(row) {
        return $htt.delete('niveles_educativos/' + row.id).then(function(r) {
          $scope.niveles = $filter('filter')($scope.niveles,
    {
            id: '!' + r.data.id
          });
          return $scope.gridOptions.data = $scope.niveles;
        },
    function(r) {
          return toastr.warning('No se pudo eliminar.');
        });
      };
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
            field: 'orden',
            type: 'number',
            maxWidth: 50,
            enableSorting: false
          },
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
            displayName: 'Abreviatura'
          }
        ],
        multiSelect: false,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            if (newValue !== oldValue) {
              $http.put('::niveles_educativos/update/' + rowEntity.id,
    rowEntity).then(function(r) {
                return toastr.success('Nivel actualizado',
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
      $http.get('::niveles_educativos').then(function(data) {
        $scope.niveles = data.data;
        return $scope.gridOptions.data = $scope.niveles;
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=NivelesCtrl.js.map
