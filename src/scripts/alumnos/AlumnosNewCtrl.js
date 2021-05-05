(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('AlumnosNewCtrl', [
    '$scope',
    '$rootScope',
    'toastr',
    '$http',
    '$filter',
    '$state',
    function($scope,
    $rootScope,
    toastr,
    $http,
    $filter,
    $state) {
      $scope.data = {}; // Para el popup del Datapicker
      $scope.$state = $state;
      $scope.data.proceso = 'matriculando';
      $scope.formatear_nuevo = function() {
        return $scope.alumno = {
          'no_matricula': '',
          'nombres': '',
          'apellidos': '',
          'sexo': 'M',
          'documento': '',
          'password': '1234567',
          'fecha_nac': new Date('2000-06-26'),
          'tipo_sangre': {},
          'eps': '',
          'telefono': '',
          'celular': '',
          'direccion': '',
          'barrio': '',
          'estrato': 1,
          'email': '@gmail.com',
          'foto': 'perfil/default_male.jpg',
          'pazysalvo': true,
          'deuda': 0,
          'nuevo': 0,
          'repitente': 0,
          'pais_nac': {
            id: 1,
            pais: 'COLOMBIA',
            abrev: 'CO'
          }
        };
      };
      $scope.formatear_nuevo();
      $scope.sangres = [
        {
          sangre: 'O+'
        },
        {
          sangre: 'O-'
        },
        {
          sangre: 'A+'
        },
        {
          sangre: 'A-'
        },
        {
          sangre: 'B+'
        },
        {
          sangre: 'B-'
        },
        {
          sangre: 'AB+'
        },
        {
          sangre: 'AB-'
        }
      ];
      if (localStorage.mostrar_mas_new) {
        $scope.mostrar_mas_new = localStorage.mostrar_mas_new === 'true' ? true : false;
      }
      $http.get('::paises').then(function(r) {
        r = r.data;
        $scope.paises = r;
        $scope.pais_nac = r[0];
        return $scope.paisNacSelect(r[0],
    $scope.pais_nac);
      },
    function() {
        return console.log('No se pudo traer los paises');
      });
      $http.get('::tiposdocumento').then(function(r) {
        return $scope.tipos_doc = r.data;
      });
      $scope.persona_buscar = '';
      $scope.templateTypeahead = '==alumnos/personaTemplateTypeahead.tpl.html';
      $scope.templateTypeDoc = '==alumnos/documentoTemplateTypeahead.tpl.html';
      $scope.personaCheck = function(texto) {
        $scope.verificandoPersona = true;
        return $http.put('::alumnos/personas-check',
    {
          texto: texto,
          todos_anios: $scope.dato.todos_anios
        }).then(function(r) {
          $scope.personas_match = r.data.personas;
          $scope.personas_match.map(function(perso) {
            return perso.perfilPath = $scope.perfilPath;
          });
          $scope.verificandoPersona = false;
          return $scope.personas_match;
        });
      };
      $scope.documentoCheck = function(texto) {
        $scope.verificandoDoc = true;
        return $http.put('::alumnos/documento-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.personas_match = r.data.personas;
          $scope.personas_match.map(function(perso) {
            return perso.perfilPath = $scope.perfilPath;
          });
          $scope.verificandoDoc = false;
          return $scope.personas_match;
        });
      };
      $scope.seleccionarPersona = function($item,
    $model,
    $label) {
        return toastr.info('Esta persona ya existe, búscala en Alumnos - Todos',
    'No crear');
      };
      $scope.mostarMasDetalleNew = function() {
        $scope.mostrar_mas_new = !$scope.mostrar_mas_new;
        return localStorage.mostrar_mas_new = $scope.mostrar_mas_new;
      };
      if ($rootScope.grupos_siguientes) {
        $scope.grupos_siguientes = $rootScope.grupos_siguientes;
        $scope.data.proceso = 'prematriculando';
      } else {
        $http.get('::grupos/next-year').then(function(r) {
          return $scope.grupos_siguientes = r.data;
        },
    function() {
          return console.log('No se pudo traer los grupos del siguiente año');
        });
      }
      $http.get('::grupos').then(function(r) {
        return $scope.grupos = r.data;
      },
    function() {
        return console.log('No se pudo traer los grupos');
      });
      $scope.crear = function(alumno,
    proceso) {
        alumno.nombres = $.trim(alumno.nombres);
        alumno.apellidos = $.trim(alumno.apellidos);
        alumno.documento = $.trim(alumno.documento);
        $scope.guardando = true;
        if (!alumno.grupo && proceso === 'matriculando') {
          $scope.guardando = false;
          toastr.warning('Debe seleccionar el grupo.');
          return;
        }
        if (!alumno.grupo_sig && proceso === 'prematriculando') {
          $scope.guardando = false;
          toastr.warning('Debe seleccionar el grupo.');
          return;
        }
        if (alumno.nombres.length === 0) {
          $scope.guardando = false;
          toastr.warning('Debe copiar el nombre.');
          return;
        }
        alumno.fecha_nac = $filter('date')(alumno.fecha_nac,
    'yyyy-MM-dd');
        if (proceso === 'prematriculando') {
          alumno.prematricula = true;
          alumno.grupo = alumno.grupo_sig;
        }
        if (proceso === 'formulario') {
          alumno.llevo_formulario = true;
          alumno.grupo = alumno.grupo_sig;
        }
        return $http.post('::alumnos/store',
    alumno).then(function(r) {
          toastr.success('Alumno ' + r.data.nombres + ' creado');
          if (proceso === 'prematriculando') {
            $state.go('panel.persona',
    {
              persona_id: r.data.id,
              tipo: 'alumno'
            });
          }
          $scope.guardando = false;
          $rootScope.grupos_siguientes = null;
          $scope.formatear_nuevo();
          return $scope.$emit('alumnoguardado',
    r.data);
        },
    function(r2) {
          $scope.guardando = false;
          return toastr.warning('No se pudo guardar alumno',
    'Problema');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.alumno.pais_doc === 'undefined') {
            $scope.alumno.pais_doc = $item;
            return $scope.paisSelecionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.alumno.departamento_doc === 'undefined') {
            $scope.alumno.departamento_doc = $item;
            return $scope.departSeleccionado($item);
          }
        });
      };
      $scope.paisSelecionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentos = r.data;
        });
      };
      $scope.cambiaUsernameCheck = function(texto) {
        $scope.verificandoUsername = true;
        return $http.put('::users/usernames-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.username_match = r.data.usernames;
          $scope.verificandoUsername = false;
          return $scope.username_match.map(function(item) {
            return item.username;
          });
        });
      };
      $scope.departSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $scope.dateOptions = {
        formatYear: 'yy'
      };
      $scope.restarEstrato = function() {
        if ($scope.alumno.estrato > 0) {
          return $scope.alumno.estrato = $scope.alumno.estrato - 1;
        }
      };
      $scope.sumarEstrato = function() {
        if ($scope.alumno.estrato < 10) {
          return $scope.alumno.estrato = $scope.alumno.estrato + 1;
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=AlumnosNewCtrl.js.map
