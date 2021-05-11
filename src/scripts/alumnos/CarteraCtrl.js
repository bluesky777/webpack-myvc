(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('CarteraCtrl', [
    '$scope',
    'App',
    '$state',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    'uiGridConstants',
    'Upload',
    '$timeout',
    'Acentos',
    'DownloadServ',
    function($scope,
    App,
    $state,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http,
    uiGridConstants,
    Upload,
    $timeout,
    Acentos,
    DownloadServ) {
      var btGrid1,
    btPazysalvo,
    btUsuario,
    gridFooterCartera;
      AuthService.verificar_acceso();
      $scope.dato = {};
      $scope.gridOptions = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.images = App.images;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.mySelectedRows = [];
      $scope.valorDeuda = 0;
      $scope.hombresGrupo = 0;
      $scope.mujeresGrupo = 0;
      $scope.dato.grupo = '';
      $http.get('::grupos').then(function(r) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        $scope.grupos = r.data;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (grupo.id === matr_grupo) {
            $scope.dato.grupo = grupo;
          }
        }
        return $scope.traerAlumnos($scope.dato.grupo);
      });
      $scope.ver_indorme_listado_deudores = function() {
        return $scope.viendo_informe_list_deudores = !$scope.viendo_informe_list_deudores;
      };
      $scope.importarCambios = function(file,
    errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          file.upload = Upload.upload({
            url: App.Server + 'importar/cartera',
            data: {
              file: file
            }
          });
          return file.upload.then(function(response) {
            return $timeout(function() {
              file.result = response.data;
              return $scope.traerAlumnos($scope.dato.grupo);
            });
          },
    function(response) {
            if (response.status > 0) {
              return $scope.errorMsg = response.status + ': ' + response.data;
            }
          },
    function(evt) {
            return file.progress = Math.min(100,
    parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      };
      $scope.onGrupoSelect = function($item,
    $model) {
        if (!$item) {
          return;
        }
        localStorage.setItem('matr_grupo',
    $item.id);
        return $scope.traerAlumnos($item);
      };
      $scope.imprimir = function() {
        return window.print();
      };
      $scope.editar = function(row) {
        //$state.go('panel.cartera.editar', {alumno_id: row.alumno_id})
        return $state.go('panel.persona',
    {
          persona_id: row.alumno_id,
          tipo: 'alumno'
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btPazysalvo = "==directives/botonesPazysalvo.tpl.html";
      btUsuario = "==directives/botonesResetPassword.tpl.html";
      gridFooterCartera = "==alumnos/gridFooterCartera.tpl.html";
      $scope.gridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        gridFooterTemplate: gridFooterCartera,
        enableSorting: true,
        enableFiltering: true,
        exporterSuppressColumns: ['edicion',
    'foto_nombre'],
        exporterCsvColumnSeparator: ';',
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: "Alumnos cartera - MyVC.csv",
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            name: 'no',
            displayName: 'No',
            width: 45,
            enableCellEdit: false,
            enableColumnMenu: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 30,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1,
            enableCellEdit: false,
            enableColumnMenu: true
          },
          {
            field: 'foto_nombre',
            displayName: 'Foto',
            cellTemplate: "<img width=\"35px\" ng-src=\"{{grid.appScope.perfilPath + grid.getCellValue(row, col)}}\">",
            width: 40
          },
          {
            field: 'nombres',
            minWidth: 80,
            filter: {
              condition: Acentos.buscarEnGrid
            },
            enableHiding: false
          },
          {
            field: 'apellidos',
            minWidth: 80,
            filter: {
              condition: Acentos.buscarEnGrid
            }
          },
          {
            field: 'sexo',
            width: 60
          },
          {
            field: 'nombre_grupo',
            displayName: 'Grupo'
          },
          {
            field: 'username',
            filter: {
              condition: Acentos.buscarEnGrid
            },
            displayName: 'Usuario',
            cellTemplate: btUsuario,
            minWidth: 150
          },
          {
            // { field: 'fecha_nac', displayName:'Nacimiento', cellFilter: "date:mediumDate", type: 'date'}
            field: 'deuda',
            displayName: 'Deuda',
            cellTemplate: btPazysalvo,
            minWidth: 150,
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() | currency:"$":0 }}</div>'
          },
          {
            field: 'fecha_pension',
            displayName: 'Fecha hasta',
            minWidth: 150,
            cellFilter: "date:mediumDate",
            type: 'date'
          }
        ],
        multiSelect: true,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            var datos;
            if (newValue !== oldValue) {
              datos = {};
              if (colDef.field === 'username') {
                datos.user_id = rowEntity.user_id;
              }
              if (!rowEntity.alumno_id) {
                rowEntity.alumno_id = fila.id;
              }
              datos.alumno_id = rowEntity.alumno_id;
              datos.propiedad = colDef.field;
              datos.valor = newValue;
              $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
                return toastr.success('Alumno(a) actualizado con éxito');
              },
    function(r2) {
                rowEntity[colDef.field] = oldValue;
                return toastr.error('Cambio no guardado',
    'Error');
              });
            }
            return $scope.$apply();
          });
        }
      };
      $scope.getSelectedRows = function() {
        return $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();
      };
      $scope.traerAlumnos = function(item) {
        return $http.put("::cartera/alumnos",
    {
          grupo_actual: item
        }).then(function(r) {
          $scope.gridOptions.data = r.data;
          $scope.gridOptions.columnDefs[6].visible = false;
          return $scope.gridApi.grid.refresh();
        });
      };
      $scope.deuda_total = function() {
        var alumno,
    i,
    len,
    ref,
    sum;
        sum = 0;
        if ($scope.gridOptions.data) {
          ref = $scope.gridOptions.data;
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            sum = sum + alumno.deuda;
          }
        }
        return $filter('currency')(sum,
    "$",
    0);
      };
      $scope.cantidadDeudores = function() {
        var alumno,
    hombres,
    i,
    len,
    mujeres,
    ref,
    sum;
        sum = 0;
        hombres = 0;
        mujeres = 0;
        if ($scope.gridOptions.data) {
          ref = $scope.gridOptions.data;
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            if (!alumno.pazysalvo) {
              sum = sum + 1;
            }
            if (alumno.sexo === 'M') {
              hombres++;
            } else {
              mujeres++;
            }
          }
        }
        $scope.hombresGrupo = hombres;
        $scope.mujeresGrupo = mujeres;
        return sum;
      };
      $scope.cambiarValorVarios = function(valor,
    campo) {
        var datos;
        datos = {
          alumnos: $scope.getSelectedRows(),
          propiedad: campo,
          valor: valor
        };
        return $http.put('::alumnos/guardar-valor-varios',
    datos).then(function(r) {
          var alumno,
    i,
    len,
    ref;
          ref = $scope.getSelectedRows();
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            alumno[campo] = valor;
          }
          return toastr.success('Cambios guardados');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.cambiarPazysalvo = function(fila) {
        var datos;
        fila.pazysalvo = !fila.pazysalvo;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'pazysalvo',
          valor: fila.pazysalvo
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          fila.pazysalvo = !fila.pazysalvo;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.resetPass = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: App.views + 'usuarios/resetPass.tpl.html',
          controller: 'ResetPassCtrl',
          resolve: {
            usuario: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(user) {});
      };
      //console.log 'Resultado del modal: ', user
      $scope.traerSoloDeudores = function(row) {
        return $http.put("::cartera/solo-deudores",
    {
          year_id: $scope.USER.year_id
        }).then(function(r) {
          $scope.gridOptions.data = r.data;
          $scope.gridOptions.columnDefs[6].visible = true;
          return $scope.gridApi.grid.refresh();
        });
      };
      $scope.exportarSoloDeudores = function(row) {
        return DownloadServ.download('::cartera/exportar-solo-deudores',
    'Deudores a exportar ' + $scope.USER.year + '.xls');
      };
    }
  ]);

}).call(this);

//CarteraCtrl.js.map
