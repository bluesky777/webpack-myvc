(function() {
  angular.module('myvcFrontApp').controller('UsuariosCtrl', [
    '$scope',
    '$http',
    '$state',
    '$rootScope',
    'AuthService',
    'Perfil',
    'App',
    '$uibModal',
    '$filter',
    'toastr',
    function($scope,
    $http,
    $state,
    $rootScope,
    AuthService,
    Perfil,
    App,
    $modal,
    $filter,
    toastr) {
      var btGrid1,
    btGrid3,
    btGrid4;
      AuthService.verificar_acceso();
      $scope.editar = function(row) {
        return $state.go('panel.usuarios.editar',
    {
          usuario_id: row.user_id
        });
      };
      $scope.crearUsuarioAdmin = function() {
        var res;
        res = confirm('¿Seguro que desea crear un usuario Administrador?');
        if (res) {
          $scope.creando = true;
          return $http.post('::users/crear-administrador').then(function(r) {
            toastr.success('Creado con éxito');
            $scope.gridOptions.data.unshift(r.data.usuario);
            return $scope.creando = false;
          },
    function() {
            toastr.error('No se pudo crear');
            return $scope.creando = false;
          });
        }
      };
      $scope.crearUsuarioPsicologo = function() {
        var res;
        res = confirm('¿Seguro que desea crear un usuario Psicólogo?');
        if (res) {
          $scope.creando = true;
          return $http.post('::users/crear-psicologo').then(function(r) {
            toastr.success('Creado con éxito');
            $scope.gridOptions.data.unshift(r.data.usuario);
            return $scope.creando = false;
          },
    function() {
            toastr.error('No se pudo crear');
            return $scope.creando = false;
          });
        }
      };
      $scope.crearUsuarioEnfermero = function() {
        var res;
        res = confirm('¿Seguro que desea crear un usuario Enfermero?');
        if (res) {
          $scope.creando = true;
          return $http.post('::users/crear-enfermero').then(function(r) {
            toastr.success('Creado con éxito');
            $scope.gridOptions.data.unshift(r.data.usuario);
            return $scope.creando = false;
          },
    function() {
            toastr.error('No se pudo crear');
            return $scope.creando = false;
          });
        }
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==usuarios/removeUsuario.tpl.html',
          controller: 'RemoveUsuarioCtrl',
          resolve: {
            usuario: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(user) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            id: '!' + user.id
          });
        });
      };
      $scope.resetPass = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==usuarios/resetPass.tpl.html',
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
      $scope.verRoles = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==usuarios/verRoles.tpl.html',
          controller: 'VerRolesCtrl',
          resolve: {
            usuario: function() {
              return row;
            },
            roles: function() {
              return $http.get('::roles');
            }
          }
        });
        return modalInstance.result.then(function(user) {});
      };
      //console.log 'Resultado del modal: ', user
      btGrid1 = '<a uib-tooltip="No cambies roles, consulta antes" class="btn btn-default btn-xs shiny" ng-click="grid.appScope.verRoles(row.entity)">Roles</a>';
      btGrid4 = '<a uib-tooltip="Resetear contraseña" tooltip-placement="right" class="btn btn-default btn-xs shiny" ng-click="grid.appScope.resetPass(row.entity)">Cambiar password</a>';
      btGrid3 = '<a uib-tooltip="Eliminar usuario" tooltip-placement="right" ng-show="row.entity.is_superuser" class="btn btn-danger btn-xs shiny" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-times"></a>';
      $scope.gridOptions = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'user_id',
            width: 70,
            enableFiltering: false,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edición',
            width: 200,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: btGrid1 + btGrid4 + btGrid3,
            enableCellEdit: false
          },
          {
            field: 'username',
            displayName: 'Usuario',
            filter: {
              condition: function(searchTerm,
          cellValue,
          row) {
                var entidad;
                entidad = row.entity;
                if (entidad.username) {
                  return entidad.username.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                }
                return false;
              }
            },
            enableHiding: false
          },
          {
            field: 'nombres',
            cellTemplate: '<div>{{row.entity.nombres + " " + row.entity.apellidos}}</div>',
            filter: {
              condition: function(searchTerm,
          cellValue,
          row) {
                var entidad;
                entidad = row.entity;
                if (entidad.nombres) {
                  return (entidad.nombres.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (entidad.apellidos.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
                }
                return false;
              }
            }
          },
          {
            field: 'sexo',
            width: 70
          },
          {
            field: 'roles',
            displayName: 'Roles',
            enableCellEdit: false,
            cellFilter: 'mapRoles',
            filter: {
              condition: function(searchTerm,
          cellValue) {
                var found;
                found = $filter('filter')(cellValue,
          {
                  name: searchTerm
                });
                return found.length > 0;
              }
            }
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
              if (colDef.field === "username") {
                $http.put('::perfiles/guardar-username/' + rowEntity.user_id,
    {
                  username: rowEntity.username
                }).then(function(r) {
                  return toastr.success('Nombre de Usuario actualizado con éxito',
    'Actualizado');
                },
    function(r2) {
                  return toastr.error('Cambio no guardado',
    'Error');
                });
              } else {
                $http.put('::perfiles/update/' + rowEntity.persona_id,
    rowEntity).then(function(r) {
                  return toastr.success('Usuario actualizado con éxito',
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
      $http.get('::perfiles/usuariosall?year_id=' + $scope.USER.year_id).then(function(data) {
        return $scope.gridOptions.data = data.data;
      });
      return $scope.crearTodosLosUsuarios = function() {
        return $http.put('::perfiles/creartodoslosusuarios').then(function(r) {
          return toastr.success('Usuarios creados con éxito');
        },
    function(r2) {
          return toastr.error('No se pudo crear los usuarios',
    'Problema');
        });
      };
    }
  ]).filter('mapRoles', [
    '$filter',
    function($filter) {
      return function(input,
    grados) {
        var roles;
        if (!input) {
          return '';
        } else {
          roles = [];
          angular.forEach(input,
    function(value,
    key) {
            return roles.push(value.name);
          });
          roles = roles.join();
          return roles;
        }
      };
    }
  ]).controller('RemoveUsuarioCtrl', [
    '$scope',
    '$uibModalInstance',
    'usuario',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    usuario,
    $http,
    toastr) {
      $scope.usuario = usuario;
      $scope.ok = function() {
        $http.delete('::perfiles/destroy/' + usuario.user_id).then(function(r) {
          return toastr.success('Usuario eliminado con éxito.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar al usuario.',
    'Problema');
        });
        return $modalInstance.close(usuario);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('ResetPassCtrl', [
    '$scope',
    '$uibModalInstance',
    'usuario',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    usuario,
    $http,
    toastr) {
      $scope.usuario = usuario;
      $scope.newpassword = '';
      $scope.showPassword = false;
      $scope.ok = function() {
        $http.put('::perfiles/reset-password/' + usuario.user_id,
    {
          password: $scope.newpassword
        }).then(function(r) {
          return toastr.success('Contraseña cambiada.');
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar contraseña.',
    'Problema');
        });
        return $modalInstance.close(usuario);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('VerRolesCtrl', [
    '$scope',
    '$uibModalInstance',
    'usuario',
    'roles',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    usuario,
    roles,
    $http,
    toastr) {
      $scope.usuario = usuario;
      $scope.roles = roles.data;
      $scope.datos = {
        selecteds: []
      };
      $scope.datos.selecteds = usuario.roles;
      $scope.seleccionando = function($item,
    $model) {
        return $http.put('::roles/addroletouser/' + $item.id,
    {
          user_id: usuario.user_id
        }).then(function(r) {
          return toastr.success('Rol agregado con éxito.');
        },
    function(r2) {
          return toastr.warning('No se pudo agregar el rol al usuario.',
    'Problema');
        });
      };
      $scope.quitando = function($item,
    $model) {
        return $http.put('::roles/removeroletouser/' + $item.id,
    {
          user_id: usuario.user_id
        }).then(function(r) {
          return toastr.success('Rol quitado con éxito.');
        },
    function(r2) {
          return toastr.warning('No se pudo quitar el rol al usuario.',
    'Problema');
        });
      };
      $scope.ok = function() {
        usuario.roles = $scope.datos.selecteds;
        return $modalInstance.close(usuario);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=UsuariosCtrl.js.map
