(function() {
  angular.module("myvcFrontApp").controller('BoletinesPeriodoCtrl', [
    '$scope',
    'alumnosDat',
    'escalas',
    '$uibModal',
    '$cookies',
    '$state',
    'AuthService',
    function($scope,
    alumnos,
    escalas,
    $modal,
    $cookies,
    $state,
    AuthService) {
      var alumno,
    area,
    cant,
    i,
    j,
    len,
    len1,
    ref,
    ref1;
      $scope.grupo = alumnos[0];
      $scope.year = alumnos[1];
      $scope.alumnos = alumnos[2];
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.escalas = escalas;
      // Para evitar que no calcule bien
      if ($state.is('panel.boletin_acudiente')) {
        if (parseInt($state.params.periodo_a_calcular) !== $scope.USER.numero_periodo) {
          $state.go('panel.boletin_acudiente',
    {
            periodo_a_calcular: $scope.USER.numero_periodo
          },
    {
            reload: true
          });
        }
        // Evitar el click derecho
        $('body').on('contextmenu',
    (ev) => {
          return event.preventDefault();
        });
      }
      if ($scope.year.mostrar_puesto_boletin && $scope.USER.tipo !== 'Acudiente' && $scope.USER.tipo !== 'Alumno') {
        ref = $scope.alumnos;
        for (i = 0, len = ref.length; i < len; i++) {
          alumno = ref[i];
          alumno.texto_puesto = ' - Puesto: ' + alumno.puesto + '/' + $scope.grupo.cantidad_alumnos;
        }
      }
      $scope.config = $cookies.getObject('config');
      $scope.requested_alumnos = $cookies.getObject('requested_alumnos');
      $scope.requested_alumno = $cookies.getObject('requested_alumno');
      if ($scope.config === void 0) {
        $scope.config = {
          mostrar_foto: true
        };
      } else {
        if ($scope.config.mostrar_foto === void 0) {
          $scope.config.mostrar_foto = true;
        }
      }
      // Cuadro el ancho que van a tener los gráficos de los boletines
      if ($scope.alumnos[0].asignaturas) {
        if ($scope.alumnos[0].asignaturas.length < 14) {
          $scope.ancho_chart = 50 * $scope.alumnos[0].asignaturas.length;
        } else {
          $scope.ancho_chart = 40 * $scope.alumnos[0].asignaturas.length;
        }
      } else {
        cant = 0;
        ref1 = $scope.alumnos[0].areas;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          area = ref1[j];
          cant = cant + area.cant;
        }
        if (cant < 14) {
          $scope.ancho_chart = 50 * cant;
        } else {
          $scope.ancho_chart = 40 * cant;
        }
      }
      //$scope.ancho_chart = 50 * $scope.alumnos[0].asignaturas.length
      if ($scope.ancho_chart > 800) {
        $scope.ancho_chart = 800;
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

//BoletinesPeriodoCtrl.js.map
