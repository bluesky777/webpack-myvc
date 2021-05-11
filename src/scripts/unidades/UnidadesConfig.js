(function() {
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    'PERMISSIONS',
    function($state,
    App,
    PERMISSIONS) {
      return $state.state('panel.unidades',
    {
        url: '^/unidades/:asignatura_id',
        views: {
          'maincontent': {
            templateUrl: "==unidades/unidades.tpl.html",
            controller: 'UnidadesCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                'AuthService',
                '$q',
                function(AuthService,
                $q) {
                  var d;
                  d = $q.defer();
                  AuthService.verificar().then(function(r) {
                    return d.resolve(r.unidades_displayname);
                  },
                function(r2) {
                    return d.resolve('Unidades');
                  });
                  return d.promise;
                }
              ]
            }
          }
        },
        resolve: {
          usuario: [
            'AuthService',
            function(AuthService) {
              return AuthService.verificar();
            }
          ]
        },
        data: {
          displayName: 'Unidades',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Unidades - MyVc',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_edit_unidades_subunidades]
        }
      }).state('panel.copiar',
    {
        url: '^/copiar',
        views: {
          'maincontent': {
            templateUrl: "==unidades/copiar.tpl.html",
            controller: 'CopiarCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Copiar';
                }
              ]
            }
          }
        },
        /*
        resolve:
        	usuario: ['AuthService', (AuthService)->
        		AuthService.verificar()
        	]
        */
        data: {
          displayName: 'Copiar',
          icon_fa: 'fa fa-copy',
          pageTitle: 'Copiar - MyVc',
          needed_permissions: [PERMISSIONS.can_work_like_teacher,
    PERMISSIONS.can_edit_unidades_subunidades]
        }
      });
    }
  ]);

}).call(this);

//UnidadesConfig.js.map
