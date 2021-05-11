(function() {
  angular.module("myvcFrontApp").controller('RemoveImageCtrl', [
    '$scope',
    '$uibModalInstance',
    'imagen',
    'user_id',
    'datos_imagen',
    'App',
    '$http',
    'AuthService',
    'toastr',
    function($scope,
    $modalInstance,
    imagen,
    user_id,
    datos_imagen,
    App,
    $http,
    AuthService,
    toastr) {
      $scope.imagesPath = App.images + 'perfil/';
      $scope.imagen = imagen;
      $scope.datos_imagen = datos_imagen;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.ok = function() {
        $http.delete('::myimages/destroy/' + imagen.id).then(function(r) {
          return console.log('Proceso de eliminado exitoso');
        },
    function(r2) {
          return toastr.error('No se pudo eliminar la imagen.');
        });
        return $modalInstance.close(imagen);
      };
      $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//RemoveImageCtrl.js.map
