(function() {
  angular.module('myvcFrontApp').controller('verUniformesAlumnoPeriodoModal', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'per_num',
    'periodos',
    'config',
    'profesores',
    '$http',
    'toastr',
    'App',
    'AuthService',
    function($scope,
    $modalInstance,
    alumno,
    per_num,
    periodos,
    config,
    profesores,
    $http,
    toastr,
    App,
    AuthService) {
      var i,
    len,
    peri,
    ref;
      $scope.alumno = alumno;
      $scope.datos = {};
      $scope.config = config;
      $scope.periodos = periodos;
      $scope.profesores = profesores;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.per_num = per_num;
      ref = $scope.periodos;
      for (i = 0, len = ref.length; i < len; i++) {
        peri = ref[i];
        peri.activo = false;
        if (peri.numero === per_num) {
          peri.activo = true;
          peri.creando = false; // creando
          $scope.datos.periodo = peri;
        }
      }
      $scope.verAgregarUniforme = function(alumno) {
        alumno.new_uni = {
          fecha_hora: new Date()
        };
        alumno.creandoUniforme = !alumno.creandoUniforme;
      };
      $scope.cancelarGuardarUniforme = function(alumno) {
        alumno.guardando_uniforme = false;
        return alumno.creandoUniforme = false;
      };
      // Crear uniforme en la nube
      $scope.guardarUniforme = function(alumno) {
        if (alumno.guardando_uniforme) {
          return;
        }
        alumno.guardando_uniforme = true;
        alumno.new_uni.alumno_id = alumno.alumno_id;
        alumno.new_uni.periodo_id = $scope.datos.periodo.id;
        //alumno.new_uni.asignatura_id = $scope.asignatura_actual.asignatura_id
        //alumno.new_uni.materia = $scope.asignatura_actual.materia
        alumno.new_uni.fecha_hora = alumno.new_uni.fecha_hora.yyyymmdd() + ' ' + window.fixHora(alumno.new_uni.fecha_hora);
        $http.put('::uniformes/agregar',
    alumno.new_uni).then(function(r) {
          console.log(alumno,
    per_num);
          alumno.guardando_uniforme = false;
          r.data.uniforme.fecha_hora = new Date(r.data.uniforme.fecha_hora.replace(/-/g,
    '\/'));
          alumno['uniformes_per' + per_num].push(r.data.uniforme);
          return alumno.creandoUniforme = false;
        },
    function() {
          toastr.error('Error agregando uniformes');
          alumno.guardando_uniforme = false;
          return alumno.creandoUniforme = false;
        });
      };
      $scope.editarUniforme = function(uniforme,
    alumno) {
        return uniforme.editando = !uniforme.editando;
      };
      $scope.cancelarGuardarUniformeEditado = function(uniforme) {
        uniforme.guardando = false;
        return uniforme.editando = false;
      };
      $scope.guardarUniformeEditado = function(uniforme,
    alumno) {
        if (uniforme.guardando) {
          return;
        }
        uniforme.guardando = true;
        $http.put('::uniformes/actualizar',
    uniforme).then(function(r) {
          uniforme.guardando = false;
          toastr.success('Uniforme actualizado.');
          return uniforme.editando = false;
        },
    function() {
          toastr.error('Error actualizado uniforme.');
          return uniforme.guardando = false;
        });
      };
      $scope.eliminarUniforme = function(uniforme,
    alumno) {
        var res;
        res = confirm('¿Seguro que deseas eliminar este registro de uniforme?');
        if (res) {
          return $http.put('::uniformes/eliminar',
    {
            uniforme_id: uniforme.id,
            alumno_id: alumno.alumno_id
          }).then(function(r) {
            return alumno['uniformes_per' + per_num] = r.data.uniformes;
          },
    function(r2) {
            return toastr.warning('No se pudo cambiar.',
    'Problema');
          });
        }
      };
      return $scope.ok = function() {
        return $modalInstance.close($scope.alumno);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=verUniformesAlumnoPeriodoModal.js.map
