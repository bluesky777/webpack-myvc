(function() {
  angular.module('myvcFrontApp').directive('votarPanelDir', [
    'App',
    'Perfil',
    '$http',
    function(App,
    Perfil,
    $http) {
      return {
        restrict: 'EA',
        templateUrl: "==votaciones/votarPanel.tpl.html",
        scope: {
          votacion: "="
        },
        controller: function($scope,
    App,
    toastr,
    $window,
    $uibModal) {
          $scope.USER = Perfil.User();
          $scope.hover = false;
          $scope.maxi = false;
          $scope.windowHeight = $($window).height() - 100;
          $scope.wzStep = 0;
          $scope.currentImg = 'default_male.jpg';
          $scope.imagesPath = App.images + 'perfil/';
          // Maximizo esta votación si es la actual para votar
          if ($scope.$parent.$index === $scope.$parent.indexVotando) {
            $scope.maxi = true;
          }
          $scope.$on('terminaVotacion',
    function(evento,
    indexVotando) {
            if ($scope.$parent.$index === indexVotando) {
              return $scope.maxi = true;
            }
          });
          // Si ya hizo todos los votos en esta votación
          if ($scope.votacion.completos) {
            $scope.wzStep = $scope.votacion.aspiraciones.length;
          }
          $scope.mostrarImagen = function(candidato) {
            candidato.iluminado = true;
            return $scope.currentImg = candidato.foto_nombre;
          };
          $scope.ocultarImagen = function(candidato) {
            return candidato.iluminado = false;
          };
          $scope.nextAspiracion = function() {
            if ($scope.wzStep < $scope.votacion.aspiraciones.length) {
              return $scope.wzStep += 1;
            }
          };
          $scope.prevAspiracion = function() {
            if ($scope.wzStep > 0) {
              return $scope.wzStep -= 1;
            }
          };
          $scope.goAspiracion = function(num) {
            $scope.wzStep = parseInt($scope.wzStep);
            num = parseInt(num);
            if (num < $scope.wzStep) {
              return $scope.wzStep = num;
            }
          };
          $scope.open = function(candidato,
    aspiracion) {
            var modalInstance;
            if ($scope.votacion.locked) {
              toastr.warning('La votación está bloqueada.');
            } else if ($scope.votacion.locked_votacion) {
              toastr.warning('Usted está bloqueado en esta votación.');
            } else {
              modalInstance = $uibModal.open({
                templateUrl: '==votaciones/chooseCandidato.tpl.html',
                controller: 'chooseCandidatoCtrl',
                resolve: {
                  candidato: function() {
                    return candidato;
                  },
                  aspiracion: function() {
                    return aspiracion;
                  },
                  votacion_id: function() {
                    return $scope.votacion.id;
                  }
                }
              });
              return modalInstance.result.then(function(selectedItem) {
                var aspi,
    cantVot,
    i,
    len,
    ref;
                //aspiracion.votado = selectedItem
                aspiracion.votado = true;
                cantVot = 0;
                ref = $scope.votacion.aspiraciones;
                for (i = 0, len = ref.length; i < len; i++) {
                  aspi = ref[i];
                  if (aspi.votado) {
                    cantVot++;
                  }
                }
                if ($scope.votacion.aspiraciones.length === cantVot) {
                  $scope.$emit('termineDeVotar');
                  $scope.maxi = false;
                  toastr.info('Ahora continúa con la siguiente votación.');
                }
                return $scope.nextAspiracion();
              },
    function() {});
            }
          };
        }
      };
    }
  ]);

  //console.log 'Modal dismissed at: ' + new Date()

}).call(this);

//# sourceMappingURL=votarPanelDir.js.map
