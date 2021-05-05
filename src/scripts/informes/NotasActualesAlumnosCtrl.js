(function() {
  angular.module('myvcFrontApp').controller('NotasActualesAlumnosCtrl', [
    '$scope',
    'App',
    'Perfil',
    'alumnosDat',
    'escalas',
    '$cookies',
    function($scope,
    App,
    Perfil,
    alumnosDat,
    escalas,
    $cookies) {
      var alumno,
    asignatura,
    i,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    len4,
    m,
    periodo,
    ref,
    ref1,
    ref2,
    ref3,
    ref4,
    subunidad,
    unidad;
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.grupo = alumnosDat[0];
      $scope.year = alumnosDat[1];
      $scope.alumnos = alumnosDat[2];
      $scope.escalas = escalas;
      $scope.config = $cookies.getObject('config');
      $scope.requested_alumnos = $cookies.getObject('requested_alumnos');
      $scope.requested_alumno = $cookies.getObject('requested_alumno');
      ref = $scope.alumnos;
      for (i = 0, len = ref.length; i < len; i++) {
        alumno = ref[i];
        alumno.cant_perdidas = 0;
        ref1 = alumno.periodos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          periodo = ref1[j];
          periodo.cant_perdidas = 0;
          ref2 = periodo.asignaturas;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            asignatura = ref2[k];
            asignatura.cant_perdidas = 0;
            ref3 = asignatura.unidades;
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              unidad = ref3[l];
              unidad.cant_perdidas = 0;
              ref4 = unidad.subunidades;
              for (m = 0, len4 = ref4.length; m < len4; m++) {
                subunidad = ref4[m];
                if (subunidad.nota < $scope.USER.nota_minima_aceptada) {
                  unidad.cant_perdidas += 1;
                  asignatura.cant_perdidas += 1;
                  periodo.cant_perdidas += 1;
                  alumno.cant_perdidas += 1;
                }
              }
            }
          }
        }
      }
      $scope.$on('change_config',
    function() {
        return $scope.config = $cookies.getObject('config');
      });
      if ($scope.requested_alumnos) {
        return $scope.$emit('cambia_descripcion',
    'Mostrando ' + $scope.alumnos.length + ' boletines de ' + $scope.grupo.cantidad_alumnos + ' del grupo ' + $scope.grupo.nombre_grupo);
      } else if ($scope.requested_alumno) {
        return $scope.$emit('cambia_descripcion',
    'Mostrando un boletin de ' + $scope.grupo.cantidad_alumnos + ' del grupo ' + $scope.grupo.nombre_grupo);
      } else {
        return $scope.$emit('cambia_descripcion',
    $scope.alumnos.length + ' boletines del grupo ' + $scope.grupo.nombre_grupo);
      }
    }
  ]);

}).call(this);

//# sourceMappingURL=NotasActualesAlumnosCtrl.js.map
