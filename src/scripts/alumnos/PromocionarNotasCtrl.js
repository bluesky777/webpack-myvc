(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('PromocionarNotasCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$timeout',
    'uiGridConstants',
    'uiGridEditConstants',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    'EscalasValorativasServ',
    function($scope,
    App,
    $rootScope,
    $state,
    $timeout,
    uiGridConstants,
    uiGridEditConstants,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http,
    EscalasValorativasServ) {
      AuthService.verificar_acceso();
      //$scope.$parent.bigLoader			= true
      $scope.dato = {};
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.views = App.views;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.dato.grupo = '';
      $http.get('::grupos').then(function(r) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref,
    results;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        $scope.grupos = r.data;
        ref = $scope.grupos;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (parseInt(grupo.id) === parseInt(matr_grupo)) {
            $scope.dato.grupo = grupo;
            results.push($scope.selectGrupo($scope.dato.grupo));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      EscalasValorativasServ.escalas().then(function(r) {
        $scope.escalas = r;
        return $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.cambiaNotaComport = function(nota,
    periodo,
    datos) {
        var temp;
        if ($scope.dato.grupo.titular_id !== $scope.USER.persona_id && !$scope.hasRoleOrPerm('admin')) {
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
          temp.alumno_id = $scope[datos].alumno.id;
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
      $scope.selectGrupo = function(grupo) {
        var grup,
    i,
    len,
    ref;
        console.log($scope.dato);
        localStorage.matr_grupo = grupo.id;
        $scope.dato.grupo = grupo;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          grup.active = false;
        }
        grupo.active = true;
        return $http.put("::alumnos/de-grupo/" + grupo.id).then(function(r) {
          var alum,
    alumno_seleccionado_id,
    j,
    len1,
    ref1,
    results;
          $scope.alumnos = r.data.alumnos;
          alumno_seleccionado_id = 0;
          if (localStorage.matr_grupo) {
            alumno_seleccionado_id = parseInt(localStorage.alumno_seleccionado_id);
          }
          ref1 = $scope.alumnos;
          results = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            alum = ref1[j];
            if (parseInt(alum.id) === alumno_seleccionado_id) {
              $scope.dato.selected_alumno = alum;
              results.push($scope.selectAlumno($scope.dato.selected_alumno));
            } else {
              results.push(void 0);
            }
          }
          return results;
        });
      };
      $scope.selectAlumno = function(alumno) {
        localStorage.alumno_seleccionado_id = alumno.id;
        $scope.dato.periodo_id = void 0;
        return $http.put("::alumnos/years-con-notas",
    {
          alumno_id: alumno.id
        }).then(function(r) {
          $scope.years_notas = r.data.years;
          return $scope.years_dest = r.data.years_dest;
        });
      };
      $scope.eligirPeriodoNotas = function(grupo,
    periodo,
    num_year,
    panel_indice,
    alumno) {
        var i,
    len,
    peri,
    ref;
        $scope.dato.periodo_id = periodo.id;
        ref = grupo.periodos;
        for (i = 0, len = ref.length; i < len; i++) {
          peri = ref[i];
          if (panel_indice === 1) {
            peri.seleccionado_origen = false;
          } else {
            peri.seleccionado_destino = false;
          }
        }
        if (panel_indice === 1) {
          periodo.seleccionado_origen = true;
        } else {
          periodo.seleccionado_destino = true;
        }
        return $http.put("::notas/alumno-periodo-grupo",
    {
          alumno_id: $scope.dato.selected_alumno.id,
          periodo_id: periodo.id,
          grupo_id: grupo.grupo_id
        }).then(function(r) {
          if (panel_indice === 1) {
            $scope.datos_origen = {
              grupo: grupo,
              periodo: periodo,
              num_year: num_year,
              alumno: alumno
            };
            return $scope.notas_origen = r.data.notas;
          } else {
            // Aquí, grupo es year en realidad con los datos del grupo
            $scope.datos_destino = {
              grupo: grupo,
              periodo: periodo,
              num_year: num_year,
              alumno: alumno
            };
            $scope.notas_destino = r.data.notas;
            if (!$.isArray($scope.notas_destino.asignaturas)) {
              return $scope.notas_destino.asignaturas = [$scope.notas_destino.asignaturas[Object.keys($scope.notas_destino.asignaturas)[0]]];
            }
          }
        });
      };
      $scope.pasarNota = function(asignatura) {
        var asignat,
    found,
    i,
    len,
    ref;
        if ($scope.pasando_nota) {
          return;
        } else {
          $scope.pasando_nota = true;
        }
        found = 0;
        ref = $scope.notas_destino.asignaturas;
        for (i = 0, len = ref.length; i < len; i++) {
          asignat = ref[i];
          if (asignat.materia_id === asignatura.materia_id) {
            found = found + 1;
            if (asignat.nf_id) {
              $scope.asign_temp = asignatura;
              $http.put('::definitivas_periodos/update',
    {
                nf_id: asignat.nf_id,
                nota: asignatura.nota_asignatura,
                num_periodo: $scope.datos_destino.periodo.numero
              }).then(function(r) {
                return $scope.evento_definitiva_cambiada(false,
    asignatura);
              },
    function(r2) {
                $scope.pasando_nota = false;
                if (r2.status === 400) {
                  return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
                } else {
                  return toastr.error('No pudimos guardar la nota ' + asignatura.nota_asignatura,
    '',
    {
                    timeOut: 8000
                  });
                }
              });
            } else {
              $http.put('::definitivas_periodos/update',
    {
                alumno_id: $scope.dato.selected_alumno.id,
                nota: asignatura.nota_asignatura,
                asignatura_id: asignat.asignatura_id,
                num_periodo: $scope.datos_destino.periodo.numero
              }).then(function(r) {
                return $scope.evento_definitiva_cambiada(true,
    asignatura,
    r.data[0]);
              },
    function(r2) {
                $scope.pasando_nota = false;
                if (r2.status === 400) {
                  return toastr.warning('Parece que no tienes permisos',
    'Lo sentimos');
                } else {
                  return toastr.error('No pudimos guardar la nota ' + asignatura.nota_asignatura,
    '',
    {
                    timeOut: 8000
                  });
                }
              });
            }
          }
        }
        if (found === 0) {
          toastr.warning('No coincide con ninguna materia destino.');
          return $scope.pasando_nota = false;
        }
      };
      // Para cuando sea cambiada alguna definitiva
      $scope.evento_definitiva_cambiada = function(is_new,
    asignatura,
    r) {
        var asignatu,
    i,
    j,
    len,
    len1,
    ref,
    ref1,
    results;
        if (is_new) {
          toastr.success('Creada: ' + asignatura.nota_asignatura);
          ref = $scope.notas_destino.asignaturas;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            asignatu = ref[i];
            if (asignatu.asignatura_id === r.asignatura_id) {
              asignatu.nf_id = r.id;
              asignatu.nota_asignatura = r.nota;
              asignatu.manual = 1;
              asignatu.recuperada = 0;
              $scope.pasando_nota = false;
              results.push($timeout(function() {
                return $scope.$apply();
              }));
            } else {
              results.push(void 0);
            }
          }
          return results;
        } else {
          ref1 = $scope.notas_destino.asignaturas;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            asignatu = ref1[j];
            if (asignatu.materia_id === $scope.asign_temp.materia_id) {
              asignatu.nota_asignatura = $scope.asign_temp.nota_asignatura;
              asignatu.manual = 1;
              $timeout(function() {
                return $scope.$apply();
              });
            }
          }
          toastr.success('Cambiada: ' + asignatura.nota_asignatura);
          return $scope.pasando_nota = false;
        }
      };
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
      $scope.verDetalleNota = function(asignatura,
    alumno) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==notas/notaFinalDetalleModal.tpl.html',
          controller: 'NotaFinalDetalleModalCtrl',
          resolve: {
            alumno: function() {
              return alumno;
            },
            asignatura: function() {
              return asignatura;
            },
            USER: function() {
              return $scope.USER;
            },
            escala_maxima: function() {
              return $scope.escala_maxima;
            }
          }
        });
        modalInstance.result.then(function(r) {
          if (r === 'Eliminada') {
            return asignatura.eliminada = true;
          }
        },
    function() {});
      };
    }
  // nada
  ]).controller('NotaFinalDetalleModalCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'asignatura',
    'AuthService',
    '$http',
    'toastr',
    '$filter',
    'USER',
    'escala_maxima',
    function($scope,
    $modalInstance,
    alumno,
    asignatura,
    AuthService,
    $http,
    toastr,
    $filter,
    USER,
    escala_maxima) {
      $scope.alumno = alumno;
      $scope.nota = asignatura;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.escala_maxima = escala_maxima;
      $http.put('::historiales/nota-final-detalle',
    {
        nf_id: asignatura.nf_id
      }).then(function(r) {
        $scope.cambios = r.data.cambios;
        return $scope.nota_detalle = r.data.nota;
      },
    function(r2) {
        return toastr.warning('No se pudo traer el historial.',
    'Problema');
      });
      $scope.eliminarNota = function() {
        return $http.delete('::definitivas_periodos/destroy/' + asignatura.nf_id).then(function(r) {
          toastr.success('Nota eliminada',
    'Recarga para ver');
          return $modalInstance.close('Eliminada');
        },
    function(r2) {
          return toastr.error('No se pudo eliminar nota.',
    'Problema');
        });
      };
      $scope.ok = function() {
        return $modalInstance.close(alumno);
      };
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
      return $scope.toggleNotaFinalManual = function(alumno,
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
    }
  ]);

}).call(this);

//# sourceMappingURL=PromocionarNotasCtrl.js.map
