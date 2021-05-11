(function() {
  angular.module("myvcFrontApp").controller('PuestosGrupoPeriodoCtrl', [
    '$scope',
    '$state',
    'alumnosDat',
    'escalas',
    '$cookies',
    function($scope,
    $state,
    alumnosDat,
    escalas,
    $cookies) {
      alumnosDat = alumnosDat.data;
      $scope.fechahora = new Date();
      $scope.grupo = alumnosDat.grupo;
      $scope.year = alumnosDat.year;
      $scope.alumnos = alumnosDat.alumnos;
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
  ]).controller('PuestosTodosPeriodoCtrl', [
    '$scope',
    '$state',
    'escalas',
    '$http',
    'toastr',
    '$cookies',
    function($scope,
    $state,
    escalas,
    $http,
    toastr,
    $cookies) {
      $scope.fechahora = new Date();
      $scope.escalas = escalas;
      $scope.grupos_puestos_temp = JSON.parse(localStorage.grupos_puestos);
      $scope.grupos_puestos = [];
      angular.forEach($scope.grupos_puestos_temp,
    function(grupo,
    key) {
        return $http.put('::puestos/detailed-notas-periodo/' + grupo.id).then(function(r) {
          grupo.year = r.data.year;
          grupo.alumnos = r.data.alumnos;
          grupo.grupo = r.data.grupo;
          return $scope.grupos_puestos.push(grupo);
        },
    function() {
          return toastr.error('No se trajo grupo ' + grupo.nombre);
        });
      });
      $scope.config = $cookies.getObject('config');
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
  ]).controller('PuestosTodosYearCtrl', [
    '$scope',
    '$state',
    'escalas',
    '$http',
    'toastr',
    '$stateParams',
    '$cookies',
    function($scope,
    $state,
    escalas,
    $http,
    toastr,
    $stateParams,
    $cookies) {
      $scope.fechahora = new Date();
      $scope.escalas = escalas;
      $scope.grupos_puestos_temp = JSON.parse(localStorage.grupos_puestos);
      $scope.grupos_puestos = [];
      angular.forEach($scope.grupos_puestos_temp,
    function(grupo,
    key) {
        return $http.put('::puestos/detailed-notas-year',
    {
          grupo_id: grupo.id,
          periodo_a_calcular: $stateParams.periodo_a_calcular
        }).then(function(r) {
          var alumno,
    asig,
    i,
    j,
    len,
    len1,
    nota_faltante,
    ref,
    ref1;
          grupo.year = r.data.year;
          grupo.alumnos = r.data.alumnos;
          grupo.grupo = r.data.grupo;
          if (parseInt($state.params.periodo_a_calcular) === 3) {
            ref = grupo.alumnos;
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
          return $scope.grupos_puestos.push(grupo);
        },
    function() {
          return toastr.error('No se trajo grupo ' + grupo.nombre);
        });
      });
      $scope.config = $cookies.getObject('config');
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

//PuestosGrupoPeriodoCtrl.js.map
