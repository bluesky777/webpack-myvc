(function() {
  angular.module('myvcFrontApp').controller('ListadoProfesoresCtrl', [
    '$scope',
    'App',
    'Perfil',
    'profesores',
    '$state',
    function($scope,
    App,
    Perfil,
    profesores,
    $state) {
      $scope.USER = Perfil.User();
      $scope.profesores = profesores.data.profesores;
      $scope.year = profesores.data.year;
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    $scope.profesores.length + '  profesores.');
    }
  ]).controller('VerCantAlumnosPorGruposCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos',
    '$state',
    function($scope,
    App,
    Perfil,
    grupos,
    $state) {
      var grup,
    i,
    len,
    ref;
      $scope.USER = Perfil.User();
      $scope.grupos_cantidades = grupos.data.grupos;
      $scope.periodos_total = grupos.data.periodos_total;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.cant_total_alumnos = 0;
      $scope.cant_total_hombres = 0;
      $scope.cant_total_mujeres = 0;
      ref = $scope.grupos_cantidades;
      for (i = 0, len = ref.length; i < len; i++) {
        grup = ref[i];
        $scope.cant_total_alumnos = $scope.cant_total_alumnos + grup.cant_alumnos;
        $scope.cant_total_hombres = $scope.cant_total_hombres + grup.cant_hombres;
        $scope.cant_total_mujeres = $scope.cant_total_mujeres + grup.cant_mujeres;
      }
      return $scope.$emit('cambia_descripcion',
    $scope.grupos_cantidades.length + '  grupos.');
    }
  ]);

}).call(this);

//# sourceMappingURL=VariosCtrl.js.map
