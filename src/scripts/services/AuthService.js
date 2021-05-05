(function() {
  angular.module('myvcFrontApp').factory('AuthService', [
    '$state',
    '$http',
    '$cookies',
    'Perfil',
    '$rootScope',
    'AUTH_EVENTS',
    '$q',
    '$filter',
    'toastr',
    function($state,
    $http,
    $cookies,
    Perfil,
    $rootScope,
    AUTH_EVENTS,
    $q,
    $filter,
    toastr) {
      var authService;
      authService = {};
      authService.verificar = function() {
        var d;
        d = $q.defer();
        if (Perfil.User().user_id) {
          d.resolve(Perfil.User());
        } else {
          if ($cookies.get('xtoken')) {
            if ($cookies.get('xtoken') !== void 0 && $cookies.get('xtoken') !== 'undefined' && $cookies.get('xtoken') !== '[object Object]') {
              authService.login_from_token().then(function(usuario) {
                Perfil.setUser(usuario);
                return d.resolve(usuario);
              },
    function(r2) {
                console.log('No se logueó from token');
                return d.reject(r2);
              });
            } else {
              authService.borrarToken();
              d.reject('Token mal estructurado.');
            }
          } else {
            console.log('No hay token');
            d.resolve('No hay token.');
            //$state.go 'login'
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
          }
        }
        return d.promise;
      };
      authService.verificar_acceso = function() {
        var autorizado_perms,
    autorizado_roles,
    needed_permissions,
    needed_roles,
    next;
        if (!Perfil.User().user_id) {
          $state.go('login');
        }
        next = $state.current;
        autorizado_perms = false;
        autorizado_roles = false;
        if (next.data.needed_permissions) {
          needed_permissions = next.data.needed_permissions;
          if (!authService.isAuthorized(needed_permissions)) {
            autorizado_perms = true;
          }
        }
        if (next.data.needed_roles) {
          needed_roles = next.data.needed_roles;
          if (!authService.isAuthorized(false,
    needed_roles)) {
            autorizado_roles = true;
          }
        }
        if (autorizado_perms && autorizado_roles) {
          $rootScope.lastState = next.name;
          if (authService.isAuthenticated()) {
            // user is not allowed
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          } else {
            $state.transitionTo('login');
          }
        }
        if (!next.data.needed_roles && !next.data.needed_permissions) {
          return true;
        }
      };
      authService.login_credentials = function(credentials) {
        var d;
        d = $q.defer();
        authService.borrarToken();
        $http.post('::login/credentials',
    credentials).then(function(r) {
          var respuesta;
          respuesta = r.data;
          if (respuesta.el_token) {
            $cookies.put('xtoken',
    respuesta.el_token);
            if (respuesta.cambia_anio > 0) {
              localStorage.cambia_anio = respuesta.cambia_anio;
            }
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $cookies.get('xtoken');
            localStorage.logueando = 'token_verificado';
            return d.resolve(respuesta.el_token);
          } else {
            //console.log 'No se trajo un token en el login.', user
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            return d.reject('Error en login');
          }
        },
    function(r2) {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          console.log(r2);
          if (r2) {
            if (r2.status) {
              if (r2.status === 400) {
                if (r2.data.message === 'Usuario invalidado') {
                  toastr.error('Te han desactivado',
    'NO ACTIVO',
    {
                    timeOut: 8000
                  });
                } else {
                  toastr.error('Datos inválidos',
    '',
    {
                    timeOut: 8000
                  });
                }
              } else if (r2.status === -1) {
                toastr.error('No parece haber comunicación con el servidor',
    '',
    {
                  timeOut: 8000
                });
              } else if (r2.status === 500) {
                toastr.error('No parece haber comunicación con la Base de datos',
    '',
    {
                  timeOut: 8000
                });
              }
            } else if (r2.data) {
              if (r2.data === 'user_inactivo') {
                toastr.warning('Usuario desactivado');
              }
              if (r2.data.error) {
                if (r2.data.error === 'Token expirado' || r2.error === 'token_expired') {
                  toastr.warning('La sesión ha expirado');
                  if ($state.current.name !== 'login') {
                    $state.go('login');
                  }
                } else {
                  $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                }
              }
            } else {
              toastr.error('No parece haber comunicación con el servidor');
            }
          } else {
            toastr.error('No parece haber comunicación con el servidor');
          }
          return d.reject('Error en login');
        });
        return d.promise;
      };
      authService.login_from_token = function() {
        var d,
    login;
        d = $q.defer();
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $cookies.get('xtoken');
        login = $http.post('::login').then(function(r) {
          var usuario;
          usuario = r.data;
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          return d.resolve(usuario);
        },
    function(r2) {
          if (r2.data) {
            if (r2.data.message === "user_inactivo") {
              toastr.warning('Usuario desactivado');
            }
          }
          return d.reject('Error en login con token.');
        });
        //$rootScope.$broadcast AUTH_EVENTS.loginFailed
        return d.promise;
      };
      authService.logout = function() {
        var login;
        login = $http.put('::login/logout',
    {
          user_id: Perfil.User().user_id
        }).then(function(r) {
          return console.log('Sesión cerrada');
        },
    function(r2) {
          return console.log('No se registró el cierre de sesión.');
        });
        $rootScope.lastState = null;
        $rootScope.lastStateParam = null;
        Perfil.deleteUser();
        authService.borrarToken();
        delete localStorage.logueando;
        return $state.transitionTo('login');
      };
      authService.borrarToken = function() {
        $cookies.remove('xtoken');
        return delete $http.defaults.headers.common['Authorization'];
      };
      authService.isAuthenticated = function() {
        return !!Perfil.User().user_id;
      };
      authService.isAuthorized = function(neededPermissions,
    neededRoles) {
        var newArr,
    user;
        user = Perfil.User();
        if (user.is_superuser) {
          return true;
        }
        newArr = [];
        if (neededPermissions) {
          if (!angular.isArray(neededPermissions)) {
            neededPermissions = [neededPermissions];
          }
          if (!angular.isArray(user.perms)) {
            if (neededPermissions.length > 0) {
              return false;
            } else {
              return true;
            }
          }
          angular.forEach(neededPermissions,
    function(elem) {
            if ((user.perms.indexOf(elem)) !== -1) {
              return newArr.push(elem);
            }
          });
        }
        if (neededRoles) {
          if (!angular.isArray(neededRoles)) {
            neededRoles = [neededRoles];
          }
          if (!angular.isArray(user.roles)) {
            if (neededRoles.length > 0) {
              return false;
            } else {
              return true;
            }
          }
          angular.forEach(neededRoles,
    function(elem) {
            var i,
    len,
    ref,
    results,
    rol;
            ref = user.roles;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              rol = ref[i];
              if (rol.name.toLocaleLowerCase() === elem.toLocaleLowerCase()) {
                results.push(newArr.push(elem));
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        }
        return authService.isAuthenticated() && (newArr.length > 0);
      };
      authService.hasRoleOrPerm = function(ReqRoles,
    RedPermis) {
        var rolesFound;
        if (!angular.isArray(ReqRoles)) {
          if (ReqRoles) {
            ReqRoles = [ReqRoles];
          } else {
            return false;
          }
        }
        rolesFound = [];
        angular.forEach(ReqRoles,
    function(elem) {
          var rolesFoundTemp;
          rolesFoundTemp = [];
          rolesFoundTemp = $filter('filter')(Perfil.User().roles,
    {
            name: elem
          });
          if (rolesFoundTemp) {
            if (rolesFoundTemp.length > 0) {
              return rolesFound.push(elem);
            }
          }
        });
        return rolesFound.length > 0;
      };
      return authService;
    }
  ]);

}).call(this);

//# sourceMappingURL=AuthService.js.map
