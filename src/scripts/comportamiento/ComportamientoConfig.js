(function() {

  // Configuración principal de nuestra aplicación.
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    'PERMISSIONS',
    function($state,
    App,
    PERMISSIONS) {
      $state.state('panel.disciplina',
    {
        url: '^/disciplina',
        views: {
          'maincontent': {
            templateUrl: "==comportamiento/disciplina.tpl.html",
            controller: 'DisciplinaCtrl',
            resolve: {
              escalas: [
                'EscalasValorativasServ',
                function(EscalasValorativasServ) {
                  return EscalasValorativasServ.escalas();
                }
              ]
            }
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Disciplina';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Disciplina',
          icon_fa: 'fa fa-user',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin],
          pageTitle: 'Disciplina - MyVc'
        }
      }).state('panel.disciplina.ver-situaciones-por-grupos',
    {
        url: '/ver-situaciones-por-grupos',
        views: {
          'report_content': {
            templateUrl: "==comportamiento/verSituacionesPorGrupos.tpl.html",
            controller: 'VerSituacionesPorGruposCtrl', // En VerSituacionesPorGruposCtrl.coffee
            resolve: {
              grupos_situaciones: [
                '$http',
                '$stateParams',
                function($http,
                $stateParams) {
                  return $http.put('::comportamiento/situaciones-por-grupos');
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Situaciones por grupos',
          icon_fa: 'fa fa-print',
          pageTitle: 'Situaciones por grupos - MyVc'
        }
      }).state('panel.disciplina.ver-observador-completo',
    {
        url: '/ver-observador-completo/:grupo_id',
        params: {
          grupo_id: {
            value: null
          }
        },
        views: {
          'report_content': {
            templateUrl: "==comportamiento/verObservadorCompleto.tpl.html",
            controller: 'VerObservadorCompletoCtrl',
            resolve: {
              grupo: [
                '$http',
                '$stateParams',
                function($http,
                $stateParams) {
                  return $http.put('::comportamiento/observador-completo',
                {
                    grupo_id: $stateParams.grupo_id
                  });
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Observador del grupo',
          icon_fa: 'fa fa-print',
          pageTitle: 'Observador del grupo - MyVc'
        }
      }).state('panel.disciplina.ver-observador-periodo',
    {
        url: '/ver-observador-periodo/:grupo_id',
        params: {
          grupo_id: {
            value: null
          }
        },
        views: {
          'report_content': {
            templateUrl: "==comportamiento/verObservadorPeriodo.tpl.html",
            controller: 'VerObservadorPeriodoCtrl',
            resolve: {
              grupo: [
                '$http',
                '$stateParams',
                function($http,
                $stateParams) {
                  return $http.put('::comportamiento/observador-periodo',
                {
                    grupo_id: $stateParams.grupo_id
                  });
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Observador periodo del grupo',
          icon_fa: 'fa fa-print',
          pageTitle: 'Observador periodo del grupo - MyVc'
        }
      }).state('panel.ordinales',
    {
        url: '^/ordinales',
        views: {
          'maincontent': {
            templateUrl: "==comportamiento/ordinales.tpl.html",
            controller: 'OrdinalesCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Ordinales';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Ordinales',
          icon_fa: 'fa fa-user',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_work_like_admin],
          pageTitle: 'Ordinales - MyVc'
        }
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=ComportamientoConfig.js.map
