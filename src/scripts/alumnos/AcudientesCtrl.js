(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('AcudientesCtrl', [
    '$scope',
    'App',
    '$state',
    '$interval',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    'uiGridConstants',
    'DownloadServ',
    'Acentos',
    function($scope,
    App,
    $state,
    $interval,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http,
    uiGridConstants,
    DownloadServ,
    Acentos) {
      var bt2,
    btGrid1,
    btGrid2,
    btPazysalvo,
    btUsuario;
      AuthService.verificar_acceso();
      $scope.dato = {};
      $scope.gridOptions = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.dato.grupo = '';
      $http.get('::grupos/con-paises-tipos').then(function(r) {
        var acud_grupo,
    grupo,
    i,
    len,
    ref,
    results;
        acud_grupo = 0;
        if (localStorage.acud_grupo) {
          acud_grupo = parseInt(localStorage.acud_grupo);
        }
        $scope.grupos = r.data.grupos;
        $scope.paises = r.data.paises;
        $scope.tipos_doc = r.data.tipos_doc;
        ref = $scope.grupos;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (parseInt(grupo.id) === parseInt(acud_grupo)) {
            $scope.dato.grupo = grupo;
            results.push($scope.selectGrupo($scope.dato.grupo));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      $scope.selectGrupo = function(grupo) {
        var grup,
    grupos_ant,
    i,
    j,
    len,
    len1,
    ref,
    ref1;
        localStorage.acud_grupo = grupo.id;
        $scope.dato.grupo = grupo;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          grup.active = false;
        }
        grupo.active = true;
        // Traer acudientes
        grupos_ant = [];
        ref1 = $scope.grupos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          grup = ref1[j];
          if (grup.orden_grado === (grupo.orden_grado - 1)) {
            grupos_ant.push(grup);
          }
        }
        $scope.traerAcudientes = function() {
          return $http.put("::acudientes/datos",
    {
            grupo_actual: grupo
          }).then(function(r) {
            var k,
    len2,
    pariente,
    ref2,
    results;
            $scope.gridOptions.data = r.data.acudientes;
            ref2 = $scope.gridOptions.data;
            results = [];
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              pariente = ref2[k];
              pariente.fecha_nac_ant = pariente.fecha_nac;
              pariente.fecha_nac = pariente.fecha_nac ? new Date(pariente.fecha_nac.replace(/-/g,
    '\/')) : pariente.fecha_nac;
              results.push(pariente.subGridOptions.onRegisterApi = function(gridApi) {
                return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
                  toastr.warning('Desde aquí solo podrás editar Acudientes',
    'No guardado');
                  return $scope.$apply();
                });
              });
            }
            return results;
          });
        };
        return $scope.traerAcudientes();
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>';
      bt2 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 + btGrid2 + '</span>';
      btPazysalvo = "==directives/botonesPazysalvo.tpl.html";
      btUsuario = "==directives/botonesResetPassword.tpl.html";
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEdit: true,
        enableCellEditOnFocus: true,
        exporterSuppressColumns: ['edicion'],
        exporterCsvColumnSeparator: ';',
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: "Alumnos - MyVC.csv",
        enableGridMenu: true,
        expandableRowTemplate: '==alumnos/expandableRowTemplate.tpl.html',
        expandableRowHeight: 110,
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
            field: 'id',
            width: 60,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 60,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: bt2,
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
            minWidth: 100,
            filter: {
              condition: Acentos.buscarEnGrid
            },
            enableHiding: false
          },
          {
            field: 'apellidos',
            minWidth: 100,
            filter: {
              condition: Acentos.buscarEnGrid
            }
          },
          {
            field: 'sexo',
            width: 60
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
            field: 'documento',
            displayName: 'Documento',
            minWidth: 100,
            cellFilter: 'formatNumberDocumento'
          },
          {
            field: 'direccion',
            displayName: 'Dirección',
            minWidth: 90
          },
          {
            field: 'barrio',
            minWidth: 80
          },
          {
            field: 'telefono',
            displayName: 'Teléfono',
            minWidth: 90
          },
          {
            field: 'celular',
            displayName: 'Celular',
            minWidth: 90
          },
          {
            field: 'ocupacion',
            displayName: 'Ocupación',
            minWidth: 90
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
            if ($scope.usuario_creado) {
              $scope.usuario_creado = false;
              return;
            }
            if (newValue !== oldValue) {
              if (colDef.field === "sexo") {
                if (newValue === 'M' || newValue === 'F') {
                  // Es correcto...
                  $http.put('::acudientes/guardar-valor',
    {
                    acudiente_id: rowEntity.id,
                    parentesco_id: rowEntity.parentesco_id,
                    user_id: rowEntity.user_id,
                    propiedad: colDef.field,
                    valor: newValue
                  }).then(function(r) {
                    return toastr.success('Acudiente actualizado con éxito',
    'Actualizado');
                  },
    function(r2) {
                    return toastr.error('Cambio no guardado',
    'Error');
                  });
                } else {
                  toastr.warning('Debe usar M o F');
                  rowEntity.sexo = oldValue;
                }
              } else {
                $http.put('::acudientes/guardar-valor',
    {
                  acudiente_id: rowEntity.id,
                  parentesco_id: rowEntity.parentesco_id,
                  user_id: rowEntity.user_id,
                  propiedad: colDef.field,
                  valor: newValue
                }).then(function(r) {
                  return toastr.success('Acudiente actualizado con éxito',
    'Actualizado');
                },
    function(r2) {
                  return toastr.error('Cambio no guardado',
    'Error');
                });
              }
            }
            return $scope.$apply();
          });
        }
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/removeAcudiente.tpl.html',
          controller: 'RemoveAcudienteCtrl',
          resolve: {
            acudiente: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(acu) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + acu.id
          });
        },
    function() {});
      };
      // nada
      $scope.editar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/editAcudienteModal.tpl.html',
          controller: 'EditAcudienteModalCtrl',
          resolve: {
            acudiente: function() {
              return row;
            },
            paises: function() {
              return $scope.paises;
            },
            tipos_doc: function() {
              return $scope.tipos_doc;
            },
            parentescos: function() {
              return $scope.parentescos;
            }
          }
        });
        return modalInstance.result.then(function(acu) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + acu.id
          });
        },
    function() {});
      };
      // nada
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
        if (!row.user_id) {
          toastr.warning('Aún no tiene usuario');
          return;
        }
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
      $scope.traerNOAsignados = function() {
        return $http.put('::acudientes/no-asignados').then(function(r) {
          var i,
    len,
    pariente,
    ref,
    results;
          $scope.gridOptions.data = r.data.acudientes;
          ref = $scope.gridOptions.data;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            pariente = ref[i];
            pariente.fecha_nac_ant = pariente.fecha_nac;
            results.push(pariente.fecha_nac = pariente.fecha_nac ? new Date(pariente.fecha_nac.replace(/-/g,
    '\/')) : pariente.fecha_nac);
          }
          return results;
        },
    function() {
          return toastr.error('No se pudo traer los acudientes sin asignar');
        });
      };
      $scope.crearUsuario = function(row) {
        if (row.user_id) {
          toastr.warning('Ya tiene usuario');
          return;
        }
        return $http.post('::acudientes/crear-usuario',
    {
          acudiente: row
        }).then(function(r) {
          $scope.usuario_creado = true;
          row.user_id = r.data.id;
          row.username = r.data.username;
          return toastr.success('Usuario creado');
        },
    function() {
          return toastr.error('No se pudo crear el usuario');
        });
      };
      $scope.exportarAcudientesPlanillas = function() {
        return DownloadServ.download('::acudientes-export/acudientes',
    'Asistencia acudientes Per ' + $scope.USER.numero_periodo + ' - ' + $scope.USER.year + '.xls');
      };
      $scope.verPlanillas = function() {
        return $state.go('panel.informes.planillas-ausencias-acudientes');
      };
    }
  ]).controller('RemoveAcudienteCtrl', [
    '$scope',
    '$uibModalInstance',
    'acudiente',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    acudiente,
    $http,
    toastr,
    App) {
      $scope.acudiente = acudiente;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.ok = function() {
        $http.delete('::acudientes/destroy/' + acudiente.id).then(function(r) {
          return toastr.success('Acudiente enviado a la papelera.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
        return $modalInstance.close(acudiente);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AcudientesCtrl.js.map
