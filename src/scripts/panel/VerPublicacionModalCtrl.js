(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VerPublicacionModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'publicacion_actual',
    'USER',
    '$http',
    'toastr',
    '$filter',
    '$timeout',
    function($scope,
    App,
    $modalInstance,
    publicacion_actual,
    USER,
    $http,
    toastr,
    $filter,
    $timeout) {
      $scope.publicacion_actual = publicacion_actual;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.USER = USER;
      $scope.new_comentario = '';
      $scope.guardando_coment = false;
      $scope.abrirImagenBlank = function(ruta) {
        return window.open(ruta,
    '_blank');
      };
      $scope.eliminarComentario = function(comentario) {
        var respu;
        respu = confirm('¿Seguro que desea eliminar comentario: ' + comentario.comentario + '?');
        if (respu) {
          comentario.eliminado = true;
          return $http.put('::publicaciones/borrar-comentario',
    {
            comentario_id: comentario.id
          }).then(function(r) {
            toastr.success('Eliminado.');
            $scope.publicacion_actual.comentarios = $filter('filter')($scope.publicacion_actual.comentarios,
    {
              id: '!' + comentario.id
            },
    true);
            return $timeout(function() {
              return $scope.$apply();
            });
          },
    function(r2) {
            toastr.error('Error al eliminar',
    'Problema');
            return {};
          });
        }
      };
      $scope.agregarComentario = function(comentario) {
        var datos;
        if ($scope.new_comentario.length === 0) {
          return;
        }
        $scope.guardando_coment = true;
        datos = {
          publi_id: $scope.publicacion_actual.id,
          comentario: comentario
        };
        return $http.put('::publicaciones/comentar',
    datos).then(function(r) {
          var new_coment;
          $scope.new_comentario = '';
          new_coment = {
            id: r.data.comentario_id,
            publicacion_id: $scope.publicacion_actual.id,
            comentario: comentario,
            nombre_autor: $scope.USER.nombres ? $scope.USER.nombres + ' ' + $scope.USER.apellidos : $scope.USER.username,
            foto_autor: $scope.USER.foto_nombre
          };
          $scope.publicacion_actual.comentarios.push(new_coment);
          return $scope.guardando_coment = false;
        },
    function(r2) {
          toastr.error('Error al eliminar',
    'Problema');
          return $scope.guardando_coment = false;
        });
      };
      $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
      return $scope.ok = function() {
        return $modalInstance.close(publicacion_actual);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=VerPublicacionModalCtrl.js.map
