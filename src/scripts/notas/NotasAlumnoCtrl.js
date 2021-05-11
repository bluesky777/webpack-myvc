(function() {
  angular.module('myvcFrontApp').controller('NotasAlumnoCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    'alumnos',
    'escalas',
    '$rootScope',
    '$filter',
    'App',
    'AuthService',
    'Perfil',
    'EscalasValorativasServ',
    '$cookies',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    alumnos,
    escalas,
    $rootScope,
    $filter,
    App,
    AuthService,
    Perfil,
    EscalasValorativasServ,
    $cookies) {
      AuthService.verificar_acceso();
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      alumnos = alumnos.data;
      if (!alumnos === 'Sin alumnos') {
        $scope.filtered_alumnos = alumnos;
      }
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.datos = {
        grupo: ''
      };
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.escalas = escalas;
      $scope.config = {
        solo_notas_perdidas: 'todas'
      };
      if (!($scope.hasRoleOrPerm(['alumno',
    'acudiente']) || $scope.USER.tipo === 'Alumno')) {
        $http.get('::grupos').then(function(r) {
          r = r.data;
          return $scope.grupos = r;
        });
      } else if ($scope.hasRoleOrPerm(['alumno',
    'acudiente']) || $scope.USER.tipo === 'Alumno') {
        console.log($scope.mis_acudidos);
      }
      EscalasValorativasServ.escalas().then(function(r) {
        $scope.escalas = r;
        return $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.verBoletin = () => {
        var alumno,
    i,
    len,
    ref;
        ref = $scope.mis_acudidos;
        for (i = 0, len = ref.length; i < len; i++) {
          alumno = ref[i];
          if (alumno.seleccionado === true) {
            if (!alumno.pazysalvo) {
              toastr.info('Lo sentimos. Debe estar a paz y salvo');
              return;
            }
            $cookies.putObject('requested_alumno',
    [
              {
                alumno_id: alumno.alumno_id,
                grupo_id: alumno.grupo_id
              }
            ]);
            $state.go('panel.boletin_acudiente',
    {
              periodo_a_calcular: $scope.USER.numero_periodo
            });
          }
        }
      };
      $scope.verMiBoletin = () => {
        if (!$scope.USER.pazysalvo) {
          toastr.info('Lo sentimos. Debe estar a paz y salvo');
          return;
        }
        $cookies.putObject('requested_alumno',
    [
          {
            alumno_id: $scope.USER.persona_id,
            grupo_id: $scope.USER.grupo_id
          }
        ]);
        return $state.go('panel.boletin_acudiente',
    {
          periodo_a_calcular: $scope.USER.numero_periodo
        });
      };
      $scope.cambiaNotaComport = function(nota,
    periodo) {
        var temp;
        if ($scope.datos.grupo.titular_id !== $scope.USER.persona_id && !$scope.hasRoleOrPerm('admin')) {
          toastr.warning('No eres el titular para cambiar comportamiento.');
          return;
        }
        if (nota.id) {
          temp = nota.nota;
          return $http.put('::nota_comportamiento/update/' + nota.id,
    {
            nota: nota.nota
          }).then(function(r) {
            return toastr.success('Nota cambiada: ' + nota.nota);
          },
    function(r2) {
            toastr.error('No pudimos guardar la nota ' + nota.nota);
            return nota.nota = temp;
          });
        } else {
          temp = {};
          temp.nota = nota.nota;
          temp.year_id = periodo.year_id;
          temp.alumno_id = $scope.datos.selected_alumno.alumno_id;
          temp.periodo_id = periodo.id;
          return $http.put('::nota_comportamiento/crear',
    temp).then(function(r) {
            var nota_temp;
            nota_temp = r.data.nota_comport;
            nota.id = nota_temp.id;
            nota.year_id = nota_temp.year_id;
            nota.nombres = nota_temp.nombres;
            nota.apellidos = nota_temp.apellidos;
            nota.alumno_id = nota_temp.alumno_id;
            nota.foto_id = nota_temp.foto_id;
            nota.foto_nombre = nota_temp.foto_nombre;
            nota.sexo = nota_temp.sexo;
            nota.periodo_id = nota_temp.periodo_id;
            return toastr.success('Nota creada: ' + nota.nota);
          },
    function(r2) {
            toastr.error('No pudimos guardar la nota ' + temp.nota);
            return nota = temp;
          });
        }
      };
      $scope.verNotasAlumno = function(alumno_id,
    grupo_id) {
        if (!alumno_id) {
          alumno_id = $scope.datos.selected_alumno.alumno_id;
        }
        if (!grupo_id) {
          grupo_id = $scope.datos.grupo.id;
        }
        return $http.get('::notas/alumno/' + alumno_id + '/' + grupo_id).then(function(r) {
          var asig,
    i,
    len,
    nota_faltante,
    ref,
    results;
          r = r.data;
          if (r[0]) {
            $scope.alumno_traido = r[0];
            $scope.periodos_notas = r[0].periodos;
            ref = $scope.alumno_traido.notas_tercer_per;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              asig = ref[i];
              nota_faltante = $scope.USER.nota_minima_aceptada * 4 - asig.nota_final_year * 3;
              results.push(asig.nota_faltante = nota_faltante <= 0 ? '' : nota_faltante);
            }
            return results;
          } else {
            $scope.periodos_notas = void 0;
            return toastr.warning('Sin matrícula este año.');
          }
        },
    function(r2) {
          return toastr.warning('Lo sentimos, No se trajeron las notas');
        });
      };
      $scope.seleccionarAcudido = function(alumno) {
        var alu,
    i,
    len,
    ref;
        if (!alumno.pazysalvo) {
          toastr.info('Lo sentimos. Debe estar a paz y salvo');
          return;
        }
        ref = $scope.mis_acudidos;
        for (i = 0, len = ref.length; i < len; i++) {
          alu = ref[i];
          alu.seleccionado = false;
        }
        alumno.seleccionado = true;
        return $http.get('::notas/alumno/' + alumno.alumno_id + '/' + alumno.grupo_id).then(function(r) {
          var asig,
    j,
    len1,
    nota_faltante,
    ref1,
    results;
          r = r.data;
          if (r[0]) {
            $scope.alumno_traido = r[0];
            $scope.periodos_notas = r[0].periodos;
            ref1 = $scope.alumno_traido.notas_tercer_per;
            results = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              asig = ref1[j];
              nota_faltante = $scope.USER.nota_minima_aceptada * 4 - asig.nota_final_year * 3;
              results.push(asig.nota_faltante = nota_faltante <= 0 ? '' : nota_faltante);
            }
            return results;
          } else {
            $scope.periodos_notas = void 0;
            return toastr.warning('Sin matrícula este año.');
          }
        },
    function(r2) {
          return toastr.warning('Lo sentimos, No se trajeron las notas');
        });
      };
      if ($state.params.alumno_id) {
        if ($scope.USER.tipo === 'Alumno') {
          toastr.warning('No puedes ver otras notas');
          return;
        }
        $scope.verNotasAlumno($state.params.alumno_id,
    $scope.USER.grupo_id);
      }
      if ($scope.USER.tipo === 'Alumno' && $scope.USER.pazysalvo) {
        $scope.verNotasAlumno($scope.USER.persona_id,
    $scope.USER.grupo_id);
      }
      $scope.cambiaNotaDef = function(asignatura,
    nota,
    nf_id,
    num_periodo) {
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
            nota: nota
          }).then(function(r) {
            if (!asignatura.manual) {
              asignatura.manual = 1;
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
        } else {
          return $http.put('::definitivas_periodos/update',
    {
            alumno_id: $scope.alumno_traido.alumno_id,
            nota: nota,
            asignatura_id: asignatura.asignatura_id,
            num_periodo: num_periodo
          }).then(function(r) {
            toastr.success('Creada: ' + nota);
            r = r.data[0];
            asignatura.nf_id = r.id;
            asignatura.recuperada = 0;
            return asignatura.manual = 1;
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
      $scope.toggleNotaFinalRecuperada = function(alumno,
    recuperada,
    nf_id) {
        return $http.put('::definitivas_periodos/toggle-recuperada',
    {
          nf_id: nf_id,
          recuperada: recuperada
        }).then(function(r) {
          if (recuperada && !alumno.manual) {
            alumno.manual = 1;
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
        return $http.put('::notas/update/' + nota.id,
    {
          nota: nota.nota
        }).then(function(r) {
          r = r.data;
          return toastr.success('Cambiada: ' + nota.nota);
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
      return $scope.selectGrupo = function(item) {
        if (item) {
          $scope.filtered_alumnos = $filter('filter')(alumnos,
    {
            grupo_id: item.id
          },
    true);
        } else {
          $scope.filtered_alumnos = alumnos;
          $cookies.putObject('requested_alumno',
    '');
        }
        return $scope.datos.selected_alumno = '';
      };
    }
  ]);

}).call(this);

//NotasAlumnoCtrl.js.map
