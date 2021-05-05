(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VotacionesCtrl', [
    '$scope',
    '$filter',
    '$http',
    'resolved_user',
    'App',
    'toastr',
    function($scope,
    $filter,
    $http,
    resolved_user,
    App,
    toastr) {
      var btAccion,
    btActual,
    btAcud,
    btBloq,
    btGrid1,
    btGrid2,
    btPermiso,
    btProfes;
      $scope.data = {}; // Para el popup del Datapicker
      $scope.editing = false;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.votacionEdit = {};
      $scope.votacion = {
        locked: false,
        is_action: false,
        fecha_inicio: '',
        fecha_fin: '',
        aspiraciones: [
          {
            aspiracion: '',
            abrev: ''
          }
        ]
      };
      $scope.date = {
        dateOptions: {
          startingDay: 1
        }
      };
      $scope.addAspiracion = function() {
        return $scope.votacion.aspiraciones.push({
          aspiracion: '',
          abrev: ''
        });
      };
      $scope.removeAspiracion = function(indice) {
        return $scope.votacion.aspiraciones.splice(indice,
    1);
      };
      $scope.addAspiracionEdit = function(votacion_id) {
        return $http.post('::aspiraciones/store',
    {
          votacion_id: votacion_id
        }).then(function(r) {
          toastr.success('Aspiración creada.');
          return $scope.votacionEdit.aspiraciones.push({
            id: r.data.id,
            aspiracion: '',
            abrev: ''
          });
        },
    function(r2) {
          return toastr.error('No se pudo crear aspiración.');
        });
      };
      $scope.updateAspiracionEdit = function(aspiracion) {
        return $http.put('::aspiraciones/update',
    aspiracion).then(function(r) {
          return toastr.success('Aspiración modificada.');
        },
    function(r2) {
          return toastr.error('No se pudo modificar aspiración.');
        });
      };
      $scope.removeAspiracionEdit = function(aspiracion) {
        return $http.delete('::aspiraciones/destroy/' + aspiracion.id).then(function(r) {
          toastr.success('Aspiración eliminada.');
          return $scope.votacionEdit.aspiraciones = $filter('filter')($scope.votacionEdit.aspiraciones,
    {
            id: '!' + aspiracion.id
          });
        },
    function(r2) {
          return toastr.error('No se pudo eliminar aspiración.');
        });
      };
      $scope.editar = function(row) {
        $scope.editing = true;
        return $scope.votacionEdit = row;
      };
      $scope.eliminar = function(row) {
        return $http.delete('::votaciones/destroy/' + row.id).then(function(r) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + row.id
          });
        },
    function(r2) {
          return toastr.error('No se pudo eliminar.');
        });
      };
      $scope.cambiarInAction = function(row) {
        return $http.put('::votaciones/set-in-action',
    {
          id: row.id,
          in_action: row.in_action
        }).then(function(r) {
          var i,
    len,
    ref,
    vot;
          if (row.in_action) {
            ref = $scope.gridOptions.data;
            for (i = 0, len = ref.length; i < len; i++) {
              vot = ref[i];
              if (row.id !== vot.id) {
                vot.in_action = false;
              }
            }
          } else {
            row.in_action = false;
          }
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo poner en acción.');
        });
      };
      $scope.cambiarVotanProfes = function(row) {
        return $http.put('::votaciones/set-votan-profes',
    {
          id: row.id,
          votan_profes: row.votan_profes
        }).then(function(r) {
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo cambiar votan profes.');
        });
      };
      $scope.cambiarVotanAcudientes = function(row) {
        return $http.put('::votaciones/set-votan-acudientes',
    {
          id: row.id,
          votan_acudientes: row.votan_acudientes
        }).then(function(r) {
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo cambiar votan acudientes.');
        });
      };
      $scope.cambiarLocked = function(row) {
        return $http.put('::votaciones/set-locked',
    {
          id: row.id,
          locked: row.locked
        }).then(function(r) {
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo cambiar bloqueo.');
        });
      };
      $scope.cambiarPermisoVerResults = function(row) {
        return $http.put('::votaciones/set-permiso-ver-results',
    {
          id: row.id,
          can_see_results: row.can_see_results
        }).then(function(r) {
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo cambiar el permiso.');
        });
      };
      $scope.cambiarEventoActual = function(row) {
        return $http.put('::votaciones/set-actual',
    {
          id: row.id,
          actual: row.actual
        }).then(function(r) {
          var i,
    len,
    ref,
    vot;
          if (row.actual) {
            ref = $scope.gridOptions.data;
            for (i = 0, len = ref.length; i < len; i++) {
              vot = ref[i];
              if (row.id !== vot.id) {
                vot.actual = false;
              }
            }
          } else {
            row.actual = false;
          }
          return toastr.success('Cambiado');
        },
    function(r2) {
          return toastr.error('No se pudo volver actual.');
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-times "></i></a>';
      btActual = "==votaciones/botonEventoActual.tpl.html";
      btBloq = "==votaciones/botonEventoLocked.tpl.html";
      btProfes = "==votaciones/botonVotanProfes.tpl.html";
      btAcud = "==votaciones/botonVotanAcudientes.tpl.html";
      btAccion = "==votaciones/botonEventoInAction.tpl.html";
      btPermiso = "==votaciones/botonPermisoVerResults.tpl.html";
      $scope.gridOptions = {
        enableSorting: true,
        enebleGridColumnMenu: false,
        columnDefs: [
          {
            name: 'id',
            displayName: 'Id',
            width: 40,
            enableFiltering: false,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 50,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid2,
            enableCellEdit: false
          },
          {
            field: 'nombre',
            enableHiding: false,
            minWidth: 110
          },
          {
            field: 'locked',
            displayName: 'Bloqueado',
            cellTemplate: btBloq,
            minWidth: 80
          },
          {
            field: 'votan_profes',
            displayName: 'Profes votan',
            minWidth: 80,
            cellTemplate: btProfes
          },
          {
            field: 'votan_acudientes',
            displayName: 'Acudientes votan',
            minWidth: 80,
            cellTemplate: btAcud
          },
          {
            field: 'actual',
            displayName: 'Actual',
            cellTemplate: btActual,
            minWidth: 80
          },
          {
            field: 'in_action',
            displayName: 'En acción',
            cellTemplate: btAccion,
            minWidth: 80
          },
          {
            field: 'can_see_results',
            displayName: 'Permiso',
            cellTemplate: btPermiso,
            minWidth: 80
          },
          {
            field: 'fecha_inicio',
            displayName: 'Inicia',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 80
          },
          {
            field: 'fecha_fin',
            displayName: 'Termina',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 80
          }
        ],
        multiSelect: false
      };
      if ($scope.USER.user_id === 1) {
        $scope.gridOptions.columnDefs.push({
          name: 'user_id',
          displayName: 'Creador',
          width: 40,
          enableCellEdit: false
        });
      }
      $http.get('::votaciones').then(function(data) {
        var i,
    len,
    ref,
    results,
    vot;
        $scope.gridOptions.data = data.data;
        ref = data.data;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          vot = ref[i];
          if (vot.actual) {
            results.push(localStorage.votacion_actual = vot.id);
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
    function(r2) {
        return toastr.error('Error trayendo los eventos.');
      });
      $scope.crear = function() {
        return $http.post('::votaciones/store',
    $scope.votacion).then(function(r) {
          r = r.data;
          if (r.actual) {
            angular.forEach($scope.gridOptions.data,
    function(value,
    key) {
              return value.actual = 0;
            });
          }
          $scope.votacion = {};
          return $scope.gridOptions.data.push(r);
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
      $scope.guardar = function() {
        return $http.post('::votaciones/update/' + $scope.votacionEdit.id,
    $scope.votacionEdit).then(function(r) {
          toastr.success('Se hizo el put de la votación');
          return $scope.editing = false;
        },
    function(r2) {
          return toastr.error('Falló al intentar guardar');
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=VotacionesCtrl.js.map
