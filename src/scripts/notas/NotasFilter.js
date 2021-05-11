(function() {
  angular.module("myvcFrontApp").filter('juicioValorativo', [
    function() {
      return function(nota,
    escalas,
    desempenio) {
        var jucio;
        jucio = {};
        angular.forEach(escalas,
    function(escala) {
          if (nota >= escala.porc_inicial && nota <= escala.porc_final) {
            jucio.desempenio = escala.desempenio;
            return jucio.valoracion = escala.valoracion;
          }
        });
        if (desempenio) {
          return jucio.desempenio;
        } else {
          return jucio.valoracion;
        }
      };
    }
  ]).filter('soloAsignaturasConPerdidas', [
    '$filter',
    function($filter) {
      return function(asignaturas,
    only) {
        if (only === true || only === 'perdidas') {
          this.asignaturas_resp = [];
          angular.forEach(asignaturas,
    function(asignatura) {
            var unidades;
            unidades = $filter('soloUnidadesConPerdidas')(asignatura.unidades,
    true);
            if (unidades.length) {
              return this.asignaturas_resp.push(asignatura);
            }
          });
          return this.asignaturas_resp;
        } else {
          return asignaturas;
        }
      };
    }
  ]).filter('soloUnidadesConPerdidas', [
    '$filter',
    function($filter) {
      return function(unidades,
    only) {
        if (only === true || only === 'perdidas') {
          this.unidades_resp = [];
          angular.forEach(unidades,
    function(unid) {
            var subunids;
            subunids = $filter('soloSubunidadesPerdidas')(unid.subunidades,
    true);
            if (subunids.length) {
              return this.unidades_resp.push(unid);
            }
          });
          return this.unidades_resp;
        } else {
          return unidades;
        }
      };
    }
  ]).filter('soloSubunidadesPerdidas', [
    'Perfil',
    function(Perfil) {
      return function(subunidades,
    only) {
        if (only === true || only === 'perdidas') {
          this.subunidades_resp = [];
          angular.forEach(subunidades,
    function(subunid) {
            if (subunid.nota) {
              if (subunid.nota.nota < Perfil.User().nota_minima_aceptada) {
                return this.subunidades_resp.push(subunid);
              }
            }
          });
          return this.subunidades_resp;
        } else {
          return subunidades;
        }
      };
    }
  ]);

}).call(this);

//NotasFilter.js.map
