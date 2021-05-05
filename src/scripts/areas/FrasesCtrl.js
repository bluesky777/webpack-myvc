(function() {
  angular.module("myvcFrontApp").controller('FrasesCtrl', [
    '$scope',
    'toastr',
    '$filter',
    '$http',
    '$uibModal',
    'App',
    'AuthService',
    function($scope,
    toastr,
    $filter,
    $http,
    $modal,
    App,
    AuthService) {
      var btGrid1,
    btGrid2;
      AuthService.verificar_acceso();
      $scope.currentFrase = {};
      $scope.currentFraseEdit = {};
      $scope.creando = false;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.tipos = [
        {
          tipo_frase: 'Debilidad'
        },
        {
          tipo_frase: 'Amenaza'
        },
        {
          tipo_frase: 'Oportunidad'
        },
        {
          tipo_frase: 'Fortaleza'
        }
      ];
      $scope.currentFrase.tipo_frase = {
        tipo_frase: 'Fortaleza'
      };
      $scope.cancelarCrear = function() {
        return $scope.creando = false;
      };
      $scope.crear = function() {
        return $http.post('::frases/store',
    $scope.currentFrase).then(function(r) {
          $scope.gridOptions.data.push(r.data);
          $scope.currentFrase.frase = '';
          $scope.cancelarCrear();
          return toastr.success('Frase creada con éxito');
        },
    function(r2) {
          return toastr.error('Error creando',
    'Problema');
        });
      };
      $scope.guardar = function() {
        return $http.put('::frases/update/' + $scope.currentFraseEdit.id,
    $scope.currentFraseEdit).then(function(r) {
          $scope.currentFraseEdit.frase = r.data.frase; // Para actualizar el grid
          return toastr.success('Frase actualizada con éxito');
        },
    function(r2) {
          return toastr.error('Error guardando',
    'Problema');
        });
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: App.views + 'areas/removeFrase.tpl.html',
          controller: 'RemoveFraseCtrl',
          resolve: {
            frase: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(frase) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + frase.id
          });
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>';
      $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'id',
            type: 'number',
            width: 70,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 60,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid2,
            enableCellEdit: false
          },
          {
            field: 'tipo_frase',
            displayName: 'Tipo',
            width: 90,
            enableCellEdit: false
          },
          {
            field: 'frase',
            displayName: 'Frase',
            minWidth: 300
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
              $scope.currentFraseEdit = rowEntity;
              $scope.guardar();
            }
            return $scope.$apply();
          });
        }
      };
      return $http.get('::frases').then(function(data) {
        return $scope.gridOptions.data = data.data;
      });
    }
  ]).controller('RemoveFraseCtrl', [
    '$scope',
    '$uibModalInstance',
    'frase',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    frase,
    $http,
    toastr) {
      $scope.frase = frase;
      $scope.ok = function() {
        $http.delete('::frases/destroy/' + frase.id).then(function(r) {
          return toastr.success('frase "' + frase.frase + '" eliminada con éxito.',
    'Eliminada');
        },
    function(r2) {
          return toastr.warning('Problema',
    'No se pudo eliminar la frase.');
        });
        return $modalInstance.close(frase);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=FrasesCtrl.js.map
