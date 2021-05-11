(function() {
  angular.module('myvcFrontApp').factory('YearsServ', [
    '$http',
    '$q',
    function($http,
    $q) {
      var interfaz,
    years;
      years = [];
      interfaz = {
        getYears: function() {
          var d;
          d = $q.defer();
          //console.log 'years.length', years.length
          if (years.length > 0) {
            d.resolve(years);
          } else {
            $http.get('::years').then(function(r) {
              years = r.data;
              return d.resolve(years);
            },
    function(r2) {
              return d.reject(r2);
            });
          }
          return d.promise;
        }
      };
      return interfaz;
    }
  ]);

}).call(this);

//RYears.js.map
