(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('LoginCtrl', [
    '$scope',
    '$rootScope',
    'AUTH_EVENTS',
    'AuthService',
    '$location',
    '$cookies',
    'Perfil',
    'App',
    '$http',
    'toastr',
    '$sce',
    function($scope,
    $rootScope,
    AUTH_EVENTS,
    AuthService,
    $location,
    $cookies,
    Perfil,
    App,
    $http,
    toastr,
    $sce) {
      var animation_speed;
      animation_speed = 300;
      $scope.logueando = true;
      $scope.recuperando = false;
      $scope.registrando = false;
      $scope.perfilPath = App.images + 'perfil/';
      // Si el colegio quiere que aparezca su imagen en el encabezado, puede hacerlo.
      $scope.logoPathDefault = 'images/Logo_MyVc_Header.gif';
      $scope.logoPath = 'images/Logo_Colegio_Header.gif';
      //$scope.paramuser = {'username': Perfil.User().username }
      $scope.verPublicacionDetalle = function() {
        return toastr.info('Debes loguearte para ver más detalles.');
      };
      $http.get($scope.logoPath).then(function() {
        return console.log('imagen existe');
      },
    function() {
        //alert('image not exist')
        return $scope.logoPath = $scope.logoPathDefault; // set default image
      });
      $scope.abrirImagenBlank = function(ruta) {
        return window.open(ruta,
    '_blank');
      };
      $scope.ir_prematricular = function() {
        $scope.mostrando_prematricular = !$scope.mostrando_prematricular;
        if ($scope.mostrando_prematricular) {
          return $scope.estilo_login = 'height: 600px !important;';
        } else {
          return $scope.estilo_login = '';
        }
      };
      $scope.guardar_prematricula = function() {
        var cre;
        $scope.guardando = true;
        cre = $scope.credentials;
        if (cre.nombres.length && cre.apellidos.length && cre.celular.length && cre.documento.length) {
          cre.estado = 'PREA';
          cre.nuevo = 1;
          cre.year = $scope.year.year + 1;
          cre.grupo_id = $scope.year.grupo_prematr.id;
          return $http.put('::login/crear-prematricula',
    cre).then(function(r) {
            toastr.success(r.data.estado);
            $scope.credentials = {
              username: '',
              password: '',
              sexo: 'M',
              nombres: '',
              apellidos: '',
              celular: '',
              documento: ''
            };
            return $scope.ir_prematricular();
          },
    function() {
            //alert('image not exist')
            return $scope.logoPath = $scope.logoPathDefault; // set default image
          });
        } else {
          return toastr.error('Faltan datos, por favor escíbelos todos.');
        }
      };
      $http.put('::publicaciones/ultimas').then(function(r) {
        var i,
    len,
    publi,
    ref,
    results;
        $scope.publicaciones = r.data.publicaciones;
        $scope.year = r.data.year;
        ref = $scope.publicaciones;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          publi = ref[i];
          results.push(publi.contenido = $sce.trustAsHtml(publi.contenido));
        }
        return results;
      },
    function() {
        //alert('image not exist')
        return $scope.logoPath = $scope.logoPathDefault; // set default image
      });
      $scope.credentials = {
        username: '',
        password: '',
        sexo: 'M',
        nombres: '',
        apellidos: '',
        celular: '',
        documento: ''
      };
      $scope.host = $location.host();
      $scope.login = function(credentials) {
        $cookies.remove('xtoken');
        Perfil.deleteUser();
        return AuthService.login_credentials(credentials).then(function(r) {
          AuthService.verificar().then(function(r2) {
            //if localStorage.getItem('logueando') == 'token_verificado'
            return localStorage.removeItem('logueando');
          },
    function(r3) {
            return console.log('Falló en Verificar',
    r3);
          });
        });
      };
      $scope.enviarPass = function(correo_electronico) {
        return $http.post('::login/ver-pass',
    {
          email: correo_electronico,
          ruta: location.origin + location.pathname
        }).then(function(r) {
          return alert('Ahora, verifica tu correo');
        },
    function() {
          return alert('Parece que el correo no está registrado.');
        });
      };
      $scope.to_recuperando = function() {
        $scope.logueando = false;
        $scope.recuperando = true;
        return $scope.registrando = false;
      };
      $scope.to_registrando = function() {
        $scope.logueando = false;
        $scope.recuperando = false;
        return $scope.registrando = true;
      };
      $scope.to_logueando = function() {
        $scope.logueando = true;
        $scope.recuperando = false;
        return $scope.registrando = false;
      };
    }
  ]).controller('ResetPasswordCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$cookies',
    'Perfil',
    'App',
    '$http',
    'toastr',
    function($scope,
    $state,
    $stateParams,
    $cookies,
    Perfil,
    App,
    $http,
    toastr) {
      $scope.reseteando = false;
      $scope.username = $stateParams.username;
      $scope.logoPath = 'images/Logo_Colegio_Header.gif';
      if ($stateParams.numero < 10000) {
        console.log('Reseteo inválido, deja de intentarlo.');
        $state.go('login');
      }
      $scope.credentials = {
        password1: '',
        password2: ''
      };
      $scope.reset = function(credentials) {
        $scope.reseteando = true;
        if (credentials.password1 !== credentials.password2) {
          toastr.warning('Las contraseñas no coinciden.');
          $scope.reseteando = false;
          return;
        }
        if (credentials.password1.length < 4) {
          toastr.warning('Debe tener al menos 4 caracteres');
          $scope.reseteando = false;
          return;
        }
        return $http.put('::login/reset-password',
    {
          password1: credentials.password1,
          numero: $stateParams.numero,
          username: $stateParams.username
        }).then(function(r) {
          if (r.data === 'Token inválido') {
            toastr.warning('Token inválido');
            return $scope.reseteando = false;
          } else {
            return $state.go('login');
          }
        },
    function(r2) {
          console.log('No se pudo resetear');
          return $scope.reseteando = false;
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=LoginCtrl.js.map
