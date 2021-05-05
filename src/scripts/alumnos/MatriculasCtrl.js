(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('MatriculasCtrl', [
    '$scope',
    'App',
    '$state',
    '$interval',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    function($scope,
    App,
    $state,
    $interval,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http) {
      AuthService.verificar_acceso();
      $scope.dato = {
        sortMatricula: false,
        sortMatriculaReverse: false,
        sortNombres: false,
        sortNombresReverse: false,
        sortType: 'apellidos',
        sortReverse: false
      };
      $scope.dato_f = {
        sortMatricula: false,
        sortMatriculaReverse: false,
        sortNombres: false,
        sortNombresReverse: false,
        sortType: 'apellidos',
        sortReverse: false
      };
      $scope.alumnos_encontrados = [];
      $scope.texto_a_buscar = "";
      $scope.year_ant = $scope.USER.year - 1;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.alumnos_all = [];
      $scope.dato.grupo = '';
      $http.get('::grupos').then(function(r) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        $scope.grupos = r.data;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (grupo.id === matr_grupo) {
            $scope.dato.grupo = grupo;
          }
        }
        return $scope.traerAlumnos($scope.dato.grupo);
      });
      $scope.editar = function(row) {
        return $state.go('panel.alumnos.editar',
    {
          alumno_id: row.alumno_id
        });
      };
      $scope.onGrupoSelect = function($item,
    $model) {
        if (!$item) {
          return;
        }
        localStorage.setItem('matr_grupo',
    $item.id);
        return $scope.traerAlumnos($item);
      };
      $scope.traerAlumnos = function(item) {
        var grado_ant_id,
    grupo,
    grupos_ant,
    i,
    len,
    ref;
        grupos_ant = [];
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (grupo.orden_grado === (item.orden_grado - 1)) {
            grupos_ant.push(grupo);
          }
        }
        // Quería mandar los grupos anteriores, pero solo voy a mandar el grado_id
        if (grupos_ant.length > 0) {
          grado_ant_id = grupos_ant[0].grado_id;
        } else {
          grado_ant_id = null;
        }
        return $http.put("::matriculas/alumnos-grado-anterior",
    {
          grupo_actual: item,
          grado_ant_id: grado_ant_id,
          year_ant: $scope.year_ant
        }).then(function(r) {
          var alumno,
    j,
    len1,
    ref1,
    results;
          $scope.alumnos_all = r.data;
          ref1 = $scope.alumnos_all;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            alumno = ref1[j];
            //console.log alumno.fecha_retiro, new Date(alumno.fecha_retiro.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
            alumno.estado_ant = alumno.estado;
            alumno.fecha_retiro_ant = alumno.fecha_retiro;
            alumno.fecha_retiro = new Date(alumno.fecha_retiro);
            alumno.fecha_matricula_ant = alumno.fecha_matricula;
            results.push(alumno.fecha_matricula = new Date(alumno.fecha_matricula));
          }
          return results;
        });
      };
      $scope.matricularUno = function(row) {
        var datos;
        if (!$scope.dato.grupo.id) {
          toastr.warning('Debes definir el grupo al que vas a matricular.',
    'Falta grupo');
          return;
        }
        datos = {
          alumno_id: row.alumno_id,
          grupo_id: $scope.dato.grupo.id,
          year_id: $scope.USER.year_id
        };
        return $http.post('::matriculas/matricularuno',
    datos).then(function(r) {
          r = r.data;
          row.matricula_id = r.id;
          row.grupo_id = r.grupo_id;
          row.estado = 'MATR';
          row.fecha_matricula_ant = r.fecha_matricula.date;
          row.fecha_matricula = new Date(r.fecha_matricula.date);
          toastr.success('Alumno matriculado con éxito',
    'Matriculado');
          return row;
        },
    function(r2) {
          return toastr.error('No se pudo matricular el alumno.',
    'Error');
        });
      };
      $scope.reMatricularUno = function(row) {
        var datos;
        if (!$scope.dato.grupo.id) {
          toastr.warning('Debes definir el grupo al que vas a matricular.',
    'Falta grupo');
          return;
        }
        datos = {
          matricula_id: row.matricula_id
        };
        return $http.put('::matriculas/re-matricularuno',
    datos).then(function(r) {
          r = r.data;
          toastr.success('Alumno rematriculado',
    'Matriculado');
          return row;
        },
    function(r2) {
          return toastr.error('No se pudo matricular el alumno.',
    'Error');
        });
      };
      $scope.matricularEn = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/matricularEn.tpl.html',
          controller: 'MatricularEnCtrl',
          resolve: {
            alumno: function() {
              return row;
            },
            grupos: function() {
              return $scope.grupos;
            },
            USER: function() {
              return $scope.USER;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return console.log('Cierra');
        });
      };
      $scope.setAsistente = function(fila) {
        return $http.put('::matriculas/set-asistente',
    {
          matricula_id: fila.matricula_id,
          grupo_id: $scope.dato.grupo.grupo_id
        }).then(function(r) {
          return toastr.success('Guardado como asistente');
        },
    function(r2) {
          return toastr.error('No se pudo guardar como asistente',
    'Error');
        });
      };
      $scope.setNewAsistente = function(fila) {
        return $http.put('::matriculas/set-new-asistente',
    {
          alumno_id: fila.alumno_id,
          grupo_id: $scope.dato.grupo.id
        }).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          return toastr.error('No se pudo crear asistente',
    'Error');
        });
      };
      $scope.cambiarFechaRetiro = function(row) {
        return $http.put('::matriculas/cambiar-fecha-retiro',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Fecha retiro guardada');
        },
    function(r2) {
          row.fecha_retiro = row.fecha_retiro_ant;
          return toastr.error('No se pudo guardar la fecha',
    'Error');
        });
      };
      $scope.cambiarFechaMatricula = function(row) {
        return $http.put('::matriculas/cambiar-fecha-matricula',
    {
          matricula_id: row.matricula_id,
          fecha_matricula: row.fecha_matricula
        }).then(function(r) {
          return toastr.success('Fecha matricula guardada');
        },
    function(r2) {
          row.fecha_matricula = row.fecha_matricula_ant;
          return toastr.error('No se pudo guardar la fecha',
    'Error');
        });
      };
      $scope.desertar = function(row) {
        var fecha;
        fecha = row.fecha_retiro;
        if (row.fecha_retiro_ant === null) {
          fecha = new Date();
          row.fecha_retiro = fecha;
        }
        return $http.put('::matriculas/desertar',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Alumno desertado');
        },
    function(r2) {
          return toastr.error('No se pudo desertar',
    'Problema');
        });
      };
      $scope.retirar = function(row) {
        var fecha;
        fecha = row.fecha_retiro;
        if (row.fecha_retiro_ant === null) {
          fecha = new Date();
          row.fecha_retiro = fecha;
        }
        return $http.put('::matriculas/retirar',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Alumno retirado');
        },
    function(r2) {
          return toastr.error('No se pudo desmatricular',
    'Problema');
        });
      };
      $scope.buscar_por_nombre = function() {
        if ($scope.texto_a_buscar === "") {
          toastr.warning('Escriba término a buscar');
          return;
        }
        return $http.put('::buscar/por-nombre',
    {
          texto_a_buscar: $scope.texto_a_buscar
        }).then(function(r) {
          return $scope.alumnos_encontrados = r.data;
        },
    function(r2) {
          return toastr.error('No se pudo buscar',
    'Problema');
        });
      };
      $scope.filterActuales = function(item) {
        return item.grupo_id === $scope.dato.grupo.id;
      };
      $scope.filterNOActuales = function(item) {
        return item.grupo_id !== $scope.dato.grupo.id;
      };
    }
  ]).controller('MatricularEnCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'grupos',
    'USER',
    '$http',
    'toastr',
    '$state',
    function($scope,
    $modalInstance,
    alumno,
    grupos,
    USER,
    $http,
    toastr,
    $state) {
      var grupo,
    i,
    len,
    matr_grupo,
    ref;
      $scope.alumno = alumno;
      $scope.grupos = grupos;
      $scope.$state = $state;
      $scope.USER = USER;
      $scope.dato = {};
      if (localStorage.matr_grupo) {
        matr_grupo = parseInt(localStorage.matr_grupo);
      }
      ref = $scope.grupos;
      for (i = 0, len = ref.length; i < len; i++) {
        grupo = ref[i];
        if (grupo.id === matr_grupo) {
          $scope.dato.grupo = grupo;
        }
      }
      $scope.ok = function() {
        var datos;
        if (!$scope.dato.grupo.id) {
          toastr.warning('Debes definir el grupo al que vas a matricular.',
    'Falta grupo');
          return;
        }
        datos = {
          alumno_id: $scope.alumno.alumno_id,
          grupo_id: $scope.dato.grupo.id,
          year_id: $scope.USER.year_id
        };
        return $http.post('::matriculas/matricular-en',
    datos).then(function(r) {
          r = r.data;
          if (r === 'Ya matriculado') {
            toastr.warning('Ya tiene matrícula en ese grupo');
            return;
          }
          $scope.alumno.matricula_id = r.id;
          $scope.alumno.grupo_id = r.grupo_id;
          toastr.success('Alumno matriculado con éxito',
    'Matriculado');
          return $modalInstance.close($scope.alumno);
        },
    function(r2) {
          return toastr.error('No se pudo matricular el alumno.',
    'Error');
        });
      };
      $scope.toggleNuevo = function(fila) {
        var datos;
        fila.nuevo = !fila.nuevo;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'nuevo',
          valor: fila.nuevo
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          console.log('Cambios guardados');
          return $modalInstance.close($scope.alumno);
        },
    function(r2) {
          fila.nuevo = !fila.nuevo;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.toggleRepitente = function(fila) {
        var datos;
        fila.repitente = !fila.repitente;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'repitente',
          valor: fila.repitente
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          console.log('Cambios guardados');
          return $modalInstance.close($scope.alumno);
        },
    function(r2) {
          fila.repitente = !fila.repitente;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.toggleEgresado = function(fila) {
        var datos;
        fila.egresado = !fila.egresado;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'egresado',
          valor: fila.egresado
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          console.log('Cambios guardados');
          return $modalInstance.close($scope.alumno);
        },
    function(r2) {
          fila.egresado = !fila.egresado;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.toggleActive = function(fila) {
        var datos;
        fila.is_active = !fila.is_active;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          user_id: fila.user_id,
          propiedad: 'is_active',
          valor: fila.is_active
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          console.log('Cambios guardados');
          return $modalInstance.close($scope.alumno);
        },
    function(r2) {
          fila.is_active = !fila.is_active;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=MatriculasCtrl.js.map
