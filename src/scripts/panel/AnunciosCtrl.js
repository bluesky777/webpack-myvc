(function() {
  angular.module('myvcFrontApp').controller('AnunciosDirCtrl', [
    '$scope',
    '$uibModal',
    'AuthService',
    '$http',
    'toastr',
    '$filter',
    'App',
    '$timeout',
    'Upload',
    '$sce',
    'uiCalendarConfig',
    '$compile',
    'EscalasValorativasServ',
    function($scope,
    $modal,
    AuthService,
    $http,
    toastr,
    $filter,
    App,
    $timeout,
    $upload,
    $sce,
    uiCalendarConfig,
    $compile,
    EscalasValorativasServ) {
      var generateThumbAndUpload,
    uploadUsing$upload;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.srcCant = $scope.views + 'informes2/verCantAlumnosPorGrupos.tpl.html';
      //$scope.fileReaderSupported 	  = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
      $scope.fileReaderSupported = window.FileReader !== null && (window.FileAPI === null);
      $scope.imgFiles = [];
      $scope.imagen_subida = true;
      $scope.mostrar_publicaciones = true;
      $scope.guardando_publicacion = false;
      $scope.USER = $scope.USER;
      $scope.profe_seleccionado = false;
      $scope.mostrando_edit_evento = false;
      $scope.actualizando_cumples = false;
      $scope.IS_PROF_ADMIN = $scope.hasRoleOrPerm(['admin',
    'profesor']);
      $scope.IS_ALUM_ACUD = $scope.hasRoleOrPerm(['alumno',
    'acudiente',
    'psicólogo',
    'enfermero']) || $scope.USER.tipo === 'Acudiente';
      $scope.new_publicacion = {
        publi_para: 'publi_para_todos',
        para_alumnos: 1
      };
      $scope.evento_actual = {
        title: '',
        start: null,
        end: null,
        allDay: 1,
        solo_profes: 0
      };
      // CALENDARIO
      $scope.data = {}; // Para el popup del Datapicker
      $scope.dateOptions = {
        formatYear: 'yyyy'
      };
      if (localStorage.panel_tab_actual) {
        $scope.panel_tab_actual = localStorage.panel_tab_actual;
      }
      $scope.guardarEvento = function(evento) {
        if (evento.title.length === 0 || !evento.start) {
          toastr.warning('Escribe título y fecha inicio');
          return;
        }
        if (!evento.allDay && !evento.end) {
          toastr.warning('Escribe fecha fin o elige Todo el día');
          return;
        }
        evento.guardando = true;
        if (evento.editar) {
          return $http.put('::calendario/guardar-evento',
    evento).then(function() {
            toastr.success('Guardado');
            evento.guardando = false;
            evento.editar = false;
            return $scope.evento_actual = {
              title: '',
              start: null,
              end: null,
              allDay: 1,
              solo_profes: 0,
              id: null
            };
          },
    function() {
            toastr.error('Error guardando');
            return evento.guardando = false;
          });
        } else {
          return $http.put('::calendario/crear-evento',
    evento).then(function(r) {
            toastr.success('Creado');
            evento.guardando = false;
            evento.id = r.data.evento_id;
            $scope.eventos[0].push(evento);
            return $scope.evento_actual = {
              title: '',
              start: null,
              end: null,
              allDay: 1,
              solo_profes: 0,
              id: null
            };
          },
    function() {
            toastr.error('Error creando');
            return evento.guardando = false;
          });
        }
      };
      $scope.actualizarEventos = function() {
        return $http.put('::calendario/this-year',
    {
          is_prof_admin: $scope.IS_PROF_ADMIN
        }).then(function(r) {
          $scope.eventos = null;
          return $timeout(function() {
            var evento,
    j,
    len,
    ref;
            ref = r.data;
            for (j = 0, len = ref.length; j < len; j++) {
              evento = ref[j];
              evento.start = new Date(evento.start);
              evento.end = evento.end ? new Date(evento.end) : null;
              if (evento.solo_profes) {
                evento.className = 'evento-solo-profes';
              } else {
                evento.className = evento.cumple_alumno_id || evento.cumple_profe_id ? 'evento-cumpleanios' : null;
              }
            }
            $scope.eventos = [r.data];
            return toastr.success('Actualizado');
          },
    500);
        },
    function() {
          return toastr.error('Error actualizando');
        });
      };
      $scope.noMostrarEditEvento = function() {
        return $scope.mostrando_edit_evento = false;
      };
      $scope.mostrarEditEvento = function() {
        return $scope.mostrando_edit_evento = true;
      };
      $scope.cancelarEdicion = function() {
        return $scope.evento_actual = {
          title: '',
          start: null,
          end: null,
          allDay: 1,
          id: null
        };
      };
      $scope.eliminarEvento = function(evento) {
        var respu;
        if (evento.guardando) {
          return;
        }
        respu = confirm('¿Seguro que desea eliminar evento?');
        if (!respu) {
          return;
        }
        evento.guardando = true;
        if (evento.editar) {
          return $http.put('::calendario/eliminar-evento',
    evento).then(function() {
            toastr.success('Eliminado');
            evento.guardando = false;
            return $scope.evento_actual = {
              title: '',
              start: null,
              end: null,
              solo_profes: 0,
              allDay: 1
            };
          },
    function() {
            toastr.error('Error eliminando');
            return evento.guardando = false;
          });
        }
      };
      $scope.actualizarCumplesEnCalendario = function() {
        var respu;
        respu = confirm('Esto borrará y creará de nuevo los cumpleaños, ¿continuar?');
        if (!respu) {
          return;
        }
        $scope.actualizando_cumples = true;
        return $http.put('::calendario/sincronizar-cumples').then(function() {
          toastr.success('Sincronizado',
    'Actualice');
          return $scope.actualizando_cumples = false;
        },
    function() {
          toastr.error('Error sincronizando');
          return $scope.actualizando_cumples = false;
        });
      };
      $scope.fromEventoToActual = function(date) {
        return $scope.evento_actual = {
          title: date.title,
          start: date.start ? new Date(date.start) : null,
          end: date.end ? new Date(date.end) : null,
          allDay: date.allDay ? 1 : 0,
          solo_profes: date.solo_profes,
          editar: true,
          id: date.id
        };
      };
      $scope.alertOnEventClick = function(date,
    jsEvent,
    view) {
        $scope.fromEventoToActual(date);
        return $scope.mostrando_edit_evento = true;
      };
      $scope.alertOnDrop = function(event,
    delta,
    revertFunc,
    jsEvent,
    ui,
    view) {
        $scope.fromEventoToActual(event);
        $scope.guardarEvento($scope.evento_actual);
        return console.log('Event Droped to make dayDelta ' + delta,
    event);
      };
      $scope.alertOnResize = function(event,
    delta,
    revertFunc,
    jsEvent,
    ui,
    view) {
        $scope.fromEventoToActual(event);
        $scope.guardarEvento($scope.evento_actual);
        return console.log('Event Resized to make dayDelta ' + delta,
    event);
      };
      $scope.eventRender = function(event,
    element,
    view) {
        element.attr({
          'uib-tooltip-html': "\'<p>" + event.title + "</p>Por: " + event.created_by_nombres + "\'",
          'tooltip-append-to-body': true
        });
        return $compile(element)($scope);
      };
      $scope.uiConfig = {
        calendar: {
          height: 450,
          editable: $scope.IS_PROF_ADMIN ? true : false,
          eventRender: $scope.eventRender,
          header: {
            left: 'month agendaWeek agendaDay',
            center: 'title',
            right: 'today prev,next'
          },
          eventDurationEditable: $scope.IS_PROF_ADMIN ? true : false,
          eventClick: $scope.alertOnEventClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.IS_PROF_ADMIN ? $scope.alertOnResize : null,
          buttonText: {
            today: 'Hoy',
            month: 'Mes',
            agendaWeek: 'Semana',
            agendaDay: 'Día'
          }
        }
      };
      $scope.selectTab = function(tab) {
        $scope.panel_tab_actual = tab;
        localStorage.panel_tab_actual = $scope.panel_tab_actual;
        if (tab === 'calendario') {
          return $scope.actualizarEventos();
        }
      };
      $scope.UNIDAD = $scope.USER.unidad_displayname;
      $scope.GENERO_UNI = $scope.USER.genero_unidad;
      $scope.SUBUNIDAD = $scope.USER.subunidad_displayname;
      $scope.GENERO_SUB = $scope.USER.genero_subunidad;
      $scope.UNIDADES = $scope.USER.unidades_displayname;
      $scope.SUBUNIDADES = $scope.USER.subunidades_displayname;
      $scope.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      EscalasValorativasServ.escalas().then(function(r) {
        $scope.escalas = r;
        return $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.mostrarClasesDeHoy = function() {
        return $scope.mostrandoHoy = true;
      };
      $scope.mostrarClasesDeManana = function() {
        return $scope.mostrandoHoy = false;
      };
      $scope.seleccionarAsignatura = function(asignatura) {
        if (asignatura.unidades.length === 0 && !asignatura.seleccionada) {
          $http.get('::unidades/de-asignatura-periodo/' + asignatura.asignatura_id + '/' + $scope.USER.periodo_id).then(function(r) {
            if (r.data.length > 0) {
              return asignatura.unidades = r.data;
            }
          },
    function() {
            return toastr.error('Error comprobando notas de asignatura');
          });
        }
        return asignatura.seleccionada = !asignatura.seleccionada;
      };
      $scope.cargarAlumnosAsistencia = function(asignatura,
    grupo_id,
    asignatura_id) {
        $scope.subunidad_actual = false;
        $scope.asignatura_actual = asignatura;
        return $http.put('::notas/subunidad',
    {
          grupo_id: grupo_id,
          asignatura_id: asignatura_id
        }).then(function(r) {
          var alumno,
    j,
    k,
    len,
    len1,
    ref,
    ref1,
    results,
    uniforme;
          $scope.alumnos_subunidad = r.data.alumnos;
          $scope.pasandoNotas = true;
          ref = $scope.alumnos_subunidad;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            alumno = ref[j];
            ref1 = alumno.uniformes;
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              uniforme = ref1[k];
              uniforme.fecha_hora = new Date(uniforme.fecha_hora.replace(/-/g,
    '\/'));
            }
            results.push($scope.verificarFallaHoy(alumno));
          }
          return results;
        },
    function() {
          return toastr.error('Error trayendo notas');
        });
      };
      $scope.verificarFallaHoy = function(alumno) {
        var ausencia,
    d,
    j,
    k,
    l,
    len,
    len1,
    len2,
    ref,
    ref1,
    ref2,
    results,
    tardanza,
    uniforme;
        d = new Date();
        alumno.falla_hoy = '';
        alumno.uniforme_hoy = false;
        ref = alumno.tardanzas;
        for (j = 0, len = ref.length; j < len; j++) {
          tardanza = ref[j];
          if (tardanza.fecha_hora) {
            if (tardanza.fecha_hora.replace) {
              tardanza.fecha_hora = new Date(tardanza.fecha_hora.replace(/-/g,
    '\/'));
            }
            if (d.toDateString() === tardanza.fecha_hora.toDateString()) {
              alumno.falla_hoy = 'tardanza';
            }
          }
        }
        ref1 = alumno.ausencias;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          ausencia = ref1[k];
          if (ausencia.fecha_hora) {
            if (ausencia.fecha_hora.replace) {
              ausencia.fecha_hora = new Date(ausencia.fecha_hora.replace(/-/g,
    '\/'));
            }
            if (d.toDateString() === ausencia.fecha_hora.toDateString()) {
              alumno.falla_hoy = 'ausencia';
            }
          }
        }
        ref2 = alumno.uniformes;
        results = [];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          uniforme = ref2[l];
          if (uniforme.fecha_hora) {
            if (uniforme.fecha_hora.replace) {
              uniforme.fecha_hora = new Date(uniforme.fecha_hora.replace(/-/g,
    '\/'));
            }
            if (d.toDateString() === uniforme.fecha_hora.toDateString()) {
              results.push(alumno.uniforme_hoy = true);
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      $scope.cargarAlumnosSubunidad = function(subunidad,
    asignatura,
    grupo_id,
    asignatura_id) {
        $scope.subunidad_actual = subunidad;
        $scope.asignatura_actual = asignatura;
        return $http.put('::notas/subunidad',
    {
          subunidad: subunidad,
          grupo_id: grupo_id,
          asignatura_id: asignatura_id
        }).then(function(r) {
          var alumno,
    j,
    len,
    ref,
    results;
          $scope.alumnos_subunidad = r.data.alumnos;
          $scope.pasandoNotas = true;
          ref = $scope.alumnos_subunidad;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            alumno = ref[j];
            results.push($scope.verificarFallaHoy(alumno));
          }
          return results;
        },
    function() {
          return toastr.error('Error trayendo notas');
        });
      };
      $scope.cambiarNota = function(alumno,
    nota) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==panel/cambiarNotaModal.tpl.html',
          controller: 'CambiarNotaModalCtrl',
          animation: false,
          resolve: {
            alumno: function() {
              return alumno;
            },
            subunidad: function() {
              return $scope.subunidad_actual;
            },
            nota: function() {
              return nota;
            }
          }
        });
        return modalInstance.result.then(function(r) {
          return console.log(r);
        },
    function() {});
      };
      // nada
      $scope.quitarAusenciaHoy = function(alumno,
    tipo) {
        var ausencia,
    d,
    j,
    k,
    len,
    len1,
    ref,
    ref1;
        if (alumno.quitandoAusenciaHoy) {
          return;
        }
        alumno.quitandoAusenciaHoy = true;
        d = new Date();
        d = d.toDateString();
        ref = alumno.tardanzas;
        for (j = 0, len = ref.length; j < len; j++) {
          ausencia = ref[j];
          if (ausencia.fecha_hora) {
            if (d === ausencia.fecha_hora.toDateString()) {
              $scope.eliminarAusencia(ausencia,
    alumno,
    true);
            }
          }
        }
        ref1 = alumno.ausencias;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          ausencia = ref1[k];
          if (ausencia.fecha_hora) {
            if (d === ausencia.fecha_hora.toDateString()) {
              $scope.eliminarAusencia(ausencia,
    alumno,
    true);
            }
          }
        }
        return $timeout(function() {
          alumno.quitandoAusenciaHoy = false;
          return $scope.verificarFallaHoy(alumno);
        },
    500);
      };
      $scope.verTardanzasAusencias = function(alumno) {
        alumno.mostrandoFallas = !alumno.mostrandoFallas;
      };
      
      // Ver uniformes de alumno
      $scope.verUniformes = function(alumno) {
        alumno.mostrandoUniformes = !alumno.mostrandoUniformes;
      };
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
        alumno.new_uni.asignatura_id = $scope.asignatura_actual.asignatura_id;
        alumno.new_uni.materia = $scope.asignatura_actual.materia;
        alumno.new_uni.fecha_hora = alumno.new_uni.fecha_hora.yyyymmdd() + ' ' + window.fixHora(alumno.new_uni.fecha_hora);
        $http.put('::uniformes/agregar',
    alumno.new_uni).then(function(r) {
          alumno.uniforme_hoy = true;
          alumno.guardando_uniforme = false;
          r.data.uniforme.fecha_hora = new Date(r.data.uniforme.fecha_hora.replace(/-/g,
    '\/'));
          alumno.uniformes.push(r.data.uniforme);
          alumno.uniformes_count++;
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
      
      // Función no utilizada
      $scope.guardarValorUniforme = function(uniforme,
    propiedad,
    valor,
    alumno) {
        var datos;
        datos = {
          uniforme_id: uniforme.id,
          fecha_hora: $filter('date')(uniforme.fecha_hora,
    'yyyy-MM-dd HH:mm:ss')
        };
        return $http.put('::uniformes/guardar-cambios-uniforme',
    datos).then(function(r) {
          return $scope.verificarFallaHoy(alumno);
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar.',
    'Problema');
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
            alumno_id: alumno.alumno_id,
            asignatura_id: $scope.asignatura_actual.asignatura_id
          }).then(function(r) {
            alumno.uniformes = r.data.uniformes;
            alumno.uniformes_count = r.data.uniformes_count;
            return $scope.verificarFallaHoy(alumno);
          },
    function(r2) {
            return toastr.warning('No se pudo cambiar.',
    'Problema');
          });
        }
      };
      $scope.volverClases = function() {
        return $scope.pasandoNotas = false;
      };
      $scope.agregarTardanza = function(alumno) {
        var d,
    now;
        if (alumno.guardando_falla) {
          return;
        }
        alumno.guardando_falla = true;
        d = new Date();
        now = d.yyyymmdd() + ' ' + window.fixHora(d);
        return $http.post('::ausencias/agregar-tardanza',
    {
          now: now,
          alumno_id: alumno.alumno_id,
          asignatura_id: $scope.asignatura_actual.asignatura_id
        }).then(function(r) {
          alumno.falla_hoy = 'tardanza';
          alumno.guardando_falla = false;
          r.data.fecha_hora = new Date(r.data.fecha_hora.date.replace(/-/g,
    '\/'));
          alumno.tardanzas.push(r.data);
          return alumno.tardanzas_count++;
        },
    function() {
          toastr.error('Error agregando tardanza');
          return alumno.guardando_falla = false;
        });
      };
      $scope.agregarAusencia = function(alumno) {
        var d,
    now;
        if (alumno.guardando_falla) {
          return;
        }
        alumno.guardando_falla = true;
        d = new Date();
        now = d.yyyymmdd() + ' ' + window.fixHora(d);
        return $http.post('::ausencias/agregar-ausencia',
    {
          now: now,
          alumno_id: alumno.alumno_id,
          asignatura_id: $scope.asignatura_actual.asignatura_id
        }).then(function(r) {
          alumno.falla_hoy = 'ausencia';
          alumno.guardando_falla = false;
          r.data.fecha_hora = new Date(r.data.fecha_hora.date.replace(/-/g,
    '\/'));
          alumno.ausencias.push(r.data);
          return alumno.ausencias_count++;
        },
    function() {
          toastr.error('Error agregando ausencia');
          return alumno.guardando_falla = false;
        });
      };
      $scope.cambiarTipo = function(ausencia,
    new_tipo,
    alumno) {
        var datos;
        datos = {
          ausencia_id: ausencia.id,
          new_tipo: new_tipo
        };
        return $http.put('::ausencias/cambiar-tipo-ausencia',
    datos).then(function(r) {
          var d;
          if (new_tipo === 'tardanza') {
            ausencia.tipo = 'tardanza';
            ausencia.cantidad_ausencia = ausencia.cantidad_tardanza;
            ausencia.tardanzas_count++;
            ausencia.ausencias_count--;
            alumno.tardanzas.push(ausencia);
            alumno.ausencias = $filter('filter')(alumno.ausencias,
    {
              id: '!' + ausencia.id
            });
            d = new Date();
            if (ausencia.fecha_hora) {
              if (d.toDateString() === ausencia.fecha_hora.toDateString()) {
                alumno.falla_hoy = 'tardanza';
              }
            }
          }
          if (new_tipo === 'ausencia') {
            ausencia.tipo = 'ausencia';
            ausencia.cantidad_tardanza = ausencia.cantidad_ausencia;
            ausencia.tardanzas_count--;
            ausencia.ausencias_count++;
            alumno.ausencias.push(ausencia);
            alumno.tardanzas = $filter('filter')(alumno.tardanzas,
    {
              id: '!' + ausencia.id
            });
            d = new Date();
            if (ausencia.fecha_hora) {
              if (d.toDateString() === ausencia.fecha_hora.toDateString()) {
                return alumno.falla_hoy = 'ausencia';
              }
            }
          }
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar el tipo.',
    'Problema');
        });
      };
      $scope.guardarValorAusencia = function(ausencia,
    propiedad,
    valor,
    alumno) {
        var datos;
        datos = {
          ausencia_id: ausencia.id,
          fecha_hora: $filter('date')(ausencia.fecha_hora,
    'yyyy-MM-dd HH:mm:ss')
        };
        return $http.put('::ausencias/guardar-cambios-ausencia',
    datos).then(function(r) {
          return $scope.verificarFallaHoy(alumno);
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar.',
    'Problema');
        });
      };
      $scope.eliminarAusencia = function(ausencia,
    alumno,
    omitir_preg) {
        var res;
        if (ausencia.eliminando) {
          return;
        }
        ausencia.eliminando = true;
        res = true;
        if (!omitir_preg) {
          res = confirm('¿Seguro que quiere eliminar?');
        }
        if (res) {
          return $http.delete('::ausencias/destroy/' + ausencia.id).then(function(r) {
            r = r.data;
            if (ausencia.tipo === 'tardanza') {
              alumno.tardanzas = $filter('filter')(alumno.tardanzas,
    {
                id: '!' + r.id
              });
              alumno.tardanzas_count--;
            }
            if (ausencia.tipo === 'ausencia') {
              alumno.ausencias = $filter('filter')(alumno.ausencias,
    {
                id: '!' + r.id
              });
              alumno.ausencias_count--;
            }
            if (!omitir_preg) {
              $timeout(function() {
                return $scope.verificarFallaHoy(alumno);
              },
    100);
            }
            return ausencia.isOpen = false;
          },
    function(r2) {
            return toastr.warning('No se pudo quitar ausencia.',
    'Problema');
          });
        } else {
          return ausencia.eliminando = false;
        }
      };
      // ****************************************************
      // PUBLICACIONES
      $scope.editarPublicacion = function(publicacion) {
        if (publicacion.para_todos) {
          publicacion.publi_para = 'publi_para_todos';
        } else {
          publicacion.publi_para = 'publi_privada';
        }
        publicacion.editar = true;
        $scope.new_publicacion = publicacion;
        return $scope.creando_publicacion = true;
      };
      $scope.verPublicacion = function(publi,
    $index) {
        if ($index > -1) {
          $scope.publicaciones_actuales = [publi];
          if ($scope.changes_asked.publicaciones.length > ($index + 1)) {
            $scope.publicaciones_actuales.push($scope.changes_asked.publicaciones[$index + 1]);
          }
          return $scope.creando_publicacion = false;
        } else {
          $scope.publicacion_actual = publi;
          return $scope.creando_publicacion = false;
        }
      };
      $scope.eliminarPublicacion = function(publi) {
        return $http.put('::publicaciones/delete',
    {
          publi_id: publi.id
        }).then(function(r) {
          toastr.success('Eliminada.');
          return publi.deleted_at = new Date().toString();
        },
    function(r2) {
          toastr.error('Error al eliminar',
    'Problema');
          return {};
        });
      };
      $scope.verPublicacionDetalle = function(publica) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==panel/VerPublicacionModal.tpl.html',
          controller: 'VerPublicacionModalCtrl',
          size: 'lg',
          windowClass: 'modal-publicacion',
          resolve: {
            publicacion_actual: function() {
              return publica;
            },
            USER: function() {
              return $scope.USER;
            }
          }
        });
        return modalInstance.result.then(function(imag) {
          return console.log('Cerrado');
        });
      };
      $scope.restaurarPublicacion = function(publi) {
        return $http.put('::publicaciones/restaurar',
    {
          publi_id: publi.id
        }).then(function(r) {
          toastr.success('Restaurada.');
          return publi.deleted_at = null;
        },
    function(r2) {
          toastr.error('Error al Restaur',
    'Problema');
          return {};
        });
      };
      $scope.crearPublicacion = function(new_publicacion) {
        $scope.guardando_publicacion = true;
        if (new_publicacion.editar) {
          return $http.put('::publicaciones/guardar-edicion',
    new_publicacion).then(function(r) {
            new_publicacion.id = r.data.publicacion_id;
            new_publicacion.imagen_nombre = $scope.new_publicacion.imagen ? $scope.new_publicacion.imagen.nombre : null;
            new_publicacion.contenido_tr = $sce.trustAsHtml(new_publicacion.contenido);
            new_publicacion.updated_at = $filter('date')(new Date(),
    'short');
            $scope.imagen_temporal = void 0;
            toastr.success('Guardado. Recargue la página');
            $scope.new_publicacion = {
              publi_para: 'publi_para_todos',
              para_alumnos: 1
            };
            $scope.creando_publicacion = false;
            return $scope.guardando_publicacion = false;
          },
    function(r2) {
            toastr.error('Error al publicar',
    'Problema');
            $scope.guardando_publicacion = false;
            return {};
          });
        } else {
          return $http.put('::publicaciones/store',
    new_publicacion).then(function(r) {
            new_publicacion.id = r.data.publicacion_id;
            new_publicacion.imagen_nombre = $scope.new_publicacion.imagen ? $scope.new_publicacion.imagen.name : null;
            new_publicacion.contenido_tr = $sce.trustAsHtml(new_publicacion.contenido);
            new_publicacion.updated_at = $filter('date')(new Date(),
    'short');
            $scope.changes_asked.mis_publicaciones.unshift(new_publicacion);
            $scope.changes_asked.publicaciones.unshift(new_publicacion);
            $scope.imagen_temporal = void 0;
            toastr.success('Publicado con éxito');
            $scope.new_publicacion = {
              publi_para: 'publi_para_todos',
              publi_para_alumnos: 1
            };
            $scope.creando_publicacion = false;
            return $scope.guardando_publicacion = false;
          },
    function(r2) {
            toastr.error('Error al publicar',
    'Problema');
            $scope.guardando_publicacion = false;
            return {};
          });
        }
      };
      $scope.toggle_mis_publicaciones = function(publi) {
        $scope.mostrar_publicaciones = false;
        return $scope.mostrar_mis_publicaciones = !$scope.mostrar_mis_publicaciones;
      };
      $scope.toggle_publicaciones = function(publi) {
        $scope.mostrar_mis_publicaciones = false;
        return $scope.mostrar_publicaciones = !$scope.mostrar_publicaciones;
      };
      //##########################################################
      //############## 	SUBIDA DE IMÁGENES 		###############
      //##########################################################
      $scope.uploadFiles = function(files) {
        var file,
    i,
    j,
    ref,
    results;
        $scope.errorMsg = '';
        if (files && files.length) {
          results = [];
          for (i = j = 0, ref = files.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
            file = files[i];
            $scope.imagen_temporal = file;
            results.push(generateThumbAndUpload(file));
          }
          return results;
        }
      };
      generateThumbAndUpload = function(file) {
        $scope.errorMsg = null;
        uploadUsing$upload(file);
        return $scope.generateThumb(file);
      };
      $scope.generateThumb = function(file) {
        console.log(file);
        if (file !== null) {
          if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            return $timeout(function() {
              var fileReader;
              fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              return fileReader.onload = function(e) {
                return $timeout(function() {
                  file.dataUrl = e.target.result;
                  return $scope.imgFiles.push(file);
                });
              };
            });
          }
        }
      };
      uploadUsing$upload = function(file) {
        $scope.imagen_subida = false;
        if (file.size > 5000000) {
          $scope.errorMsg = 'Archivo excede los 5MB permitidos.';
          return;
        }
        return $upload.upload({
          url: App.Server + 'myimages/store-intacta-privada',
          file: file
        }).progress(function(evt) {
          var progressPercentage;
          progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          return file.porcentaje = progressPercentage;
        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name, evt.config)
        }).success(function(data,
    status,
    headers,
    config) {
          $scope.new_publicacion.imagen = data;
          return $scope.imagen_subida = true;
        }).error(function(r2) {
          $scope.imagen_subida = true;
          return console.log('Falla uploading: ',
    r2);
        });
      };
      $scope.borrarImagen = function(imagen_temp) {
        var imagen,
    modalInstance;
        imagen = {};
        angular.copy(imagen_temp,
    imagen);
        if (imagen.imagen_id) {
          imagen.id = imagen.imagen_id;
          imagen.nombre = imagen.imagen_nombre;
        }
        modalInstance = $modal.open({
          templateUrl: '==fileManager/removeImage.tpl.html',
          controller: 'RemoveImageCtrl',
          size: 'md',
          resolve: {
            imagen: function() {
              return imagen;
            },
            user_id: function() {
              return $scope.USER.user_id;
            },
            datos_imagen: function() {
              var codigos;
              codigos = {
                imagen_id: imagen.imagen_id ? imagen.imagen_id : imagen.id,
                user_id: $scope.USER.user_id
              };
              return $http.put('::myimages/datos-imagen',
    codigos).then(function(r) {
                return $scope.datos_imagen = r.data;
              },
    function(r2) {
                toastr.error('Error al traer datos de imagen',
    'Problema');
                return {};
              });
            }
          }
        });
        return modalInstance.result.then(function(imag) {
          $scope.new_publicacion.imagen = void 0;
          $scope.new_publicacion.imagen_nombre = void 0;
          $scope.new_publicacion.imagen_id = void 0;
          return $scope.imgFiles = [];
        });
      };
      $scope.seleccionar_profe = function(profesor) {
        return $http.put('::historiales/de-usuario',
    {
          user_id: profesor.user_id
        }).then(function(r) {
          $scope.profe_seleccionado = r.data;
          return $scope.profe_seleccionado.profesor = profesor;
        },
    function(r2) {
          return console.log('Error trayendo detalles',
    r2);
        });
      };
      $scope.mostrar_crear_publicacion = function() {
        $scope.creando_publicacion = true;
        return $timeout(function() {
          return $('#textarea-new-publicacion').focus();
        });
      };
      // Editor options.
      $scope.options = {
        language: 'es',
        allowedContent: true,
        entities: false
      };
      $scope.onReady = function() {
        return console.log('Listo para editar');
      };
      $scope.desseleccionar_profe = function() {
        return $scope.profe_seleccionado = false;
      };
      $scope.verDetalles = function(change_asked) {
        var datos;
        if (change_asked.mostrando) {
          return change_asked.mostrando = false;
        } else {
          change_asked.mostrando = true;
          if (!change_asked.detalles) {
            datos = {
              asked_id: change_asked.asked_id
            };
            return $http.put('::ChangesAsked/ver-detalles',
    datos).then(function(r) {
              return change_asked.detalles = r.data.detalles;
            },
    function(r2) {
              return console.log('Error trayendo detalles',
    r2);
            });
          }
        }
      };
      $scope.traerCatAlumnosPorGrupos = function() {
        return $http.put('::grupos/con-cantidad-alumnos').then(function(r) {
          var grup,
    j,
    len,
    ref,
    results;
          $scope.grupos_cantidades = r.data.grupos;
          $scope.periodos_total = r.data.periodos_total;
          $scope.cant_total_alumnos = 0;
          ref = $scope.grupos_cantidades;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            grup = ref[j];
            results.push($scope.cant_total_alumnos = $scope.cant_total_alumnos + grup.cant_alumnos);
          }
          return results;
        },
    function(r2) {
          return console.log('Error trayendo cantidad de alumnos',
    r2);
        });
      };
      $scope.rechazarCambio = function(asked,
    tipo) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==panel/rechazarAsked.tpl.html',
          controller: 'RechazarAskedCtrl',
          resolve: {
            asked: function() {
              return asked;
            },
            tipo: function() {
              return tipo;
            }
          }
        });
        return modalInstance.result.then(function(r) {
          toastr.info('Pedido rechazado.');
          asked.finalizado = r.finalizado;
          if (tipo === 'img_perfil') {
            asked.detalles.image_id_accepted = false;
          }
          if (tipo === 'foto_oficial') {
            asked.detalles.foto_id_accepted = false;
          }
          if (tipo === 'img_delete') {
            asked.detalles.image_to_delete_accepted = false;
          }
          if (tipo === 'nombres') {
            asked.detalles.nombres_accepted = false;
          }
          if (tipo === 'apellidos') {
            asked.detalles.apellidos_accepted = false;
          }
          if (tipo === 'sexo') {
            asked.detalles.sexo_accepted = false;
          }
          if (tipo === 'fecha_nac') {
            return asked.detalles.fecha_nac_accepted = false;
          }
        });
      };
      $scope.aprobarCambio = function(asked,
    tipo,
    valor_nuevo) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==panel/aceptarAsked.tpl.html',
          controller: 'AceptarAskedCtrl',
          resolve: {
            asked: function() {
              return asked;
            },
            tipo: function() {
              return tipo;
            },
            valor_nuevo: function() {
              return valor_nuevo;
            }
          }
        });
        return modalInstance.result.then(function(r) {
          toastr.success('Pedido aceptado.');
          asked.finalizado = r.finalizado;
          if (tipo === 'img_perfil') {
            asked.detalles.image_id_accepted = true;
          }
          if (tipo === 'img_delete') {
            asked.detalles.image_to_delete_accepted = true;
          }
          if (tipo === 'nombres') {
            asked.detalles.nombres_accepted = true;
          }
          if (tipo === 'apellidos') {
            asked.detalles.apellidos_accepted = true;
          }
          if (tipo === 'sexo') {
            asked.detalles.sexo_accepted = true;
          }
          if (tipo === 'fecha_nac') {
            asked.detalles.fecha_nac_accepted = true;
          }
          if (tipo === 'foto_oficial') {
            asked.detalles.foto_id_accepted = true;
            asked.foto_nombre = asked.detalles.foto_new_nombre;
          }
          if (tipo === 'asignatura') {
            return asked.finalizado = true;
          }
        });
      };
      $scope.eliminarSolicitudes = function(asked) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==panel/eliminarAsked.tpl.html',
          controller: 'EliminarAskedCtrl',
          resolve: {
            asked: function() {
              return asked;
            }
          }
        });
        return modalInstance.result.then(function(r) {
          toastr.success('Pedido eliminado.');
          return asked.finalizado = true;
        });
      };
      $scope.verDetalleDeMiSesion = function(historial) {
        return $http.put('::historiales/sesion',
    {
          historial_id: historial.id,
          tipo: historial.tipo
        }).then(function(r) {
          var modalInstance;
          modalInstance = $modal.open({
            templateUrl: '==panel/modalDetallesSesion.tpl.html',
            controller: 'ModalDetallesSesionCtrl',
            resolve: {
              historial: function() {
                return r.data.historial;
              }
            }
          });
          return modalInstance.result.then(function(r) {
            return console.log(historial);
          });
        },
    function(r2) {
          return toastr.error('No se pudo traer el detalle');
        });
      };
      return $scope.eliminarIntentoFallido = function(intento) {
        var res;
        res = false;
        res = confirm('¿Está seguro de eliminar este registro?');
        if (res) {
          return $http.delete('::bitacoras/destroy/' + intento.id).then(function(r) {
            toastr.success('Eliminado. Recargue para ver los cambios.');
            intento.eliminada = true;
            return $scope.changes_asked.intentos_fallidos = $filter('filter')($scope.changes_asked.intentos_fallidos,
    {
              id: '!' + intento.id
            },
    true);
          },
    function(r2) {
            return toastr.error('No se pudo eliminar');
          });
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AnunciosCtrl.js.map
