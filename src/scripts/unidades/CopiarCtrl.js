(function() {
  angular.module('myvcFrontApp').controller('CopiarCtrl', [
    '$scope',
    '$uibModal',
    '$http',
    '$filter',
    '$rootScope',
    'AuthService',
    'toastr',
    'App',
    'YearsServ',
    function($scope,
    $modal,
    $http,
    $filter,
    $rootScope,
    AuthService,
    toastr,
    App,
    YearsServ) {
      var profe_id;
      AuthService.verificar_acceso();
      $scope.UNIDAD = $scope.USER.unidad_displayname;
      $scope.GENERO_UNI = $scope.USER.genero_unidad;
      $scope.SUBUNIDAD = $scope.USER.subunidad_displayname;
      $scope.GENERO_SUB = $scope.USER.genero_subunidad;
      $scope.UNIDADES = $scope.USER.unidades_displayname;
      $scope.SUBUNIDADES = $scope.USER.subunidades_displayname;
      $scope.views = App.views;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.configuracion = {
        copiar_subunidades: true,
        copiar_notas: true
      };
      $scope.periodos = [];
      $scope.resultado = '';
      profe_id = $scope.USER.persona_id;
      $scope.urlTplSubunidades = "==unidades/subunidadespop.tpl.html";
      /*
      if $scope.hasRoleOrPerm('admin') == true
      	$scope.profesores = []
      	$scope.conprofes = true # Para indicar que el select de años se llene con la selección de un profe y no años traidos por get

      	$http.get('::profesores/conyears').then((r)->
      		$scope.profesores = r.data
      	,(r)->
      		toastr.error 'No se pudo traer los profes con años', r
      	)

      else
      	$scope.conprofes = false

      	YearsServ.getYears().then((r)->
      		$scope.years_copy = r
      		$scope.years_copy_to = r
      	, (r)->
      		toastr.error 'No se pudo traer los años a copiar', r
      	)
      */
      $scope.profesores = [];
      if ($scope.hasRoleOrPerm('admin') === true) {
        $scope.conprofes = true; // Para indicar que el select de años se llene con la selección de un profe y no años traidos por get
      }
      $http.get('::profesores/conyears').then(function(r) {
        var i,
    j,
    len,
    len1,
    profe,
    ref,
    ref1,
    results,
    year_search;
        $scope.profesores = r.data;
        if (localStorage.asignatura_a_copiar) {
          $scope.asignatura_a_copiar = JSON.parse(localStorage.asignatura_a_copiar);
          delete localStorage.asignatura_a_copiar;
          if ($scope.asignatura_a_copiar.profesor_id) {
            ref = $scope.profesores;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              profe = ref[i];
              if (profe.id === $scope.asignatura_a_copiar.profesor_id) {
                $scope.configuracion.profesor_from = profe;
                $scope.years_copy = profe.years;
                ref1 = $scope.years;
                for (j = 0, len1 = ref1.length; j < len1; j++) {
                  year_search = ref1[j];
                  if (year_search.id === $scope.asignatura_a_copiar.year_id) {
                    $scope.configuracion.year_from = year_search;
                    $scope.yearSelect(year_search);
                  }
                }
              }
              // Para el año destino
              if (profe.id === profe_id) {
                $scope.years_copy_to = profe.years;
                $scope.configuracion.year_to = profe.years[profe.years.length - 1];
                results.push($scope.yearToSelect(profe.years[profe.years.length - 1]));
              } else {
                results.push(void 0);
              }
            }
            return results;
          } else {
            return $scope.set_year_copy_to();
          }
        } else {
          return $scope.set_year_copy_to();
        }
      },
    function(r) {
        return toastr.error('No se pudo traer los profes con años',
    r);
      });
      $scope.set_year_copy_to = function() {
        var i,
    len,
    profe,
    ref,
    results;
        ref = $scope.profesores;
        // Para el año destino
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          profe = ref[i];
          if (profe.id === profe_id) {
            $scope.years_copy_to = profe.years;
            $scope.configuracion.year_to = profe.years[profe.years.length - 1];
            results.push($scope.yearToSelect(profe.years[profe.years.length - 1]));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      // ORIGEN
      $scope.profesorSelect = function($item,
    $model) {
        $scope.years_copy = $item.years;
        $scope.configuracion.year_from = $scope.years_copy[$scope.years_copy.length - 1];
        if ($scope.configuracion.periodo_from) {
          $scope.configuracion.periodo_from = $scope.configuracion.year_from.periodos[0];
          return $scope.periodoSelect($scope.configuracion.periodo_from);
        } else {
          return $scope.periodos = $scope.configuracion.year_from.periodos;
        }
      };
      $scope.yearSelect = function($item,
    $model) {
        var i,
    len,
    periodo,
    ref,
    results;
        $scope.periodos = $item.periodos;
        if ($scope.asignatura_a_copiar) {
          if ($scope.asignatura_a_copiar.periodo_id) {
            ref = $scope.periodos;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              periodo = ref[i];
              if (periodo.id === $scope.asignatura_a_copiar.periodo_id) {
                $scope.configuracion.periodo_from = periodo;
                results.push($scope.periodoSelect(periodo));
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        }
      };
      $scope.periodoSelect = function($item,
    $model) {
        var profesor_id;
        if ($scope.asignatura_a_copiar) {
          profesor_id = $scope.asignatura_a_copiar.profesor_id;
        } else {
          profesor_id = $scope.configuracion.profesor_from.id;
        }
        return $http.get('::asignaturas/list-asignaturas-year/' + profesor_id + '/' + $scope.configuracion.periodo_from.id).then(function(r) {
          var asig_found,
    asig_id,
    asignatu,
    i,
    len,
    ref;
          $scope.asignaturas = r.data;
          if ($scope.asignatura_a_copiar) {
            if ($scope.asignatura_a_copiar.asignatura_id) {
              ref = $scope.asignaturas;
              for (i = 0, len = ref.length; i < len; i++) {
                asignatu = ref[i];
                if (asignatu.asignatura_id === $scope.asignatura_a_copiar.asignatura_id) {
                  $scope.configuracion.asignatura_from = asignatu;
                  $scope.asignaturaSelect(asignatu);
                }
              }
            }
          }
          if ($scope.configuracion.asignatura_from) {
            asig_id = $scope.configuracion.asignatura_from.asignatura_id;
            asig_found = $filter('filter')($scope.asignaturas,
    {
              asignatura_id: asig_id
            })[0];
            $scope.configuracion.asignatura_from = asig_found;
            return $scope.asignaturaSelect(asig_found);
          }
        },
    function(r2) {
          return toastr.error('No se pudo traer las asignaturas origen');
        });
      };
      $scope.asignaturaSelect = function($item,
    $model) {
        var i,
    len,
    ref,
    unidad;
        if ($item && $item.unidades) {
          ref = $item.unidades.items;
          for (i = 0, len = ref.length; i < len; i++) {
            unidad = ref[i];
            unidad.seleccionada = true;
          }
          return $scope.unidades = $item.unidades;
        } else {
          return $scope.unidades = [];
        }
      };
      // DESTINO
      $scope.profesorToSelect = function($item,
    $model) {
        $scope.years_copy_to = $item.years;
        if ($scope.configuracion.periodo_to) {
          $scope.configuracion.periodo_to = $scope.configuracion.year_to.periodos[0];
          return $scope.periodoToSelect($scope.configuracion.periodo_to);
        }
      };
      $scope.yearToSelect = function($item,
    $model) {
        return $scope.periodos_to = $item.periodos;
      };
      $scope.periodoToSelect = function($item,
    $model) {
        if ($scope.conprofes === true) {
          profe_id = $scope.configuracion.profesor_to.id;
        }
        return $http.get('::asignaturas/list-asignaturas-year/' + profe_id + '/' + $scope.configuracion.periodo_to.id).then(function(r) {
          var asig_found,
    asig_id;
          r = r.data;
          $scope.asignaturas_to = r;
          if ($scope.configuracion.asignatura_to) {
            asig_id = $scope.configuracion.asignatura_to.asignatura_id;
            asig_found = $filter('filter')($scope.asignaturas_to,
    {
              asignatura_id: asig_id
            })[0];
            $scope.configuracion.asignatura_to = asig_found;
            return $scope.asignaturaToSelect(asig_found);
          }
        },
    function(r2) {
          return toastr.error('No se pudo traer las asignaturas destino, ',
    r2);
        });
      };
      $scope.asignaturaToSelect = function($item,
    $model) {
        if ($item && $item.unidades) {
          $scope.unidades_to = $item.unidades;
        } else {
          $scope.unidades_to = [];
        }
        return $scope.activar_btn_copiar = true;
      };
      // COPIAR
      return $scope.copiar = function() {
        var datos,
    unidades_a_copiar,
    unidades_ids;
        if (!$scope.activar_btn_copiar) {
          return;
        }
        $scope.activar_btn_copiar = false;
        unidades_a_copiar = $filter('filter')($scope.unidades.items,
    {
          seleccionada: true
        });
        unidades_ids = [];
        angular.forEach(unidades_a_copiar,
    function(value,
    key) {
          return unidades_ids.push(value.id);
        });
        datos = {
          copiar_subunidades: $scope.configuracion.copiar_subunidades,
          copiar_notas: $scope.configuracion.copiar_notas,
          asignatura_to_id: $scope.configuracion.asignatura_to.asignatura_id,
          periodo_from_id: $scope.configuracion.periodo_from.id,
          periodo_to_id: $scope.configuracion.periodo_to.id,
          unidades_ids: unidades_ids,
          grupo_from_id: $scope.configuracion.asignatura_from.grupo_id,
          grupo_to_id: $scope.configuracion.asignatura_to.grupo_id
        };
        return $http.put('::periodos/copiar',
    datos).then(function(r) {
          r = r.data;
          toastr.success('Copiado con éxito');
          $scope.activar_btn_copiar = true;
          $scope.resultado = 'Unidades copiadas: ' + r.unidades_copiadas + ' - Subunidades copiadas: ' + r.subunidades_copiadas + ' - Notas copidas: ' + r.notas_copiadas;
          "$scope.unidades_to.items.push unidad_a_copiar for unidad_a_copiar in unidades_a_copiar\n\nif $scope.configuracion.asignatura_from.asignatura_id == $scope.configuracion.asignatura_to.asignatura_id and $scope.configuracion.periodo_from.id==$scope.configuracion.periodo_to.id\n	$scope.unidades.items.push unidad_a_copiar for unidad_a_copiar in unidades_a_copiar";
          return $scope.unidades_to.items = r.unidades;
        },
    function(r2) {
          toastr.error('No se pudieron copiar los datos');
          return $scope.activar_btn_copiar = true;
        });
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=CopiarCtrl.js.map
