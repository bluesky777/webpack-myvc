(function() {
  'use strict';
  angular.module('myvcFrontApp').config([
    '$stateProvider',
    function($state) {
      $state.state('panel.niveles',
    {
        url: '^/niveles',
        views: {
          'maincontent': {
            templateUrl: "==grados/niveles.tpl.html",
            controller: 'NivelesCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Niveles educativos';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Niveles',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Niveles - MyVc'
        }
      });
      $state.state('panel.niveles.nuevo',
    {
        url: '/nuevo',
        views: {
          'edit_nivel': {
            templateUrl: "==grados/nivelesNew.tpl.html",
            controller: 'NivelesNewCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Nuevo';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Nuevo',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Nivel nuevo - MyVc'
        }
      });
      $state.state('panel.niveles.editar',
    {
        url: '/editar/:nivel_id',
        views: {
          'edit_nivel': {
            templateUrl: "==grados/nivelesEdit.tpl.html",
            controller: 'NivelesEditCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Editar';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Editar',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Editar nivel - MyVc'
        }
      });
      $state.state('panel.grados',
    {
        url: '^/grados',
        views: {
          'maincontent': {
            templateUrl: "==grados/grados.tpl.html",
            controller: 'GradosCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Grados';
                }
              ]
            }
          }
        },
        resolve: {
          niveles: [
            '$http',
            function($http) {
              return $http.get('::niveles_educativos').then(function(data) {
                return data.data;
              });
            }
          ]
        },
        data: {
          displayName: 'Grados',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Grados - MyVc'
        }
      });
      $state.state('panel.grados.nuevo',
    {
        url: '/nuevo',
        views: {
          'edit_grado': {
            templateUrl: "==grados/gradosNew.tpl.html",
            controller: 'GradosNewCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Nuevo';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Nuevo',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Grado nuevo - MyVc'
        }
      });
      $state.state('panel.grados.editar',
    {
        url: '/editar/:grado_id',
        views: {
          'edit_grado': {
            templateUrl: "==grados/gradosEdit.tpl.html",
            controller: 'GradosEditCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Editar';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Editar',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Editar grado - MyVc'
        }
      });
      $state.state('panel.grupos',
    {
        url: '^/grupos',
        views: {
          'maincontent': {
            templateUrl: "==grados/grupos.tpl.html",
            controller: 'GruposCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Grupos';
                }
              ]
            }
          }
        },
        resolve: {
          grados: [
            '$http',
            function($http) {
              return $http.get('::grados').then(function(data) {
                return data.data;
              });
            }
          ],
          profesores: [
            '$http',
            function($http) {
              return $http.get('::contratos').then(function(data) {
                return data.data;
              });
            }
          ]
        },
        data: {
          displayName: 'Grupos',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Grupos - MyVc'
        }
      });
      $state.state('panel.grupos.nuevo',
    {
        url: '/nuevo',
        views: {
          'edit_grupo': {
            templateUrl: "==grados/gruposNew.tpl.html",
            controller: 'GruposNewCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Nuevo';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Nuevo',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Grupo nuevo - MyVc'
        }
      });
      return $state.state('panel.grupos.editar',
    {
        url: '/editar/:grupo_id',
        views: {
          'edit_grupo': {
            templateUrl: "==grados/gruposEdit.tpl.html",
            controller: 'GruposEditCtrl'
          },
          'headerContent': {
            templateUrl: "==panel/panelHeader.tpl.html",
            controller: 'PanelHeaderCtrl',
            resolve: {
              titulo: [
                function() {
                  return 'Editar';
                }
              ]
            }
          }
        },
        data: {
          displayName: 'Editar',
          icon_fa: 'fa fa-graduation-cap',
          pageTitle: 'Editar grupo - MyVc'
        }
      });
    }
  ]);

}).call(this);

//GradosConfig.js.map
