(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('EditarActividadCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$http',
    '$uibModal',
    '$filter',
    'AuthService',
    'datos',
    'toastr',
    '$stateParams',
    '$timeout',
    '$location',
    '$anchorScroll',
    function($scope,
    App,
    $rootScope,
    $state,
    $http,
    $modal,
    $filter,
    AuthService,
    datos,
    toastr,
    $stateParams,
    $timeout,
    $location,
    $anchorScroll) {
      var addZero,
    compart,
    grupo,
    j,
    k,
    len,
    len1,
    ref,
    ref1;
      AuthService.verificar_acceso();
      $scope.actividad_id = $stateParams.actividad_id;
      $scope.datos = {
        selected_grupos: []
      };
      $scope.mostrando_detalles_actividad = true;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.actividad = datos.actividad;
      $scope.grupos = datos.grupos;
      $scope.compartidas = datos.compartidas;
      ref = $scope.compartidas;
      for (j = 0, len = ref.length; j < len; j++) {
        compart = ref[j];
        ref1 = $scope.grupos;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          grupo = ref1[k];
          if (grupo.id === compart.grupo_id) {
            $scope.datos.selected_grupos.push(grupo);
          }
        }
      }
      if ($scope.actividad.finaliza_at) {
        $scope.actividad.finaliza_at = new Date($scope.actividad.finaliza_at);
      } else {
        $scope.actividad.finaliza_at = new Date();
      }
      if ($scope.actividad.inicia_at) {
        $scope.actividad.inicia_at = new Date($scope.actividad.inicia_at);
      } else {
        $scope.actividad.inicia_at = new Date();
      }
      $scope.actividad.para_alumnos = $scope.actividad.para_alumnos ? true : false;
      $scope.actividad.para_profesores = $scope.actividad.para_profesores ? true : false;
      $scope.actividad.para_acudientes = $scope.actividad.para_acudientes ? true : false;
      $scope.editor_options = {
        allowedContent: true,
        entities: false
      };
      $scope.restar = function(modelo) {
        if ($scope.actividad[modelo] > 0) {
          return $scope.actividad[modelo] = $scope.actividad[modelo] - 1;
        }
      };
      $scope.sumar = function(modelo) {
        if ($scope.actividad[modelo] < 1000) {
          return $scope.actividad[modelo] = parseInt($scope.actividad[modelo]) + 1;
        }
      };
      $scope.onEditorReady = function() {
        return console.log('Editor listo');
      };
      addZero = function(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      };
      $scope.ftime_to_string = function(ftime) {
        var d,
    h,
    m,
    res,
    s;
        h = addZero(ftime.getHours());
        m = addZero(ftime.getMinutes());
        s = addZero(ftime.getSeconds());
        d = ftime.yyyymmdd();
        return res = d + "T" + h + ":" + m + ":" + s + ".000Z";
      };
      $scope.guardarActividad = function(salir) {
        var finaliza_at,
    inicia_at;
        finaliza_at = $scope.ftime_to_string($scope.actividad.finaliza_at);
        $scope.actividad.finaliza_at_str = finaliza_at;
        inicia_at = $scope.ftime_to_string($scope.actividad.inicia_at);
        $scope.actividad.inicia_at_str = inicia_at;
        return $http.put('::actividades/guardar',
    $scope.actividad).then(function(r) {
          r = r.data;
          toastr.success('Cambios guardados');
          if (salir) {
            return $state.go('panel.actividades',
    {
              asign_id: $scope.actividad.asignatura_id
            });
          }
        },
    function(r2) {
          return toastr.error('No se pudo guardar cambios');
        });
      };
      $scope.editar_pregunta = function(pregunta) {
        $state.go('panel.editar_actividad',
    {
          actividad_id: $scope.actividad.id
        });
        localStorage.pregunta_edit = JSON.stringify(pregunta);
        return $timeout(function() {
          return $state.go('panel.editar_actividad.pregunta');
        });
      };
      $scope.crearPregunta = function() {
        datos = {
          actividad_id: $scope.actividad_id
        };
        return $http.post('::preguntas/crear',
    datos).then(function(r) {
          r = r.data;
          $scope.actividad.preguntas.push(r);
          return $scope.editar_pregunta(r);
        },
    function(r2) {
          return toastr.error('No se pudo crear pregunta');
        });
      };
      $scope.cambios_pregunta_guardados = function(preg_editada) {
        $scope.actividad.preguntas = $filter('filter')($scope.actividad.preguntas,
    {
          id: '!' + preg_editada.id
        });
        $scope.actividad.preguntas.push(preg_editada);
        return $scope.actividad.preguntas = $filter('orderBy')($scope.actividad.preguntas,
    'orden');
      };
      $scope.duplicar_pregunta = function(pregunta) {
        pregunta.orden = $scope.actividad.preguntas.length;
        return $http.put('::preguntas/duplicar-pregunta',
    pregunta).then(function(r) {
          r = r.data;
          toastr.success('Pregunta duplicada');
          $scope.actividad.preguntas.push(r);
          return $timeout(function() {
            $location.hash('end-preguntas');
            return $anchorScroll();
          });
        },
    function(r2) {
          return toastr.error('No se pudo duplicar');
        });
      };
      $scope.on_sort_preguntas = function($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo) {
        var hashEntry,
    index,
    l,
    len2,
    pregunta,
    sortHash;
        sortHash = [];
//subunidades
        for (index = l = 0, len2 = $partFrom.length; l < len2; index = ++l) {
          pregunta = $partFrom[index];
          pregunta.orden = index;
          hashEntry = {};
          hashEntry["" + pregunta.id] = index;
          sortHash.push(hashEntry);
        }
        datos = {
          sortHash: sortHash
        };
        return $http.put('::preguntas/update-orden',
    datos).then(function(r) {
          return true;
        },
    function(r2) {
          toastr.warning('No se pudo ordenar',
    'Problema');
          return false;
        });
      };
      $scope.para_alumnos_toggle = function(para) {
        return $http.put('::actividades/para-alumnos-toggle',
    {
          actividad_id: $scope.actividad.id,
          para_alumnos: para
        }).then(function(r) {
          if (para) {
            return toastr.success('Debe haber al menos un grupo seleccionado');
          } else {
            return toastr.info('No la realizarán los alumnos');
          }
        },
    function(r2) {
          toastr.warning('No se pudo guardar cambio',
    'Problema');
          return false;
        });
      };
      $scope.para_profesores_toggle = function(para_prof) {
        return $http.put('::actividades/para-profesores-toggle',
    {
          actividad_id: $scope.actividad.id,
          para_profesores: para_prof
        }).then(function(r) {
          if (para_prof) {
            return toastr.success('La realizarán los docentes');
          } else {
            return toastr.info('No la realizarán los docentes');
          }
        },
    function(r2) {
          toastr.warning('No se pudo guardar cambio',
    'Problema');
          return false;
        });
      };
      $scope.para_acudientes_toggle = function(para) {
        return $http.put('::actividades/para-acudientes-toggle',
    {
          actividad_id: $scope.actividad.id,
          para_acudientes: para
        }).then(function(r) {
          if (para) {
            return toastr.success('La realizarán los acudientes');
          } else {
            return toastr.info('No la realizarán los acudientes');
          }
        },
    function(r2) {
          toastr.warning('No se pudo guardar cambio',
    'Problema');
          return false;
        });
      };
      $scope.toggle_compartida = function(compar) {
        return $http.put('::actividades/set-compartida',
    {
          actividad_id: $scope.actividad.id,
          compartida: compar
        }).then(function(r) {
          return toastr.success('Compartida: ' + compar);
        },
    function(r2) {
          toastr.warning('No se pudo establecer compartida',
    'Problema');
          return false;
        });
      };
      $scope.select_grupo_compartido = function($item) {
        return $http.put('::actividades/insert-grupo-compartido',
    {
          actividad_id: $scope.actividad.id,
          grupo_id: $item.id
        }).then(function(r) {
          return toastr.success('Grupo agregado');
        },
    function(r2) {
          toastr.warning('No se pudo agregar grupo',
    'Problema');
          return false;
        });
      };
      $scope.quitando_grupo_compartido = function($item) {
        return $http.put('::actividades/quitando-grupo-compartido',
    {
          actividad_id: $scope.actividad.id,
          grupo_id: $item.id
        }).then(function(r) {
          return toastr.success('Grupo quitado');
        },
    function(r2) {
          toastr.warning('No se pudo quitar grupo',
    'Problema');
          return false;
        });
      };
      $scope.ver_preguntas = function() {
        $scope.mostrando_preguntas = true;
        return $scope.mostrando_detalles_actividad = false;
      };
      $scope.ver_detalles_actividad = function() {
        return $scope.mostrando_detalles_actividad = true;
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=EditarActividadCtrl.js.map
