(function() {
  angular.module('myvcFrontApp').controller('VerSituacionesPorGruposCtrl', [
    '$scope',
    'toastr',
    'grupos_situaciones',
    function($scope,
    toastr,
    grupos_situaciones) {
      $scope.grupos_situaciones = grupos_situaciones.data.grupos;
      $scope.year = $scope.$parent.year;
      return console.log($scope.$parent.year);
    }
  ]);

}).call(this);

//# sourceMappingURL=VerSituacionesPorGruposCtrl.js.map
