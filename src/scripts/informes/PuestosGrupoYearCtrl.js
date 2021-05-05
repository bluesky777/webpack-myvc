(function() {
  angular.module("myvcFrontApp").controller('PuestosGrupoYearCtrl', [
    '$scope',
    'datos_puestos',
    'escalas',
    '$cookies',
    '$state',
    function($scope,
    datos_puestos,
    escalas,
    $cookies,
    $state) {
      var alumno,
    asig,
    i,
    j,
    len,
    len1,
    nota_faltante,
    ref,
    ref1;
      datos_puestos = datos_puestos.data;
      $scope.fechahora = new Date();
      $scope.grupo = datos_puestos.grupo;
      $scope.year = datos_puestos.year;
      $scope.alumnos = datos_puestos.alumnos;
      if (parseInt($state.params.periodo_a_calcular) === 3) {
        ref = $scope.alumnos;
        for (i = 0, len = ref.length; i < len; i++) {
          alumno = ref[i];
          ref1 = alumno.notas_asig;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            asig = ref1[j];
            nota_faltante = $scope.USER.nota_minima_aceptada * 4 - asig.nota_final_year * 3;
            asig.nota_faltante = nota_faltante <= 0 ? '' : nota_faltante;
          }
        }
      }
      $scope.escalas = escalas;
      $scope.config = $cookies.getObject('config');
      //$scope.config.orientacion = $scope.orientacion
      //$scope.config.mostrar_foto = $scope.mostrar_foto
      $scope.$on('change_config',
    function() {
        return $scope.config = $cookies.getObject('config');
      });
      //###################################################################
      //########    Edición de notas de materia      ######################
      //###################################################################
      $scope.alumnos_materias = [];
      return $scope.add_alum_materia = function(asig,
    alum) {
        return $scope.alumnos_materias.push({
          asignatura: asig,
          alumno: alum
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=PuestosGrupoYearCtrl.js.map
