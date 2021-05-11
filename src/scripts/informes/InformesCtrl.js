(function() {
  angular.module('myvcFrontApp').controller('InformesCtrl', [
    '$scope',
    '$http',
    '$state',
    '$uibModal',
    '$stateParams',
    '$filter',
    'App',
    'AuthService',
    'ProfesoresServ',
    'informes_datos',
    'alumnos',
    '$timeout',
    '$cookies',
    'toastr',
    '$interval',
    'DownloadServ',
    'Upload',
    function($scope,
    $http,
    $state,
    $modal,
    $stateParams,
    $filter,
    App,
    AuthService,
    ProfesoresServ,
    informes_datos,
    alumnos,
    $timeout,
    $cookies,
    toastr,
    $interval,
    DownloadServ,
    Upload) {
      var $tempParam,
    DAYS_IN_MONTH,
    found,
    founds,
    getDaysInMonth,
    r,
    requ;
      AuthService.verificar_acceso();
      $scope.rowsAlum = [];
      //alumnos 		= alumnos.data
      $scope.$state = $state;
      $scope.$stateParams = $stateParams;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.config = {
        periodos_a_calcular: 1, // de_usuario, de_colegio, todos
        mostrar_foto: true,
        show_firma_rector: true,
        show_rojos: true,
        show_porcentajes: true,
        show_tabla_perdidas: true,
        show_firma_titular: true,
        show_firma_secretario: true,
        show_cedulas: true,
        show_datos: true,
        periodo_a_calcular: $scope.USER.numero_periodo,
        generar_bol_final_prees: false
      };
      $scope.filtered_alumnos = alumnos;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.mostrar_faltante = false;
      $scope.datos = {
        grupo: ''
      };
      r = informes_datos;
      $scope.year_actual = r.year;
      $scope.grupos = r.grupos;
      $scope.profesores = r.profesores;
      $scope.imgs_public = r.imagenes;
      $scope.periodos_grupos = r.periodos_grupos;
      if (r.periodos_desactualizados) {
        $scope.periodos_desactualizados = r.periodos_desactualizados;
      }
      // Grupo seleccionado
      if ($state.params.grupo_id) {
        $tempParam = parseInt($state.params.grupo_id);
        $scope.datos.grupo = $filter('filter')($scope.grupos,
    {
          id: $tempParam
        },
    true)[0];
        $scope.filtered_alumnos = $filter('orderBy')($filter('filter')(alumnos,
    {
          grupo_id: $tempParam
        },
    true),
    'apellidos');
      }
      // Profesor seleccionado
      if ($state.params.profesor_id) {
        $tempParam = parseInt($state.params.profesor_id);
        $scope.datos.profesor = $filter('filter')($scope.profesores,
    {
          profesor_id: $tempParam
        },
    true)[0];
      }
      if (localStorage.tipo_boletin) {
        $scope.tipo_boletin = localStorage.tipo_boletin;
      }
      if (localStorage.tipo_boletin_final) {
        $scope.tipo_boletin_final = localStorage.tipo_boletin_final;
        if ($scope.USER.tipo === 'Profesor') {
          $scope.tipo_boletin_final = 1;
        }
      }
      $scope.eligirTipo = function(n) {
        localStorage.tipo_boletin = n;
        return $scope.tipo_boletin = n;
      };
      $scope.calcularPromovido = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==informes2/calcularPromovidosModal.tpl.html',
          controller: 'CalcularPromovidosModalCtrl',
          resolve: {
            USER: function() {
              return $scope.USER;
            },
            grupos: function() {
              return $scope.grupos;
            }
          }
        });
        return modalInstance.result.then(function(alum) {},
    // nada
    function() {});
      };
      // nada
      $scope.eligirTipoFinal = function(n) {
        localStorage.tipo_boletin_final = n;
        return $scope.tipo_boletin_final = n;
      };
      $scope.range = function(n) {
        return new Array(n);
      };
      if ($cookies.getObject('config')) {
        $scope.config = $cookies.getObject('config');
      } else {
        //console.log '$scope.config', $scope.config
        $scope.config.orientacion = 'vertical';
        $scope.config.cant_imagenes = 7;
      }
      if ($cookies.getObject('requested_alumnos')) {
        requ = $cookies.getObject('requested_alumnos');
        if (requ.length > 0) {
          founds = [];
          angular.forEach(requ,
    function(value,
    key) {
            var found;
            found = $filter('filter')(alumnos,
    {
              alumno_id: value.alumno_id
            },
    true)[0];
            return founds.push(found);
          });
          $scope.datos.selected_alumnos = founds;
        } else {
          //console.log 'Mas de uno: ', $scope.datos.selected_alumnos
          $scope.datos.selected_alumno = requ[0];
        }
      }
      if ($cookies.getObject('requested_alumno')) {
        requ = $cookies.getObject('requested_alumno');
        found = $filter('filter')(alumnos,
    {
          alumno_id: requ[0].alumno_id
        },
    true)[0];
        $scope.datos.selected_alumno = found;
      }
      $scope.$watch('config',
    function(newVal,
    oldVal) {
        //console.log 'oldVal, newVal', oldVal, newVal
        $cookies.putObject('config',
    newVal);
        return $scope.$broadcast('change_config');
      },
    true);
      $scope.selectTab = function(tab) {
        $scope.config.informe_tab_actual = tab;
        return $cookies.putObject('config',
    $scope.config);
      };
      $scope.putConfigCookie = function() {
        return $cookies.putObject('config',
    $scope.config);
      };
      $scope.calcularGrupoPeriodo = function(grupo,
    periodo) {
        grupo.desabilitado = true;
        return $http.put('::definitivas_periodos/calcular-grupo-periodo',
    {
          grupo_id: grupo.grupo_id,
          periodo_id: periodo.id,
          num_periodo: periodo.numero
        }).then(function(r) {
          return toastr.success(grupo.nombre + ' calculado con éxito');
        },
    //grupo.desabilitado = false
    function(r2) {
          grupo.desabilitado = false;
          return toastr.error('No se pudo calcular las definitivas del grupo ' + grupo.nombre + ', Per ' + periodo.numero);
        });
      };
      $scope.calcularPeriodo = function(periodo) {
        $scope.porcentaje = 0;
        periodo.bloqueado = true;
        $scope.grupo_temp_calculado = true;
        $scope.grupo_temp_indce = 0;
        return $scope.intervalo = $interval(function() {
          var grupo;
          if ($scope.grupo_temp_calculado) {
            $scope.grupo_temp_calculado = false;
            grupo = periodo.grupos[$scope.grupo_temp_indce];
            $scope.porcentaje = parseInt(($scope.grupo_temp_indce + 1) * 100 / periodo.grupos.length);
            return $http.put('::definitivas_periodos/calcular-grupo-periodo',
    {
              grupo_id: grupo.grupo_id,
              periodo_id: periodo.id,
              num_periodo: periodo.numero
            }).then(function(r) {
              toastr.success(grupo.nombre + ' calculado con éxito');
              $scope.grupo_temp_calculado = true;
              $scope.grupo_temp_indce = $scope.grupo_temp_indce + 1;
              if ($scope.grupo_temp_indce === periodo.grupos.length) {
                return $interval.cancel($scope.intervalo);
              }
            },
    function(r2) {
              $scope.grupo_temp_calculado = true;
              return toastr.warning('No se pudo calcular ' + grupo.nombre + ', Per ' + periodo.numero + '. Intentaremos de nuevo.');
            });
          }
        },
    20);
      };
      $scope.verBoletinesGrupo = function(tipo) {
        var grup,
    grupo,
    j,
    k,
    len,
    len1,
    perDesact,
    ref,
    ref1;
        if ($scope.config.generar_bol_final_prees) {
          $scope.config.orientacion = 'vertical';
          $state.go('panel.informes.boletines_finales_preescolar',
    {
            grupo_id: $scope.datos.grupo.id
          },
    {
            reload: true
          });
          return;
        }
        if ($scope.periodos_desactualizados) {
          found = false;
          grupo = {};
          ref = $scope.periodos_desactualizados;
          for (j = 0, len = ref.length; j < len; j++) {
            perDesact = ref[j];
            if ($scope.USER.numero_periodo === perDesact.numero) {
              ref1 = perDesact.grupos;
              for (k = 0, len1 = ref1.length; k < len1; k++) {
                grup = ref1[k];
                if (grup.grupo_id === $scope.datos.grupo.id) {
                  found = true;
                  grupo = grup;
                }
              }
            }
          }
          if (found) {
            return $http.put('::definitivas_periodos/calcular-grupo-periodo',
    {
              grupo_id: grupo.grupo_id,
              periodo_id: $scope.USER.periodo_id,
              num_periodo: $scope.USER.numero_periodo
            }).then(function(r) {
              return $scope.verBoletinesGrupoCargar(tipo);
            },
    function(r2) {
              return toastr.warning('No se pudo calcular ' + grupo.nombre + ', Per ' + $scope.USER.numero_periodo + '. Intentaremos de nuevo.');
            });
          } else {
            return $scope.verBoletinesGrupoCargar(tipo);
          }
        } else {
          return $scope.verBoletinesGrupoCargar(tipo);
        }
      };
      $scope.verBoletinesGrupoCargar = function(tipo) {
        if (tipo === '1' || tipo === 1) {
          tipo = '';
        }
        $cookies.remove('requested_alumnos');
        $cookies.remove('requested_alumno');
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        delete localStorage.alumno_boletin;
        localStorage.grupo_boletines = 'Boletines ' + $scope.datos.grupo.nombre;
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.boletines_periodo' + tipo,
    {
          grupo_id: $scope.datos.grupo.id,
          periodo_a_calcular: $scope.USER.numero_periodo
        },
    {
          reload: true
        });
      };
      $scope.verBoletinesAlumnos = function(tipo) {
        if (tipo === '1' || tipo === 1) {
          tipo = '';
        }
        if ($scope.datos.selected_alumnos.length > 0) {
          if ($scope.datos.selected_alumnos.length === 1) {
            delete localStorage.grupo_boletines;
            localStorage.alumno_boletin = $scope.datos.selected_alumnos[0].apellidos + ' ' + $scope.datos.selected_alumnos[0].nombres + ' - ' + $scope.datos.grupo.abrev + ' Per' + $scope.USER.numero_periodo;
          } else {
            delete localStorage.alumno_boletin;
            localStorage.grupo_boletines = 'Boletines ' + $scope.datos.grupo.nombre;
          }
          $scope.config.orientacion = 'vertical';
          $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
          return $state.go('panel.informes.boletines_periodo' + tipo,
    {
            grupo_id: $scope.datos.grupo.id,
            periodo_a_calcular: $scope.USER.numero_periodo
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno o cargar boletines del grupo completo');
        }
      };
      $scope.verBoletinAlumno = function(tipo) {
        if (tipo === '1' || tipo === 1) {
          tipo = '';
        }
        $cookies.remove('requested_alumnos');
        delete localStorage.grupo_boletines;
        localStorage.alumno_boletin = $scope.datos.selected_alumno.apellidos + ' ' + $scope.datos.selected_alumno.nombres + ' - ' + $scope.datos.grupo.abrev + ' Per' + $scope.USER.numero_periodo;
        if ($scope.datos.selected_alumno) {
          $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
          $state.go('panel.informes');
          $scope.config.orientacion = 'vertical';
          return $interval(function() {
            return $state.go('panel.informes.boletines_periodo' + tipo,
    {
              periodo_a_calcular: $scope.USER.numero_periodo
            });
          },
    1,
    1);
        } else {
          return toastr.warning('Elige un alumno o carga el grupo completo');
        }
      };
      //######################
      // VARIOS
      //######################
      $scope.verNotasActualesAlumno = function() {
        $cookies.remove('requested_alumno');
        if ($scope.datos.selected_alumno) {
          $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
          $state.go('panel.informes');
          $scope.config.orientacion = 'vertical';
          return $interval(function() {
            return $state.go('panel.informes.notas_actuales_alumnos',
    {
              periodo_a_calcular: $scope.USER.numero_periodo
            });
          },
    1,
    1);
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno');
        }
      };
      $scope.verNotasActualesAlumnos = function() {
        if ($scope.datos.selected_alumnos.length > 0) {
          $scope.config.orientacion = 'vertical';
          $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
          return $state.go('panel.informes.notas_actuales_alumnos',
    {
            grupo_id: $scope.datos.grupo.id,
            periodo_a_calcular: $scope.USER.numero_periodo
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno');
        }
      };
      $scope.verNotasPerdidasActualesAlumno = function() {
        if ($scope.datos.selected_alumno) {
          $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
          $state.go('panel.informes');
          $scope.config.orientacion = 'vertical';
          return $interval(function() {
            return $state.go('panel.informes.notas_perdidas_actuales_alumnos',
    {
              periodo_a_calcular: $scope.USER.numero_periodo
            });
          },
    1,
    1);
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno');
        }
      };
      $scope.verNotasPerdidasActualesAlumnos = function() {
        if ($scope.datos.selected_alumnos.length > 0) {
          $scope.config.orientacion = 'vertical';
          $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
          return $state.go('panel.informes.notas_perdidas_actuales_alumnos',
    {
            grupo_id: $scope.datos.grupo.id,
            periodo_a_calcular: $scope.USER.numero_periodo
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno');
        }
      };
      $scope.verListadoDocentes = function() {
        $scope.config.orientacion = 'oficio_horizontal';
        return $state.go('panel.informes.listado_profesores');
      };
      $scope.excelListadoDocentes = function() {
        return DownloadServ.download('::excel-docentes/docentes/' + $scope.USER.year + '/' + $scope.USER.year_id,
    'Listado docentes ' + $scope.USER.year + '.xls');
      };
      $scope.verCantAlumnosEnGrupos = function() {
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.ver_cant_alumnos_por_grupos');
      };
      //######################
      // PLANILLAS
      //######################
      $scope.verPuestosPeriodo = function() {
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.puestos_grupo_periodo',
    {
          grupo_id: $scope.datos.grupo.id,
          periodos_a_calcular: $scope.config.periodos_a_calcular
        });
      };
      $scope.verPuestosYear = function() {
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.puestos_grupo_year',
    {
          grupo_id: $scope.datos.grupo.id,
          periodo_a_calcular: $scope.config.periodo_a_calcular
        });
      };
      $scope.verTodosPuestosPeriodo = function() {
        localStorage.grupos_puestos = JSON.stringify($scope.grupos);
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.puestos_todos_periodo',
    {
          periodos_a_calcular: $scope.config.periodos_a_calcular
        });
      };
      $scope.verTodosPuestosYear = function() {
        localStorage.grupos_puestos = JSON.stringify($scope.grupos);
        $scope.config.orientacion = 'vertical';
        return $state.go('panel.informes.puestos_todos_year',
    {
          periodo_a_calcular: $scope.config.periodo_a_calcular
        });
      };
      $scope.mostrar_nota_faltante = function() {
        if (parseInt($state.params.periodo_a_calcular) === 3 && ($state.is('panel.informes.puestos_todos_year') || $state.is('panel.informes.puestos_grupo_year'))) {
          return $scope.mostrar_faltante = !$scope.mostrar_faltante;
        } else {
          return toastr.info('Debe calcular PUESTOS DEL AÑO (no periodo) y hasta el periodo 3 ');
        }
      };
      //###### // Puestos
      $scope.verPlanillasGrupo = function() {
        if ($scope.datos.grupo.id) {
          $scope.config.orientacion = 'oficio_horizontal';
          return $state.go('panel.informes.planillas_grupo',
    {
            grupo_id: $scope.datos.grupo.id,
            periodos_a_calcular: $scope.config.periodos_a_calcular
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Elige un grupo');
        }
      };
      $scope.verPlanillasProfe = function() {
        if ($scope.datos.profesor) {
          $scope.config.orientacion = 'oficio_horizontal';
          return $state.go('panel.informes.planillas_profesor',
    {
            profesor_id: $scope.datos.profesor.profesor_id,
            periodos_a_calcular: $scope.config.periodos_a_calcular
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Elige un profesor');
        }
      };
      $scope.verAusencias = function() {
        return $state.go('panel.informes.ver_ausencias',
    {
          periodos_a_calcular: $scope.config.periodos_a_calcular
        },
    {
          reload: true
        });
      };
      $scope.listasPersonalizadas = function() {
        return $state.go('panel.informes.listas_personalizadas',
    {
          reload: true
        });
      };
      $scope.verSimat = function() {
        DownloadServ.download('::simat/alumnos',
    'Alumnos con acudientes ' + $scope.USER.year + '.xls');
        return $state.go('panel.informes.ver_simat',
    {
          reload: true
        });
      };
      $scope.asistenciaPadres = function() {
        return $state.go('panel.informes.planillas-ausencias-acudientes',
    {
          reload: true
        });
      };
      $scope.importarSimat = function(file,
    errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          file.upload = Upload.upload({
            url: App.Server + 'importar/algo/' + $scope.USER.year,
            data: {
              file: file
            }
          });
          return file.upload.then(function(response) {
            return $timeout(function() {
              return file.result = response.data;
            });
          },
    function(response) {
            if (response.status > 0) {
              return $scope.errorMsg = response.status + ': ' + response.data;
            }
          },
    function(evt) {
            return file.progress = Math.min(100,
    parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      };
      $scope.verObservadorVertical = function() {
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        return $state.go('panel.informes.ver_observador_vertical',
    {
          grupo_id: $scope.datos.grupo.id
        },
    {
          reload: true
        });
      };
      $scope.verObservadorHorizontal = function() {
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        return $state.go('panel.informes.ver_observador_horizontal',
    {
          grupo_id: $scope.datos.grupo.id
        },
    {
          reload: true
        });
      };
      $scope.verObservadorVerticalTodos = function() {
        return $state.go('panel.informes.ver_observador_vertical_todos',
    {
          reload: true
        });
      };
      $scope.verPlanillasControlTardanzas = function() {
        $scope.config.orientacion = 'oficio_horizontal';
        return $state.go('panel.informes.control_tardanza_entrada',
    {
          reload: true
        });
      };
      $scope.verPlanillasAsistenciaClase = function() {
        $scope.config.orientacion = 'oficio_horizontal';
        return $state.go('panel.informes.control_asistencia_clase',
    {
          reload: true
        });
      };
      $scope.verNotasPerdidasProfesor = function(solo_periodo) {
        if ($scope.datos.profesor) {
          $scope.config.orientacion = 'carta_horizontal';
          return $state.go('panel.informes.notas_perdidas_profesor',
    {
            profesor_id: $scope.datos.profesor.profesor_id,
            periodo_a_calcular: $scope.config.periodo_a_calcular,
            solo_periodo: solo_periodo
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Elige un profesor');
        }
      };
      $scope.verNotasPerdidasTodos = function(solo_periodo) {
        $scope.config.orientacion = 'carta_horizontal';
        return $state.go('panel.informes.notas_perdidas_todos',
    {
          periodo_a_calcular: $scope.config.periodo_a_calcular,
          solo_periodo: solo_periodo
        },
    {
          reload: true
        });
      };
      $scope.verCumpleanosPorMeses = function() {
        $scope.config.orientacion = 'carta_horizontal';
        return $state.go('panel.informes.cumpleanos_por_meses');
      };
      $scope.verActaEvaluacionPromocion = function() {
        $scope.config.orientacion = 'carta_horizontal';
        return $state.go('panel.informes.acta_evaluacion_promocion',
    {},
    {
          reload: true
        });
      };
      $scope.mostrarUnidadesProfe = function() {
        if ($scope.datos.profesor) {
          $scope.config.orientacion = 'vertical';
          return $state.go('panel.informes.unidades_profesor',
    {
            profesor_id: $scope.datos.profesor.profesor_id
          },
    {
            reload: true
          });
        } else {
          return toastr.warning('Elige un profesor');
        }
      };
      $scope.verAusencias = function() {
        return $state.go('panel.informes.ver_ausencias',
    {
          periodos_a_calcular: $scope.config.periodos_a_calcular
        },
    {
          reload: true
        });
      };
      $scope.selectGrupo = function(item) {
        if (item) {
          $scope.filtered_alumnos = $filter('orderBy')($filter('filter')(alumnos,
    {
            grupo_id: item.id
          },
    true),
    'apellidos');
        } else {
          $scope.filtered_alumnos = alumnos;
          $cookies.putObject('requested_alumno',
    '');
          $cookies.putObject('requested_alumnos',
    '');
        }
        $scope.datos.selected_alumnos = '';
        return $scope.datos.selected_alumno = '';
      };
      $scope.selectAlumnos = function(item) {};
      //console.log item
      $scope.selectAlumno = function(item) {};
      //console.log item
      $scope.$on('cambia_descripcion',
    function(event,
    descrip) {
        return $scope.descripcion_informe = descrip;
      });
      $scope.pdfMaker = function() {
        var docDefinition;
        docDefinition = {
          content: [
            ['Este es un ejemplo de reporte en pdf'],
            {
              table: {
                headerRows: 1,
                widths: ['*',
            'auto',
            100,
            '*'],
                body: [
                  ['No',
                  'Primero',
                  'Segundo',
                  'Tercero'],
                  ['0',
                  'No me gusta!!',
                  'No queda bonito',
                  'FACILMENTE!'],
                  [
                    '1',
                    {
                      text: 'En negrita',
                      bold: true
                    },
                    'Así que ',
                    'me mordió la vaca'
                  ]
                ]
              }
            }
          ]
        };
        return pdfMake.createPdf(docDefinition).open();
      };
      $scope.verBoletinesFinalesGrupo = function() {
        var datos;
        $cookies.remove('requested_alumnos');
        $cookies.remove('requested_alumno');
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        datos = {
          grupo_id: $scope.datos.grupo.id,
          periodos_a_calcular: $scope.config.periodos_a_calcular
        };
        delete localStorage.alumno_boletin;
        localStorage.grupo_boletines = 'Boletines finales ' + $scope.datos.grupo.nombre;
        if ($scope.tipo_boletin_final === 2 || $scope.tipo_boletin_final === '2') {
          datos.year_selected = true;
        }
        return $state.go('panel.informes.boletines_finales',
    datos,
    {
          reload: true
        });
      };
      $scope.verBoletinesFinalesAlumnos = function() {
        var datos;
        if ($scope.datos.selected_alumnos.length > 0) {
          $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
          if ($scope.datos.selected_alumnos.length === 1) {
            delete localStorage.grupo_boletines;
            localStorage.alumno_boletin = $scope.datos.selected_alumnos[0].apellidos + ' ' + $scope.datos.selected_alumnos[0].nombres + ' - ' + $scope.datos.grupo.abrev + ' Per' + $scope.USER.numero_periodo;
          } else {
            delete localStorage.alumno_boletin;
            localStorage.grupo_boletines = 'Boletines finales ' + $scope.datos.grupo.nombre;
          }
          datos = {
            grupo_id: $scope.datos.grupo.id,
            periodos_a_calcular: $scope.config.periodos_a_calcular
          };
          if ($scope.tipo_boletin_final === 2 || $scope.tipo_boletin_final === '2') {
            datos.year_selected = true;
          }
          return $state.go('panel.informes.boletines_finales',
    datos,
    {
            reload: true
          });
        } else {
          return toastr.warning('Debes seleccionar al menos un alumno o cargar boletines del grupo completo');
        }
      };
      $scope.verBoletinFinalAlumno = function() {
        if ($scope.datos.selected_alumno) {
          $cookies.remove('requested_alumnos');
          $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
          delete localStorage.grupo_boletines;
          localStorage.alumno_boletin = $scope.datos.selected_alumno.apellidos + ' ' + $scope.datos.selected_alumno.nombres + ' - ' + $scope.datos.grupo.abrev + ' Per' + $scope.USER.numero_periodo;
          $state.go('panel.informes');
          return $interval(function() {
            var datos;
            datos = {
              grupo_id: $scope.datos.grupo.id,
              periodos_a_calcular: $scope.config.periodos_a_calcular
            };
            if ($scope.tipo_boletin_final === 2 || $scope.tipo_boletin_final === '2') {
              datos.year_selected = true;
            }
            return $state.go('panel.informes.boletines_finales',
    datos);
          },
    1,
    1);
        } else {
          return toastr.warning('Elige un alumno o carga el grupo completo');
        }
      };
      $scope.verCertificadosEstudioGrupo = function(periodo) {
        $cookies.remove('requested_alumnos');
        $cookies.remove('requested_alumno');
        if (!$scope.datos.grupo.id) {
          toastr.warning('Debes seleccionar el grupo');
          return;
        }
        if (periodo) {
          return $state.go('panel.informes.certificados_estudio_periodo',
    {
            grupo_id: $scope.datos.grupo.id,
            periodo_a_calcular: periodo
          },
    {
            reload: true
          });
        } else {
          return $state.go('panel.informes.certificados_estudio',
    {
            grupo_id: $scope.datos.grupo.id
          },
    {
            reload: true
          });
        }
      };
      $scope.verCertificadosEstudioAlumnos = function(periodo) {
        if (periodo) {
          if ($scope.datos.selected_alumnos.length > 0) {
            $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
            return $state.go('panel.informes.certificados_estudio_periodo',
    {
              grupo_id: $scope.datos.grupo.id,
              periodo_a_calcular: periodo
            },
    {
              reload: true
            });
          } else {
            return toastr.warning('Debes seleccionar al menos un alumno o cargar boletines del grupo completo');
          }
        } else {
          if ($scope.datos.selected_alumnos.length > 0) {
            $cookies.putObject('requested_alumnos',
    $scope.datos.selected_alumnos);
            return $state.go('panel.informes.certificados_estudio',
    {
              grupo_id: $scope.datos.grupo.id,
              periodo_a_calcular: periodo
            },
    {
              reload: true
            });
          } else {
            return toastr.warning('Debes seleccionar al menos un alumno o cargar boletines del grupo completo');
          }
        }
      };
      $scope.verCertificadosEstudioAlumno = function(periodo) {
        if (periodo) {
          if ($scope.datos.selected_alumno) {
            $cookies.remove('requested_alumnos');
            $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
            $state.go('panel.informes');
            return $interval(function() {
              return $state.go('panel.informes.certificados_estudio_periodo',
    {
                periodo_a_calcular: periodo
              });
            },
    1,
    1);
          } else {
            return toastr.warning('Elige un alumno o carga el grupo completo');
          }
        } else {
          if ($scope.datos.selected_alumno) {
            $cookies.remove('requested_alumnos');
            $cookies.putObject('requested_alumno',
    [$scope.datos.selected_alumno]);
            $state.go('panel.informes');
            return $interval(function() {
              return $state.go('panel.informes.certificados_estudio');
            },
    1,
    1);
          } else {
            return toastr.warning('Elige un alumno o carga el grupo completo');
          }
        }
      };
      // CALCULOS PARA DÍAS Y MESES
      $scope.meses = [
        {
          nombre: 'Enero'
        },
        {
          nombre: 'Febrero'
        },
        {
          nombre: 'Marzo'
        },
        {
          nombre: 'Abril'
        },
        {
          nombre: 'Mayo'
        },
        {
          nombre: 'Junio'
        },
        {
          nombre: 'Julio'
        },
        {
          nombre: 'Agosto'
        },
        {
          nombre: 'Septiembre'
        },
        {
          nombre: 'Octubre'
        },
        {
          nombre: 'Noviembre'
        },
        {
          nombre: 'Diciembre'
        }
      ];
      $scope.numYearActual = $scope.USER.year;
      DAYS_IN_MONTH = [31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31];
      getDaysInMonth = function(year,
    month) {
        if ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) {
          return 29;
        } else {
          return DAYS_IN_MONTH[month];
        }
      };
      return $scope.getAllDaysInMonth = function(month) {
        var d,
    i,
    j,
    n,
    num,
    ref;
        num = getDaysInMonth($scope.numYearActual,
    month);
        r = [];
        for (i = j = 1, ref = num; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
          d = new Date($scope.numYearActual,
    parseInt(month),
    i);
          n = d.getDay();
          if (n !== 0 && n !== 6) {
            r.push(i);
          }
        }
        return r;
      };
    }
  // //
  ]).filter('fechaHoraStringShort', [
    '$filter',
    function($filter) {
      return function(fecha_hora,
    created_at) {
        if (fecha_hora) {
          fecha_hora = new Date(fecha_hora);
          if (isNaN(fecha_hora)) {
            fecha_hora = new Date(fecha_hora);
          } else {
            fecha_hora = new Date(created_at);
          }
          fecha_hora = $filter('date')(fecha_hora,
    'MMMdd H:mm');
          return fecha_hora;
        } else {
          return '';
        }
      };
    }
  ]);

}).call(this);

//InformesCtrl.js.map
