(function() {
  angular.module('myvcFrontApp').factory('NotasServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var notas;
      notas = {};
      notas.detalladas = function(asignatura_id,
    profe_id,
    con_asignaturas) {
        var d;
        d = $q.defer();
        $http.put('::notas/detailed',
    {
          asignatura_id: asignatura_id,
          profesor_id: profe_id,
          con_asignaturas: con_asignaturas
        }).then(function(r) {
          return d.resolve(r.data);
        },
    function(r2) {
          return d.reject(r2);
        });
        return d.promise;
      };
      return notas;
    }
  ]).factory('AlumnosSinMatriculaServ', [
    '$http',
    '$q',
    '$filter',
    function($http,
    $q,
    $filter) {
      var alumnos,
    alumnosResp;
      alumnos = [];
      alumnosResp = {};
      alumnosResp.alumnos = function() {
        var d;
        d = $q.defer();
        if (alumnos.length > 0) {
          d.resolve(alumnos);
        } else {
          $http.get('::alumnos/sin-matriculas').then(function(r) {
            alumnos = r.data;
            return d.resolve(alumnos);
          },
    function(r2) {
            return d.reject(r2);
          });
        }
        return d.promise;
      };
      return alumnosResp;
    }
  ]).factory('InformesServ', [
    '$http',
    '$q',
    '$filter',
    function($http,
    $q,
    $filter) {
      var datos,
    datosResp;
      datos = {};
      datosResp = {};
      datosResp.datos = function() {
        var d;
        d = $q.defer();
        if (datos.year) {
          d.resolve(datos);
        } else {
          $http.put('::informes/datos').then(function(r) {
            datos = r.data;
            return d.resolve(datos);
          },
    function(r2) {
            return d.reject(r2);
          });
        }
        return d.promise;
      };
      return datosResp;
    }
  ]).factory('EscalasValorativasServ', [
    '$http',
    '$q',
    '$filter',
    function($http,
    $q,
    $filter) {
      var escalas,
    escalasr;
      escalas = [];
      escalasr = {};
      escalasr.escalas = function() {
        var d;
        d = $q.defer();
        if (escalas.length > 0) {
          d.resolve(escalas);
        } else {
          $http.get('::escalas').then(function(r) {
            var escala,
    i,
    len;
            escalas = r.data;
            for (i = 0, len = escalas.length; i < len; i++) {
              escala = escalas[i];
              escala.orden = parseInt(escala.orden);
              escala.perdido = parseInt(escala.perdido);
              escala.porc_final = parseInt(escala.porc_final);
              escala.porc_inicial = parseInt(escala.porc_inicial);
              escala.id = parseInt(escala.id);
              escala.year_id = parseInt(escala.year_id);
            }
            return d.resolve(escalas);
          },
    function(r2) {
            return d.reject(r2);
          });
        }
        return d.promise;
      };
      escalasr.escala_maxima = function() {
        var escala_max;
        escala_max = $filter('orderBy')(escalas,
    'orden')[escalas.length - 1];
        return escala_max;
      };
      return escalasr;
    }
  ]).factory('AusenciasServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var ausencias;
      ausencias = {};
      ausencias.detalladas = function(asignatura_id) {
        var d;
        d = $q.defer();
        $http.get('::ausencias/detailed/' + asignatura_id).then(function(r) {
          return d.resolve(r.data);
        },
    function(r2) {
          return d.reject(r2);
        });
        return d.promise;
      };
      return ausencias;
    }
  ]).factory('ComportamientoServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var comportamientos;
      comportamientos = {};
      comportamientos.detallados = function(grupo_id) {
        var d;
        d = $q.defer();
        $http.get('::nota_comportamiento/detailed/' + grupo_id).then(function(r) {
          return d.resolve(r.data);
        },
    function(r2) {
          return d.reject(r2);
        });
        return d.promise;
      };
      comportamientos.proceso = function(grupo_id) {
        var d;
        d = $q.defer();
        $http.get('::comportamiento/proceso/' + grupo_id).then(function(r) {
          return d.resolve(r.data);
        },
    function(r2) {
          return d.reject(r2);
        });
        return d.promise;
      };
      return comportamientos;
    }
  ]);

}).call(this);

//# sourceMappingURL=RNotas.js.map
