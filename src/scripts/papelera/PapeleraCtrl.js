(function() {
  angular.module("myvcFrontApp").controller('PapeleraCtrl', [
    '$scope',
    'App',
    '$state',
    '$http',
    '$uibModal',
    '$filter',
    'toastr',
    function($scope,
    App,
    $state,
    $http,
    $modal,
    $filter,
    toastr) {
      var btGridAlum1,
    btGridAlum2,
    btGridGrupo1,
    btGridGrupo2,
    btGridUnidad1,
    btGridUnidad2;
      $scope.restaurarAlum = function(alum) {
        return $http.put('::alumnos/restore/' + alum.alumno_id).then(function() {
          $scope.gridAlumnos.data = $filter('filter')($scope.gridAlumnos.data,
    {
            alumno_id: '!' + alum.alumno_id
          });
          return toastr.success('Éxito',
    'Alumno restaurado');
        },
    function(r2) {
          return toastr.error('No se restauró el alumno',
    'Error');
        });
      };
      $scope.elimAlum = function(alum) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==papelera/forceRemoveAlumno.tpl.html',
          controller: 'ForceRemoveAlumnoCtrl',
          resolve: {
            alumno: function() {
              return alum;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return $scope.gridAlumnos.data = $filter('filter')($scope.gridAlumnos.data,
    {
            alumno_id: '!' + alum.alumno_id
          });
        });
      };
      // ALUMNOS
      btGridAlum1 = '<a class="btn btn-default btn-xs shiny info" ng-click="grid.appScope.restaurarAlum(row.entity)"><i class="fa fa-refresh "></i>Restaurar</a>';
      btGridAlum2 = '<a uib-tooltip="¡Eliminar completamente!" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.elimAlum(row.entity)"><i class="fa fa-times "></i></a>';
      $scope.gridAlumnos = {
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'alumno_id',
            displayName: 'Id',
            maxWidth: 40
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            maxWidth: 110,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGridAlum1 + btGridAlum2
          },
          {
            field: 'nombres',
            enableHiding: false
          },
          {
            field: 'apellidos'
          },
          {
            field: 'sexo',
            maxWidth: 20
          },
          {
            field: 'username',
            displayName: 'Usuario'
          },
          {
            field: 'fecha_nac',
            displayName: 'Nacimiento',
            cellFilter: "date:mediumDate",
            type: 'date'
          },
          {
            field: 'direccion',
            displayName: 'Dirección'
          }
        ],
        multiSelect: false,
        //filterOptions: $scope.filterOptions,
        onRegisterApi: function(gridApi) {
          return $scope.gridApi = gridApi;
        }
      };
      // GRUPOS
      $scope.restaurarGrupo = function(grupo) {
        return $http.put('::grupos/restore/' + grupo.id).then(function() {
          $scope.gridGrupos.data = $filter('filter')($scope.gridGrupos.data,
    {
            id: '!' + grupo.id
          });
          return toastr.success('Éxito',
    'Grupo restaurado');
        },
    function(r2) {
          return toastr.error('No se restauró el grupo',
    'Error');
        });
      };
      $scope.elimGrupo = function(grupo) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '::papelera/forceRemoveGrupo.tpl.html',
          controller: 'ForceRemoveGrupoCtrl',
          resolve: {
            grupo: function() {
              return grupo;
            }
          }
        });
        return modalInstance.result.then(function(grupo) {
          return $scope.gridGrupos.data = $filter('filter')($scope.gridGrupos.data,
    {
            id: '!' + grupo.id
          });
        });
      };
      btGridGrupo1 = '<a class="btn btn-default btn-xs shiny info" ng-click="grid.appScope.restaurarGrupo(row.entity)"><i class="fa fa-refresh "></i>Restaurar</a>';
      btGridGrupo2 = '<a uib-tooltip="¡Eliminar completamente!" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.elimGrupo(row.entity)"><i class="fa fa-times "></i></a>';
      $scope.gridGrupos = {
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'id',
            displayName: 'Id',
            maxWidth: 40
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            maxWidth: 110,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGridGrupo1 + btGridGrupo2
          },
          {
            field: 'nombre',
            enableHiding: false
          },
          {
            field: 'abrev',
            displayName: 'Abreviatura'
          },
          {
            field: 'grado_id',
            maxWidth: 20
          },
          {
            field: 'titular_id',
            displayName: 'Titular'
          }
        ],
        multiSelect: false,
        //filterOptions: $scope.filterOptions,
        onRegisterApi: function(gridApi) {
          return $scope.gridApi = gridApi;
        }
      };
      $http.get('::alumnos/trashed').then(function(data) {
        return $scope.gridAlumnos.data = data.data;
      },
    function(r2) {
        return toastr.warning('No se pudo traer los alumnos eliminados.');
      });
      $http.get('::grupos/trashed').then(function(data) {
        return $scope.gridGrupos.data = data.data;
      },
    function(r2) {
        return toastr.warning('No se pudo traer los grupos eliminados.');
      });
      // UNIDADES
      $scope.restaurarUnidad = function(unidad) {
        return $http.put('::unidades/restore/' + unidad.id).then(function() {
          $scope.gridUnidad.data = $filter('filter')($scope.gridUnidad.data,
    {
            id: '!' + unidad.id
          });
          return toastr.success('Éxito',
    'Unidad restaurada');
        },
    function(r2) {
          return toastr.error('No se restauró la unidad',
    'Error');
        });
      };
      $scope.elimUnidad = function(unidad) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==papelera/forceRemoveUnidad.tpl.html',
          controller: 'ForceRemoveUnidadCtrl',
          resolve: {
            unidad: function() {
              return unidad;
            }
          }
        });
        return modalInstance.result.then(function(unidad) {
          return $scope.gridUnidad.data = $filter('filter')($scope.gridUnidad.data,
    {
            id: '!' + unidad.id
          });
        });
      };
      btGridUnidad1 = '<a class="btn btn-default btn-xs shiny info" ng-click="grid.appScope.restaurarUnidad(row.entity)"><i class="fa fa-refresh "></i>Restaurar</a>';
      btGridUnidad2 = '<a uib-tooltip="¡Eliminar completamente!" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.elimUnidad(row.entity)"><i class="fa fa-times "></i></a>';
      $scope.gridUnidad = {
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'id',
            displayName: 'Id',
            maxWidth: 40
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            maxWidth: 110,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGridUnidad1 + btGridUnidad2
          },
          {
            field: 'definicion',
            displayName: 'Definición',
            enableHiding: false
          },
          {
            field: 'alias_materia',
            displayName: 'Materia'
          },
          {
            field: 'abrev_grupo',
            displayName: 'Grupo'
          },
          {
            field: 'numero_periodo',
            displayName: 'Per',
            maxWidth: 20
          },
          {
            field: 'porcentaje',
            displayName: 'Porc'
          }
        ],
        multiSelect: false,
        //filterOptions: $scope.filterOptions,
        onRegisterApi: function(gridApi) {
          return $scope.gridApi = gridApi;
        }
      };
      $http.get('::unidades/trashed').then(function(data) {
        return $scope.gridUnidad.data = data.data;
      },
    function(r2) {
        return toastr.warning('No se pudo traer las unidades eliminados.');
      });
      return $http.get('::unidades/trashed').then(function(data) {
        return $scope.gridUnidad.data = data.data;
      },
    function(r2) {
        return toastr.warning('No se pudo traer las unidades eliminadas.');
      });
    }
  ]);

}).call(this);

//PapeleraCtrl.js.map
