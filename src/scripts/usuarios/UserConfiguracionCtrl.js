(function() {
  angular.module('myvcFrontApp').controller('UserConfiguracionCtrl', [
    '$scope',
    '$http',
    '$state',
    'toastr',
    'AuthService',
    'Perfil',
    'App',
    'perfilactual',
    function($scope,
    $http,
    $state,
    toastr,
    AuthService,
    Perfil,
    App,
    perfilactual) {
      AuthService.verificar_acceso();
      $scope.data = {}; // Para el popup del Datapicker
      $scope.comprobando = false;
      $scope.mostrarErrorUsername = false;
      $scope.mostrarErrorPassword = false;
      $scope.canSaveUsername = false;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.perfilactual = perfilactual;
      $scope.newusername = '';
      $scope.passantiguo = '';
      $scope.newpass = '';
      $scope.newpassverif = '';
      $scope.status = {
        passCambiado: false // Para cerrar tab cuando se cambie el password
      };
      $scope.nombresdeusuario = [];
      $http.get('::perfiles/usernames').then(function(r) {
        return $scope.nombresdeusuario = r.data;
      },
    function(r2) {
        return toastr.error('No se trajeron los nombres de usuario');
      });
      $scope.dateOptions = {
        formatYear: 'yyyy',
        allowInvalid: true
      };
      $scope.guardarEmailRestore = function(email_rest) {
        return $http.put('::perfiles/guardar-mi-email-restore',
    {
          email_restore: email_rest
        }).then(function(r) {
          return toastr.success('Email guardado con éxito');
        },
    function(r2) {
          return toastr.error('No se trajeron los nombres de usuario');
        });
      };
      $scope.$watch('newusername',
    function(oldv,
    newv) {});
      //console.log 'oldv, newv', oldv, newv
      $scope.comprobarusername = function(newusername) {
        $scope.canSaveUsername = false;
        $scope.comprobando = true;
        if (newusername.username) {
          newusername = newusername.username;
        }
        if (newusername === $scope.perfilactual.username) {
          toastr.warning('Copia un nombre de usuario diferente al que ya tienes');
          $scope.comprobando = false;
          return;
        }
        if (newusername === '') {
          toastr.warning('Debes copiar un nombre de usuario.');
          $scope.comprobando = false;
          return;
        }
        return $http.get('::perfiles/comprobarusername/' + newusername).then(function(r) {
          r = r.data;
          if (r[0].existe) {
            toastr.warning('Nombre de usuario ya en uso.');
            $scope.mostrarErrorUsername = true;
          } else {
            $scope.mostrarErrorUsername = false;
            $scope.canSaveUsername = true;
          }
          return $scope.comprobando = false;
        },
    function(r2) {
          toastr.error('No se trajeron los nombres de usuario');
          return $scope.comprobando = false;
        });
      };
      $scope.guardar = function() {
        var datos;
        $scope.canSaveUsername = false;
        datos = {
          nombres: $scope.perfilactual.nombres,
          apellidos: $scope.perfilactual.apellidos,
          sexo: $scope.perfilactual.sexo,
          fecha_nac: $scope.perfilactual.fecha_nac,
          celular: $scope.perfilactual.celular,
          tipo: $scope.perfilactual.tipo,
          email_persona: $scope.perfilactual.email_persona
        };
        return $http.put('::perfiles/update/' + $scope.perfilactual.persona_id,
    datos).then(function(r) {
          return toastr.success('Datos guardados');
        },
    function(r2) {
          toastr.error('Datos NO guardados',
    'Problema');
          return $scope.canSaveUsername = true;
        });
      };
      $scope.solicitarCambios = function() {
        $scope.canSaveUsername = false;
        return $http.put('::ChangesAsked/solicitar-cambios',
    $scope.perfilactual).then(function(r) {
          return toastr.info('Debes esperar que un administrador acepte cambios',
    'Solicitud realizada',
    {
            timeOut: 8000
          });
        },
    function(r2) {
          toastr.error('Datos NO guardados',
    'Problema');
          return $scope.canSaveUsername = true;
        });
      };
      $scope.CambiarUsername = function(newusername) {
        return $http.put('::perfiles/guardar-username/' + $scope.perfilactual.user_id,
    {
          'username': newusername
        }).then(function(r) {
          toastr.success('Nombre de usuario guardado');
          Perfil.User().username = newusername;
          return $scope.$emit('cambianImgs',
    {
            username: newusername
          });
        },
    function(r2) {
          return toastr.error('Nombre de usuario NO guardado',
    'Problema');
        });
      };
      $scope.CambiarPass = function(newpass,
    newpassverif,
    passantiguo) {
        var datos;
        if (newpass !== newpassverif) {
          toastr.warning('Las contraseñas no coinciden');
          return;
        }
        if (newpass.length < 4) {
          toastr.warning('La contraseña debe tener mínimo 4 caracteres. Sin espacios ni Ñ ni tildes.');
          return;
        }
        $scope.cambiandoPass = true; // Bloqueamos el botón temporalmente
        datos = {
          'password': newpassverif,
          'oldpassword': passantiguo
        };
        return $http.put('::perfiles/cambiarpassword/' + $scope.perfilactual.user_id,
    datos).then(function(r) {
          toastr.success('Contraseña cambiada.');
          $scope.status.passCambiado = false;
          return $scope.cambiandoPass = false;
        },
    function(r2) {
          r2 = r2.data;
          if (r2.$error) {
            if (r2.error.message === 'Contraseña antigua es incorrecta') {
              toastr.warning(r2.error.message);
            } else {
              toastr.error('No se pudo cambiar la contraseña.');
            }
          } else {
            toastr.error('No se pudo cambiar la contraseña.');
          }
          return $scope.cambiandoPass = false;
        });
      };
      return $scope.CambiarCorreoRestore = function() {
        var datos;
        datos = {
          'email_restore': $scope.email_restore
        };
        return $http.put('::perfiles/cambiaremailrestore/' + $scope.perfilactual.user_id,
    datos).then(function(r) {
          return toastr.success('Contraseña cambiada.');
        },
    function(r2) {
          return toastr.error('No se pudo cambiar la contraseña',
    'Problema');
        });
      };
    }
  ]);

}).call(this);

//UserConfiguracionCtrl.js.map
