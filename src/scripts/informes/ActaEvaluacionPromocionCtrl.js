(function() {
  angular.module('myvcFrontApp').controller('ActaEvaluacionPromocionCtrl', [
    '$scope',
    '$interval',
    'App',
    'Perfil',
    'datos',
    '$state',
    '$filter',
    '$uibModal',
    '$http',
    'toastr',
    function($scope,
    $interval,
    App,
    Perfil,
    datos,
    $state,
    $filter,
    $modal,
    $http,
    toastr) {
      var fecha;
      $scope.grupos = datos.data.grupos;
      $scope.year = datos.data.year;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.dato = {};
      $scope.dato.texto_acta_eval = $scope.year.texto_acta_eval;
      fecha = new Date();
      $scope.dato.hora_acta = fecha;
      $scope.dato.dia_acta = fecha;
      $scope.cambia_texto_informativo = function() {
        return $http.put('::actas-evaluacion/cambiar-descripcion',
    {
          texto_acta_eval: data.texto_acta_eval
        }).then(function(r) {
          return toastr.success('Texto guardado');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar texto.',
    'Problema');
        });
      };
      $scope.verAlumnos = function(alumnos) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==informes/verAlumnosActaModal.tpl.html',
          controller: 'VerAlumnosActaCtrl',
          size: 'lg',
          resolve: {
            alumnos: function() {
              return alumnos;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return console.log('Editado');
        },
    function() {});
      };
      // nada
      $scope.editarAlumno = function(alumno) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==informes/editarActaEvaluacionModal.tpl.html',
          controller: 'EditarActaEvaluacionCtrl',
          size: 'lg',
          resolve: {
            alumno: function() {
              return alumno;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return console.log('Editado');
        },
    function() {});
      };
      // nada
      return $scope.$emit('cambia_descripcion',
    'Acta de evaluación y promoción ' + $scope.USER.year);
    }
  ]).controller('VerAlumnosActaCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumnos',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    alumnos,
    $http,
    toastr,
    App) {
      var alumno,
    i,
    len;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.data = {};
      $scope.alumnos = alumnos;
      for (i = 0, len = alumnos.length; i < len; i++) {
        alumno = alumnos[i];
        if (alumno.fecha_nac) {
          alumno.fecha_nac = new Date(alumno.fecha_nac);
        }
        if (alumno.fecha_matricula) {
          alumno.fecha_matricula = new Date(alumno.fecha_matricula);
        }
        if (alumno.fecha_retiro) {
          alumno.fecha_retiro = new Date(alumno.fecha_retiro);
        }
        $scope.alumno = alumno;
      }
      $scope.guardarValor = function(rowEntity,
    colDef,
    newValue,
    year_id) {
        var datos;
        datos = {};
        if (colDef === "sexo") {
          newValue = newValue.toUpperCase();
          if (!(newValue === 'M' || newValue === 'F')) {
            toastr.warning('Debe usar M o F');
            rowEntity.sexo = $scope.alum_copy['sexo'];
            return;
          }
        }
        if (colDef === "estrato") {
          if (newValue < 0 || newValue > 9) {
            toastr.warning('Valor no admitido');
            rowEntity.estrato = $scope.alum_copy['estrato'];
            return;
          }
        }
        datos.alumno_id = rowEntity.alumno_id;
        datos.propiedad = colDef;
        datos.valor = newValue;
        datos.year_id = rowEntity.year_id;
        if (year_id) {
          datos.year_id = year_id;
        }
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return toastr.success('Dato actualizado con éxito');
        },
    function(r2) {
          rowEntity[colDef] = $scope.alum_copy[colDef];
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close(alumno);
      };
    }
  ]).controller('EditarActaEvaluacionCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    alumno,
    $http,
    toastr,
    App) {
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.data = {};
      if (alumno.fecha_nac) {
        alumno.fecha_nac = new Date(alumno.fecha_nac);
      }
      if (alumno.fecha_matricula) {
        alumno.fecha_matricula = new Date(alumno.fecha_matricula);
      }
      if (alumno.fecha_retiro) {
        alumno.fecha_retiro = new Date(alumno.fecha_retiro);
      }
      $scope.alumno = alumno;
      $http.put('::actas-evaluacion/detalle',
    {
        alumno_id: alumno.alumno_id,
        grupo_id: alumno.grupo_id
      }).then(function(r) {
        $scope.alumnos = r.data.alumnos;
        return $scope.matriculas = r.data.matriculas;
      },
    function(r2) {
        return toastr.warning('No se pudo traer detalles.',
    'Problema');
      });
      $scope.guardarValor = function(rowEntity,
    colDef,
    newValue,
    year_id) {
        var datos;
        datos = {};
        if (colDef === "sexo") {
          newValue = newValue.toUpperCase();
          if (!(newValue === 'M' || newValue === 'F')) {
            toastr.warning('Debe usar M o F');
            rowEntity.sexo = $scope.alum_copy['sexo'];
            return;
          }
        }
        if (colDef === "estrato") {
          if (newValue < 0 || newValue > 9) {
            toastr.warning('Valor no admitido');
            rowEntity.estrato = $scope.alum_copy['estrato'];
            return;
          }
        }
        datos.alumno_id = rowEntity.alumno_id;
        datos.propiedad = colDef;
        datos.valor = newValue;
        datos.year_id = rowEntity.year_id;
        if (year_id) {
          datos.year_id = year_id;
        }
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return toastr.success('Dato actualizado con éxito');
        },
    function(r2) {
          rowEntity[colDef] = $scope.alum_copy[colDef];
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close(alumno);
      };
    }
  ]);

}).call(this);

//ActaEvaluacionPromocionCtrl.js.map
