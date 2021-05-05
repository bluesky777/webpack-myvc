(function() {
  angular.module('myvcFrontApp').controller('ModalDetallesSesionCtrl', [
    '$scope',
    '$uibModalInstance',
    'historial',
    '$http',
    'toastr',
    'App',
    '$filter',
    function($scope,
    $modalInstance,
    historial,
    $http,
    toastr,
    App,
    $filter) {
      var desde,
    duracion,
    hasta,
    hours,
    milliseconds,
    minutes,
    seconds;
      $scope.imagesPath = App.images + 'perfil/';
      $scope.historial = historial;
      if (historial.logout_at) {
        desde = new Date(historial.created_at);
        hasta = new Date(historial.logout_at);
        duracion = hasta.getTime() - desde.getTime();
        milliseconds = parseInt((duracion % 1000) / 100);
        seconds = parseInt((duracion / 1000) % 60);
        minutes = parseInt((duracion / (1000 * 60)) % 60);
        hours = parseInt((duracion / (1000 * 60 * 60)) % 24);
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        $scope.duracion = hours + ":" + minutes + ":" + seconds;
      } else {
        $scope.duracion = 'No cerró sesión.';
      }
      $scope.ok = function() {
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ModalDetallesSesionCtrl.js.map
