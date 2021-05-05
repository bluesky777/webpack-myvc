(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('ProfesoresCtrl', [
    '$scope',
    '$uibModal',
    'toastr',
    'uiGridConstants',
    '$http',
    '$state',
    'App',
    '$filter',
    'Acentos',
    function($scope,
    $uibModal,
    toastr,
    uiGridConstants,
    $http,
    $state,
    App,
    $filter,
    Acentos) {
      var btEditUsername,
    btGrid1,
    btGrid2,
    btGrid3,
    btGridQuitar,
    btUsuario;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.current_year = $scope.USER.year_id;
      $scope.views = App.views;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.editar = function(row) {
        return $state.go('panel.profesores.editar',
    {
          profe_id: row.id
        });
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: '==profesores/removeProfesor.tpl.html',
          controller: 'RemoveProfesorCtrl',
          resolve: {
            profesor: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            alumno_id: '!' + alum.alumno_id
          });
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-times "></i></a>';
      btGrid3 = "==profesores/botonContratar.tpl.html";
      btUsuario = "==directives/botonesResetPassword.tpl.html";
      btEditUsername = "==profesores/botonEditUsername.tpl.html";
      $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        exporterSuppressColumns: ['edicion'],
        exporterCsvColumnSeparator: ';',
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: "Todos los docentes - MyVC.csv",
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'no',
            pinnedLeft: true,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40,
            enableCellEdit: false
          },
          {
            name: 'contrato',
            pinnedLeft: true,
            displayName: 'Contrato',
            width: 75,
            enableFiltering: false,
            cellTemplate: btGrid3,
            enableCellEdit: false
          },
          {
            field: 'nombres',
            enableHiding: false,
            minWidth: 150,
            pinnedLeft: true,
            filter: {
              condition: Acentos.buscarEnGrid
            },
            enableHiding: false,
            cellTemplate: '<div class="ui-grid-cell-contents" style="padding: 0px;"><img ng-src="{{grid.appScope.perfilPath + row.entity.foto_nombre}}" style="width: 35px" />{{row.entity.nombres}}</div>'
          },
          {
            field: 'apellidos',
            minWidth: 150
          },
          {
            field: 'id',
            displayName: 'Id',
            width: 50,
            enableFiltering: false,
            enableCellEdit: false
          },
          {
            //{ name: 'edicion', displayName:'Edición', width: 50, enableSorting: false, enableFiltering: false, cellTemplate: btGrid1 + btGrid2, enableCellEdit: false}
            name: 'edicion',
            displayName: 'Edición',
            width: 50,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid2,
            enableCellEdit: false
          },
          {
            field: 'sexo',
            displayName: 'Sex',
            width: 40
          },
          {
            field: 'num_doc',
            displayName: 'Documento',
            minWidth: 130,
            cellFilter: 'formatNumberDocumento'
          },
          {
            field: 'username',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            },
            displayName: 'Usuario',
            cellTemplate: btUsuario,
            editableCellTemplate: btEditUsername,
            minWidth: 135
          },
          {
            field: 'fecha_nac',
            displayName: 'Nacimiento',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 100
          },
          {
            field: 'celular',
            minWidth: 100
          },
          {
            field: 'titulo',
            minWidth: 200
          },
          {
            field: 'email_usu',
            displayName: 'Email',
            minWidth: 250
          },
          {
            field: 'direccion',
            minWidth: 200
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
              $http.put('::profesores/update/' + rowEntity.id,
    rowEntity).then(function(r) {
                return toastr.success('Profesor actualizado con éxito',
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
      $http.get('::profesores').then(function(data) {
        return $scope.gridOptions.data = data.data;
      });
      $scope.$on('profesorcreado',
    function(data,
    prof) {
        return $scope.gridOptions.data.push(prof);
      });
      $scope.quitarContrato = function(contrato_id) {
        return $http.delete('::contratos/destroy/' + contrato_id).then(function(r) {
          var actual;
          toastr.success('Quitado de este año ' + $scope.USER.year);
          $scope.gridCurrentOptions.data = $filter('filter')($scope.gridCurrentOptions.data,
    {
            contrato_id: '!' + contrato_id
          });
          actual = $filter('filter')($scope.gridOptions.data,
    {
            contrato_id: contrato_id
          })[0];
          return actual.year_id = null;
        },
    function(r2) {
          return toastr.error('No se pudo agregar el profesor al presente año',
    'Problema');
        });
      };
      $scope.contratar = function(row) {
        return $http.post('::contratos',
    {
          profesor_id: row.id
        }).then(function(r) {
          var actual;
          toastr.success(row.nombres + ' contratado para este año');
          r = r.data[0];
          $scope.gridCurrentOptions.data.push(r);
          actual = $filter('filter')($scope.gridOptions.data,
    {
            id: r.profesor_id
          })[0];
          actual.year_id = $scope.current_year;
          return actual.contrato_id = r.contrato_id;
        },
    function(r2) {
          if (r2.data.contratado) {
            return toastr.warning('Este profesor ya está contratado');
          } else {
            return toastr.error('No se pudo agregar el profesor al presente año',
    'Problema');
          }
        });
      };
      btGridQuitar = '<a uib-tooltip="Quitar de año actual" tooltip-placement="left" class="btn btn-default btn-xs shiny danger" ng-click="grid.appScope.quitarContrato(row.entity.contrato_id)"><i class="fa fa-times "></i></a>';
      $scope.gridCurrentOptions = {
        enableSorting: true,
        enableFiltering: true,
        exporterSuppressColumns: ['edicion'],
        exporterCsvColumnSeparator: ';',
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: "Docentes contratados - MyVC.csv",
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'no',
            pinnedLeft: true,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40,
            enableCellEdit: false
          },
          {
            field: 'profesor_id',
            displayName: 'Id',
            width: 50,
            enableFiltering: false,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 50,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGridQuitar,
            enableCellEdit: false
          },
          {
            field: 'nombres',
            enableHiding: false,
            minWidth: 100
          },
          {
            field: 'apellidos',
            minWidth: 100
          },
          {
            field: 'sexo',
            displayName: 'Sex',
            width: 40
          },
          {
            field: 'username',
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            },
            displayName: 'Usuario',
            cellTemplate: btUsuario,
            editableCellTemplate: btEditUsername,
            minWidth: 135
          },
          {
            field: 'fecha_nac',
            displayName: 'Nacimiento',
            minWidth: 100
          },
          {
            field: 'email_usu',
            displayName: 'Email',
            minWidth: 250
          },
          {
            field: 'celular',
            minWidth: 100
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
              $http.put('::profesores/update/' + rowEntity.profesor_id,
    rowEntity).then(function(r) {
                return toastr.success('Profesor actualizado con éxito',
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
      $http.get('::contratos').then(function(r) {
        return $scope.gridCurrentOptions.data = r.data;
      },
    function(r2) {
        return toastr.error('No se trajeron los profesores contratados');
      });
      $scope.cambiaUsernameCheck = function(texto) {
        $scope.verificandoUsername = true;
        return $http.put('::users/usernames-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.username_match = r.data.usernames;
          $scope.verificandoUsername = false;
          return $scope.username_match.map(function(item) {
            return item.username;
          });
        });
      };
      $scope.resetPass = function(row) {
        var modalInstance;
        modalInstance = $uibModal.open({
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
    }
  //console.log 'Resultado del modal: ', user
  ]).controller('RemoveProfesorCtrl', [
    '$scope',
    '$uibModalInstance',
    'profesor',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    profesor,
    $http,
    toastr) {
      $scope.profesor = profesor;
      $scope.ok = function() {
        $http.delete('::profesores/destroy/' + profesor.id).then(function(r) {
          return toastr.success('Profesor enviado a la papelera.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
        return $modalInstance.close(profesor);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ProfesoresCtrl.js.map
