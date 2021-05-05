(function() {
  angular.module("myvcFrontApp").controller('BoletinesFinalesCtrl', [
    '$scope',
    'alumnosDat',
    'escalas',
    '$cookies',
    '$state',
    function($scope,
    alumnos,
    escalas,
    $cookies,
    $state) {
      $scope.grupo = alumnos[0];
      $scope.year = alumnos[1];
      $scope.alumnos = alumnos[2];
      $scope.escalas_val = alumnos[3];
      $scope.$state = $state;
      $scope.escalas = escalas;
      $scope.config = $cookies.getObject('config');
      $scope.requested_alumnos = $cookies.getObject('requested_alumnos');
      $scope.requested_alumno = $cookies.getObject('requested_alumno');
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
  ]).controller('BoletinesFinalesPreescolarCtrl', [
    '$scope',
    'alumnosDat',
    '$cookies',
    '$http',
    'toastr',
    function($scope,
    alumnos,
    $cookies,
    $http,
    toastr) {
      $scope.grupo = alumnos[0];
      $scope.year = alumnos[1];
      $scope.alumnos = alumnos[2];
      $scope.config = $cookies.getObject('config');
      $scope.requested_alumnos = $cookies.getObject('requested_alumnos');
      $scope.requested_alumno = $cookies.getObject('requested_alumno');
      $scope.guardar_frase = function(frase,
    asignatura) {
        console.log(frase);
        return $http.put('::bolfinales-preescolar/guardar-frase',
    {
          definicion: frase,
          asignatura_id: asignatura.asignatura_id,
          id: asignatura.frases[0].id
        }).then(function(r) {
          var alumn,
    asig,
    i,
    len,
    ref,
    results;
          toastr.success('Frase guardada');
          asignatura.frases[0].definicion = frase.definicion;
          ref = $scope.alumnos;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            alumn = ref[i];
            results.push((function() {
              var j,
    len1,
    ref1,
    results1;
              ref1 = alumn.asignaturas;
              results1 = [];
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                asig = ref1[j];
                if (asig.asignatura_id === asignatura.asignatura_id) {
                  results1.push(asig.frases[0] = frase.definicion);
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            })());
          }
          return results;
        },
    function() {
          return toastr.error('No se pudo crear frase');
        });
      };
      $scope.crear_frase = function(asignatura) {
        console.log(asignatura);
        return $http.put('::bolfinales-preescolar/crear-frase',
    {
          asignatura_id: asignatura.asignatura_id
        }).then(function(r) {
          var alumn,
    asig,
    i,
    len,
    ref,
    results;
          toastr.success('Frase creada');
          asignatura.frases.push(r.data);
          ref = $scope.alumnos;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            alumn = ref[i];
            results.push((function() {
              var j,
    len1,
    ref1,
    results1;
              ref1 = alumn.asignaturas;
              results1 = [];
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                asig = ref1[j];
                if (asig.asignatura_id === asignatura.asignatura_id) {
                  results1.push(asig.frases.push(r.data));
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            })());
          }
          return results;
        },
    function() {
          return toastr.error('No se pudo crear frase');
        });
      };
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

//# sourceMappingURL=BoletinesFinalesCtrl.js.map
