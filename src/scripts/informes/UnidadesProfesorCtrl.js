(function() {
  angular.module('myvcFrontApp').controller('UnidadesProfesorCtrl', [
    '$scope',
    'App',
    'Perfil',
    'asignaturas',
    '$state',
    'toastr',
    '$http',
    function($scope,
    App,
    Perfil,
    asignaturas,
    $state,
    toastr,
    $http) {
      var asig;
      $scope.asignaturas = asignaturas.data.asignaturas;
      $scope.info_profe = asignaturas.data.info_profesor;
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.perfilPath = App.images + 'perfil/';
      $scope.editarUnidad = function(unidad) {
        return unidad.editando = true;
      };
      $scope.cancelarEditUnidad = function(unidad) {
        return unidad.editando = false;
      };
      $scope.guardarCambiosUnidad = function(unidad) {
        unidad.periodo_id = $scope.USER.periodo_id;
        unidad.num_periodo = $scope.USER.numero_periodo;
        return $http.put('::unidades/update/' + unidad.id,
    unidad).then(function(r) {
          toastr.success('Cambios guardados');
          return unidad.editando = false;
        },
    function(r2) {
          return toastr.error('No se pudo guardar cambios');
        });
      };
      $scope.editarSubunidad = function(subunidad) {
        return subunidad.editando = true;
      };
      $scope.cancelarEditSubunidad = function(subunidad) {
        return subunidad.editando = false;
      };
      $scope.guardarCambiosSubunidad = function(subunidad,
    unidad) {
        subunidad.asignatura_id = unidad.asignatura_id;
        subunidad.periodo_id = $scope.USER.periodo_id;
        subunidad.num_periodo = $scope.USER.numero_periodo;
        return $http.put('::subunidades/update/' + subunidad.id,
    subunidad).then(function(r) {
          toastr.success('Cambios guardados');
          return subunidad.editando = false;
        },
    function(r2) {
          return toastr.error('No se pudo guardar cambios');
        });
      };
      asig = $scope.asignaturas[0];
      return $scope.$emit('cambia_descripcion',
    $scope.asignaturas.length + ' asignaturas del profesor ' + $scope.info_profe.nombres_profesor + ' ' + $scope.info_profe.apellidos_profesor);
    }
  ]);

}).call(this);

//UnidadesProfesorCtrl.js.map
