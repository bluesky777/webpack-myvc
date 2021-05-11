(function() {
  'use strict';
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    'PERMISSIONS',
    function($state,
    App,
    PERMISSIONS) {
      $state.state('panel.actividades.votaciones',
    {
        url: '/votaciones',
        views: {
          'actividades_content': {
            templateUrl: `${App.views}votaciones/votacionesInicio.tpl.html`,
            controller: 'VotacionesInicioCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Votaciones';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Votaciones',
          icon_fa: 'fa fa-legal',
          pageTitle: 'Votaciones - MyVc'
        }
      });
      $state.state('panel.actividades.votaciones.config',
    {
        url: '/config',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/votaciones.tpl.html`,
            controller: 'VotacionesCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Configuración - MyVc';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Configuración',
          icon_fa: 'fa fa-legal',
          pageTitle: 'Configuración - MyVc'
        }
      }).state('panel.actividades.votaciones.participantes',
    {
        url: '/participantes',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/participantes.tpl.html`,
            controller: 'ParticipantesCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Participantes';
                }
              ]
            }
          }
        },
        data: {
          needed_permissions: [PERMISSIONS.can_edit_participantes],
          displayName: 'Participantes',
          icon_fa: 'fa fa-legal',
          pageTitle: 'Participantes - MyVc'
        }
      }).state('panel.actividades.votaciones.candidatos',
    {
        url: '/candidatos',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/candidatos.tpl.html`,
            controller: 'CandidatosCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Candidatos';
                }
              ]
            }
          }
        },
        data: {
          needed_permissions: [PERMISSIONS.can_edit_candidatos],
          pageTitle: 'Candidatos - MyVc'
        }
      }).state('panel.actividades.votaciones.votar',
    {
        url: '/votar',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/votar.tpl.html`,
            controller: 'VotarCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Votar';
                }
              ]
            }
          }
        },
        data: {
          pageTitle: 'Votar - MyVc'
        }
      }).state('panel.actividades.votaciones.votarprueba',
    {
        url: '/prueba',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/votarprueba.tpl.html`,
            controller: 'VotarPruebaCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Prueba votación';
                }
              ]
            }
          }
        },
        data: {
          pageTitle: 'Prueba votación - MyVc'
        }
      }).state('panel.actividades.votaciones.resultados',
    {
        url: '/resultados',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/resultados.tpl.html`,
            controller: 'ResultadosCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Resultados';
                }
              ]
            }
          }
        },
        data: {
          pageTitle: 'Resultados - MyVc'
        }
      }).state('panel.actividades.votaciones.tarjetones',
    {
        url: '/tarjetones',
        views: {
          'votaciones_view': {
            templateUrl: `${App.views}votaciones/tarjetones.tpl.html`,
            controller: 'TarjetonesCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Tarjetones';
                }
              ]
            }
          }
        },
        data: {
          pageTitle: 'Tarjetones - MyVc'
        }
      });
    }
  ]);

}).call(this);

//VotacionesConfig.js.map
