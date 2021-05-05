(function() {
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    function($state,
    App) {
      $state.state('panel.areas',
    {
        url: '^/areas',
        views: {
          'maincontent': {
            templateUrl: "==areas/areas.tpl.html",
            controller: 'AreasCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Areas';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Areas',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Áreas - MyVc'
        }
      });
      $state.state('panel.materias',
    {
        url: '^/materias',
        views: {
          'maincontent': {
            templateUrl: "==areas/materias.tpl.html",
            controller: 'MateriasCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Materias';
                }
              ]
            }
          }
        },
        resolve: {
          areas: [
            '$http',
            function($http) {
              return $http.get('::areas').then(function(data) {
                return data.data;
              });
            }
          ]
        },
        data: {
          displayName: 'Materias',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Materias - MyVc'
        }
      });
      $state.state('panel.asignaturas',
    {
        url: '^/asignaturas',
        views: {
          'maincontent': {
            templateUrl: "==areas/asignaturas.tpl.html",
            controller: 'AsignaturasCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Asignaturas';
                }
              ]
            }
          }
        },
        resolve: {
          datosAsignaturas: [
            '$http',
            function($http) {
              return $http.put('::asignaturas/datos-asignaturas').then(function(data) {
                return data.data;
              });
            }
          ]
        },
        data: {
          displayName: 'Asignaturas',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Asignatura - MyVc'
        }
      });
      $state.state('panel.listasignaturas',
    {
        url: '^/listasignaturas/:profesor_id',
        params: {
          profesor_id: {
            value: null
          }
        },
        views: {
          'maincontent': {
            templateUrl: "==areas/listAsignaturas.tpl.html",
            controller: 'ListAsignaturasCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                '$stateParams',
                function($stateParams) {
                  localStorage.profesor_id = $stateParams.profesor_id;
                  return 'Listado de asignaturas';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Listado de asignaturas',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Mis asignaturas - MyVc'
        }
      });
      return $state.state('panel.frases',
    {
        url: '^/frases',
        views: {
          'maincontent': {
            templateUrl: "==areas/frases.tpl.html",
            controller: 'FrasesCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Frases';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Frases',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Frases - MyVc'
        }
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=AreasConfig.js.map
