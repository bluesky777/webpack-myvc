(function() {
  angular.module('myvcFrontApp').filter('decimales', [
    function() {
      return function(input,
    cant) {
        input = parseFloat(input);
        if ((input % 1) === 0) {
          input = input.toFixed(0);
        } else {
          input = input.toFixed(cant);
        }
        return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
    ",");
      };
    }
  ]).filter('decimales_if', [
    function() {
      return function(input,
    cant) {
        var numero;
        input = parseFloat(input);
        if ((input % 1) === 0) {
          input = input.toFixed(0);
        } else {
          input = input.toFixed(cant);
        }
        numero = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
    ",");
        numero = parseFloat(numero);
        return numero;
      };
    }
  ]).filter('setDecimal', [
    function() {
      return function(input,
    places) {
        var factor;
        if (isNaN(input)) {
          return input;
        }
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
      };
    }
  ]).filter('formatNumberDocumento', [
    '$filter',
    function($filter) {
      return function(input) {
        if (!isNaN(input) && angular.isNumber(+input)) {
          return $filter('number')(input,
    0);
        } else {
          return input;
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=decimalesFilter.js.map
