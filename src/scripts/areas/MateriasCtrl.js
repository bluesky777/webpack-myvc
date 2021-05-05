(function() {
  angular.module("myvcFrontApp").controller('MateriasCtrl', [
    '$scope',
    'toastr',
    '$http',
    'areas',
    '$uibModal',
    '$filter',
    function($scope,
    toastr,
    $http,
    areas,
    $modal,
    $filter) {
      var btGrid1,
    btGrid2;
      $scope.creando = false;
      $scope.editando = false;
      $scope.currentmateria = {};
      $scope.currenmateriaEdit = {};
      $scope.areas = areas;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.cancelarCrear = function() {
        return $scope.creando = false;
      };
      $scope.cancelarEdit = function() {
        return $scope.editando = false;
      };
      $scope.crear = function() {
        return $http.post('::materias',
    $scope.currentmateria).then(function(r) {
          $scope.gridOptions.data.push(r.data);
          delete $scope.currentmateria;
          return toastr.success('Materia creada con éxito');
        },
    function(r2) {
          return toastr.error('Error creando',
    'Problema');
        });
      };
      $scope.guardar = function() {
        return $http.put('::materias/update/' + $scope.currentmateriaEdit.id,
    $scope.currentmateriaEdit).then(function(r) {
          $scope.currentmateriaEdit.area_id = r.data.area_id; // Para actulizar el grid
          delete $scope.currentmateriaEdit;
          toastr.success('Materia actualizada con éxito');
          return $scope.cancelarEdit();
        },
    function(r2) {
          return toastr.error('Error guardando',
    'Problema');
        });
      };
      $scope.editar = function(row) {
        row.area = $filter('filter')(areas,
    {
          id: row.area_id
        })[0];
        $scope.currentmateriaEdit = row;
        return $scope.editando = true;
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==areas/removeMateria.tpl.html',
          controller: 'RemovemateriaCtrl',
          resolve: {
            materia: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(materia) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + materia.id
          });
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-times "></i></a>';
      $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        multiSelect: false,
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
            field: 'materia',
            enableHiding: false,
            filter: {
              condition: function(searchTerm,
          cellValue,
          row) {
                var actual,
          foundG;
                foundG = $filter('filter')($scope.gridOptions.data,
          {
                  materia: searchTerm
                });
                actual = $filter('filter')(foundG,
          {
                  materia: cellValue
                });
                return actual.length > 0;
              }
            }
          },
          {
            field: 'alias',
            displayName: 'Alias'
          },
          {
            field: 'area_id',
            displayName: 'Area',
            editDropdownOptionsArray: areas,
            cellFilter: 'mapAreas:grid.appScope.areas',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            filter: {
              condition: function(searchTerm,
          cellValue) {
                var actual,
          foundG;
                foundG = $filter('filter')($scope.areas,
          {
                  nombre: searchTerm
                });
                actual = $filter('filter')(foundG,
          {
                  id: cellValue
                },
          true);
                return actual.length > 0;
              }
            },
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
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            if (newValue !== oldValue) {
              $scope.currentmateriaEdit = rowEntity;
              $scope.guardar();
            }
            return $scope.$apply();
          });
        }
      };
      $http.get('::materias').then(function(r) {
        var area,
    i,
    len,
    ref,
    results;
        $scope.gridOptions.data = r.data.materias;
        $scope.areas = r.data.mat_por_areas;
        $scope.areas = $filter('orderBy')($scope.areas,
    'orden');
        ref = $scope.areas;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          area = ref[i];
          results.push(area.materias = $filter('orderBy')(area.materias,
    'orden'));
        }
        return results;
      });
      $scope.onSortMaterias = function($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo,
    $modeloPadre) {
        var datos,
    hashEntry,
    i,
    index,
    j,
    len,
    len1,
    materia,
    sortHash1,
    sortHash2;
        sortHash1 = [];
        sortHash2 = [];
        datos = {};
        console.log($partTo,
    $item,
    $modeloPadre.area);
        for (index = i = 0, len = $partFrom.length; i < len; index = ++i) {
          materia = $partFrom[index];
          materia.orden = index;
          hashEntry = {};
          hashEntry["" + materia.id] = index;
          sortHash1.push(hashEntry);
        }
        datos.partFrom = {
          sortHash: sortHash1
        };
        if ($partFrom !== $partTo) {
          for (index = j = 0, len1 = $partTo.length; j < len1; index = ++j) {
            materia = $partTo[index];
            materia.orden = index;
            hashEntry = {};
            hashEntry["" + materia.id] = index;
            sortHash2.push(hashEntry);
          }
          datos.partTo = {
            sortHash: sortHash2,
            area_id: $modeloPadre.area.id
          };
        }
        return $http.put('::materias/update-orden',
    datos).then(function(r) {
          return true;
        },
    function(r2) {
          toastr.warning('No se pudo ordenar',
    'Problema');
          return false;
        });
      };
      return $scope.onSortAreas = function($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo) {
        var area,
    datos,
    hashEntry,
    i,
    index,
    len,
    sortHash;
        sortHash = [];
        console.log($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo);
        for (index = i = 0, len = $partFrom.length; i < len; index = ++i) {
          area = $partFrom[index];
          area.orden = index;
          hashEntry = {};
          hashEntry["" + area.id] = index;
          sortHash.push(hashEntry);
        }
        datos = {
          sortHash: sortHash
        };
        return $http.put('::areas/update-orden',
    datos).then(function(r) {
          return true;
        },
    function(r2) {
          toastr.warning('No se pudo ordenar',
    'Problema');
          return false;
        });
      };
    }
  ]).filter('mapAreas', [
    '$filter',
    function($filter) {
      return function(input,
    areas) {
        var area;
        if (!input) {
          return 'Elija...';
        } else {
          area = $filter('filter')(areas,
    {
            id: input
          })[0];
          if (area) {
            return area.nombre;
          } else {
            return 'Elija...';
          }
        }
      };
    }
  ]).controller('RemovemateriaCtrl', [
    '$scope',
    '$uibModalInstance',
    'materia',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    materia,
    $http,
    toastr) {
      $scope.materia = materia;
      $scope.ok = function() {
        $http.delete('::materias/destroy/' + materia.id).then(function(r) {
          return toastr.success('Materia ' + materia.nombre + ' eliminada con éxito.',
    'Eliminada');
        },
    function(r2) {
          return toastr.warning('Problema',
    'No se pudo eliminar la Materia.');
        });
        return $modalInstance.close(materia);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=MateriasCtrl.js.map
