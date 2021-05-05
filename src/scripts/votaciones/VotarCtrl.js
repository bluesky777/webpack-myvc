(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VotarCtrl', [
    '$scope',
    '$http',
    'toastr',
    function($scope,
    $http,
    toastr) {
      $scope.votaciones = [];
      $scope.indexVotando = 0;
      $http.get('::votaciones/en-accion-inscrito').then(function(r) {
        var i,
    len,
    ref,
    results,
    vot;
        r = r.data;
        if (r.msg) {
          return toastr.warning(r.msg,
    'Atención');
        } else {
          $scope.votaciones = r;
          ref = $scope.votaciones;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            vot = ref[i];
            if (vot.completos) {
              results.push($scope.indexVotando++);
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      });
      $scope.$on('termineDeVotar',
    function() {
        $scope.indexVotando++;
        return $scope.$broadcast('terminaVotacion',
    $scope.indexVotando);
      });
    }
  ]).controller('chooseCandidatoCtrl', [
    '$scope',
    '$http',
    '$uibModalInstance',
    'App',
    'candidato',
    'aspiracion',
    'votacion_id',
    'toastr',
    function($scope,
    $http,
    $modalInstance,
    App,
    candidato,
    aspiracion,
    votacion_id,
    toastr) {
      $scope.candidato = candidato;
      $scope.aspiracion = aspiracion;
      $scope.imagesPath = App.images + 'perfil/';
      $scope.ok = function() {
        var datos;
        datos = {};
        datos.votacion_id = votacion_id;
        if (candidato.voto_blanco) {
          datos.blanco_aspiracion_id = aspiracion.id;
          datos.voto_blanco = true;
        } else {
          datos.candidato_id = candidato.candidato_id;
        }
        return $http.post('::votos/store',
    datos).then(function(r) {
          r = r.data;
          if (r.msg) {
            toastr.info(r.msg);
          } else {
            toastr.success('Voto guardado con éxito');
          }
          return $modalInstance.close(r);
        },
    function(r2) {
          r2 = r2.data;
          if (r2.data) {
            if (r2.data.msg) {
              toastr.error(r2.data.msg); // Mensaje que me devuelve el servidor
            } else {
              toastr.error('No se pudo guardar el voto.');
            }
          } else {
            toastr.error('No se pudo guardar el voto.');
          }
          return $modalInstance.dismiss('Error al guardar');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=VotarCtrl.js.map
