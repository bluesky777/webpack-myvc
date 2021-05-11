(function() {
  angular.module("myvcFrontApp").filter('promGrupoYear', [
    function() {
      return function(alumnos) {
        var alumno,
    i,
    len,
    prom,
    promedio;
        promedio = 0;
        for (i = 0, len = alumnos.length; i < len; i++) {
          alumno = alumnos[i];
          promedio = promedio + alumno.promedio_year;
        }
        prom = Math.round(promedio / alumnos.length);
        return prom;
      };
    }
  ]).filter('promAsigYear', [
    '$filter',
    function($filter) {
      return function(alumnos,
    asignatura_id) {
        var alumno,
    cant,
    i,
    j,
    len,
    len1,
    notas_asig,
    promedio,
    promedioAsig,
    ref;
        promedioAsig = 0;
        cant = 0;
        for (i = 0, len = alumnos.length; i < len; i++) {
          alumno = alumnos[i];
          ref = alumno.notas_asig;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            notas_asig = ref[j];
            if (notas_asig.asignatura_id === asignatura_id) {
              cant++;
              promedioAsig = promedioAsig + parseFloat(notas_asig.nota_final_year);
            }
          }
        }
        promedio = Math.round(promedioAsig / cant);
        return promedio;
      };
    }
  ]).filter('notasAsignaturaYear', [
    '$filter',
    function($filter) {
      return function(periodos) {
        var cantPerd,
    echo,
    i,
    len,
    periodo;
        cantPerd = 0;
        echo = '';
        for (i = 0, len = periodos.length; i < len; i++) {
          periodo = periodos[i];
          echo = echo + $filter('notasAsignatura')(periodo.unidades,
    periodo.numero);
        }
        return echo;
      };
    }
  ]).filter('notasPerdidasAsignaturaYear', [
    '$filter',
    function($filter) {
      return function(periodos,
    cantidad) {
        var cantPerd,
    echo,
    i,
    len,
    periodo;
        cantPerd = 0;
        echo = '';
        for (i = 0, len = periodos.length; i < len; i++) {
          periodo = periodos[i];
          if (cantidad) {
            cantPerd = cantPerd + $filter('notasPerdidasAsignatura')(periodo.unidades,
    cantidad,
    periodo.numero);
          } else {
            echo = echo + $filter('notasPerdidasAsignatura')(periodo.unidades,
    false,
    periodo.numero);
          }
        }
        if (cantidad) {
          return cantPerd;
        } else {
          return echo;
        }
      };
    }
  ]).filter('notasPerdidasAsignaturasYear', [
    '$filter',
    function($filter) {
      return function(asignaturas) {
        this.cantidad_perdidas = 0;
        angular.forEach(asignaturas,
    function(asignatura) {
          return this.cantidad_perdidas = this.cantidad_perdidas + $filter('notasPerdidasAsignaturaYear')(asignatura.periodos,
    true);
        });
        return this.cantidad_perdidas;
      };
    }
  ]).filter('notasPerdidasGrupoYear', [
    '$filter',
    function($filter) {
      return function(alumnos) {
        var alumno,
    cant,
    i,
    len;
        cant = 0;
        for (i = 0, len = alumnos.length; i < len; i++) {
          alumno = alumnos[i];
          cant = cant + alumno.perdidos_year;
        }
        return cant;
      };
    }
  ]);

}).call(this);

//PuestoAlumnoYearFilter.js.map
