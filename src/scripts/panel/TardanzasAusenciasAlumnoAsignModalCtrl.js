(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('TardanzasAusenciasAlumnoAsignModalCtrl', [
    '$scope',
    'App',
    '$uibModalInstance',
    'alumno',
    '$http',
    'toastr',
    'EscalasValorativasServ',
    function($scope,
    App,
    $modalInstance,
    alumno,
    $http,
    toastr,
    EscalasValorativasServ) {
      $scope.datos = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.alumno = alumno;
      $scope.guardarCambioAusencia = function(ausencia) {
        var datos;
        datos = {
          ausencia_id: ausencia.id,
          fecha_hora: $filter('date')(ausencia.fecha_hora,
    'yyyy-MM-dd HH:mm:ss')
        };
        return $http.put('::ausencias/guardar-cambios-ausencia',
    datos).then(function(r) {
          r = r.data;
          //r.fecha_hora = new Date(r.fecha_hora)
          return alumno.tardanzas.push(r);
        },
    function(r2) {
          return toastr.warning('No se pudo agregar tardanza.',
    'Problema');
        });
      };
      $scope.eliminarAusencia = function(ausencia,
    alumno_aus_tard_edit) {
        return $http.delete('::ausencias/destroy/' + ausencia.id).then(function(r) {
          r = r.data;
          alumno_aus_tard_edit.ausencias = $filter('filter')(alumno_aus_tard_edit.ausencias,
    {
            id: '!' + r.id
          });
          return ausencia.isOpen = false;
        },
    function(r2) {
          return toastr.warning('No se pudo quitar ausencia.',
    'Problema');
        });
      };
      $scope.eliminarTardanza = function(tardanza,
    alumno_aus_tard_edit) {
        return $http.delete('::ausencias/destroy/' + tardanza.id).then(function(r) {
          r = r.data;
          alumno_aus_tard_edit.tardanzas = $filter('filter')(alumno_aus_tard_edit.tardanzas,
    {
            id: '!' + r.id
          });
          return tardanza.isOpen = false;
        },
    function(r2) {
          return toastr.warning('No se pudo quitar tardanza.',
    'Problema');
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close();
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=TardanzasAusenciasAlumnoAsignModalCtrl.js.map
