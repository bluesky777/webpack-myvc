(function() {
  angular.module('myvcFrontApp').directive('configuracionEscalas', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}colegio/configEscalas.tpl.html`,
        link: function(scope,
    iElem,
    iAttrs) {},
        // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
        // y eso lo puedo hacer con el ng-if
        controller: 'ConfigEscalasCtrl'
      };
    }
  ]).controller('ConfigEscalasCtrl', [
    '$scope',
    'App',
    '$http',
    '$state',
    '$cookies',
    'toastr',
    'uiGridConstants',
    '$filter',
    function($scope,
    App,
    $http,
    $state,
    $cookies,
    toastr,
    uiGridConstants,
    $filter) {
      var btGrid2;
      $scope.creando_escala = false;
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminarEscala(row.entity)"><i class="fa fa-trash "></i></a>';
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enebleGridColumnMenu: false,
        columnDefs: [
          {
            field: 'id',
            displayName: 'Id',
            width: 50,
            enableCellEdit: false,
            enableColumnMenu: false
          },
          {
            field: 'desempenio',
            displayName: 'Desempeño',
            enableSorting: false,
            enableColumnMenu: false
          },
          {
            name: 'eliminar',
            displayName: 'Elimin',
            width: 50,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid2,
            enableCellEdit: false,
            enableColumnMenu: false
          },
          {
            field: 'descripcion',
            displayName: 'Descripción'
          },
          {
            field: 'porc_inicial',
            displayName: 'Valor inicial'
          },
          {
            field: 'porc_final',
            displayName: 'Valor final'
          },
          {
            field: 'orden',
            type: 'number'
          },
          {
            field: 'perdido',
            type: 'boolean',
            cellTemplate: '<input type="checkbox" ng-model="row.entity.perdido" ng-true-value="1" ng-false-value="0">'
          },
          {
            field: 'valoracion',
            displayName: 'Valoración'
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
              $http.put('::escalas/update',
    rowEntity).then(function(r) {
                return toastr.success('Escala modificada',
    'Actualizada');
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
      $scope.gridOptions.data = $scope.year.escalas;
      $scope.crearEscala = function() {
        return $http.post('::escalas/store').then(function(r) {
          toastr.success('Escala creada.');
          $scope.creando_escala = false;
          $scope.year.escalas.push(r.data);
          return $scope.gridOptions.data = $scope.year.escalas;
        },
    function(r2) {
          return toastr.error('Escala no guardada',
    'Error');
        });
      };
      $scope.eliminarEscala = function(escala) {
        return $http.delete('::escalas/destroy/' + escala.id).then(function(r) {
          toastr.success('Escala eliminada.');
          $scope.year.escalas = $filter('filter')($scope.year.escalas,
    {
            id: '!' + escala.id
          });
          return $scope.gridOptions.data = $scope.year.escalas;
        },
    function(r2) {
          return toastr.error('Escala no eliminada',
    'Error');
        });
      };
    }
  ]);

}).call(this);

//ConfigEscalas.js.map
