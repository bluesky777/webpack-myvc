(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('OrdinalesCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    '$filter',
    'App',
    'AuthService',
    'Acentos',
    '$interval',
    '$anchorScroll',
    '$location',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    $filter,
    App,
    AuthService,
    Acentos,
    $interval,
    $anchorScroll,
    $location) {
      var anio,
    bt1,
    btGrid1,
    btGrid2,
    i,
    len,
    ref;
      AuthService.verificar_acceso();
      $scope.datos = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.gridOptions = {};
      $scope.creando = false;
      $scope.editando = false;
      $scope.guardando = false;
      $scope.configuracion = {
        reinicia_por_periodo: 0
      };
      $scope.ordinal_new = {
        ordinal: '',
        descripcion: '',
        pagina: ''
      };
      $scope.configurar = function() {
        $location.hash('configurar-convivencia');
        return $anchorScroll();
      };
      $scope.selectYear = function(year) {
        return $scope.traerOrdinales(year.id,
    false);
      };
      $scope.verCrear = function() {
        $scope.creando = true;
        return $scope.ordinal_new.year_id = $scope.datos.year.id;
      };
      $scope.cancelarCrear = function() {
        $scope.creando = false;
        return $scope.ordinal_new = {
          ordinal: '',
          descripcion: '',
          pagina: ''
        };
      };
      $scope.cancelarEditar = function() {
        return $scope.editando = false;
      };
      $scope.editar = function(ordinal) {
        $scope.ordinal_edit = ordinal;
        return $scope.editando = true;
      };
      $scope.crear = function(ordinal) {
        if (!$scope.datos.year) {
          toastr.warning('Elija el año');
          return;
        }
        $scope.guardando = true;
        ordinal.year_id = $scope.datos.year.id;
        return $http.post('::ordinales/store',
    ordinal).then(function(r) {
          console.log(r.data,
    $scope.gridOptions);
          $scope.gridOptions.data.push(r.data);
          toastr.success('Creado con éxito.');
          return $scope.guardando = false;
        },
    function() {
          toastr.error('No se puedo crear');
          return $scope.guardando = false;
        });
      };
      $scope.eliminar = function(ordinal) {
        var res;
        res = confirm("¿Seguro que desea eliminar?");
        if (res) {
          return $http.put('::ordinales/destroy',
    {
            ordinal_id: ordinal.id
          }).then(function(r) {
            var i,
    indice,
    len,
    ordin,
    ref;
            $scope.gridOptions.data.push(r.data);
            toastr.success('Eliminado con éxito.');
            ref = $scope.gridOptions.data;
            for (indice = i = 0, len = ref.length; i < len; indice = ++i) {
              ordin = ref[indice];
              if (ordin.id === ordinal.id) {
                $scope.gridOptions.data.splice(indice,
    1);
                return;
              }
            }
          },
    function() {
            toastr.error('No se puedo crear');
            return $scope.guardando = false;
          });
        }
      };
      $scope.guardar_cambios = function(ordinal) {
        if (!$scope.datos.year) {
          toastr.warning('Elija el año');
          return;
        }
        ordinal.year_id = $scope.datos.year.id;
        return $http.put('::ordinales/update',
    ordinal).then(function(r) {
          toastr.success('Editado con éxito.');
          return $scope.editando = false;
        },
    function() {
          return toastr.error('No se puedo crear');
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>';
      bt1 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 + btGrid2 + '</span>';
      $scope.gridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        showFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'no',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edit',
            width: 54,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: bt1,
            enableCellEdit: false,
            enableColumnMenu: true
          },
          {
            field: 'tipo',
            minWidth: 80,
            filter: {
              condition: Acentos.buscarEnGrid
            }
          },
          {
            field: 'ordinal',
            minWidth: 70
          },
          {
            field: 'descripcion',
            displayName: 'Descripción',
            minWidth: 210,
            filter: {
              condition: Acentos.buscarEnGrid
            }
          },
          {
            field: 'pagina',
            displayName: 'Página',
            minWidth: 70
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
              return $http.put('::ordinales/guardar-valor',
    {
                ordinal_id: rowEntity.id,
                propiedad: colDef.field,
                valor: newValue
              }).then(function(r) {
                return toastr.success('Ordinal actualizado con éxito');
              },
    function(r2) {
                rowEntity[colDef.field] = oldValue;
                return toastr.error('Cambio no guardado',
    'Error');
              });
            }
          });
        }
      };
      $scope.traerOrdinales = function(year_id,
    con_datos) {
        return $http.put('::ordinales/ordinales',
    {
          year_id: year_id,
          con_datos: con_datos
        }).then(function(r) {
          r = r.data;
          if ($scope.configuracion) {
            $scope.config = r.configuracion;
            $scope.tipos = r.tipos;
          }
          return $scope.gridOptions.data = r.ordinales;
        },
    function(r2) {
          return toastr.error('No se pudo traer los datos.');
        });
      };
      $scope.guardarValorConfig = function(config,
    propiedad,
    valor) {
        return $http.put('::ordinales/guardar-valor-config',
    {
          config_id: config.id,
          propiedad: propiedad,
          valor: valor
        }).then(function(r) {
          return toastr.success('Campo actualizado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      if ($scope.$parent.years) {
        ref = $scope.$parent.years;
        for (i = 0, len = ref.length; i < len; i++) {
          anio = ref[i];
          if (anio.id === $scope.USER.year_id) {
            $scope.datos.year = anio;
          }
        }
        return $scope.traerOrdinales();
      } else {
        return $scope.Timer = $interval(function() {
          var j,
    len1,
    ref1;
          if ($scope.$parent.years) {
            if (angular.isDefined($scope.Timer)) {
              $interval.cancel($scope.Timer);
            }
            ref1 = $scope.$parent.years;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              anio = ref1[j];
              if (anio.id === $scope.USER.year_id) {
                $scope.datos.year = anio;
              }
            }
            return $scope.traerOrdinales();
          }
        },
    1000);
      }
    }
  ]);

}).call(this);

//# sourceMappingURL=OrdinalesCtrl.js.map
