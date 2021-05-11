(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('AsistenciasCtrl', [
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
      $scope.grupo_id = $state.params.grupo_id;
      $scope.datos = {};
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.ausencia_edit = {}; // Para editar en el popover
      $scope.tardanza_edit = {};
      $scope.alumno_aus_tard_edit = {};
      $scope.opts_picker = {
        minDate: new Date('1/1/2017'),
        showWeeks: false,
        startingDay: 0
      };
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $http.put('::asistencias/detailed',
    {
        con_grupos: true
      }).then(function(r) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref,
    results;
        $scope.alumnos = r.data.alumnos;
        $scope.grupos = r.data.grupos;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        ref = $scope.grupos;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (parseInt(grupo.id) === parseInt(matr_grupo)) {
            $scope.grupo = grupo;
            results.push($scope.traerAsistencias($scope.grupo));
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
    function(r2) {
        return toastr.error('No se pudo traer las notas con asignaturas.');
      });
      $scope.traerAsistencias = function(grupo) {
        var grupo_t,
    i,
    len,
    ref;
        localStorage.matr_grupo = grupo.id;
        $state.go('.',
    {
          grupo_id: grupo.id
        },
    {
          notify: false
        });
        $http.put('::asistencias/detailed',
    {
          grupo_id: grupo.id,
          con_grupos: false
        }).then(function(r) {
          var alumno,
    ausencia,
    i,
    j,
    len,
    len1,
    ref,
    ref1,
    results,
    tarda;
          $scope.alumnos = r.data.alumnos;
          ref = $scope.alumnos;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            ref1 = alumno.ausencias;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              ausencia = ref1[j];
              ausencia.backup = ausencia.fecha_hora;
              if (ausencia.fecha_hora) {
                if (ausencia.fecha_hora.replace) {
                  ausencia.fecha_hora = new Date(ausencia.fecha_hora.replace(/-/g,
    '\/'));
                }
              } else {
                ausencia.fecha_hora = new Date();
              }
            }
            results.push((function() {
              var k,
    len2,
    ref2,
    results1;
              ref2 = alumno.tardanzas;
              results1 = [];
              for (k = 0, len2 = ref2.length; k < len2; k++) {
                tarda = ref2[k];
                tarda.backup = tarda.fecha_hora;
                if (tarda.fecha_hora) {
                  if (tarda.fecha_hora.replace) {
                    results1.push(tarda.fecha_hora = new Date(tarda.fecha_hora.replace(/-/g,
    '\/')));
                  } else {
                    results1.push(void 0);
                  }
                } else {
                  results1.push(tarda.fecha_hora = new Date());
                }
              }
              return results1;
            })());
          }
          return results;
        },
    function(r2) {
          return toastr.error('No se pudo traer las asistencias.');
        });
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo_t = ref[i];
          grupo_t.active = false;
        }
        grupo.active = true;
        $scope.grupo_id = grupo.id;
        return $scope.grupo = grupo;
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
              entrada: 1,
              tipo: 'ausencia'
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
              entrada: 1,
              tipo: 'tardanza'
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
          if (ausencia.fecha_hora.replace) {
            ausencia.fecha_hora = new Date(ausencia.fecha_hora.replace(/-/g,
    '\/'));
          }
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
          if (tardanza.fecha_hora.replace) {
            tardanza.fecha_hora = new Date(tardanza.fecha_hora.replace(/-/g,
    '\/'));
          }
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
          //alumno.tardanzas.push r
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
    }
  ]);

}).call(this);

//AsistenciasCtrl.js.map
