(function() {
  angular.module('myvcFrontApp').controller('VerObservadorCompletoCtrl', [
    '$scope',
    'toastr',
    'grupo',
    'App',
    'Perfil',
    function($scope,
    toastr,
    grupo,
    App,
    Perfil) {
      var i,
    imagen,
    img,
    j,
    len,
    len1,
    ref,
    ref1;
      $scope.grupo = grupo.data.grupo;
      $scope.imagenes = grupo.data.imagenes;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.observ = {
        encabezado_margin_top: 150,
        encabezado_margin_left: 200
      };
      if (localStorage.imagen_fondo) {
        $scope.observ.imagen = JSON.parse(localStorage.imagen_fondo);
        ref = $scope.imagenes;
        for (i = 0, len = ref.length; i < len; i++) {
          imagen = ref[i];
          if (imagen === $scope.observ.imagen) {
            $scope.observ.imagen = imagen;
          }
        }
      } else {
        ref1 = $scope.imagenes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          img = ref1[j];
          if (img.nombre.includes('fondo-observador.png')) {
            $scope.observ.imagen = img;
          }
        }
      }
      $scope.imagenSelect = function($item) {
        return localStorage.imagen_fondo = JSON.stringify($item);
      };
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Observador del alumno ');
    }
  ]);

}).call(this);

//# sourceMappingURL=VerObservadorCompletoCtrl.js.map
