(function() {
  angular.module('myvcFrontApp').directive('anunciosDir', [
    'App',
    '$http',
    'toastr',
    '$uibModal',
    '$state',
    'AuthService',
    '$sce',
    '$timeout',
    '$window',
    function(App,
    $http,
    toastr,
    $modal,
    $state,
    AuthService,
    $sce,
    $timeout,
    $window) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}panel/anunciosDir.tpl.html`,
        link: function(scope,
    iElem,
    iAttrs) {
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          scope.anchoWindow = $window.innerWidth;
          scope.mostrandoHoy = true;
          scope.dato = {};
          if ($state.is('panel')) {
            return $http.get('::ChangesAsked/to-me',
    {
              params: {
                anchoWindow: scope.anchoWindow
              }
            }).then(function(r) {
              var alumno,
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
    profe,
    publi,
    ref,
    ref1,
    ref2,
    ref3,
    ref4,
    ref5,
    uniforme,
    valores;
              scope.changes_asked = r.data;
              // Calendario
              $timeout(function() {
                var evento,
    i,
    len,
    ref;
                ref = scope.changes_asked.eventos;
                for (i = 0, len = ref.length; i < len; i++) {
                  evento = ref[i];
                  evento.start = new Date(evento.start);
                  evento.end = evento.end ? new Date(evento.end) : null;
                  if (evento.solo_profes) {
                    evento.className = 'evento-solo-profes';
                  } else {
                    evento.className = evento.cumple_alumno_id || evento.cumple_profe_id ? 'evento-cumpleanios' : null;
                  }
                }
                return scope.eventos = [scope.changes_asked.eventos];
              },
    500);
              if (scope.changes_asked.alumnos.length > 0) {
                ref = scope.changes_asked.alumnos;
                for (i = 0, len = ref.length; i < len; i++) {
                  alumno = ref[i];
                  if (alumno.uniformes) {
                    ref1 = alumno.uniformes;
                    for (j = 0, len1 = ref1.length; j < len1; j++) {
                      uniforme = ref1[j];
                      uniforme.fecha_hora = new Date(uniforme.fecha_hora.replace(/-/g,
    '\/'));
                    }
                  }
                }
              } else {
                if (scope.changes_asked.uniformes) {
                  ref2 = scope.changes_asked.uniformes;
                  for (k = 0, len2 = ref2.length; k < len2; k++) {
                    uniforme = ref2[k];
                    uniforme.fecha_hora = new Date(uniforme.fecha_hora.replace(/-/g,
    '\/'));
                  }
                }
              }
              ref3 = scope.changes_asked.publicaciones;
              // Publicaciones
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                publi = ref3[l];
                publi.contenido_tr = $sce.trustAsHtml(publi.contenido);
              }
              if (scope.changes_asked.mis_publicaciones) {
                ref4 = scope.changes_asked.mis_publicaciones;
                for (m = 0, len4 = ref4.length; m < len4; m++) {
                  publi = ref4[m];
                  publi.contenido_tr = $sce.trustAsHtml(publi.contenido);
                }
              }
              if (AuthService.hasRoleOrPerm(['alumno',
    'acudiente']) || scope.USER.tipo === 'Alumno') {
                scope.publicaciones_actuales = [scope.changes_asked.publicaciones[0]];
                if (scope.changes_asked.publicaciones.length > 1) {
                  scope.publicaciones_actuales.push(scope.changes_asked.publicaciones[1]);
                }
              }
              if (AuthService.hasRoleOrPerm(['admin',
    'profesor'])) {
                if (scope.changes_asked.publicaciones.length > 0) {
                  scope.publicacion_actual = scope.changes_asked.publicaciones[0];
                }
              }
              // Gráfico del trabajo de profesores
              if (scope.anchoWindow > 500) {
                if (AuthService.hasRoleOrPerm(['admin',
    'profesor',
    'alumno'])) {
                  scope.options = {
                    chart: {
                      type: 'discreteBarChart',
                      height: 180,
                      margin: {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 55
                      },
                      useInteractiveGuideline: true,
                      x: function(d) {
                        return d.label;
                      },
                      y: function(d) {
                        return d.value;
                      },
                      showValues: true,
                      valueFormat: function(d) {
                        return d3.format(',.0f')(d);
                      },
                      transitionDuration: 500,
                      xAxis: {
                        axisLabel: "X Axis",
                        rotateLabels: 30,
                        showMaxMin: false
                      },
                      zoom: {
                        enabled: true,
                        scaleExtent: [1,
    10],
                        useFixedDomain: false,
                        useNiceScale: false,
                        horizontalOff: false,
                        verticalOff: true,
                        unzoomEventType: "dblclick.zoom"
                      }
                    },
                    title: {
                      enable: false,
                      text: 'Asignaturas correctas'
                    }
                  };
                  valores = [];
                  ref5 = scope.changes_asked.profes_actuales;
                  for (n = 0, len5 = ref5.length; n < len5; n++) {
                    profe = ref5[n];
                    valores.push({
                      label: profe.nombres + ' ' + profe.apellidos.substr(0,
    1) + '.',
                      value: profe.porcentaje
                    });
                  }
                  scope.data = [
                    {
                      key: "Asignaturas correctas",
                      values: valores
                    }
                  ];
                }
              }
              return scope.prematricular = function(alumno) {
                var datos,
    modalInstance;
                console.log(alumno);
                if (!alumno.grupo_prematr) {
                  toastr.warning('Debe seleccionar el grupo');
                  return;
                }
                datos = {
                  matricula_id: alumno.next_year.matricula_id,
                  alumno_id: alumno.alumno_id,
                  grupo_id: alumno.grupo_prematr.id,
                  year_id: alumno.next_year.year_id,
                  estado: 'PREA'
                };
                modalInstance = $modal.open({
                  templateUrl: '==alumnos/prematricularConfirmarModal.tpl.html',
                  controller: 'PrematricularConfirmarCtrl',
                  resolve: {
                    datos: function() {
                      return datos;
                    },
                    alumno: function() {
                      return alumno;
                    },
                    USER: function() {
                      return scope.USER;
                    }
                  }
                });
                return modalInstance.result.then(function(alum) {
                  return console.log('Prematriculado');
                });
              };
            },
    function(r2) {
              //toastr.error 'No se pudo traer los anuncios.'
              return console.log(r2);
            });
          }
        },
        controller: 'AnunciosDirCtrl'
      };
    }
  ]).directive('publicacionesPanelDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}panel/publicacionesPanelDir.tpl.html`
      };
    }
  ]).directive('horarioHoyPanelDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}panel/horarioHoyPanelDir.tpl.html`
      };
    }
  ]).controller('PrematricularConfirmarCtrl', [
    '$scope',
    '$uibModalInstance',
    'datos',
    'alumno',
    'USER',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    datos,
    alumno,
    USER,
    $http,
    toastr,
    App) {
      $scope.imagesPath = App.images + 'perfil/';
      $scope.USER = USER;
      $scope.alumno = alumno;
      $scope.ok = function() {
        if ($scope.prematriculando) {
          return;
        }
        $scope.prematriculando = true;
        return $http.put('::matriculas/prematricular',
    datos).then(function(r) {
          toastr.success('Alumno prematriculado');
          $scope.prematriculando = false;
          r.data.matricula.prematriculado = new Date(r.data.matricula.prematriculado.replace(/-/g,
    '\/'));
          $scope.alumno.next_year = r.data.matricula;
          return $modalInstance.close(r.data);
        },
    function(r2) {
          toastr.error('Tal vez no existe el ' + ($scope.USER.year + 1),
    'Problema');
          return $scope.prematriculando = false;
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('AceptarAskedCtrl', [
    '$scope',
    '$uibModalInstance',
    'asked',
    'tipo',
    'valor_nuevo',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    asked,
    tipo,
    valor_nuevo,
    $http,
    toastr,
    App) {
      $scope.imagesPath = App.images + 'perfil/';
      $scope.asked = asked;
      $scope.aceptarAsignatura = function() {
        var datos;
        datos = {
          pedido: asked,
          tipo: tipo,
          asker_id: asked.asked_by_user_id
        };
        return $http.put('::ChangesAsked/aceptar-asignatura',
    datos).then(function(r) {
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.warning('Problema',
    'No se pudo aceptar petición.');
        });
      };
      $scope.ok = function() {
        var datos;
        if (asked.assignment_id) {
          return $scope.aceptarAsignatura();
        } else {
          datos = {
            asked_id: asked.asked_id,
            data_id: asked.detalles.data_id,
            tipo: tipo,
            valor_nuevo: valor_nuevo,
            asker_id: asked.asked_by_user_id
          };
          if (asked.alumno_id) {
            datos.alumno_id = asked.alumno_id;
          }
          return $http.put('::ChangesAsked/aceptar-alumno',
    datos).then(function(r) {
            return $modalInstance.close(r.data);
          },
    function(r2) {
            return toastr.warning('Problema',
    'No se pudo aceptar petición.');
          });
        }
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('RechazarAskedCtrl', [
    '$scope',
    '$uibModalInstance',
    'asked',
    'tipo',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    asked,
    tipo,
    $http,
    toastr,
    App) {
      $scope.imagesPath = App.images + 'perfil/';
      $scope.asked = asked;
      $scope.ok = function() {
        var assignment_id,
    data_id,
    datos;
        data_id = asked.detalles ? asked.detalles.data_id : asked.assignment_id;
        assignment_id = asked.detalles.assignment_id;
        datos = {
          asked_id: asked.asked_id,
          data_id: data_id,
          assignment_id: assignment_id,
          tipo: tipo,
          asker_id: asked.asked_by_user_id
        };
        return $http.put('::ChangesAsked/rechazar',
    datos).then(function(r) {
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.error('Problema',
    'No se pudo rechazar petición.');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('EliminarAskedCtrl', [
    '$scope',
    '$uibModalInstance',
    'asked',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    asked,
    $http,
    toastr,
    App) {
      $scope.imagesPath = App.images + 'perfil/';
      $scope.asked = asked;
      $scope.ok = function() {
        var datos;
        datos = {
          asked_id: asked.asked_id,
          data_id: asked.detalles.data_id
        };
        return $http.put('::ChangesAsked/destruir',
    datos).then(function(r) {
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.error('Problema',
    'No se pudo eliminar peticiones.');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//AnunciosDir.js.map
