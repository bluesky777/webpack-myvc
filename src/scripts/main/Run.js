(function() {

  //- Run ejecuta código depués de haber configurado nuestro módulo con config()
  angular.module('myvcFrontApp').run([
    '$rootScope',
    'cfpLoadingBar',
    '$state',
    '$stateParams',
    '$cookies',
    'Perfil',
    'AuthService',
    'AUTH_EVENTS',
    'toastr',
    function($rootScope,
    cfpLoadingBar,
    $state,
    $stateParams,
    $cookies,
    Perfil,
    AuthService,
    AUTH_EVENTS,
    toastr) {
      //- Asignamos la información de los estados actuales para poder manipularla en las vistas.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.lastState = null;
      $rootScope.lastStateParam = null;
      $rootScope.notaRapida = {
        enable: false,
        valorNota: 0
      };
      $rootScope.menucompacto = false;
      //- Evento que se ejecuta cuando envío alguna petición al servidor que requiere autenticación y no está autenticado.
      $rootScope.$on('event:auth-loginRequired',
    function(r) {
        console.log('Acceso no permitido, vamos a loguear',
    r);
        return $state.transitionTo('login');
      });
      $rootScope.ingresar = function() {
        //- Si lastState es null, quiere decir que hemos entrado directamente a login sin ser redireccionados.
        if ($rootScope.lastState === null || $rootScope.lastState === 'login' || $rootScope.lastState === '/' || $rootScope.lastState === 'main') {
          return $state.transitionTo('panel'); //- Por lo tanto nos vamos a panel después de autenticarnos.
        } else {
          return $state.transitionTo($rootScope.lastState,
    $rootScope.lastStateParam); //- Si no es null ni login, Nos vamos al último estado.
        }
      };
      //console.log 'Funcion ingresar. lastState: ', $rootScope.lastState

      //- Evento ejecutado cuando nos logueamos despues del servidor haber pedido autenticación.
      $rootScope.$on('event:auth-loginConfirmed',
    function() {
        console.log('Logueado con éxito!');
        return $rootScope.ingresar();
      });
      //- Evento que se ejecuta cuando vamos a cambiar de estado.
      $rootScope.$on('$stateChangeStart',
    function(event,
    next,
    toParams,
    fromState,
    fromParams) {
        //console.log 'Va a empezar a cambiar un estado: ', next, toParams
        if ($rootScope.lastState === null || (next.name !== 'logout' && next.name !== 'login' && next.name !== 'main')) {
          $rootScope.lastState = next.name;
          return $rootScope.lastStateParam = toParams;
        }
      });
      //- Evento cuando ya hemos cambiado de estado.
      $rootScope.$on('$stateChangeSuccess',
    function(event,
    toState,
    toParams,
    fromState,
    fromParams) {
        //$rootScope.lastState = fromState.name if fromState.name != ''
        //-if $state.current.name == 'login' then cfpLoadingBar.complete() # No me funciona :(
        return $rootScope.pageTitle = $state.current.name;
      });
      $rootScope.$on('$stateChangeError',
    function(event,
    toState,
    toParams,
    fromState,
    fromParams) {
        //$rootScope.lastState = fromState.name if fromState.name != ''
        //-if $state.current.name == 'login' then cfpLoadingBar.complete() # No me funciona :(
        console.log('Evento fallido: ',
    event);
        toastr.warning('Lo sentimos, hubo un error o no puedes acceder a esta vista');
        if ($rootScope.lastState !== 'panel') {
          return $state.transitionTo('panel');
        }
      });
      $rootScope.$on(AUTH_EVENTS.loginSuccess,
    function() {
        var usuario;
        usuario = Perfil.User();
        if (usuario) {
          if (usuario.votaciones) {
            if (usuario.votaciones.length === 1) {
              toastr.success('Hay 1 votación en ejecución.');
            } else {
              toastr.success('Hay ' + usuario.votaciones.length + ' votaciones en ejecución.');
            }
            return $state.go('panel.actividades.votaciones.votar');
          } else {
            return $rootScope.ingresar();
          }
        }
      });
      $rootScope.$on(AUTH_EVENTS.loginFailed,
    function(ev) {});
      //toastr.error 'Datos incorrecto.', 'No se pudo loguear'
      //console.log 'Evento loginFailed: ', ev
      $rootScope.$on(AUTH_EVENTS.notAuthenticated,
    function(ev) {
        toastr.warning('No está autorizado.',
    'Acceso exclusivo');
        console.log('Evento notAuthenticated: ',
    ev);
        return $state.transitionTo('login');
      });
      return $rootScope.$on(AUTH_EVENTS.notAuthorized,
    function(ev) {
        toastr.warning('No está autorizado para entrar a esta vista',
    'Restringido');
        $state.go('panel');
        return console.log('Evento notAuthorized: ',
    ev,
    $rootScope.lastState);
      });
    }
  ]);

}).call(this);

//# sourceMappingURL=Run.js.map
