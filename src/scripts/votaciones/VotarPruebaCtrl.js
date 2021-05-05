(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('VotarPruebaCtrl', [
    '$scope',
    '$filter',
    '$http',
    'App',
    '$state',
    '$uibModal',
    '$window',
    function($scope,
    $filter,
    $http,
    App,
    $state,
    $modal,
    $window) {
      $scope.hover = false;
      $scope.aspiraciones = [];
      $scope.maxi = $state.params.maxi;
      $scope.windowHeight = $($window).height() - 100;
      $scope.wzStep = 0;
      $scope.votacion = {
        locked: false,
        is_action: false,
        fecha_inicio: '',
        fecha_fin: ''
      };
      $http.get('::votaciones/actual').then(function(r) {
        $scope.votacion = r.data;
        if ($scope.votacion.locked) {
          return $scope.toastr.warning('La votación actual está bloqueada');
        }
      });
      //$state.transitionTo 'panel'
      $http.get('::candidatos/conaspiraciones').then(function(r) {
        return $scope.aspiraciones = r.data;
      },
    function(r2) {
        return $scope.toastr.error('No se pudo traer las aspiraciones',
    'Problema');
      });
      $http.get('::participantes/allinscritos').then(function(r) {
        return $scope.allinscritos = r.data;
      },
    function(r2) {
        return $scope.toastr.error('No se pudo traer los inscritos',
    'Problema');
      });
      $scope.currentImg = 'default_male.jpg';
      $scope.imagesPath = App.images + 'perfil/';
      $scope.mostrarImagen = function(candidato) {
        candidato.iluminado = true;
        return $scope.currentImg = candidato.imagen_nombre;
      };
      $scope.ocultarImagen = function(candidato) {
        return candidato.iluminado = false;
      };
      $scope.nextAspiracion = function() {
        if ($scope.wzStep < $scope.aspiraciones.length) {
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
          $scope.toastr.warning('La votación actual está bloqueada');
        } else {
          modalInstance = $modal.open({
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
            aspiracion.votado.push(selectedItem);
            return $scope.nextAspiracion();
          },
    function() {});
        }
      };
    }
  //console.log 'Modal dismissed at: ' + new Date()
  ]).controller('chooseCandidatoPruebaCtrl', [
    '$scope',
    '$http',
    '$uibModalInstance',
    'App',
    'candidato',
    'aspiracion',
    'toastr',
    function($scope,
    $http,
    $modalInstance,
    App,
    candidato,
    aspiracion,
    toastr) {
      $scope.candidato = candidato;
      $scope.aspiracion = aspiracion;
      $scope.imagesPath = App.images + 'perfil/';
      $scope.ok = function() {
        var datos,
    r;
        datos = {};
        datos.candidato_id = candidato.candidato_id;
        r = {
          locked: false,
          is_action: false,
          fecha_inicio: '',
          fecha_fin: '',
          completo: false
        };
        toastr.success('Voto guardado con éxito');
        return $modalInstance.close(r);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=VotarPruebaCtrl.js.map
