(function() {
  angular.module("myvcFrontApp").controller('AreasCtrl', [
    '$scope',
    'toastr',
    '$filter',
    '$http',
    '$uibModal',
    function($scope,
    toastr,
    $filter,
    $http,
    $uibModal) {
      var btGrid1,
    btGrid2;
      $scope.creando = false;
      $scope.editando = false;
      $scope.currentArea = {};
      $scope.currenAreaEdit = {};
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.cancelarCrear = function() {
        return $scope.creando = false;
      };
      $scope.cancelarEdit = function() {
        return $scope.editando = false;
      };
      $scope.crear = function() {
        return $http.post('::areas',
    $scope.currentArea).then(function(r) {
          $scope.gridOptions.data.push(r.data);
          delete $scope.currentArea;
          return toastr.success('Area creada con éxito');
        },
    function(r2) {
          return toastr.error('Error creando',
    'Problema');
        });
      };
      $scope.guardar = function() {
        return $http.put('::areas/update/' + $scope.currentAreaEdit.id,
    $scope.currentAreaEdit).then(function(r) {
          delete $scope.currentAreaEdit;
          toastr.success('Area actualizada con éxito');
          return $scope.cancelarEdit();
        },
    function(r2) {
          return toastr.error('Error guardando',
    'Problema');
        });
      };
      $scope.editar = function(row) {
        $scope.currentAreaEdit = row;
        return $scope.editando = true;
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: '==areas/removeArea.tpl.html',
          controller: 'RemoveAreaCtrl',
          resolve: {
            area: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(area) {
          return $scope.gridOptions.data = $filter('filter')($scope.areas,
    {
            id: '!' + area.id
          });
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
            field: 'id',
            type: 'number',
            maxWidth: 50,
            enableFiltering: false
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
            field: 'orden',
            type: 'number',
            maxWidth: 40,
            enableSorting: false
          },
          {
            field: 'nombre',
            enableHiding: false
          },
          {
            field: 'alias',
            displayName: 'Alias'
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
              $scope.currentAreaEdit = rowEntity;
              $scope.guardar();
            }
            return $scope.$apply();
          });
        }
      };
      return $http.get('::areas').then(function(data) {
        $scope.areas = data.data;
        return $scope.gridOptions.data = $scope.areas;
      });
    }
  ]).controller('RemoveAreaCtrl', [
    '$scope',
    '$uibModalInstance',
    'area',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    area,
    $http,
    toastr) {
      $scope.area = area;
      $scope.ok = function() {
        $http.delete('::areas/destroy/' + area.id).then(function(r) {
          return toastr.success('Grupo eliminado: ' + area.nombre,
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('Problema',
    'No se pudo eliminar el area.');
        });
        return $modalInstance.close(area);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AreasCtrl.js.map
