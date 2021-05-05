(function() {
  angular.module('myvcFrontApp').filter('materiasPerdidasYear', [
    function() {
      return function(alumnos,
    cant,
    nota_minima_aceptada) {
        if (cant) {
          this.alumnos_response = [];
          angular.forEach(alumnos,
    function(alumno,
    key) {
            this.cant_asig_perdidas = 0;
            angular.forEach(alumno.notas_asig,
    function(asignatura,
    key) {
              if (Math.round(asignatura.nota_final_year) < nota_minima_aceptada) {
                return this.cant_asig_perdidas++;
              }
            });
            if (this.cant_asig_perdidas >= cant) {
              return this.alumnos_response.push(alumno);
            }
          });
          return alumnos_response;
        } else {
          return alumnos;
        }
      };
    }
  ]).filter('materiasPerdidas', [
    function() {
      return function(alumnos,
    cant,
    nota_minima_aceptada) {
        if (cant) {
          this.alumnos_response = [];
          angular.forEach(alumnos,
    function(alumno,
    key) {
            this.cant_asig_perdidas = 0;
            angular.forEach(alumno.asignaturas,
    function(asignatura,
    key) {
              if (Math.round(asignatura.nota_asignatura) < nota_minima_aceptada) {
                return this.cant_asig_perdidas++;
              }
            });
            if (this.cant_asig_perdidas >= cant) {
              return this.alumnos_response.push(alumno);
            }
          });
          return alumnos_response;
        } else {
          return alumnos;
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=materiasPerdidas.js.map
