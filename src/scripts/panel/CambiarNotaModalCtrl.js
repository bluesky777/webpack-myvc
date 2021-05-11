(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('CambiarNotaModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'alumno',
    'subunidad',
    'nota',
    '$http',
    'toastr',
    'EscalasValorativasServ',
    function($scope,
    App,
    $modalInstance,
    alumno,
    subunidad,
    nota,
    $http,
    toastr,
    EscalasValorativasServ) {
      $scope.subunidad = subunidad;
      $scope.datos = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.alumno = alumno;
      $scope.nota = nota;
      EscalasValorativasServ.escalas().then(function(r) {
        return $scope.escalas = r;
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.cambiaNota = function(n) {
        console.log(n);
        return $http.put('::notas/update/' + nota.id,
    {
          nota: n
        }).then(function(r) {
          toastr.success('Cambiada: ' + n);
          nota.nota = n;
          return $modalInstance.close(nota.nota);
        },
    function(r2) {
          if (r2.status === 400) {
            return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
          } else {
            return toastr.error('No pudimos guardar la nota ' + nota.nota,
    '',
    {
              timeOut: 8000
            });
          }
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close();
      };
    }
  ]);

}).call(this);

//CambiarNotaModalCtrl.js.map
