(function() {
  'use strict';
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    function($state) {
      return $state.state('panel.filemanager',
    {
        url: '/filemanager',
        views: {
          'maincontent': {
            templateUrl: "==fileManager/fileManager.tpl.html",
            controller: 'FileManagerCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Administrador de archivos';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Administrador de archivos',
          icon_fa: 'fa fa-cube',
          pageTitle: 'Imágenes - MyVc'
        }
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=FileManagerConfig.js.map
