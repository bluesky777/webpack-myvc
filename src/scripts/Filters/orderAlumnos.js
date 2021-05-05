(function() {
  angular.module('myvcFrontApp').filter('orderMatriculadosBy', [
    function() {
      return function(items,
    dato) {
        var filtered,
    sortTiempo;
        filtered = [];
        angular.forEach(items,
    function(item) {
          return filtered.push(item);
        });
        sortTiempo = function(a,
    b) {
          if (a.resultados.tiempo > b.resultados.tiempo) {
            if (reverse) {
              return 1;
            } else {
              return -1;
            }
          } else if (a.resultados.tiempo === b.resultados.tiempo) {
            return 0;
          } else {
            if (reverse) {
              return -1;
            } else {
              return 1;
            }
          }
        };
        filtered.sort(function(a,
    b) {
          switch (tipo) {
            case 'promedio':
              if (a.resultados.promedio > b.resultados.promedio) {
                if (reverse) {
                  return -1;
                } else {
                  return 1;
                }
              } else if (a.resultados.promedio === b.resultados.promedio) {
                return sortTiempo(a,
    b);
              } else {
                if (reverse) {
                  return 1;
                } else {
                  return -1;
                }
              }
              break;
            case 'cantidad_pregs':
              if (a.resultados.cantidad_pregs > b.resultados.cantidad_pregs) {
                if (reverse) {
                  return -1;
                } else {
                  return 1;
                }
              } else if (a.resultados.cantidad_pregs === b.resultados.cantidad_pregs) {
                return sortTiempo(a,
    b);
              } else {
                if (reverse) {
                  return 1;
                } else {
                  return -1;
                }
              }
              break;
            case 'nombres':
            case 'examen_id':
            case 'categorias':
            case 'examen_at':
              if (a[tipo] > b[tipo]) {
                if (reverse) {
                  return -1;
                } else {
                  return 1;
                }
              } else if (a[tipo] === b[tipo]) {
                return sortTiempo(a,
    b);
              } else {
                if (reverse) {
                  return 1;
                } else {
                  return -1;
                }
              }
              break;
            case 'tiempo':
              return sortTiempo(a,
    b);
          }
        });
        return filtered;
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=orderAlumnos.js.map
