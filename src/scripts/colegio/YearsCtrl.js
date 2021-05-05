(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('YearsCtrl', [
    'App',
    '$scope',
    '$http',
    '$uibModal',
    '$state',
    'ProfesoresServ',
    '$cookies',
    '$rootScope',
    '$filter',
    'toastr',
    '$timeout',
    function(App,
    $scope,
    $http,
    $modal,
    $state,
    ProfesoresServ,
    $cookies,
    $rootScope,
    $filter,
    toastr,
    $timeout) {
      //$scope.config = {alumnos_can_see_notas: $scope.USER.alumnos_can_see_notas}
      $scope.perfilPath = App.images + 'perfil/';
      $scope.status = {
        open_year: true
      };
      $http.get('::years/colegio').then(function(r) {
        var anio,
    i,
    j,
    len,
    len1,
    perio,
    ref,
    ref1;
        r = r.data;
        ref = r.years;
        for (i = 0, len = ref.length; i < len; i++) {
          anio = ref[i];
          ref1 = anio.periodos;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            perio = ref1[j];
            console.log(perio);
            perio.fecha_inicio = new Date(perio.fecha_inicio);
            perio.fecha_fin = new Date(perio.fecha_fin);
            perio.fecha_plazo = new Date(perio.fecha_plazo);
          }
        }
        $scope.years = r.years;
        $scope.certificados = r.certificados;
        $scope.imagenes = r.imagenes;
        $http.get('::profesores/todos').then(function(r) {
          $scope.profesores = r.data;
          // Arreglamos paneles y selects cuando ya han llegado todos los datos
          return $scope.fixControles();
        },
    function(r2) {
          return toastr.error('No se pudo traer los profesores');
        });
        return $timeout(function() {
          return $scope.cargado = true;
        },
    100);
      },
    function(r) {
        return toastr.error('No se trajeron los años');
      });
      $scope.fixControles = function() {
        var i,
    len,
    ref,
    results,
    ultimo,
    year_cambiar;
        ultimo = $scope.years.length - 1;
        $scope.newcertif = {};
        $scope.newYear = {
          nombre_colegio: $scope.years[ultimo].nombre_colegio,
          abrev_colegio: $scope.years[ultimo].abrev_colegio,
          year: $scope.years[ultimo].year + 1,
          actual: true,
          alumnos_can_see_notas: true,
          nota_minima_aceptada: $scope.years[ultimo].nota_minima_aceptada,
          resolucion: $scope.years[ultimo].resolucion,
          codigo_dane: $scope.years[ultimo].codigo_dane,
          telefono: $scope.years[ultimo].telefono,
          celular: $scope.years[ultimo].celular,
          unidad_displayname: $scope.years[ultimo].unidad_displayname,
          unidades_displayname: $scope.years[ultimo].unidades_displayname,
          genero_unidad: $scope.years[ultimo].genero_unidad,
          subunidad_displayname: $scope.years[ultimo].subunidad_displayname,
          subunidades_displayname: $scope.years[ultimo].subunidades_displayname,
          genero_subunidad: $scope.years[ultimo].genero_subunidad
        };
        ref = $scope.years;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          year_cambiar = ref[i];
          // Abramos panel del año actual
          year_cambiar.ocultando = year_cambiar.actual ? false : true;
          // Arreglemos los selects
          year_cambiar.rector = $filter('filter')($scope.profesores,
    {
            profesor_id: year_cambiar.rector_id
          },
    true)[0];
          year_cambiar.secretario = $filter('filter')($scope.profesores,
    {
            profesor_id: year_cambiar.secretario_id
          },
    true)[0];
          results.push(year_cambiar.tesorero = $filter('filter')($scope.profesores,
    {
            profesor_id: year_cambiar.tesorero_id
          },
    true)[0]);
        }
        return results;
      };
      $scope.addPeriodo = function(year) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==colegio/addPeriodo.tpl.html',
          controller: 'AddPeriodoCtrl',
          resolve: {
            year: function() {
              return year;
            }
          }
        });
        return modalInstance.result.then(function(periodo) {
          return year.periodos.push(periodo);
        });
      };
      $scope.removePeriodo = function(year,
    periodo) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==colegio/removePeriodo.tpl.html',
          controller: 'RemovePeriodoCtrl',
          resolve: {
            periodo: function() {
              return periodo;
            }
          }
        });
        return modalInstance.result.then(function(periodo) {
          return year.periodos = $filter('filter')(year.periodos,
    {
            id: '!' + periodo.id
          });
        });
      };
      $scope.toggleAnioActual = function(year_id,
    can) {
        return $http.put('::years/set-actual',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se establecer como actual.',
    'Problema');
        });
      };
      $scope.toggleBloquearNotas = function(year_id,
    can) {
        return $http.put('::years/alumnos-can-see-notas',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo bloquear o desbloquear el sistema.',
    'Problema');
        });
      };
      $scope.toggleBloquearProfesEditAlumnos = function(year_id,
    can) {
        return $http.put('::years/profes-can-edit-alumnos',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo bloquear o desbloquear la edición.',
    'Problema');
        });
      };
      $scope.toggleMostrarPuestoEnBoletin = function(year_id,
    can) {
        return $http.put('::years/toggle-mostrar-puestos-en-boletin',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo bloquear o desbloquear la edición.',
    'Problema');
        });
      };
      $scope.toggleMostrarNotaComportamientoEnBoletin = function(year_id,
    can) {
        return $http.put('::years/toggle-mostrar-nota-comport-en-boletin',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar.',
    'Problema');
        });
      };
      $scope.toggleMostrarAnioPasado = function(year_id,
    can) {
        return $http.put('::years/toggle-mostrar-anio-pasado-en-boletin',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar.',
    'Problema');
        });
      };
      $scope.toggleIgnorarNotasPerdidas = function(year_id,
    can) {
        return $http.put('::years/toggle-ignorar-notas-perdidas',
    {
          can: can,
          year_id: year_id
        }).then(function(r) {
          return toastr.success(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo bloquear o desbloquear la edición.',
    'Problema');
        });
      };
      $scope.restarNewYear = function() {
        if ($scope.newYear.year > 1990) {
          return $scope.newYear.year = $scope.newYear.year - 1;
        }
      };
      $scope.sumarNewYear = function() {
        if ($scope.newYear.year < 3000) {
          return $scope.newYear.year = $scope.newYear.year + 1;
        }
      };
      $scope.restarNewNota = function() {
        if ($scope.newYear.nota_minima_aceptada > 0) {
          return $scope.newYear.nota_minima_aceptada = $scope.newYear.nota_minima_aceptada - 0.1;
        }
      };
      $scope.sumarNewNota = function() {
        if ($scope.newYear.nota_minima_aceptada < 1000) {
          return $scope.newYear.nota_minima_aceptada = $scope.newYear.nota_minima_aceptada + 0.1;
        }
      };
      $scope.actualPeriodo = function(year,
    periodo) {
        return $http.put('::periodos/establecer-actual/' + periodo.id).then(function(r) {
          var i,
    len,
    peri,
    ref;
          toastr.success('Periodo ' + periodo.numero + ' establecido como actual.');
          ref = year.periodos;
          for (i = 0, len = ref.length; i < len; i++) {
            peri = ref[i];
            peri.actual = false;
          }
          return periodo.actual = true;
        },
    function(r2) {
          return toastr.warning('No se pudo establecer como actual.',
    'Problema');
        });
      };
      $scope.crearNewYear = function() {
        return $http.post('::years/store',
    $scope.newYear).then(function(r) {
          var i,
    len,
    ref,
    year;
          toastr.success('Año ' + $scope.newYear.year + ' creado. Por favor configúrelo.');
          $scope.nonuevo = false;
          ref = $scope.years;
          for (i = 0, len = ref.length; i < len; i++) {
            year = ref[i];
            year.actual = 0;
          }
          return $scope.years.push(r.data);
        },
    function(r2) {
          return toastr.warning('No se pudo crear año.',
    'Problema');
        });
      };
      $scope.guardar_cambios = function(year) {
        year.rector_id = year['rector'] ? year['rector'].profesor_id : null;
        year.secretario_id = year['secretario'] ? year['secretario'].profesor_id : null;
        year.tesorero_id = year['tesorero'] ? year['tesorero'].profesor_id : null;
        return $http.put('::years/guardar-cambios',
    year).then(function(r) {
          return toastr.success('Cambios guardados.');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar cambios.',
    'Problema');
        });
      };
      $scope.deleteYear = function(year) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==colegio/removeYear.tpl.html',
          controller: 'RemoveYearCtrl',
          resolve: {
            year: function() {
              return year;
            }
          }
        });
        return modalInstance.result.then(function(year) {
          return $scope.years = $filter('filter')($scope.years,
    {
            id: '!' + year.id
          });
        });
      };
      $scope.cambiarFechaInicio = function(periodo,
    fecha) {
        return $http.put('::periodos/cambiar-fecha-inicio',
    {
          periodo_id: periodo.id,
          fecha: fecha
        }).then(function(r) {
          return toastr.success('Fecha guardada.');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar fecha.',
    'Problema');
        });
      };
      $scope.cambiarFechaFin = function(periodo,
    fecha) {
        return $http.put('::periodos/cambiar-fecha-fin',
    {
          periodo_id: periodo.id,
          fecha: fecha
        }).then(function(r) {
          return toastr.success('Fecha guardada.');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar fecha.',
    'Problema');
        });
      };
      $scope.toggleProfesPuedenEditarNotas = function(periodo,
    pueden) {
        return $http.put('::periodos/toggle-profes-pueden-editar-notas',
    {
          periodo_id: periodo.id,
          pueden: pueden
        }).then(function(r) {
          return toastr.success('Cambiado.');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar fecha.',
    'Problema');
        });
      };
      $scope.toggleProfesPuedenNivelar = function(periodo,
    pueden) {
        return $http.put('::periodos/toggle-profes-pueden-nivelar',
    {
          periodo_id: periodo.id,
          pueden: pueden
        }).then(function(r) {
          return toastr.success('Cambiado.');
        },
    function(r2) {
          return toastr.warning('No se pudo guardar fecha.',
    'Problema');
        });
      };
    }
  ]).controller('RemoveYearCtrl', [
    '$scope',
    '$uibModalInstance',
    'year',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    year,
    $http,
    toastr) {
      $scope.year = year;
      $scope.ok = function() {
        return $http.delete('::years/delete/' + year.id).then(function(r) {
          toastr.success('Año ' + year.year + ' enviado a la papelera.');
          return $modalInstance.close(year);
        },
    function(r2) {
          toastr.warning('No se pudo eliminar el año.',
    'Problema');
          return $modalInstance.dismiss();
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('RemovePeriodoCtrl', [
    '$scope',
    '$uibModalInstance',
    'periodo',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    periodo,
    $http,
    toastr) {
      $scope.periodo = periodo;
      $scope.ok = function() {
        return $http.delete('::periodos/destroy/' + periodo.id).then(function(r) {
          toastr.success('Periodo eliminado con éxito.',
    'Eliminado');
          return $modalInstance.close(periodo);
        },
    function(r2) {
          toastr.warning('No se pudo eliminar el periodo.',
    'Problema');
          return $modalInstance.dismiss();
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('AddPeriodoCtrl', [
    '$scope',
    '$uibModalInstance',
    'year',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    year,
    $http,
    toastr) {
      $scope.year = year;
      $scope.new_periodo = {};
      $scope.year_id = $scope.year.id;
      $scope.ok = function() {
        return $http.post('::periodos/store/' + year.id,
    $scope.new_periodo).then(function(r) {
          toastr.success('Periodo creado con éxito.',
    'Creado');
          return $modalInstance.close(r.data);
        },
    function(r2) {
          toastr.warning('No se pudo crear el periodo.',
    'Problema');
          return $modalInstance.dismiss();
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=YearsCtrl.js.map
