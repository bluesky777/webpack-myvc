(function() {
  angular.module('myvcFrontApp').controller('UserCtrl', [
    '$scope',
    '$http',
    '$state',
    'AuthService',
    'Perfil',
    'App',
    'perfilactual',
    '$filter',
    function($scope,
    $http,
    $state,
    AuthService,
    Perfil,
    App,
    perfilactual,
    $filter) {
      var traerDatos,
    username;
      username = $state.params.username;
      $scope.perfilactual = perfilactual;
      $scope.companieros = [];
      $scope.profesores = [];
      $scope.materias = [];
      $scope.canConfig = false;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.setImagenPrincipal();
      if ($scope.USER.user_id === $scope.perfilactual.user_id) {
        $scope.canConfig = true;
      }
      $scope.setImagenPrincipal = function() {
        var imgOficial,
    imgUsuario,
    ini,
    pathOfi,
    pathUsu;
        ini = App.images + 'perfil/';
        imgUsuario = $scope.perfilactual.imagen_nombre;
        imgOficial = $scope.perfilactual.foto_nombre;
        pathUsu = ini + imgUsuario;
        pathOfi = ini + imgOficial;
        $scope.imagenPrincipal = pathUsu;
        return $scope.imagenOficial = pathOfi;
      };
      traerDatos = function() {
        return $http.get('::perfiles/profesormispersonas').then(function(r) {
          r = r.data;
          $scope.perfilactual = r[0];
          return $scope.setImagenPrincipal();
        },
    function(r2) {
          toastr.error('No se pudo traer el usuario');
          return $state.transitionTo('panel');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.perfilactual.pais_doc === 'undefined') {
            $scope.perfilactual.pais_doc = $item;
            return $scope.paisDocSelecionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.perfilactual.departamento_doc === 'undefined') {
            $scope.perfilactual.departamento_doc = $item;
            return $scope.departDocSeleccionado($item);
          }
        });
      };
      $scope.paisDocSelecionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentos = r.data;
        });
      };
      $scope.departDocSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $http.get('::paises').then(function(r) {
        return $scope.paises = r.data;
      });
      $http.get('::tiposdocumento').then(function(r) {
        var tipo_temp;
        $scope.tipos_doc = r.data;
        // ARREGLO PAIS DE NACIMIENTO
        if ($scope.perfilactual.tipo_doc) {
          tipo_temp = $filter('filter')($scope.tipos_doc,
    {
            id: $scope.perfilactual.tipo_doc
          });
          if (tipo_temp.length > 0) {
            return $scope.perfilactual.tipo_doc = tipo_temp[0];
          }
        }
      });
      // ARREGLO PAIS DE NACIMIENTO
      if ($scope.perfilactual.ciudad_nac === null) {
        $scope.perfilactual.pais_nac = {
          id: 1,
          pais: 'COLOMBIA',
          abrev: 'CO'
        };
        $scope.paisNacSelect($scope.perfilactual.pais_nac,
    $scope.perfilactual.pais_nac);
      } else {
        if ($scope.perfilactual.ciudad_nac === 'N/A') {
          return;
        }
        $http.get('::ciudades/datosciudad/' + $scope.perfilactual.ciudad_nac).then(function(r2) {
          $scope.paises = r2.data.paises;
          $scope.departamentosNac = r2.departamentos;
          $scope.ciudadesNac = r2.ciudades;
          $scope.perfilactual.pais_nac = r2.pais;
          $scope.perfilactual.departamento_nac = r2.departamento;
          return $scope.perfilactual.ciudad_nac = r2.ciudad;
        });
        $http.get('::ciudades/datosciudad/' + $scope.perfilactual.ciudad_doc).then(function(r2) {
          $scope.paises = r2.data.paises;
          $scope.departamentos = r2.departamentos;
          $scope.ciudades = r2.ciudades;
          $scope.perfilactual.pais_doc = r2.pais;
          $scope.perfilactual.departamento_doc = r2.departamento;
          return $scope.perfilactual.ciudad_doc = r2.ciudad;
        });
      }
      return $scope.nameToShow = function() {
        if ($scope.perfilactual.tipo === 'Usu') {
          return $scope.perfilactual.username.toUpperCase();
        } else {
          return $scope.perfilactual.nombres + ' ' + $scope.perfilactual.apellidos;
        }
      };
    }
  ]);

}).call(this);

//UserCtrl.js.map
