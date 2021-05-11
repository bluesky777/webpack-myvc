(function() {
  angular.module("myvcFrontApp").filter('puestoAlumno', [
    function() {
      return function(alumno,
    alumnos) {
        var puesto;
        puesto = 0;
        angular.forEach(alumnos,
    function(alum) {
          if (alumno.promedio < alum.promedio) {
            return puesto = puesto + 1;
          }
        });
        return puesto;
      };
    }
  ]).filter('notasAsignatura', [
    function() {
      return function(unidades,
    num_periodo) {
        var echo;
        echo = '';
        angular.forEach(unidades,
    function(unidad) {
          echo = echo + '<div class="ellipsis350"><b>Per' + num_periodo + ': ' + unidad.definicion_unidad + '</b></div>';
          return angular.forEach(unidad.subunidades,
    function(subunidad,
    key) {
            if (subunidad.nota) {
              return echo = echo + (key + 1) + '. ' + subunidad.definicion_subunidad + '<b> => ' + subunidad.nota.nota + '</b><br>';
            }
          });
        });
        return echo;
      };
    }
  ]).filter('notasPerdidasAsignaturas', [
    '$filter',
    function($filter) {
      return function(asignaturas) {
        this.cantidad_perdidas = 0;
        angular.forEach(asignaturas,
    function(asignatura) {
          return this.cantidad_perdidas = this.cantidad_perdidas + $filter('notasPerdidasAsignatura')(asignatura.unidades,
    true);
        });
        return this.cantidad_perdidas;
      };
    }
  ]).filter('notasPerdidasAsignatura', [
    'Perfil',
    function(Perfil) {
      return function(unidades,
    cantidad,
    num_periodo) {
        var echo;
        this.unidades_response = [];
        this.cantidad_perdidas = 0;
        angular.forEach(unidades,
    function(unidad) {
          var newUni;
          this.subunis = [];
          angular.forEach(unidad.subunidades,
    function(subunidad) {
            if (subunidad.nota) {
              if (subunidad.nota.nota || subunidad.nota.nota === 0) {
                if (subunidad.nota.nota < Perfil.User().nota_minima_aceptada) {
                  return this.subunis.push(subunidad);
                }
              } else {
                if (subunidad.nota < Perfil.User().nota_minima_aceptada) {
                  return this.subunis.push(subunidad);
                }
              }
            }
          },
    this);
          this.cantidad_perdidas = this.cantidad_perdidas + this.subunis.length;
          if (this.subunis.length > 0) {
            newUni = {
              unidad_id: unidad.unidad_id,
              definicion_unidad: unidad.definicion_unidad,
              valor_unidad: unidad.valor_unidad,
              orden_unidad: unidad.orden_unidad,
              nota_unidad: unidad.nota_unidad,
              subunidades: this.subunis
            };
            return this.unidades_response.push(newUni);
          }
        },
    this);
        if (cantidad) {
          return this.cantidad_perdidas;
        }
        echo = '';
        angular.forEach(unidades_response,
    function(unidad) {
          echo = echo + '<div class="ellipsis350"><b>Per' + num_periodo + ': ' + unidad.definicion_unidad + '</b></div>';
          return angular.forEach(unidad.subunidades,
    function(subunidad,
    key) {
            return echo = echo + '<span class="ellipsis250">' + (key + 1) + '. ' + subunidad.definicion_subunidad + ' </span><b> => ' + subunidad.nota.nota + '</b><br>';
          });
        });
        return echo;
      };
    }
  ]).filter('notasPerdidasAsignaturaPeriodo', [
    '$filter',
    function($filter) {
      return function(asignaturas,
    cantidad) {
        var asignatura,
    i,
    len,
    total,
    uniPerdidas;
        total = 0;
        for (i = 0, len = asignaturas.length; i < len; i++) {
          asignatura = asignaturas[i];
          uniPerdidas = $filter('notasPerdidasAsignatura')(asignatura.unidades,
    true);
          total = total + uniPerdidas;
        }
        return total;
      };
    }
  ]).filter('promAsig', [
    '$filter',
    function($filter) {
      return function(alumnos,
    asignatura_id) {
        var alumno,
    asignatura,
    cant,
    i,
    j,
    len,
    len1,
    promedioAsig,
    ref;
        promedioAsig = 0;
        cant = 0;
        for (i = 0, len = alumnos.length; i < len; i++) {
          alumno = alumnos[i];
          ref = alumno.asignaturas;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            asignatura = ref[j];
            if (asignatura.asignatura_id === asignatura_id) {
              cant++;
              promedioAsig = promedioAsig + asignatura.nota_asignatura;
            }
          }
        }
        return promedioAsig / cant;
      };
    }
  ]).filter('promGrupoPer', [
    '$filter',
    function($filter) {
      return function(alumnos) {
        var alumno,
    i,
    len,
    promedio;
        promedio = 0;
        for (i = 0, len = alumnos.length; i < len; i++) {
          alumno = alumnos[i];
          promedio = promedio + alumno.promedio;
        }
        return promedio / alumnos.length;
      };
    }
  ]).filter('notasPerdidasGrupoPer', [
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
          cant = cant + $filter('notasPerdidasAsignaturaPeriodo')(alumno.asignaturas,
    true);
        }
        return cant;
      };
    }
  ]);

}).call(this);

//PuestoAlumnoFilter.js.map
