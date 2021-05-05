(function() {
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    'USER_ROLES',
    'PERMISSIONS',
    function($state,
    App,
    USER_ROLES,
    PERMISSIONS) {
      return $state.state('panel.notas',
    {
        url: '^/notas/:asignatura_id/:profesor_id',
        views: {
          'maincontent': {
            templateUrl: "==notas/notas.tpl.html",
            controller: 'NotasCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Notas';
                }
              ]
            }
          }
        },
        resolve: {
          escalas: [
            'EscalasValorativasServ',
            function(EscalasValorativasServ) {
              //debugger
              return EscalasValorativasServ.escalas();
            }
          ]
        },
        data: {
          displayName: 'Notas',
          icon_fa: 'fa fa-graduation-cap',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin,
    PERMISSIONS.can_edit_notas],
          pageTitle: 'Notas - MyVc'
        }
      }).state('panel.definitivas_periodos',
    {
        url: '^/definitivas-periodos/:profesor_id',
        params: {
          profesor_id: {
            value: null
          }
        },
        views: {
          'maincontent': {
            templateUrl: "==notas/definitivasPeriodos.tpl.html",
            controller: 'DefinitivasPeriodosCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Definitivas periodos';
                }
              ]
            }
          }
        },
        resolve: {
          escalas: [
            'EscalasValorativasServ',
            function(EscalasValorativasServ) {
              //debugger
              return EscalasValorativasServ.escalas();
            }
          ],
          asignaturas_definitivas: [
            '$http',
            'AuthService',
            '$stateParams',
            function($http,
            AuthService,
            $stateParams) {
              if (AuthService.hasRoleOrPerm(['alumno',
            'acudiente'])) {
                return 'Sin alumnos';
              }
              if ($stateParams.profesor_id) {
                return $http.get('::definitivas_periodos',
            {
                  params: {
                    profesor_id: $stateParams.profesor_id
                  }
                });
              } else {
                return $http.get('::definitivas_periodos');
              }
            }
          ]
        },
        data: {
          displayName: 'Notas',
          icon_fa: 'fa fa-graduation-cap',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin,
    PERMISSIONS.can_edit_notas],
          pageTitle: 'Definitivas - MyVc'
        }
      }).state('panel.comportamiento',
    {
        url: '^/comportamiento/:grupo_id',
        views: {
          'maincontent': {
            templateUrl: "==notas/comportamiento.tpl.html",
            controller: 'ComportamientoCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Comportamiento';
                }
              ]
            }
          }
        },
        resolve: {
          comportamiento: [
            'ComportamientoServ',
            '$stateParams',
            function(ComportamientoServ,
            $stateParams) {
              return ComportamientoServ.detallados($stateParams.grupo_id);
            }
          ]
        },
        data: {
          displayName: 'Comportamiento',
          icon_fa: 'fa fa-street-view',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin,
    PERMISSIONS.can_edit_notas],
          pageTitle: 'Comportamiento - MyVc'
        }
      }).state('panel.notas_alumno',
    {
        url: '^/notas_alumno/:alumno_id',
        params: {
          alumno_id: {
            value: null
          }
        },
        views: {
          'maincontent': {
            templateUrl: "==notas/notasAlumno.tpl.html",
            controller: 'NotasAlumnoCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Notas alumno';
                }
              ]
            }
          }
        },
        resolve: {
          alumnos: [
            '$http',
            'AuthService',
            'resolved_user',
            function($http,
            AuthService,
            resolved_user) {
              if (AuthService.hasRoleOrPerm(['alumno',
            'acudiente']) || resolved_user.tipo === 'Alumno') {
                return 'Sin alumnos';
              }
              return $http.get('::alumnos/sin-matriculas');
            }
          ],
          escalas: [
            'EscalasValorativasServ',
            function(EscalasValorativasServ) {
              //debugger
              return EscalasValorativasServ.escalas();
            }
          ]
        },
        data: {
          displayName: 'Notas alumno',
          icon_fa: 'fa fa-graduation-cap',
          //needed_permissions: [PERMISSIONS.can_work_like_student, PERMISSIONS.can_work_like_teacher, PERMISSIONS.can_work_like_admin, PERMISSIONS.can_edit_notas]
          pageTitle: 'Notas alumno - MyVc'
        }
      }).state('panel.boletin_acudiente',
    {
        url: '/boletin_acudiente/:grupo_id/:periodo_a_calcular',
        params: {
          grupo_id: {
            value: null
          },
          periodo_a_calcular: {
            value: null
          }
        },
        views: {
          'maincontent': {
            templateUrl: "==informes/boletinesPeriodo.tpl.html",
            controller: 'BoletinesPeriodoCtrl',
            resolve: {
              alumnosDat: [
                '$http',
                '$stateParams',
                '$q',
                '$cookies',
                function($http,
                $stateParams,
                $q,
                $cookies) {
                  var d,
                requested_alumno;
                  d = $q.defer();
                  requested_alumno = $cookies.getObject('requested_alumno');
                  if (requested_alumno) {
                    $http.put('::boletines/detailed-notas/' + requested_alumno[0].grupo_id,
                {
                      requested_alumnos: requested_alumno,
                      periodo_a_calcular: $stateParams.periodo_a_calcular
                    }).then(function(r) {
                      return d.resolve(r.data);
                    },
                function(r2) {
                      return d.reject(r2.data);
                    });
                  }
                  return d.promise;
                }
              ],
              escalas: [
                'EscalasValorativasServ',
                function(EscalasValorativasServ) {
                  //debugger
                  return EscalasValorativasServ.escalas();
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Boletín del periodo',
          pageTitle: 'Boletín del periodo - MyVc'
        }
      }).state('panel.notas_perdidas_profesor_edit',
    {
        url: '^/notas_perdidas_profesor_edit',
        views: {
          'maincontent': {
            templateUrl: "==notas/notasPerdidasProfesorEdit.tpl.html",
            controller: 'NotasPerdidasProfesorEditCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Notas perdidas a editar';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Notas perdidas a editar',
          icon_fa: 'fa fa-graduation-cap',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin,
    PERMISSIONS.can_edit_notas],
          pageTitle: 'Notas perdidas a editar - MyVc'
        }
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=NotasConfig.js.map
