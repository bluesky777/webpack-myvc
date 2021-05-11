(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('DisciplinaCtrl', [
    '$scope',
    'toastr',
    '$http',
    '$uibModal',
    '$state',
    '$filter',
    'App',
    'AuthService',
    'escalas',
    'EscalasValorativasServ',
    'ProfesoresServ',
    '$cookies',
    function($scope,
    toastr,
    $http,
    $modal,
    $state,
    $filter,
    App,
    AuthService,
    escalas,
    EscalasValorativasServ,
    ProfesoresServ,
    $cookies) {
      AuthService.verificar_acceso();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.views = App.views;
      $scope.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.escalas = escalas;
      $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      $scope.config_infor = {};
      $scope.datos = {
        grupo: ''
      };
      if ($cookies.getObject('config')) {
        $scope.config_infor = $cookies.getObject('config');
      } else {
        $scope.config_infor.orientacion = 'vertical';
      }
      if (localStorage.inmovible_activado) {
        $scope.inmovible_activado = localStorage.inmovible_activado === 'true';
      } else {
        $scope.inmovible_activado = true;
      }
      $scope.toggleMostrarDetalle = function(alumno,
    prop) {
        return alumno[prop] = !alumno[prop];
      };
      $scope.traerProceso = function() {
        var grupo_id;
        grupo_id = $scope.datos.grupo.id;
        return $http.put('::disciplina/alumnos',
    {
          grupo_id: grupo_id
        }).then(function(r) {
          var alumno,
    i,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    ref,
    ref1,
    ref2,
    ref3,
    results,
    unif;
          $scope.alumnos = r.data.alumnos;
          ref = $scope.alumnos;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            ref1 = alumno.uniformes_per1;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              unif = ref1[j];
              unif.fecha_hora = new Date(unif.fecha_hora.replace(/-/g,
    '\/'));
            }
            ref2 = alumno.uniformes_per2;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              unif = ref2[k];
              unif.fecha_hora = new Date(unif.fecha_hora.replace(/-/g,
    '\/'));
            }
            ref3 = alumno.uniformes_per3;
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              unif = ref3[l];
              unif.fecha_hora = new Date(unif.fecha_hora.replace(/-/g,
    '\/'));
            }
            results.push((function() {
              var len4,
    m,
    ref4,
    results1;
              ref4 = alumno.uniformes_per4;
              results1 = [];
              for (m = 0, len4 = ref4.length; m < len4; m++) {
                unif = ref4[m];
                results1.push(unif.fecha_hora = new Date(unif.fecha_hora.replace(/-/g,
    '\/')));
              }
              return results1;
            })());
          }
          return results;
        },
    function(r2) {
          return toastr.error('No se trajo los alumnos');
        });
      };
      $scope.crearFalta = function(alumno,
    periodo,
    per_num) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==comportamiento/crearFaltaModal.tpl.html',
          controller: 'CrearFaltaCtrl',
          size: 'lg',
          scope: $scope,
          resolve: {
            alumno: function() {
              return alumno;
            },
            per_num: function() {
              return per_num;
            },
            periodos: function() {
              return $scope.periodos;
            },
            config: function() {
              return $scope.config;
            },
            profesores: function() {
              return $scope.profesores;
            },
            ordinales: function() {
              return $scope.ordinales;
            },
            creando: function() {
              return true;
            }
          }
        });
        return modalInstance.result.then(function(ficha) {},
    //console.log($scope.alumnos)
    function() {});
      };
      //console.log($scope.alumnos)
      $scope.verFaltasModal = function(alumno,
    periodo,
    per_num,
    tipo_falta_num) {
        var modalInstance;
        periodo.editando = false;
        modalInstance = $modal.open({
          templateUrl: '==comportamiento/crearFaltaModal.tpl.html',
          controller: 'CrearFaltaCtrl',
          size: 'lg',
          scope: $scope,
          resolve: {
            alumno: function() {
              return alumno;
            },
            per_num: function() {
              return per_num;
            },
            periodos: function() {
              return $scope.periodos;
            },
            config: function() {
              return $scope.config;
            },
            profesores: function() {
              return $scope.profesores;
            },
            ordinales: function() {
              return $scope.ordinales;
            },
            creando: function() {
              return false;
            }
          }
        });
        return modalInstance.result.then(function(ficha) {},
    //console.log($scope.alumnos)
    function() {});
      };
      //console.log($scope.alumnos)
      $scope.verUniformesModal = function(alumno,
    per_num) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==comportamiento/uniformesAlumnoPeriodoModal.tpl.html',
          controller: 'verUniformesAlumnoPeriodoModal',
          size: 'lg',
          scope: $scope,
          resolve: {
            alumno: function() {
              return alumno;
            },
            per_num: function() {
              return per_num;
            },
            periodos: function() {
              return $scope.periodos;
            },
            config: function() {
              return $scope.config;
            },
            profesores: function() {
              return $scope.profesores;
            }
          }
        });
        return modalInstance.result.then(function(ficha) {},
    //console.log($scope.alumnos)
    function() {});
      };
      //console.log($scope.alumnos)
      $scope.toggleInmovible = function() {
        $scope.inmovible_activado = !$scope.inmovible_activado;
        localStorage.inmovible_activado = $scope.inmovible_activado;
        if (!$scope.inmovible_activado) {
          return $('td.fixed-cell').css({
            'transform': 'translate(0, 0)'
          });
        }
      };
      $scope.irComportamientoGrupo = function() {
        return $state.go('panel.comportamiento',
    {
          grupo_id: $scope.datos.grupo.id
        });
      };
      $http.put('::grupos/con-disciplina').then(function(r) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        $scope.grupos = r.data.grupos;
        $scope.config = r.data.config;
        $scope.ordinales = r.data.ordinales;
        $scope.descripciones_typeahead = r.data.descripciones_typeahead;
        $scope.year = r.data.year;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (grupo.id === matr_grupo) {
            $scope.datos.grupo = grupo;
            grupo.active = true;
          }
        }
        return $scope.traerProceso();
      },
    function() {
        return toastr.error('No se pudo traer los grupos y datos');
      });
      ProfesoresServ.contratos().then(function(r) {
        return $scope.profesores = r;
      },
    function(r2) {
        return toastr.error('No se pudo traer los profesores.');
      });
      $scope.selectGrupo = function(grupo) {
        var grup,
    i,
    len,
    ref;
        localStorage.matr_grupo = grupo.id;
        $scope.datos.grupo = grupo;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          grup.active = false;
        }
        grupo.active = true;
        return $scope.traerProceso();
      };
      //###############################
      //####### Informes ##############
      //###############################
      $scope.$watch('config_infor',
    function(newVal,
    oldVal) {
        $cookies.putObject('config',
    newVal);
        return $scope.$broadcast('change_config');
      },
    true);
      $scope.$broadcast('change_config');
      $scope.verSituacionesPorGrupos = function() {
        return $state.go('panel.disciplina.ver-situaciones-por-grupos',
    {
          reload: true
        });
      };
      $scope.verObservadorPeriodo = function() {
        return $state.go('panel.disciplina.ver-observador-periodo',
    {
          grupo_id: $scope.datos.grupo.id
        },
    {
          reload: true
        });
      };
      return $scope.verObservadorCompleto = function() {
        return $state.go('panel.disciplina.ver-observador-completo',
    {
          grupo_id: $scope.datos.grupo.id
        },
    {
          reload: true
        });
      };
    }
  ]);

}).call(this);

//DisciplinaCtrl.js.map
