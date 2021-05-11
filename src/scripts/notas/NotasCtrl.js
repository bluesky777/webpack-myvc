(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('NotasCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    '$rootScope',
    '$filter',
    'App',
    'AuthService',
    '$timeout',
    'EscalasValorativasServ',
    '$stateParams',
    'NotasServ',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    $rootScope,
    $filter,
    App,
    AuthService,
    $timeout,
    EscalasValorativasServ,
    $stateParams,
    NotasServ) {
      AuthService.verificar_acceso();
      $scope.asignatura = {};
      $scope.asignatura_id = $state.params.asignatura_id;
      $scope.datos = {};
      $scope.UNIDAD = $scope.USER.unidad_displayname;
      $scope.SUBUNIDAD = $scope.USER.subunidad_displayname;
      $scope.UNIDADES = $scope.USER.unidades_displayname;
      $scope.SUBUNIDADES = $scope.USER.subunidades_displayname;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.ocultando_ausencias = true;
      $scope.ausencia_edit = {}; // Para editar en el popover
      $scope.tardanza_edit = {};
      $scope.alumno_aus_tard_edit = {};
      $scope.opts_picker = {
        minDate: new Date('1/1/2017'),
        showWeeks: false,
        startingDay: 0
      };
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      NotasServ.detalladas($stateParams.asignatura_id,
    $stateParams.profesor_id,
    true).then(function(r) {
        $scope.asignatura = r.asignatura;
        $scope.alumnos = r.alumnos;
        $scope.unidades = r.unidades;
        $scope.asignaturas = r.asignaturas;
        return $scope.arreglarDatos();
      },
    /*
    $timeout(()->
    	$scope.$parent.bigLoader 	= false
    , 1000)
    */
    function(r2) {
        return toastr.error('No se pudo traer las notas con asignaturas.');
      });
      EscalasValorativasServ.escalas().then(function(r) {
        return $scope.escalas = r;
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      $scope.arreglarDatos = function() {
        var alumno,
    asignat,
    ausencia,
    i,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    len4,
    len5,
    m,
    n,
    ref,
    ref1,
    ref2,
    ref3,
    ref4,
    ref5,
    subunidad,
    tardanza,
    unidad;
        // Las Subunidades están en cada Unidad. Necesito agregarlas juntas en un solo Array
        $scope.subunidadesunidas = [];
        ref = $scope.unidades;
        for (i = 0, len = ref.length; i < len; i++) {
          unidad = ref[i];
          if (unidad.subunidades.length === 0) {
            $scope.subunidadesunidas.push({
              empty: true
            });
          }
          ref1 = unidad.subunidades;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            subunidad = ref1[j];
            $scope.subunidadesunidas.push(subunidad);
          }
        }
        if (localStorage.ocultando_ausencias) {
          $scope.ocultando_ausencias = localStorage.ocultando_ausencias === 'true';
        }
        if (localStorage.historial_activado) {
          $scope.historial_activado = localStorage.historial_activado === 'true';
        }
        if (localStorage.inmovible_activado) {
          $scope.inmovible_activado = localStorage.inmovible_activado === 'true';
        } else {
          $scope.inmovible_activado = true;
        }
        if (localStorage.titulos_activado) {
          $scope.titulos_activado = localStorage.titulos_activado === 'true';
        } else {
          $timeout(function() {
            return $scope.toggleTitulos();
          },
    200);
        }
        ref2 = $scope.alumnos;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          alumno = ref2[k];
          ref3 = alumno.ausencias;
          for (l = 0, len3 = ref3.length; l < len3; l++) {
            ausencia = ref3[l];
            if (ausencia.fecha_hora) {
              ausencia.fecha_hora = new Date(ausencia.fecha_hora);
            }
          }
          ref4 = alumno.tardanzas;
          for (m = 0, len4 = ref4.length; m < len4; m++) {
            tardanza = ref4[m];
            if (tardanza.fecha_hora) {
              tardanza.fecha_hora = new Date(tardanza.fecha_hora);
            }
          }
        }
        ref5 = $scope.asignaturas;
        for (n = 0, len5 = ref5.length; n < len5; n++) {
          asignat = ref5[n];
          if (parseInt(asignat.asignatura_id) === parseInt($scope.asignatura.asignatura_id)) {
            asignat.active = true;
          }
        }
        return $timeout(function() {
          if (localStorage.tab_horiz_or_verti) {
            if (localStorage.tab_horiz_or_verti === 'vertical') {
              return $scope.setTabVertically();
            } else {
              return $scope.setTabHorizontally();
            }
          } else {
            return $scope.setTabHorizontally();
          }
        },
    1);
      };
      $scope.setTabVertically = function() {
        var filas;
        localStorage.tab_horiz_or_verti = 'vertical';
        $scope.tab_horiz_or_verti = 'vertical';
        filas = $('table tr');
        angular.forEach(filas,
    function(value,
    key) {
          var fila,
    inputs;
          fila = $(value);
          inputs = fila.find('.input-nota');
          return angular.forEach(inputs,
    function(value2,
    key2) {
            var a;
            a = $(value2);
            return a.attr('tabindex',
    key2 + 1);
          });
        });
        if ($scope.eleFocus) {
          if ($scope.eleFocus.focus) {
            return $scope.eleFocus.focus();
          }
        }
      };
      $scope.setTabHorizontally = function() {
        var filas;
        localStorage.tab_horiz_or_verti = 'horizontal';
        $scope.tab_horiz_or_verti = 'horizontal';
        filas = $('.input-nota');
        angular.forEach(filas,
    function(value,
    key) {
          var a;
          a = $(value);
          return a.attr('tabindex',
    key + 1);
        });
        if ($scope.eleFocus) {
          return $scope.eleFocus.focus();
        }
      };
      $scope.onInputFocus = function($event) {
        return $scope.eleFocus = $event.currentTarget;
      };
      $scope.traerNotasDeAsignatura = function(asignatura) {
        var asignat,
    i,
    len,
    ref;
        //$scope.$parent.bigLoader 	= true
        $state.go('.',
    {
          asignatura_id: asignatura.asignatura_id
        },
    {
          notify: false
        });
        NotasServ.detalladas(asignatura.asignatura_id,
    asignatura.profesor_id,
    false).then(function(r) {
          $scope.asignatura = r.asignatura;
          $scope.alumnos = r.alumnos;
          $scope.unidades = r.unidades;
          return $scope.arreglarDatos();
        });
        ref = $scope.asignaturas;
        /*
        $timeout(()->
        	$scope.$parent.bigLoader 	= false
        , 500)
        */
        for (i = 0, len = ref.length; i < len; i++) {
          asignat = ref[i];
          asignat.active = false;
        }
        asignatura.active = true;
        return $scope.asignatura_id = asignatura.asignatura_id;
      };
      $scope.toggleHistorial = function() {
        $scope.historial_activado = !$scope.historial_activado;
        localStorage.historial_activado = $scope.historial_activado;
        if ($scope.historial_activado) {
          return toastr.info('Ahora dale doble click a la nota que quieres ver');
        }
      };
      $scope.toggleInmovible = function() {
        $scope.inmovible_activado = !$scope.inmovible_activado;
        localStorage.inmovible_activado = $scope.inmovible_activado;
        if (!$scope.inmovible_activado) {
          return $('td.fixed-cell').css({
            'transform': 'translate(0, 0)'
          });
        }
      };
      $scope.toggleTitulos = function() {
        $scope.titulos_activado = !$scope.titulos_activado;
        return localStorage.titulos_activado = $scope.titulos_activado;
      };
      $scope.seleccionarFila = function(alumno) {
        var alum,
    i,
    len,
    ref;
        ref = $scope.alumnos;
        for (i = 0, len = ref.length; i < len; i++) {
          alum = ref[i];
          alum.seleccionado = false;
        }
        return alumno.seleccionado = true;
      };
      //####################################################################
      //#############   AUSENCIAS Y TARDANZAS   ############################
      //####################################################################
      $scope.toggleAusencias = function() {
        $scope.ocultando_ausencias = !$scope.ocultando_ausencias;
        return localStorage.ocultando_ausencias = $scope.ocultando_ausencias;
      };
      $scope.cambiaAusencia = function(alumno) {
        var ausencia_id,
    datos,
    i,
    j,
    pedida,
    pedidas,
    ref,
    ref1,
    results,
    results1;
        // Si incrementó el número
        if (alumno.ausencias_count > alumno.ausencias.length) {
          pedidas = alumno.ausencias_count - alumno.ausencias.length;
          results = [];
          for (pedida = i = 0, ref = pedidas - 1; (0 <= ref ? i <= ref : i >= ref); pedida = 0 <= ref ? ++i : --i) {
            datos = {
              alumno_id: alumno.alumno_id,
              asignatura_id: $scope.asignatura_id,
              cantidad_ausencia: 1
            };
            // fecha_hora = new Date(numYearActual, parseInt($scope.dato.mes), dia)
            results.push($http.post('::ausencias/store',
    datos).then(function(r) {
              r = r.data;
              //r.fecha_hora = new Date(r.fecha_hora)
              return alumno.ausencias.push(r);
            },
    function(r2) {
              return toastr.warning('No se pudo agregar ausencia.',
    'Problema');
            }));
          }
          return results;
        // Si bajó el número
        } else if (alumno.ausencias_count < alumno.ausencias.length) {
          pedidas = alumno.ausencias.length - alumno.ausencias_count;
          results1 = [];
          for (pedida = j = 0, ref1 = pedidas - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); pedida = 0 <= ref1 ? ++j : --j) {
            ausencia_id = alumno.ausencias[alumno.ausencias.length - pedida - 1].id;
            results1.push($http.delete('::ausencias/destroy/' + ausencia_id).then(function(r) {
              r = r.data;
              //r.fecha_hora = new Date(r.fecha_hora)
              return alumno.ausencias = $filter('filter')(alumno.ausencias,
    {
                id: '!' + r.id
              });
            },
    function(r2) {
              return toastr.warning('No se pudo quitar ausencia.',
    'Problema');
            }));
          }
          return results1;
        }
      };
      $scope.cambiaTardanza = function(alumno) {
        var datos,
    i,
    j,
    pedida,
    pedidas,
    ref,
    ref1,
    results,
    results1,
    tardanza_id;
        if (alumno.tardanzas_count > alumno.tardanzas.length) {
          pedidas = alumno.tardanzas_count - alumno.tardanzas.length;
          results = [];
          for (pedida = i = 0, ref = pedidas - 1; (0 <= ref ? i <= ref : i >= ref); pedida = 0 <= ref ? ++i : --i) {
            datos = {
              alumno_id: alumno.alumno_id,
              asignatura_id: $scope.asignatura_id,
              cantidad_tardanza: 1
            };
            // fecha_hora = new Date(numYearActual, parseInt($scope.dato.mes), dia)
            results.push($http.post('::ausencias/store',
    datos).then(function(r) {
              r = r.data;
              //r.fecha_hora = new Date(r.fecha_hora)
              return alumno.tardanzas.push(r);
            },
    function(r2) {
              return toastr.warning('No se pudo agregar tardanza.',
    'Problema');
            }));
          }
          return results;
        // Si bajó el número
        } else if (alumno.tardanzas_count < alumno.tardanzas.length) {
          pedidas = alumno.tardanzas.length - alumno.tardanzas_count;
          results1 = [];
          for (pedida = j = 0, ref1 = pedidas - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); pedida = 0 <= ref1 ? ++j : --j) {
            tardanza_id = alumno.tardanzas[alumno.tardanzas.length - pedida - 1].id;
            results1.push($http.delete('::ausencias/destroy/' + tardanza_id).then(function(r) {
              r = r.data;
              //r.fecha_hora = new Date(r.fecha_hora)
              return alumno.tardanzas = $filter('filter')(alumno.tardanzas,
    {
                id: '!' + r.id
              });
            },
    function(r2) {
              return toastr.warning('No se pudo quitar tardanza.',
    'Problema');
            }));
          }
          return results1;
        }
      };
      $scope.clickAusenciaObject = function(ausencia,
    alumno) {
        ausencia.backup = ausencia.fecha_hora;
        if (ausencia.fecha_hora) {
          ausencia.fecha_hora = new Date(ausencia.fecha_hora);
        } else {
          ausencia.fecha_hora = new Date();
        }
        $scope.ausencia_edit = ausencia;
        $scope.alumno_aus_tard_edit = alumno;
        return ausencia.isOpen = !ausencia.isOpen;
      };
      $scope.clickTardanzaObject = function(tardanza,
    alumno) {
        tardanza.backup = tardanza.fecha_hora;
        if (tardanza.fecha_hora) {
          tardanza.fecha_hora = new Date(tardanza.fecha_hora);
        } else {
          tardanza.fecha_hora = new Date();
        }
        $scope.tardanza_edit = tardanza;
        $scope.alumno_aus_tard_edit = alumno;
        return tardanza.isOpen = !tardanza.isOpen;
      };
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
          alumno.tardanzas.push(r);
          $scope.ausencia_edit.isOpen = false;
          return $scope.tardanza_edit.isOpen = false;
        },
    function(r2) {
          return toastr.warning('No se pudo agregar tardanza.',
    'Problema');
        });
      };
      $scope.cancelarCambioAusencia = function(ausencia_edit) {
        return ausencia_edit.isOpen = false;
      };
      $scope.cancelarCambioTardanza = function(tardanza_edit) {
        return tardanza_edit.isOpen = false;
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
      //####################################################################
      //#####################      NOTAS       #############################
      //####################################################################
      $scope.cambiaNotaDef = function(alumno,
    nota,
    nf_id) {
        if (nota > $scope.escala_maxima.porc_final || nota === 'undefined' || nota === void 0) {
          toastr.error('No puede ser mayor de ' + $scope.escala_maxima.porc_final,
    'NO guardada',
    {
            timeOut: 8000
          });
          return;
        }
        return $http.put('::definitivas_periodos/update',
    {
          nf_id: nf_id,
          nota: nota
        }).then(function(r) {
          if (!alumno.nota_final.manual) {
            alumno.nota_final.manual = 1;
          }
          return toastr.success('Cambiada: ' + nota);
        },
    function(r2) {
          if (r2.status === 400) {
            return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
          } else {
            return toastr.error('No pudimos guardar la nota ' + nota,
    '',
    {
              timeOut: 8000
            });
          }
        });
      };
      $scope.toggleNotaFinalRecuperada = function(alumno,
    recuperada,
    nf_id) {
        return $http.put('::definitivas_periodos/toggle-recuperada',
    {
          nf_id: nf_id,
          recuperada: recuperada
        }).then(function(r) {
          if (recuperada && !alumno.nota_final.manual) {
            alumno.nota_final.manual = 1;
            return toastr.success('Indicará que es recuperada, así que también será manual.');
          } else if (recuperada) {
            return toastr.success('Recuperada');
          } else {
            return toastr.success('No recuperada');
          }
        },
    function(r2) {
          if (r2.status === 400) {
            return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
          } else {
            return toastr.error('No pudimos cambiar.',
    '',
    {
              timeOut: 8000
            });
          }
        });
      };
      $scope.toggleNotaFinalManual = function(alumno,
    manual,
    nf_id) {
        return $http.put('::definitivas_periodos/toggle-manual',
    {
          nf_id: nf_id,
          manual: manual
        }).then(function(r) {
          if (!manual && alumno.nota_final.recuperada) {
            alumno.nota_final.recuperada = false;
            return toastr.success('Será automática y no recuperada.');
          } else if (manual) {
            return toastr.success('Nota manual.');
          } else {
            return toastr.success('Ahora la calculará el sistema.');
          }
        },
    function(r2) {
          if (r2.status === 400) {
            return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
          } else {
            return toastr.error('No pudimos cambiar.',
    '',
    {
              timeOut: 8000
            });
          }
        });
      };
      $scope.cambiaNota = function(nota,
    otra) {
        if (nota.nota > $scope.escala_maxima.porc_final || nota.nota === 'undefined' || nota.nota === void 0) {
          toastr.error('No puede ser mayor de ' + $scope.escala_maxima.porc_final,
    'NO guardada',
    {
            timeOut: 8000
          });
          return;
        }
        return $http.put('::notas/update/' + nota.id,
    {
          nota: nota.nota
        }).then(function(r) {
          toastr.success('Cambiada: ' + nota.nota);
          return nota.updated_at = nota.updated_at;
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
      $scope.showFrases = function(alumno) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==notas/showFrases.tpl.html',
          controller: 'ShowFrasesCtrl',
          size: 'lg',
          resolve: {
            alumno: function() {
              return alumno;
            },
            frases: function() {
              return $http.get('::frases');
            },
            asignatura: function() {
              return $scope.asignatura;
            },
            USER: function() {
              return $scope.USER;
            }
          }
        });
        return modalInstance.result.then(function(datos) {
          return alumno.frases = datos.frases_asignatura;
        },
    function(res) {
          return console.log(res);
        });
      };
      $scope.promedioTotal = function(alumno) {
        var acumSub,
    i,
    len,
    nota,
    ref,
    valorNota;
        acumSub = 0;
        ref = alumno.notas;
        for (i = 0, len = ref.length; i < len; i++) {
          nota = ref[i];
          valorNota = nota.nota * nota.subunidad_porc * nota.unidad_porc;
          acumSub = acumSub + valorNota;
        }
        alumno.total_definit = parseInt($filter('number')(acumSub,
    0));
        return $filter('number')(acumSub,
    1);
      };
      $scope.verDetalleNota = function(notaObject,
    alumno) {
        var modalInstance;
        if (!$scope.historial_activado) {
          return;
        }
        modalInstance = $modal.open({
          templateUrl: '==notas/notaDetalleModal.tpl.html',
          controller: 'NotaDetalleModalCtrl',
          resolve: {
            alumno: function() {
              return alumno;
            },
            nota: function() {
              return notaObject;
            }
          }
        });
        modalInstance.result.then(function(r) {
          if (r === 'Eliminada') {
            return notaObject.eliminada = true;
          }
        },
    function() {});
      };
      // nada
      $scope.verifClickNotaRapida = function(notaObject) {
        $timeout(function() {
          var temp;
          if ($rootScope.notaRapida.enable) {
            if (notaObject.backup) {
              if ($rootScope.notaRapida.valorNota !== notaObject.nota) {
                notaObject.backup = notaObject.nota;
                notaObject.nota = $rootScope.notaRapida.valorNota;
              } else {
                temp = notaObject.backup;
                notaObject.backup = notaObject.nota;
                notaObject.nota = temp;
              }
            } else {
              notaObject.backup = notaObject.nota;
              notaObject.nota = $rootScope.notaRapida.valorNota;
            }
            return $scope.cambiaNota(notaObject);
          }
        });
      };
      $scope.columnaNotaRapida = function(subunidad_id) {
        $timeout(function() {
          var alumno,
    contadorGuardadas,
    i,
    len,
    nota,
    ref,
    results,
    temp;
          if ($rootScope.notaRapida.enable) {
            ref = $scope.alumnos;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              alumno = ref[i];
              results.push((function() {
                var j,
    len1,
    ref1,
    results1;
                ref1 = alumno.notas;
                results1 = [];
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  nota = ref1[j];
                  if (nota.subunidad_id === subunidad_id) {
                    if (nota.backup) {
                      if ($rootScope.notaRapida.valorNota !== nota.nota) {
                        nota.backup = nota.nota;
                        nota.nota = $rootScope.notaRapida.valorNota;
                      } else {
                        temp = nota.backup;
                        nota.backup = nota.nota;
                        nota.nota = temp;
                      }
                    } else {
                      nota.backup = nota.nota;
                      nota.nota = $rootScope.notaRapida.valorNota;
                    }
                    contadorGuardadas = 0;
                    results1.push($http.put('::notas/update/' + nota.id,
    {
                      nota: nota.nota
                    }).then(function(r) {
                      // Toca hacerlo con promesa
                      contadorGuardadas = contadorGuardadas + 1;
                      if (contadorGuardadas === ($scope.alumnos.length - 1)) {
                        return toastr.success((contadorGuardadas + 1) + ' notas guardadas.');
                      }
                    },
    function(r2) {
                      return toastr.error('No pudimos guardar la nota ' + nota.nota,
    '',
    {
                        timeOut: 8000
                      });
                    }));
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              })());
            }
            return results;
          } else {
            return toastr.info('Activa la Nota Rápida para cambiar todas las notas de esta columna.');
          }
        });
      };
      $scope.filaNotaRapida = function(alumno,
    $index) {
        $timeout(function() {
          var contadorGuardadas,
    i,
    len,
    notaObject,
    ref,
    results,
    temp;
          if ($rootScope.notaRapida.enable) {
            ref = alumno.notas;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              notaObject = ref[i];
              if (notaObject.backup) {
                if ($rootScope.notaRapida.valorNota !== notaObject.nota) {
                  notaObject.backup = notaObject.nota;
                  notaObject.nota = $rootScope.notaRapida.valorNota;
                } else {
                  temp = notaObject.backup;
                  notaObject.backup = notaObject.nota;
                  notaObject.nota = temp;
                }
              } else {
                notaObject.backup = notaObject.nota;
                notaObject.nota = $rootScope.notaRapida.valorNota;
              }
              contadorGuardadas = 0;
              results.push($http.put('::notas/update/' + notaObject.id,
    {
                nota: notaObject.nota
              }).then(function(r) {
                // Toca hacerlo con promesa
                contadorGuardadas = contadorGuardadas + 1;
                if (contadorGuardadas === (alumno.notas.length - 1)) {
                  return toastr.success((contadorGuardadas + 1) + ' notas guardadas.');
                }
              },
    function(r2) {
                return toastr.error('No pudimos guardar la nota ' + notaObject.nota,
    '',
    {
                  timeOut: 8000
                });
              }));
            }
            return results;
          } else {
            return toastr.info('Activa la Nota Rápida para cambiar todas las notas de este alumno.');
          }
        });
        return;
        $timeout(function() {
          var contadorGuardadas,
    i,
    len,
    notaObject,
    ref,
    results,
    subunidad,
    temp;
          if ($rootScope.notaRapida.enable) {
            ref = $scope.subunidadesunidas;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              subunidad = ref[i];
              notaObject = subunidad.notas[$index];
              if (notaObject.backup) {
                if ($rootScope.notaRapida.valorNota !== notaObject.nota) {
                  notaObject.backup = notaObject.nota;
                  notaObject.nota = $rootScope.notaRapida.valorNota;
                } else {
                  temp = notaObject.backup;
                  notaObject.backup = notaObject.nota;
                  notaObject.nota = temp;
                }
              } else {
                notaObject.backup = notaObject.nota;
                notaObject.nota = $rootScope.notaRapida.valorNota;
              }
              contadorGuardadas = 0;
              results.push($http.put('::notas/update/' + notaObject.id,
    {
                nota: notaObject.nota
              }).then(function(r) {
                // Toca hacerlo con promesa
                contadorGuardadas = contadorGuardadas + 1;
                if (contadorGuardadas === ($scope.subunidadesunidas.length - 1)) {
                  return toastr.success((contadorGuardadas + 1) + 'Notas guardadas.');
                }
              },
    function(r2) {
                return toastr.error('No pudimos guardar la nota ' + notaObject.nota,
    '',
    {
                  timeOut: 8000
                });
              }));
            }
            return results;
          } else {
            return toastr.info('Activa la Nota Rápida para cambiar todas las notas de este alumno.');
          }
        });
      };
    }
  ]).controller('ShowFrasesCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'frases',
    'asignatura',
    '$http',
    'toastr',
    '$filter',
    'USER',
    'AuthService',
    function($scope,
    $modalInstance,
    alumno,
    frases,
    asignatura,
    $http,
    toastr,
    $filter,
    USER,
    AuthService) {
      $scope.alumno = alumno;
      $scope.frases = frases.data;
      $scope.asignatura = asignatura;
      $scope.USER = USER;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.alumno.newFrase = '';
      $http.get('::frases_asignatura/show/' + alumno.alumno_id + '/' + asignatura.asignatura_id).then(function(r) {
        return $scope.frases_asignatura = r.data;
      },
    function(r2) {
        return toastr.warning('No se pudo traer frases.',
    'Problema');
      });
      $scope.addFrase = function() {
        var dato;
        if ($scope.alumno.newFrase !== '') {
          dato = {
            alumno_id: alumno.alumno_id,
            frase: $scope.alumno.newFrase,
            asignatura_id: $scope.asignatura.asignatura_id
          };
          return $http.post('::frases_asignatura/store',
    dato).then(function(r) {
            $scope.frases_asignatura = r.data;
            return toastr.success('Frase añadida.');
          },
    function(r2) {
            return toastr.warning('No se pudo añadir frase.',
    'Problema');
          });
        } else {
          return toastr.warning('No ha copiado ninguna frase');
        }
      };
      $scope.addFrase_id = function() {
        var dato;
        if ($scope.alumno.newFrase_by_id) {
          dato = {
            alumno_id: alumno.alumno_id,
            frase_id: $scope.alumno.newFrase_by_id.id,
            asignatura_id: $scope.asignatura.asignatura_id
          };
          return $http.post('::frases_asignatura/store/' + $scope.alumno.newFrase_by_id.id,
    dato).then(function(r) {
            toastr.success('Frase añadida.');
            return $scope.frases_asignatura = r.data;
          },
    function(r2) {
            return toastr.warning('No se pudo añadir frase.',
    'Problema');
          });
        } else {
          return toastr.warning('No ha seleccionado frase');
        }
      };
      $scope.quitarFrase = function(fraseasig) {
        return $http.delete('::frases_asignatura/destroy/' + fraseasig.id).then(function(r) {
          toastr.success('Frase quitada');
          return $scope.frases_asignatura = $filter('filter')($scope.frases_asignatura,
    {
            id: '!' + fraseasig.id
          });
        },
    function(r2) {
          return toastr.warning('No se pudo quitar la frase.',
    'Problema');
        });
      };
      $scope.ok = function() {
        return $modalInstance.close({
          alumno: alumno,
          frases_asignatura: $scope.frases_asignatura
        });
      };
      return $scope.$on('modal.closing',
    function(event,
    reason,
    closed) {
        switch (reason) {
          // clicked outside
          case "backdrop click":
            $modalInstance.close({
              alumno: alumno,
              frases_asignatura: $scope.frases_asignatura
            });
            return event.preventDefault();
          case "cancel":
            $modalInstance.close({
              alumno: alumno,
              frases_asignatura: $scope.frases_asignatura
            });
            return event.preventDefault();
          case "escape key press":
            $modalInstance.close({
              alumno: alumno,
              frases_asignatura: $scope.frases_asignatura
            });
            return event.preventDefault();
        }
      });
    }
  ]).controller('NotaDetalleModalCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'nota',
    'AuthService',
    '$http',
    'toastr',
    '$filter',
    function($scope,
    $modalInstance,
    alumno,
    nota,
    AuthService,
    $http,
    toastr,
    $filter) {
      $scope.alumno = alumno;
      $scope.nota = nota;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $http.put('::historiales/nota-detalle',
    {
        nota_id: nota.id
      }).then(function(r) {
        $scope.cambios = r.data.cambios;
        return $scope.nota_detalle = r.data.nota;
      },
    function(r2) {
        return toastr.warning('No se pudo traer el historial.',
    'Problema');
      });
      $scope.eliminarNota = function() {
        return $http.delete('::notas/destroy/' + nota.id).then(function(r) {
          toastr.success('Nota eliminada',
    'Puede recargar y será creada de nuevo');
          return $modalInstance.close('Eliminada');
        },
    function(r2) {
          return toastr.error('No se pudo eliminar nota.',
    'Problema');
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close(alumno);
      };
    }
  ]);

}).call(this);

//NotasCtrl.js.map
