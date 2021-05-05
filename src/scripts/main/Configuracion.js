(function() {

  // Configuración principal de nuestra aplicación.
  angular.module('myvcFrontApp').config([
    '$cookiesProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$httpProvider',
    '$locationProvider',
    'App',
    'PERMISSIONS',
    '$intervalProvider',
    '$rootScopeProvider',
    'USER_ROLES',
    'toastrConfig',
    'uiSelectConfig',
    function($cookies,
    $state,
    $urlRouter,
    $urlMatcherFactoryProvider,
    $httpProvider,
    $locationProvider,
    App,
    PERMISSIONS,
    $intervalProvider,
    $rootScopeProvider,
    USER_ROLES,
    toastrConfig,
    uiSelectConfig) {
      $httpProvider.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
      $httpProvider.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.interceptors.push(function($q) {
        return {
          'request': function(config) {
            var explotado;
            explotado = config.url.split('::');
            if (explotado.length > 1) {
              config.url = App.Server + explotado[1];
            } else {
              explotado = config.url.split('==');
              if (explotado.length > 1) {
                config.url = App.views + explotado[1];
              }
            }
            return config;
          }
        };
      });
      /*
      ChartJsProvider.setOptions({
      	defaultFontSize : 9
      });
      */
      uiSelectConfig.theme = 'select2';
      uiSelectConfig.resetSearchInput = true;
      // Los estados con parámetros opcionales siguen sin funcionar cuando se les quita el slash. stricMode arregla al menos los demás que no tienen parametros opcionales
      $urlMatcherFactoryProvider.strictMode(false);
      $urlRouter.otherwise('/login');
      $urlRouter.when('/user/:username',
    [
        '$match',
        '$state',
        function($match,
        $state) {
          return $state.transitionTo('panel.user.resumen',
        $match);
        }
      ]);
      $state.state('main', //- Estado raiz que no necesita autenticación.
    {
        url: '/',
        views: {
          'principal': {
            templateUrl: App.views + 'main/main.tpl.html',
            controller: 'MainCtrl'
          }
        },
        data: {
          displayName: 'principal',
          icon_fa: '',
          pageTitle: 'Construcción - MyVc'
        }
      }).state('login',
    {
        url: '/login',
        views: {
          'principal': {
            templateUrl: `${App.views}login/login.tpl.html`,
            controller: 'LoginCtrl'
          }
        },
        data: {
          displayName: 'Login',
          icon_fa: 'fa fa-user',
          pageTitle: 'Ingresar a MyVc'
        }
      }).state('reset-password',
    {
        url: '/reset-password/:numero/:username',
        views: {
          'principal': {
            templateUrl: `${App.views}login/reset-password.tpl.html`,
            controller: 'ResetPasswordCtrl'
          }
        },
        data: {
          displayName: 'Resetear',
          icon_fa: 'fa fa-user',
          pageTitle: 'Ingreso a MyVc'
        }
      }).state('logout',
    {
        url: '/logout',
        views: {
          'principal': {
            templateUrl: `${App.views}login/logout.tpl.html`,
            controller: 'LogoutCtrl'
          }
        },
        data: {
          displayName: 'Logout',
          icon_fa: 'fa fa-user'
        }
      }).state('panel', //- Estado admin.
    {
        url: '/panel',
        views: {
          'principal': {
            templateUrl: `${App.views}panel/panel.tpl.html`,
            controller: 'PanelCtrl'
          }
        },
        resolve: {
          resolved_user: [
            'AuthService',
            function(AuthService) {
              return AuthService.verificar();
            }
          ]
        },
        data: {
          displayName: 'Inicio',
          icon_fa: 'fa fa-home',
          pageTitle: 'Bienvenido - MyVc'
        }
      });
      //$locationProvider.html5Mode true

      //$rootScopeProvider.bigLoader = true
      angular.extend(toastrConfig,
    {
        allowHtml: true,
        closeButton: true,
        extendedTimeOut: 1000,
        preventOpenDuplicates: false,
        maxOpened: 3,
        tapToDismiss: true,
        target: 'body',
        timeOut: 4000
      });
      return this;
    }
  ]).filter('capitalize', function() {
    return function(input, all) {
      if (!!input) {
        return input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      } else {
        return '';
      }
    };
  });

}).call(this);

//# sourceMappingURL=Configuracion.js.map
