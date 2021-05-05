(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('DefinitivasPeriodosCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    '$rootScope',
    '$filter',
    'App',
    'asignaturas_definitivas',
    'AuthService',
    '$timeout',
    'EscalasValorativasServ',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    $rootScope,
    $filter,
    App,
    asignaturas_definitivas,
    AuthService,
    $timeout,
    EscalasValorativasServ) {
      var asignat,
    asignatura_id_def,
    i,
    len,
    ref;
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
      $scope.opts_picker = {
        minDate: new Date('1/1/2017'),
        showWeeks: false,
        startingDay: 0
      };
      $scope.dato = {
        asignatura: {}
      };
      $scope.ocultando_ausencias = true;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      //$scope.$parent.bigLoader 	= false
      $scope.selectAsignatura = function(asignatura) {
        var asignat,
    i,
    len,
    ref;
        localStorage.asignatura_id_def = asignatura.asignatura_id;
        $scope.dato.asignatura = asignatura;
        ref = $scope.asignaturas;
        for (i = 0, len = ref.length; i < len; i++) {
          asignat = ref[i];
          asignat.active = false;
        }
        return asignatura.active = true;
      };
      if (asignaturas_definitivas === 'Sin alumnos') {
        toastr.warning('No parece que tengas acceso');
        $state.go('panel');
      }
      $scope.asignaturas = asignaturas_definitivas.data;
      asignatura_id_def = 0;
      if ($scope.USER.is_superuser) {
        if ($scope.asignaturas.length === 0) {
          toastr.warning('Profesor no tiene asignaturas');
        } else {
          $scope.dato.asignatura.nombres_profesor = $scope.asignaturas[0].nombres_profesor;
        }
      }
      if (localStorage.asignatura_id_def) {
        asignatura_id_def = parseInt(localStorage.asignatura_id_def);
      }
      ref = $scope.asignaturas;
      for (i = 0, len = ref.length; i < len; i++) {
        asignat = ref[i];
        if (parseInt(asignat.asignatura_id) === parseInt(asignatura_id_def)) {
          $scope.dato.asignatura = asignat;
          $scope.selectAsignatura($scope.dato.asignatura);
        }
      }
      //####################################################################
      //#####################      NOTAS       #############################
      //####################################################################
      $scope.cambiaNotaDef = function(alumno,
    nota,
    nf_id,
    num_periodo,
    alumnos) {
        if (nota > $scope.escala_maxima.porc_final || nota === 'undefined' || nota === void 0) {
          toastr.error('No puede ser mayor de ' + $scope.escala_maxima.porc_final,
    'NO guardada',
    {
            timeOut: 8000
          });
          return;
        }
        if (nf_id) {
          return $http.put('::definitivas_periodos/update',
    {
            nf_id: nf_id,
            nota: nota,
            num_periodo: num_periodo
          }).then(function(r) {
            alumno['manual_' + num_periodo] = 1;
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
        } else {
          return $http.put('::definitivas_periodos/update',
    {
            alumno_id: alumno.alumno_id,
            nota: nota,
            asignatura_id: $scope.dato.asignatura.asignatura_id,
            num_periodo: num_periodo
          }).then(function(r) {
            toastr.success('Creada: ' + nota);
            r = r.data[0];
            alumno['nf_id_' + num_periodo] = r.id;
            alumno['nfinal' + num_periodo + '_desactualizada'] = 0;
            alumno['periodo_id' + num_periodo] = r.periodo_id;
            alumno['recuperada_' + num_periodo] = 0;
            return alumno['manual_' + num_periodo] = 1;
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
        }
      };
      $scope.arreglarDuplicados = function(per) {
        var periodo;
        periodo = $scope.periodos[per];
        return $http.get('::definitivas_periodos/arreglar-duplicados?periodo_id=' + periodo.id).then(function(r) {
          return console.log(r);
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
      $scope.cambiaNotaRecuFinal = function(alumno,
    nota,
    rf_id) {
        if (nota > $scope.escala_maxima.porc_final || nota === 'undefined' || nota === void 0) {
          toastr.error('No puede ser mayor de ' + $scope.escala_maxima.porc_final,
    'NO guardada',
    {
            timeOut: 8000
          });
          return;
        }
        if (alumno.promedio_automatico > nota) {
          toastr.error('Debe ser mayor que la definitiva.',
    'No guardado');
        }
        if (rf_id) {
          return $http.put('::definitivas_periodos/update-recuperacion',
    {
            rf_id: rf_id,
            nota: nota
          }).then(function(r) {
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
        } else {
          return $http.put('::definitivas_periodos/update-recuperacion',
    {
            alumno_id: alumno.alumno_id,
            nota: nota,
            asignatura_id: $scope.dato.asignatura.asignatura_id
          }).then(function(r) {
            toastr.success('Creada: ' + nota);
            r = r.data;
            alumno['recu_id'] = r.id;
            alumno['recu_year'] = r.year;
            return alumno['recu_nota'] = r.nota;
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
        }
      };
      $scope.eliminarRecuperacion = function(alumno,
    rf_id) {
        var res;
        res = confirm('¿Seguro que desea eliminar nota?');
        if (res) {
          return $http.put('::definitivas_periodos/eliminar-recuperada',
    {
            rf_id: rf_id
          }).then(function(r) {
            toastr.success('Eliminada. Puede volver a crearla cuando quiera');
            alumno['recu_id'] = void 0;
            alumno['recu_year'] = void 0;
            return alumno['recu_nota'] = void 0;
          },
    function(r2) {
            if (r2.status === 400) {
              return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
            } else {
              return toastr.error('No pudimos eliminar nota ' + nota);
            }
          });
        }
      };
      $scope.toggleNotaRecuperada = function(alumno,
    recuperada,
    nf_id,
    num_periodo) {
        return $http.put('::definitivas_periodos/toggle-recuperada',
    {
          nf_id: nf_id,
          recuperada: recuperada,
          num_periodo: num_periodo
        }).then(function(r) {
          if (recuperada && !alumno['manual_' + num_periodo]) {
            alumno['manual_' + num_periodo] = 1;
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
            return toastr.error('No pudimos guardar la recuperación.',
    {
              timeOut: 8000
            });
          }
        });
      };
      $scope.toggleNotaManual = function(alumno,
    manual,
    nf_id,
    num_periodo) {
        return $http.put('::definitivas_periodos/toggle-manual',
    {
          nf_id: nf_id,
          manual: manual,
          num_periodo: num_periodo
        }).then(function(r) {
          if (!manual && alumno['recuperada_' + num_periodo]) {
            alumno['recuperada_' + num_periodo] = 0;
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
            return toastr.error('No pudimos guardar la recuperación.',
    {
              timeOut: 8000
            });
          }
        });
      };
      $scope.promedioTotalDef = function(alu) {
        var promedio;
        promedio = (alu.nota_final_per1 + alu.nota_final_per2 + alu.nota_final_per3 + alu.nota_final_per4) / 4;
        alu.nota_requerida = 0;
        alu.total_definit = 0;
        if (promedio < $scope.nota_minima_aceptada) {
          alu.nota_requerida = $filter('number')($scope.nota_minima_aceptada - promedio,
    0);
        }
        alu.total_definit = parseFloat($filter('number')(promedio,
    1));
        return alu.total_definit;
      };
      $scope.toggleAusencias = function() {
        $scope.ocultando_ausencias = !$scope.ocultando_ausencias;
        return localStorage.ocultando_ausencias = $scope.ocultando_ausencias;
      };
      $scope.cambiaAusencia = function(alumno) {
        var ausencia_id,
    datos,
    j,
    k,
    pedida,
    pedidas,
    ref1,
    ref2,
    results,
    results1;
        // Si incrementó el número
        if (alumno.ausencias_count > alumno.ausencias.length) {
          pedidas = alumno.ausencias_count - alumno.ausencias.length;
          results = [];
          for (pedida = j = 0, ref1 = pedidas - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); pedida = 0 <= ref1 ? ++j : --j) {
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
          for (pedida = k = 0, ref2 = pedidas - 1; (0 <= ref2 ? k <= ref2 : k >= ref2); pedida = 0 <= ref2 ? ++k : --k) {
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
    j,
    k,
    pedida,
    pedidas,
    ref1,
    ref2,
    results,
    results1,
    tardanza_id;
        if (alumno.tardanzas_count > alumno.tardanzas.length) {
          pedidas = alumno.tardanzas_count - alumno.tardanzas.length;
          results = [];
          for (pedida = j = 0, ref1 = pedidas - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); pedida = 0 <= ref1 ? ++j : --j) {
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
          for (pedida = k = 0, ref2 = pedidas - 1; (0 <= ref2 ? k <= ref2 : k >= ref2); pedida = 0 <= ref2 ? ++k : --k) {
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
    }
  ]);

}).call(this);

//# sourceMappingURL=DefinitivasPeriodosCtrl.js.map
