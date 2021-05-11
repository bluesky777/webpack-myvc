(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('PanelCtrl', [
    '$scope',
    '$http',
    '$state',
    '$cookies',
    '$rootScope',
    'AuthService',
    'Perfil',
    'App',
    'resolved_user',
    'toastr',
    'cfpLoadingBar',
    '$window',
    '$uibModal',
    function($scope,
    $http,
    $state,
    $cookies,
    $rootScope,
    AuthService,
    Perfil,
    App,
    resolved_user,
    toastr,
    cfpLoadingBar,
    $window,
    $modal) {
      var cambia,
    modalInstance;
      $scope.USER = resolved_user;
      $scope.pageTitle = $rootScope.pageTitle;
      //$scope.bigLoader = true
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;

      $scope.status = {
        isPeriodoOpen: false,
        isYearOpen: false,
        isPerfilOpen: false,
      };

      if (localStorage.cambia_anio) {
        cambia = parseInt(localStorage.cambia_anio);
        modalInstance = $modal.open({
          templateUrl: '==panel/cuidadoCambiaPeriodoModal.tpl.html',
          controller: 'PoliticasPrivacidadCtrl',
          size: 'lg'
        });
        delete localStorage.cambia_anio;
      }
      // Si el colegio quiere que aparezca su imagen en el encabezado, puede hacerlo.
      $scope.logoPathDefault = 'images/Logo_MyVc_Header.gif';
      $scope.logoPath = 'images/Logo_Colegio_Header.gif';
      //$scope.paramuser = {'username': Perfil.User().username }
      $http.get($scope.logoPath).then(function() {
        return console.log('logoPath  existe');
      },
    function() {
        //console.log 'logoPath NO existe'
        return $scope.logoPath = $scope.logoPathDefault; // set default image
      });
      if (localStorage.menucompacto) {
        $rootScope.menucompacto = localStorage.menucompacto === 'true' ? true : false;
      } else {
        if ($window.innerWidth < 600) {
          $rootScope.menucompacto = true;
          localStorage.menucompacto = $rootScope.menucompacto;
        }
      }
      // Para evitar una supuesta espera infinita
      cfpLoadingBar.complete();
      AuthService.verificar_acceso();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.date = new Date();
      $http.get('::years').then(function(r) {
        return $scope.years = r.data;
      },
    function(r) {
        return toastr.error('No se trajeron los años');
      });
      $http.get('::periodos').then(function(r) {
        return $scope.periodos = r.data;
      },
    function(r) {
        return toastr.error('No se trajeron los periodos');
      });
      if ($scope.USER.tipo === 'Acudiente') {
        $http.put('::acudientes/mis-acudidos').then(function(r) {
          return $scope.mis_acudidos = r.data.alumnos;
        },
    function(r) {
          return toastr.error('No se trajeron los acudidos');
        });
      }
      $scope.setImagenPrincipal = function() {
        var imgOficial,
    imgUsuario,
    ini,
    pathOfi,
    pathUsu;
        ini = App.images + 'perfil/';
        imgUsuario = $scope.USER.imagen_nombre;
        imgOficial = $scope.USER.foto_nombre;
        pathUsu = ini + imgUsuario;
        pathOfi = ini + imgOficial;
        $scope.imagenPrincipal = pathUsu;
        return $scope.imagenOficial = pathOfi;
      };
      $scope.setImagenPrincipal();
      $scope.nameToShow = Perfil.nameToShow;
      $scope.usuario = function() {
        return Perfil.User().username;
      };
      $scope.toggleCompactMenu = function() {
        $rootScope.menucompacto = !$rootScope.menucompacto;
        return localStorage.menucompacto = $rootScope.menucompacto;
      };
      $scope.seeDropdownPeriodos = false;
      $scope.togglePeriodos = function() {
        $scope.seeDropdownPeriodos = !$scope.seeDropdownPeriodos;
        return console.log($scope.seeDropdownPeriodos);
      };
      $scope.cambiarPeriodo = function(periodo) {
        return $http.put('::periodos/useractive/' + periodo.id).then(function(r) {
          toastr.success('Periodo cambiado con éxito al perido ' + periodo.numero,
    'Cambiado');
          $scope.USER.periodo_id = periodo.id;
          $scope.USER.numero_periodo = periodo.numero;
          //$rootScope.reload()
          return $window.location.reload(); // Actualizamos toda la página al cambiar el periodo
        },
    function(r2) {
          return toastr.warning('No se pudo cambiar de periodo.',
    'Problema');
        });
      };
      $scope.cambiarYear = function(year) {
        return $http.put('::years/useractive/' + year.id).then(function(r) {
          r = r.data;
          $scope.USER.year_id = year.id;
          $scope.USER.year = year.year;
          $scope.USER.numero_periodo = r.numero;
          $scope.USER.periodo_id = r.id;
          toastr.success('Año cambiado con éxito: ' + year.year,
    'Cambiado');
          return $window.location.reload(); // Actualizamos toda la página al cambiar el año
        },
    // $rootScope.reload() # No funciona correctamente
    function(r2) {
          return toastr.warning('No se pudo cambiar el año.',
    'Problema');
        });
      };
      $scope.logout = function() {
        return AuthService.logout();
      };
      $scope.goFileManager = function() {
        return $state.go('panel.filemanager');
      };
      $scope.indexChar = function(index) {
        return String.fromCharCode(65 + index);
      };
      $scope.verPoliticasPrivacidad = function() {
        return modalInstance = $modal.open({
          templateUrl: '==panel/politicasPrivacidadModal.tpl.html',
          controller: 'PoliticasPrivacidadCtrl',
          size: 'lg'
        });
      };
      $scope.$on('cambianImgs',
    function(event,
    data) {
        $scope.USER = Perfil.User();
        return $scope.setImagenPrincipal();
      });
    }
  ]).controller('PoliticasPrivacidadCtrl', [
    '$scope',
    '$uibModalInstance',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    $http,
    toastr,
    App) {
      $scope.perfilPath = App.images + 'perfil/';
      $scope.ok = function() {
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//PanelCtrl.js.map
