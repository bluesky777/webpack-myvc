(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('GruposCtrl', [
    '$scope',
    '$filter',
    '$state',
    'grados',
    'profesores',
    '$uibModal',
    '$http',
    'toastr',
    'AuthService',
    function($scope,
    $filter,
    $state,
    grados,
    profesores,
    $modal,
    $http,
    toastr,
    AuthService) {
      var btCarit,
    btGrid1,
    btGrid2,
    btGrid3;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.grados = grados;
      $scope.profesores = profesores;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.editar = function(row) {
        return $state.go('panel.grupos.editar',
    {
          grupo_id: row.id
        });
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==grados/removeGrupo.tpl.html',
          controller: 'RemoveGrupoCtrl',
          resolve: {
            grupo: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(grupo) {
          $scope.grupos = $filter('filter')($scope.grupos,
    {
            id: '!' + grupo.id
          });
          return $scope.gridOptions.data = $scope.grupos;
        });
      };
      // ng-true-value="\'1\'" ng-false-value="\'0\'"
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>';
      btGrid3 = '<a uib-tooltip="Listado de alumnos" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only info" ui-sref="panel.listalumnos({grupo_id: row.entity.id})"><i class="fa fa-users "></i></a>';
      btCarit = "==grados/botonCaritasGrupo.tpl.html";
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
            width: 40
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 80,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid2 + btGrid3,
            enableCellEdit: false
          },
          {
            field: 'nombre',
            enableHiding: false,
            minWidth: 100
          },
          {
            field: 'abrev',
            displayName: 'Abrev',
            minWidth: 30
          },
          {
            field: 'titular_id',
            displayName: 'Titular',
            minWidth: 130,
            editDropdownOptionsArray: profesores,
            cellFilter: 'mapProfesores:grid.appScope.profesores',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'profesor_id',
            editDropdownValueLabel: 'nombre_completo'
          },
          {
            field: 'grado_id',
            displayName: 'Grado',
            minWidth: 90,
            editDropdownOptionsArray: grados,
            cellFilter: 'mapGrado:grid.appScope.grados',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'nombre'
          },
          {
            field: 'cant_alumnos',
            displayName: 'Canti alumnos',
            enableSorting: false,
            enableCellEdit: false
          },
          {
            field: 'cupo',
            displayName: 'Cupo',
            minWidth: 40,
            type: 'number'
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
            var dato;
            if (newValue !== oldValue) {
              dato = {
                abrev: rowEntity.abrev,
                grado_id: rowEntity.grado_id,
                nombre: rowEntity.nombre,
                orden: rowEntity.orden,
                titular_id: rowEntity.titular_id,
                caritas: rowEntity.caritas,
                cupo: rowEntity.cupo,
                id: rowEntity.id
              };
              $http.put('::grupos/update',
    dato).then(function(r) {
                return toastr.success('Grupo actualizado con éxito',
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
      $scope.cambiarCaritas = function(rowEntity) {
        var dato;
        rowEntity.caritas = !rowEntity.caritas;
        dato = {
          abrev: rowEntity.abrev,
          grado_id: rowEntity.grado_id,
          nombre: rowEntity.nombre,
          orden: rowEntity.orden,
          titular_id: rowEntity.titular_id,
          caritas: rowEntity.caritas,
          id: rowEntity.id
        };
        return $http.put('::grupos/update',
    dato).then(function(r) {
          return toastr.success('Grupo actualizado con éxito',
    'Actualizado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $http.get('::grupos/cant-alumnos').then(function(data) {
        var grup,
    i,
    len,
    ref;
        $scope.grupos = data.data;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          grup.caritas = grup.caritas ? true : false;
        }
        return $scope.gridOptions.data = $scope.grupos;
      });
      $scope.$on('grupocreado',
    function(ev,
    grupo) {
        $scope.grupos.push(grupo);
        return $scope.gridOptions.data = $scope.grupos;
      });
    }
  ]).filter('mapGrado', [
    '$filter',
    function($filter) {
      return function(input,
    grados) {
        var grad;
        if (!input) {
          return 'Elija...';
        } else {
          grad = $filter('filter')(grados,
    {
            id: input
          })[0];
          return grad.nombre;
        }
      };
    }
  ]).controller('RemoveGrupoCtrl', [
    '$scope',
    '$uibModalInstance',
    'grupo',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    grupo,
    $http,
    toastr) {
      $scope.grupo = grupo;
      $scope.ok = function() {
        $http.delete('::grupos/destroy/' + grupo.id).then(function(r) {
          return toastr.success('Grupo ' + grupo.nombre + ' eliminado con éxito.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar al grupo.',
    'Problema');
        });
        return $modalInstance.close(grupo);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=GruposCtrl.js.map
