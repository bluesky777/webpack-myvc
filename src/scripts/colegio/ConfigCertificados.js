(function() {
  angular.module('myvcFrontApp').directive('configuracionCertificados', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}colegio/configCertificados.tpl.html`,
        link: function(scope,
    iElem,
    iAttrs) {},
        // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
        // y eso lo puedo hacer con el ng-if
        controller: 'ConfigCertificadosCtrl'
      };
    }
  ]).controller('ConfigCertificadosCtrl', [
    '$scope',
    'App',
    '$http',
    '$state',
    'toastr',
    'uiGridConstants',
    '$filter',
    function($scope,
    App,
    $http,
    $state,
    toastr,
    uiGridConstants,
    $filter) {
      var btGrid1,
    btGrid2,
    certs;
      //console.log 'Configurando certificados'
      $scope.newcertif = {
        encabezado_width: 0,
        encabezado_height: 0,
        encabezado_margin_top: 0,
        encabezado_margin_left: 0,
        piepagina_width: 0,
        piepagina_height: 0,
        piepagina_margin_bottom: 0,
        piepagina_margin_left: 0
      };
      $scope.creando_certificado = false;
      $scope.editando = false;
      $scope.currentCertif = {};
      $scope.certificado = {};
      certs = $filter('filter')($scope.certificados,
    {
        id: $scope.year.config_certificado_estudio_id
      });
      if (certs) {
        if (certs.length > 0) {
          $scope.certificado.config_actual = certs[0];
        }
      }
      $scope.crearConfig = function() {
        return $scope.creando_certificado = true;
      };
      $scope.cancelConfig = function() {
        return $scope.creando_certificado = false;
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>';
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: false,
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
            field: 'nombre',
            displayName: 'Nombre',
            minWidth: 80,
            enableSorting: false,
            enableColumnMenu: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 60,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid2,
            enableCellEdit: false,
            enableColumnMenu: false
          },
          {
            field: 'encabezado_width',
            displayName: 'AnchoE',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            }
          },
          {
            field: 'encabezado_height',
            displayName: 'AltoE',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            }
          },
          {
            field: 'encabezado_margin_top',
            displayName: 'MargenEArr',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            }
          },
          {
            field: 'encabezado_margin_left',
            displayName: 'MargenEIzq',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            }
          },
          {
            field: 'piepagina_width',
            displayName: 'AnchoP'
          },
          {
            field: 'piepagina_height',
            displayName: 'AltoP'
          },
          {
            field: 'piepagina_margin_left',
            displayName: 'MargenPIzq'
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
              $http.put('::certificados/update',
    rowEntity).then(function(r) {
                return toastr.success('Certificado modificado',
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
      $scope.gridOptions.data = $scope.certificados;
      $scope.guardar = function() {
        return $http.post('::certificados/store',
    $scope.newcertif).then(function(r) {
          toastr.success('Certificado creado.');
          $scope.creando_certificado = false;
          $scope.certificados.push(r.data);
          return $scope.gridOptions.data = $scope.certificados;
        },
    function(r2) {
          return toastr.error('Certificado no guardado',
    'Error');
        });
      };
      $scope.editar = function(certif) {
        var enc_img,
    pie_img;
        $scope.editando = true;
        $scope.currentCertif = certif;
        enc_img = $filter('filter')($scope.imagenes,
    {
          id: certif.encabezado_img_id
        });
        pie_img = $filter('filter')($scope.imagenes,
    {
          id: certif.piepagina_img_id
        });
        if (enc_img.length > 0) {
          enc_img = enc_img[0];
          $scope.currentCertif.encabezado_img = enc_img;
        }
        if (pie_img.length > 0) {
          pie_img = pie_img[0];
          return $scope.currentCertif.piepagina_img = pie_img;
        }
      };
      $scope.cancelEdit = function() {
        return $scope.editando = false;
      };
      $scope.actualizar = function() {
        return $http.put('::certificados/update',
    $scope.currentCertif).then(function(r) {
          toastr.success('Certificado modificado',
    'Actualizado');
          return $scope.editando = false;
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.eliminar = function(certif) {
        return $http.delete('::certificados/destroy/' + certif.id).then(function(r) {
          toastr.success('Certificado eliminado.');
          $scope.certificados = $filter('filter')($scope.certificados,
    {
            id: '!' + certif.id
          });
          return $scope.gridOptions.data = $scope.certificados;
        },
    function(r2) {
          return toastr.error('Certificado no eliminado',
    'Error');
        });
      };
      $scope.certificadoSelect = function($item,
    $model) {
        return $http.put('::certificados/actual',
    {
          config_certificado_estudio_id: $item.id,
          year_id: $scope.year.id
        }).then(function(r) {
          return toastr.success('Certificado actual cambiado.');
        },
    function(r2) {
          return toastr.error('Certificado no cambiado',
    'Error');
        });
      };
      $scope.guardarEncabezado = function() {
        return $http.put('::certificados/encabezado',
    {
          encabezado_certificado: $scope.year.encabezado_certificado,
          year_id: $scope.year.id
        }).then(function(r) {
          return toastr.success('Encabezado guardado.');
        },
    function(r2) {
          return toastr.error('Encabezado no guardado',
    'Error');
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ConfigCertificados.js.map
