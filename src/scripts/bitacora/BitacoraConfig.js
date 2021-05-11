(function() {
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    'App',
    function($state,
    App) {
      return $state.state('panel.bitacora',
    {
        url: '/bitacora',
        views: {
          'maincontent': {
            templateUrl: `${App.views}bitacora/bitacora.tpl.html`,
            controller: 'BitacoraCtrl'
          },
          'headerContent': {
            templateUrl: `${App.views}panel/panelHeader.tpl.html`,
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Bitacora';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Bitacora',
          icon_fa: 'fa fa-male',
          pageTitle: 'Bitácora - MyVc'
        }
      });
    }
  ]);

}).call(this);

//BitacoraConfig.js.map
