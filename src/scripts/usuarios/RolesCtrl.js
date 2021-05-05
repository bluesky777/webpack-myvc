(function() {
  angular.module('myvcFrontApp').controller('RolesCtrl', [
    '$scope',
    '$http',
    '$state',
    '$rootScope',
    'AuthService',
    'toastr',
    'App',
    '$filter',
    function($scope,
    $http,
    $state,
    $rootScope,
    AuthService,
    toastr,
    App,
    $filter) {
      AuthService.verificar_acceso();
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.dato = {};
      $scope.roles = [];
      $scope.permissions = [];
      $http.get('::roles').then(function(r) {
        return $scope.roles = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los roles ',
    r2);
      });
      $http.get('::permissions').then(function(r) {
        return $scope.permissions = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer los permissions ',
    r2);
      });
      $scope.expand = function(rol) {
        return rol.mostrandoPermisos = true;
      };
      $scope.collapse = function(rol) {
        return rol.mostrandoPermisos = false;
      };
      $scope.addPermissions = function(rol) {
        return $http.put('::roles/addpermission/' + rol.id,
    {
          permission_id: rol.newperm.id
        }).then(function(r) {
          rol.perms.push(r.data);
          return toastr.success('Permiso agregado al rol ' + rol.display_name);
        },
    function(r2) {
          return toastr.error('No se pudo agregar el permiso',
    'Problema');
        });
      };
      return $scope.removePermission = function(rol,
    perm) {
        return $http.put('::roles/removepermission/' + rol.id,
    {
          permission_id: perm.id
        }).then(function(r) {
          rol.perms = $filter('filter')(rol.perms,
    {
            id: '!' + perm.id
          });
          return toastr.success('Permiso eliminado del rol ' + rol.display_name);
        },
    function(r2) {
          return toastr.error('No se pudo quitar el permiso',
    'Problema');
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=RolesCtrl.js.map
