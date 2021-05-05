(function() {
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'USER_ROLES',
    'PERMISSIONS',
    function($state,
    USER_ROLES,
    PERMISSIONS) {
      $state.state('panel.usuarios',
    {
        url: '^/usuarios',
        views: {
          'maincontent': {
            templateUrl: "==usuarios/usuarios.tpl.html",
            controller: 'UsuariosCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Usuarios';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Usuarios',
          icon_fa: 'fa fa-user',
          needed_permissions: [PERMISSIONS.can_edit_usuarios],
          pageTitle: 'Usuarios - MyVc'
        }
      }).state('panel.user',
    {
        url: '^/user/:username',
        views: {
          'maincontent': {
            templateUrl: "==usuarios/user.tpl.html",
            controller: 'UserCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Perfil';
                }
              ]
            }
          }
        },
        resolve: {
          perfilactual: [
            '$http',
            '$stateParams',
            '$q',
            '$state',
            'toastr',
            function($http,
            $stateParams,
            $q,
            $state,
            toastr) {
              var d,
            username;
              d = $q.defer();
              username = $stateParams.username;
              if (username || username === '') {
                $http.get('::perfiles/username/' + username).then(function(r) {
                  //console.log 'Perfilactual en el resolve:', r[0]
                  if (r.data[0].fecha_nac) {
                    r.data[0].fecha_nac = r.data[0].fecha_nac ? new Date(r.data[0].fecha_nac.replace(/-/g,
            '\/')) : r.data[0].fecha_nac;
                  }
                  return d.resolve(r.data[0]);
                },
            function(r2) {
                  //$state.transitionTo 'panel'
                  return d.reject(r2);
                });
              } else {
                toastr.warning('Lo sentimos, nombre de usuario no encontrado');
                $state.go('panel');
              }
              return d.promise;
            }
          ]
        },
        data: {
          displayName: 'Perfil',
          icon_fa: 'fa fa-user'
        }
      }).state('panel.user.resumen',
    {
        url: '/r',
        views: {
          'user_detail': {
            templateUrl: "==usuarios/userResumen.tpl.html",
            controller: 'UserResumenCtrl'
          }
        },
        data: {
          displayName: 'Resumen',
          icon_fa: 'fa fa-user'
        }
      }).state('panel.user.configuracion',
    {
        url: '/c',
        views: {
          'user_detail': {
            templateUrl: "==usuarios/userConfiguracion.tpl.html",
            controller: 'UserConfiguracionCtrl'
          }
        },
        data: {
          displayName: 'Configuración de perfil',
          icon_fa: 'fa fa-user'
        }
      }).state('panel.usuarios.roles',
    {
        url: '/roles',
        views: {
          'user_roles': {
            templateUrl: "==usuarios/roles.tpl.html",
            controller: 'RolesCtrl'
          }
        },
        data: {
          displayName: 'Roles',
          icon_fa: 'fa fa-user-secret'
        }
      }).state('panel.usuarios.editar',
    {
        url: '/editar/:user_id',
        views: {
          'edit_user': {
            templateUrl: "==usuarios/usuariosEdit.tpl.html",
            controller: 'UsuariosEditCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Editar alumno';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Editar',
          icon_fa: 'fa fa-users',
          pageTitle: 'Editar alumno - MyVc'
        }
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=UserConfig.js.map
