(function() {
  angular.module('myvcFrontApp').controller('PlanillasCtrl', [
    '$scope',
    'App',
    'Perfil',
    'asignaturas',
    '$state',
    function($scope,
    App,
    Perfil,
    asignaturas,
    $state) {
      var asig,
    asign,
    i,
    len,
    ref;
      asignaturas = asignaturas.data;
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.year = asignaturas[0];
      $scope.asignaturas = asignaturas[1];
      $scope.perfilPath = App.images + 'perfil/';
      $scope.unidadesdefault = ["  ",
    "  ",
    "  ",
    "  ",
    "  "];
      $scope.subunidadesdefault = ["  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  ",
    "  "];
      $scope.onChangeTitulos = function(titulos) {
        $scope.titulos_planillas = titulos.split(';');
        return localStorage.titulos_planillas = titulos;
      };
      if (localStorage.titulos_planillas) {
        $scope.titulos_planillas = localStorage.titulos_planillas.split(';');
        $scope.titulos_planillas_string = localStorage.titulos_planillas;
      } else {
        localStorage.titulos_planillas = '';
      }
      ref = $scope.asignaturas;
      for (i = 0, len = ref.length; i < len; i++) {
        asign = ref[i];
        asign.alumnos_temp = asign.alumnos;
        if (asign.alumnos_temp.length < 34) {
          asign.alumnos1 = asign.alumnos_temp;
        } else if (asign.alumnos_temp.length < 38) {
          asign.alumnos1 = asign.alumnos_temp.splice(0,
    27);
          asign.alumnos2 = asign.alumnos_temp.splice(0,
    20);
        } else if (asign.alumnos_temp.length < 65) {
          asign.alumnos1 = asign.alumnos_temp.splice(0,
    33);
          asign.alumnos2 = asign.alumnos_temp.splice(0,
    32);
        }
      }
      if ($state.params.profesor_id) {
        asig = $scope.asignaturas[0];
        return $scope.$emit('cambia_descripcion',
    $scope.asignaturas.length + ' planillas  del profesor ' + asig.nombres_profesor + ' ' + asig.apellidos_profesor);
      } else if ($state.params.grupo_id) {
        asig = $scope.asignaturas[0];
        return $scope.$emit('cambia_descripcion',
    $scope.asignaturas.length + ' planillas  del grupo ' + asig.nombre_grupo);
      }
    }
  ]).controller('ControlTardanzaEntradaCtrl', [
    '$scope',
    'App',
    'Perfil',
    '$state',
    'grupos',
    function($scope,
    App,
    Perfil,
    $state,
    grupos) {
      var alumno,
    cont,
    grupo,
    i,
    j,
    len,
    len1,
    r,
    ref,
    ref1;
      $scope.USER = Perfil.User();
      r = grupos.data[0];
      $scope.year = r;
      $scope.grupos = r.grupos;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.numberColumExt = 21;
      $scope.numberColumInt = 4;
      $scope.getNumber = function(num) {
        return new Array(num);
      };
      ref = $scope.grupos;
      for (i = 0, len = ref.length; i < len; i++) {
        grupo = ref[i];
        cont = 0;
        ref1 = grupo.alumnos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          alumno = ref1[j];
          cont++;
          if (cont === 3) {
            alumno.gris = true;
            cont = 0;
          } else {
            alumno.gris = false;
          }
        }
      }
      $scope.$emit('cambia_descripcion',
    'Planillas para el control de tardanzas en la entrada.');
      $scope.dato = {};
      return $scope.mesSeleccionado = function() {
        if ($scope.mesMostrar === '-1') {
          return $scope.numberColumExt = 21;
        } else {
          $scope.dato.mes = '' + $scope.mesMostrar;
          $scope.dias = $scope.getAllDaysInMonth($scope.dato.mes);
          return $scope.numberColumExt = $scope.dias.length;
        }
      };
    }
  ]).controller('ControlAsistenciaClaseCtrl', [
    '$scope',
    'App',
    'Perfil',
    '$state',
    'grupos',
    function($scope,
    App,
    Perfil,
    $state,
    grupos) {
      var alumno,
    cont,
    grupo,
    i,
    j,
    len,
    len1,
    r,
    ref,
    ref1;
      $scope.USER = Perfil.User();
      r = grupos.data[0];
      $scope.year = r;
      $scope.grupos = r.grupos;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.getNumber = function(num) {
        return new Array(num);
      };
      ref = $scope.grupos;
      for (i = 0, len = ref.length; i < len; i++) {
        grupo = ref[i];
        cont = 0;
        ref1 = grupo.alumnos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          alumno = ref1[j];
          cont++;
          if (cont === 3) {
            alumno.gris = true;
            cont = 0;
          } else {
            alumno.gris = false;
          }
        }
      }
      $scope.$emit('cambia_descripcion',
    'Planillas para de asistencia a clase.');
      $scope.dato = {};
      $scope.mesSeleccionado = function() {
        if ($scope.mesMostrar === '-1') {
          return $scope.numberColumExt = 21;
        } else {
          $scope.dato.mes = '' + $scope.mesMostrar;
          $scope.dias = $scope.getAllDaysInMonth($scope.dato.mes);
          return $scope.numberColumExt = $scope.dias.length;
        }
      };
      r = new Date();
      $scope.mesMostrar = r.getMonth();
      return $scope.mesSeleccionado();
    }
  ]);

}).call(this);

//# sourceMappingURL=PlanillasCtrl.js.map
