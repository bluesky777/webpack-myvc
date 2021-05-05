(function() {
  angular.module("myvcFrontApp").controller('AsignaturasCtrl', [
    '$scope',
    '$http',
    'datosAsignaturas',
    '$uibModal',
    '$filter',
    'App',
    'AuthService',
    'toastr',
    '$timeout',
    function($scope,
    $http,
    datosAsignaturas,
    $modal,
    $filter,
    App,
    AuthService,
    toastr,
    $timeout) {
      var btGrid1,
    btGrid2;
      AuthService.verificar_acceso();
      $scope.creando = false;
      $scope.editando = false;
      $scope.currentasignatura = {
        grupo: void 0,
        profesor: void 0
      };
      $scope.currenasignaturaEdit = {};
      $scope.copiando = false;
      $scope.show_materias_todas = false;
      if ($scope.USER.show_materias_todas) {
        $scope.show_materias_todas = parseInt($scope.USER.show_materias_todas);
      }
      $scope.asignaturas = [];
      $scope.materias = datosAsignaturas.materias;
      $scope.grupos = datosAsignaturas.grupos;
      $scope.profesores = datosAsignaturas.profesores;
      $scope.perfilPath = App.images + 'perfil/';
      // Traemos la papelera
      $http.get('::asignaturas/papelera').then(function(r) {
        return $scope.asignaturas_eliminadas = r.data;
      },
    function(r2) {
        return toastr.error('Error trayendo las asignaturas de papelera',
    'Problema');
      });
      $scope.restaurarAsignatura = function(asignatura) {
        if (!asignatura.restaurando) {
          asignatura.restaurando = true;
          return $http.put('::asignaturas/restaurar',
    {
            asignatura_id: asignatura.asignatura_id
          }).then(function(r) {
            return toastr.success('Listo. Debes actualizar la página para ver los cambios.');
          },
    function(r2) {
            asignatura.restaurando = false;
            return toastr.error('Error restaurando',
    'Problema');
          });
        }
      };
      $scope.cambiarMostrarTodasMaterias = function(can) {
        return $http.put('::years/mostrar-todas-materias',
    {
          can: can,
          year_id: $scope.USER.year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.error('No guardado.',
    'Problema');
        });
      };
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.seleccionaGrupo = function(item,
    model) {
        var profeSearch;
        item = item === void 0 ? {
          id: '!'
        } : item;
        $scope.gridOptions.data = $filter('filter')($scope.asignaturas,
    {
          grupo_id: item.id
        },
    true);
        if ($scope.currentasignatura.profesor !== void 0) {
          profeSearch = $scope.currentasignatura.profesor.id;
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            profesor_id: profeSearch
          },
    true);
        }
      };
      $scope.mostrarTodas = function(item,
    model) {
        return $scope.gridOptions.data = $scope.asignaturas;
      };
      $scope.seleccionaProfe = function(item,
    model) {
        var grupoSearch;
        if (item) {
          item = item === void 0 ? {
            profesor_id: '!'
          } : item;
          $scope.gridOptions.data = $filter('filter')($scope.asignaturas,
    {
            profesor_id: item.profesor_id
          },
    true);
          if ($scope.currentasignatura.grupo) {
            grupoSearch = $scope.currentasignatura.grupo.id;
            return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
              grupo_id: grupoSearch
            },
    true);
          }
        } else {
          if ($scope.currentasignatura.grupo) {
            grupoSearch = $scope.currentasignatura.grupo.id;
            return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
              grupo_id: grupoSearch
            },
    true);
          }
        }
      };
      $scope.filtrarAsignaturas = function() {
        var grupoSearch,
    profeSearch;
        $scope.gridOptions.data = $scope.asignaturas;
        if ($scope.currentasignatura.grupo !== void 0) {
          grupoSearch = $scope.currentasignatura.grupo.id;
          $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            grupo_id: grupoSearch
          },
    true);
        }
        if ($scope.currentasignatura.profesor !== void 0) {
          profeSearch = $scope.currentasignatura.profesor.id;
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            profesor_id: profeSearch
          },
    true);
        }
      };
      $scope.cancelarCrear = function() {
        return $scope.creando = false;
      };
      $scope.cancelarEdit = function() {
        return $scope.editando = false;
      };
      $scope.copiarAsignaturas = function() {
        $scope.copiando = false;
        return $http.post('::asignaturas/copiar',
    {
          grupo_id_origen: $scope.currentasignatura.grupo.id,
          grupo_id_destino: $scope.currentasignatura.grupo_destino.id
        }).then(function(r) {
          $scope.copiando = true;
          return toastr.success('Asignaturas copiadas. Actualice');
        },
    function(r2) {
          return toastr.error('Error creando',
    'Problema');
        });
      };
      $scope.toggleDia = function(fila,
    dia) {
        var datos;
        fila[dia] = !fila[dia];
        datos = {
          asignatura_id: fila.id,
          dia: dia,
          valor: fila[dia]
        };
        return $http.put('::asignaturas/toggle-dia',
    datos).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          fila[dia] = !fila[dia];
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.crear = function() {
        return $http.post('::asignaturas',
    $scope.currentasignatura).then(function(r) {
          $scope.asignaturas.push(r.data);
          $scope.filtrarAsignaturas();
          $scope.cancelarCrear();
          return toastr.success('Asignatura creada con éxito');
        },
    function(r2) {
          return toastr.error('Error creando',
    'Problema');
        });
      };
      $scope.guardar = function() {
        return $http.put('::asignaturas/update/' + $scope.currentasignaturaEdit.id,
    $scope.currentasignaturaEdit).then(function(r) {
          $scope.currentasignaturaEdit.area_id = r.data.area_id; // Para actulizar el grid
          toastr.success('Asignatura actualizada con éxito');
          return $scope.cancelarEdit();
        },
    function(r2) {
          return toastr.error('Error guardando',
    'Problema');
        });
      };
      $scope.editar = function(row) {
        row.materia = $filter('filter')(datosAsignaturas.materias,
    {
          id: row.materia_id
        },
    true)[0];
        row.grupo = $filter('filter')(datosAsignaturas.grupos,
    {
          id: row.grupo_id
        },
    true)[0];
        row.profesor = $filter('filter')(datosAsignaturas.profesores,
    {
          profesor_id: row.profesor_id
        },
    true)[0];
        $scope.currentasignaturaEdit = row;
        return $scope.editando = true;
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==areas/removeAsignatura.tpl.html',
          controller: 'RemoveAsignaturaCtrl',
          resolve: {
            asignatura: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(asignatura) {
          $scope.asignaturas = $filter('filter')($scope.asignaturas,
    {
            id: '!' + asignatura.id
          });
          $scope.gridOptions.data = $scope.asignaturas;
          return $scope.filtrarAsignaturas();
        },
    function(asignatura) {
          var asign,
    i,
    j,
    len,
    ref;
          ref = $scope.asignaturas;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            asign = ref[i];
            if (asign.id === asignatura.id) {
              asign.cantidad_notas = asignatura.cantidad_notas;
              $scope.asignaturas.splice(i,
    1,
    asignatura);
            }
          }
          return $timeout(function() {
            return $scope.$apply();
          });
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>' + '<span ng-show="true" uib-tooltip="Cantidad notas">{{row.entity.cantidad_notas}}</span>';
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'id',
            type: 'number',
            width: 60,
            enableFiltering: false,
            enableCellEdit: false,
            enableColumnMenu: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 80,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid2,
            enableCellEdit: false,
            enableColumnMenu: false
          },
          {
            //{ field: 'orden', displayName:'Orden', type: 'number', maxWidth: 50, enableFiltering: false }
            field: 'materia_id',
            displayName: 'Materia',
            editDropdownOptionsArray: datosAsignaturas.materias,
            cellFilter: 'mapMaterias:grid.appScope.materias',
            filter: {
              condition: function(searchTerm,
          cellValue) {
                var actual,
          foundMaterias;
                foundMaterias = $filter('filter')(datosAsignaturas.materias,
          {
                  materia: searchTerm
                });
                actual = $filter('filter')(foundMaterias,
          {
                  id: cellValue
                },
          true);
                return actual.length > 0;
              }
            },
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'materia',
            enableCellEditOnFocus: true,
            minWidth: 150
          },
          {
            field: 'grupo_id',
            displayName: 'Grupos',
            editDropdownOptionsArray: datosAsignaturas.grupos,
            cellFilter: 'mapGrupos:grid.appScope.grupos',
            filter: {
              condition: function(searchTerm,
          cellValue) {
                var actual,
          foundG;
                foundG = $filter('filter')(datosAsignaturas.grupos,
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
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'id',
            editDropdownValueLabel: 'nombre',
            enableCellEditOnFocus: true,
            minWidth: 80
          },
          {
            field: 'profesor_id',
            displayName: 'Profesor',
            editDropdownOptionsArray: datosAsignaturas.profesores,
            cellFilter: 'mapProfesores:grid.appScope.profesores', //  cellTemplate: '<div>{{row.entity.nombres + " " + row.entity.apellidos}}</div>',
            filter: {
              condition: function(searchTerm,
          cellValue) {
                var foundP;
                foundP = $filter('filter')(datosAsignaturas.profesores,
          function(prof) {
                  var pru1,
          pru2,
          pru3;
                  pru1 = prof.nombres ? prof.nombres.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;
                  pru2 = prof.apellidos ? prof.apellidos.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : false;
                  pru3 = prof.profesor_id === cellValue ? true : false;
                  return (pru1 || pru2) && pru3;
                });
                return foundP.length > 0;
              }
            },
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownIdLabel: 'profesor_id',
            editDropdownValueLabel: 'nombre_completo',
            enableCellEditOnFocus: true,
            minWidth: 140
          },
          {
            field: 'creditos',
            displayName: 'IH',
            type: 'number',
            minWidth: 50
          },
          {
            field: 'lunes',
            displayName: 'Lunes',
            minWidth: 50,
            cellTemplate: "==areas/botonLunes.tpl.html",
            enableCellEdit: false
          },
          {
            field: 'martes',
            displayName: 'Martes',
            minWidth: 50,
            cellTemplate: "==areas/botonMartes.tpl.html",
            enableCellEdit: false
          },
          {
            field: 'miercoles',
            displayName: 'Miércoles',
            minWidth: 50,
            cellTemplate: "==areas/botonMiercoles.tpl.html",
            enableCellEdit: false
          },
          {
            field: 'jueves',
            displayName: 'Jueves',
            minWidth: 50,
            cellTemplate: "==areas/botonJueves.tpl.html",
            enableCellEdit: false
          },
          {
            field: 'viernes',
            displayName: 'Viernes',
            minWidth: 50,
            cellTemplate: "==areas/botonViernes.tpl.html",
            enableCellEdit: false
          },
          {
            name: 'nn',
            displayName: '',
            width: 10,
            enableSorting: false,
            enableFiltering: false,
            enableColumnMenu: false
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
              $scope.currentasignaturaEdit = rowEntity;
              $scope.guardar();
            }
            return $scope.$apply();
          });
        }
      };
      return $http.get('::asignaturas').then(function(data) {
        $scope.asignaturas = data.data;
        return $scope.gridOptions.data = $scope.asignaturas;
      });
    }
  ]).filter('mapMaterias', [
    '$filter',
    function($filter) {
      return function(input,
    materias) {
        var mater;
        if (!input) {
          return 'Elija...';
        } else {
          mater = $filter('filter')(materias,
    {
            id: input
          },
    true)[0];
          if (mater) {
            return mater.materia;
          } else {
            return 'En papelera...';
          }
        }
      };
    }
  ]).filter('mapGrupos', [
    '$filter',
    function($filter) {
      return function(input,
    grupos) {
        var grupo;
        if (!input) {
          return 'Elija...';
        } else {
          grupo = $filter('filter')(grupos,
    {
            id: input
          },
    true)[0];
          return grupo.nombre;
        }
      };
    }
  ]).filter('mapProfesores', [
    '$filter',
    function($filter) {
      return function(input,
    profesores) {
        var profes;
        if (!input) {
          return 'Elija...';
        } else {
          profes = $filter('filter')(profesores,
    {
            profesor_id: input
          },
    true);
          if (profes.length > 0) {
            return profes[0].nombres + ' ' + profes[0].apellidos;
          } else {
            return 'Elija...';
          }
        }
      };
    }
  ]).controller('RemoveAsignaturaCtrl', [
    '$scope',
    '$uibModalInstance',
    'asignatura',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    asignatura,
    $http,
    toastr) {
      $scope.asignatura = asignatura;
      $http.put('::asignaturas/detalle-asignatura',
    {
        asignatura_id: asignatura.id
      }).then(function(r) {
        $scope.unidades = r.data.unidades;
        $scope.cantidad_notas = r.data.cantidad_notas;
        return asignatura.cantidad_notas = $scope.cantidad_notas;
      },
    function(r2) {
        return toastr.warning('Problema',
    'No se pudo traer detalle de la asignatura.');
      });
      $scope.ok = function() {
        $http.delete('::asignaturas/destroy/' + asignatura.id).then(function(r) {
          return toastr.success('asignatura ' + asignatura.nombre + ' eliminada con éxito.',
    'Eliminada');
        },
    function(r2) {
          return toastr.warning('Problema',
    'No se pudo eliminar la asignatura.');
        });
        return $modalInstance.close(asignatura);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss(asignatura);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AsignaturasCtrl.js.map
