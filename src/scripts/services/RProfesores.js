(function() {
  angular.module('myvcFrontApp').factory('ProfesoresServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var profes;
      profes = {};
      profes.profesores = [];
      profes.contratos = function() {
        var d;
        d = $q.defer();
        if (profes.profesores.length > 0) {
          d.resolve(profes.profesores);
        } else {
          $http.get('::contratos').then(function(r) {
            profes.profesores = r.data;
            return d.resolve(profes.profesores);
          },
    function(r2) {
            console.log('No se trajeron los profesores contratados. ',
    r2);
            return d.reject(r2.data);
          });
        }
        return d.promise;
      };
      return profes;
    }
  ]);

}).call(this);

//# sourceMappingURL=RProfesores.js.map
