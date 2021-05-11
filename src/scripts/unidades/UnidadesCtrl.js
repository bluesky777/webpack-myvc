(function() {
  angular.module('myvcFrontApp').controller('UnidadesCtrl', [
    '$scope',
    '$uibModal',
    '$http',
    '$state',
    '$filter',
    'AuthService',
    'toastr',
    'resolved_user',
    '$timeout',
    function($scope,
    $uibModal,
    $http,
    $state,
    $filter,
    AuthService,
    toastr,
    resolved_user,
    $timeout) {
      AuthService.verificar_acceso();
      $scope.asignatura = {};
      $scope.asignatura_id = $state.params.asignatura_id;
      $scope.datos = {};
      $scope.UNIDAD = $scope.USER.unidad_displayname;
      $scope.GENERO_UNI = $scope.USER.genero_unidad;
      $scope.SUBUNIDAD = $scope.USER.subunidad_displayname;
      $scope.GENERO_SUB = $scope.USER.genero_subunidad;
      $scope.UNIDADES = $scope.USER.unidades_displayname;
      $scope.SUBUNIDADES = $scope.USER.subunidades_displayname;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.activar_crear_unidad = true;
      $scope.unidades = [];
      $http.put('::unidades/de-asignatura-periodo/' + $scope.asignatura_id + '/' + $scope.USER.periodo_id).then(function(r) {
        var i,
    j,
    len,
    len1,
    ref,
    ref1,
    subuni,
    unidad;
        $scope.anios_pasados = r.data.anios_pasados;
        $scope.mostrar_poco_anteriores = true;
        if (r.data.unidades.length > 0) {
          ref = r.data.unidades;
          for (i = 0, len = ref.length; i < len; i++) {
            unidad = ref[i];
            unidad.anim_bloqueada = false;
            unidad.subunidades = $filter('orderBy')(unidad.subunidades,
    'orden');
            $scope.bloquear_animacion(unidad);
            if (unidad) {
              ref1 = unidad.subunidades;
              for (j = 0, len1 = ref1.length; j < len1; j++) {
                subuni = ref1[j];
                subuni.anim_bloqueada = false;
                $scope.bloquear_animacion(subuni);
              }
            }
          }
          $scope.unidades = r.data.unidades;
          $scope.unidades = $filter('orderBy')($scope.unidades,
    'orden');
          return $scope.calcularPorcUnidades();
        }
      },
    function(r2) {
        return toastr.error('No se pudo traer las ' + $scope.UNIDADES,
    'Problemas');
      });
      $http.get('::asignaturas/show/' + $scope.asignatura_id).then(function(r) {
        r = r.data;
        $scope.asignatura = r;
        $scope.inicializado = true;
        $scope.profesor_id = r.profesor_id;
        if (!r) {
          return $scope.no_asignatura = true;
        }
      },
    function(r2) {
        toastr.error('No se pudo traer los datos de la asignatura');
        return $scope.no_asignatura = true;
      });
      $scope.mostrarUnidadesEliminadas = function() {
        if ($scope.mostrando_unidades_eliminadas) {
          return $scope.mostrando_unidades_eliminadas = false;
        } else {
          return $http.put('::unidades/eliminadas/' + $scope.asignatura_id).then(function(r) {
            r = r.data;
            $scope.unidades_eliminadas = r.unidades_eliminadas;
            $scope.subunidades_eliminadas = r.subunidades_eliminadas;
            return $scope.mostrando_unidades_eliminadas = true;
          },
    function(r2) {
            $scope.mostrando_unidades_eliminadas = true;
            return toastr.error('No se pudo traer las unidades eliminadas');
          });
        }
      };
      $scope.restaurarUnidad = function(unidad) {
        if (!unidad.restaurando) {
          unidad.restaurando = true;
          return $http.put('::unidades/restore/' + unidad.id).then(function(r) {
            $scope.unidades.push(unidad);
            $scope.calcularPorcUnidades();
            $timeout(function() {
              return $scope.onSortUnidades(void 0,
    $scope.unidades);
            },
    100);
            return toastr.success('Listo.');
          },
    function(r2) {
            unidad.restaurando = false;
            return toastr.error('Error restaurando',
    'Problema');
          });
        }
      };
      $scope.mostrarSubunidadesEliminadas = function() {
        if ($scope.mostrando_subunidades_eliminadas) {
          return $scope.mostrando_subunidades_eliminadas = false;
        } else {
          return $http.put('::subunidades/eliminadas/' + $scope.asignatura_id).then(function(r) {
            r = r.data;
            $scope.subunidades_eliminadas = r.subunidades;
            return $scope.mostrando_subunidades_eliminadas = true;
          },
    function(r2) {
            $scope.mostrando_subunidades_eliminadas = true;
            return toastr.error('No se pudo traer las subunidades eliminadas');
          });
        }
      };
      $scope.restaurarSubunidad = function(subunidad) {
        if (!subunidad.restaurando) {
          subunidad.restaurando = true;
          return $http.put('::subunidades/restore/' + subunidad.id).then(function(r) {
            return toastr.success('Listo. Recargue para ver los cambios');
          },
    function(r2) {
            subunidad.restaurando = false;
            return toastr.error('Error restaurando',
    'Problema');
          });
        }
      };
      $scope.copiarUnidade = function() {
        var modalInstance;
        $scope.asignatura.periodo_id = $scope.USER.periodo_id;
        $scope.asignatura.year_id = $scope.USER.year_id;
        modalInstance = $uibModal.open({
          templateUrl: '==unidades/copiarUnidadModal.tpl.html',
          controller: 'CopiarUnidadModalCtrl',
          resolve: {
            USER: function() {
              return $scope.USER;
            },
            asignatura: function() {
              return $scope.asignatura;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data,
    {
            alumno_id: '!' + alum.alumno_id
          });
        },
    function() {});
      };
      // nada
      $scope.copiarUnidades = function() {
        $scope.asignatura.periodo_id = $scope.USER.periodo_id;
        $scope.asignatura.year_id = $scope.USER.year_id;
        localStorage.asignatura_a_copiar = JSON.stringify($scope.asignatura);
        return $state.go('panel.copiar');
      };
      $scope.calcularPorcUnidades = function() {
        var sum;
        sum = 0;
        angular.forEach($scope.unidades,
    function(unidad,
    key) {
          var subsum;
          sum = sum + unidad.porcentaje;
          subsum = 0;
          angular.forEach(unidad.subunidades,
    function(subunidad,
    key) {
            return subsum = subsum + subunidad.porcentaje;
          });
          unidad.subunidades.porc_subunidades = subsum;
          return unidad.subunidades.unidad_id = unidad.id; // El ordenador me borra esta propiedad a cada rato, por eso la pongo aquí
        });
        return $scope.unidades.porc_unidades = sum;
      };
      $scope.crearUnidad = function() {
        $scope.activar_crear_unidad = false;
        $scope.newunidad.asignatura_id = $scope.asignatura.asignatura_id;
        return $http.post('::unidades',
    $scope.newunidad).then(function(r) {
          var creado;
          r = r.data;
          r.subunidades = [];
          r.obligatoria = 0;
          r.anim_bloqueada = false;
          $scope.unidades.push(r);
          creado = 'creado';
          if ($scope.GENERO_UNI === 'F') {
            creado = 'creada';
          }
          toastr.success($scope.UNIDAD + ' ' + creado + '. Ahora agrégale ' + $scope.SUBUNIDADES);
          $scope.newunidad.definicion = '';
          $scope.calcularPorcUnidades();
          $scope.activar_crear_unidad = true;
          return $scope.bloquear_animacion();
        },
    function(r2) {
          toastr.error('No se pudo crear la unidad',
    'Problemas');
          return $scope.activar_crear_unidad = true;
        });
      };
      $scope.actualizarUnidad = function(unidad) {
        var datos;
        datos = {
          definicion: unidad.definicion,
          porcentaje: unidad.porcentaje,
          asignatura_id: unidad.asignatura_id,
          periodo_id: $scope.USER.periodo_id,
          num_periodo: $scope.USER.numero_periodo
        };
        return $http.put('::unidades/update/' + unidad.id,
    datos).then(function(r) {
          var actualizado;
          actualizado = 'actualizado';
          if ($scope.GENERO_UNI === 'F') {
            actualizado = 'actualizada';
          }
          toastr.success($scope.UNIDAD + ' ' + actualizado + ' con éxito.');
          unidad.editando = false;
          return $scope.calcularPorcUnidades();
        },
    function(r2) {
          return toastr.error('No se pudo actualizar ' + $scope.UNIDAD,
    'Problemas');
        });
      };
      $scope.removeUnidad = function(unidad) {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: '==unidades/removeUnidad.tpl.html',
          controller: 'RemoveUnidadCtrl',
          resolve: {
            unidad: function() {
              return unidad;
            },
            USER: function() {
              return $scope.USER;
            }
          }
        });
        return modalInstance.result.then(function(unidad) {
          $scope.unidades = $filter('filter')($scope.unidades,
    {
            id: '!' + unidad.id
          });
          $scope.calcularPorcUnidades();
          return $timeout(function() {
            return $scope.onSortUnidades(void 0,
    $scope.unidades);
          },
    100);
        });
      };
      $scope.onSortUnidades = function($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo) {
        var datos,
    hashEntry,
    i,
    index,
    len,
    sortHash,
    unidad;
        sortHash = [];
        for (index = i = 0, len = $partFrom.length; i < len; index = ++i) {
          unidad = $partFrom[index];
          unidad.orden = index;
          hashEntry = {};
          hashEntry["" + unidad.id] = index;
          sortHash.push(hashEntry);
        }
        datos = {
          sortHash: sortHash
        };
        $http.put('::unidades/update-orden',
    datos).then(function(r) {
          return true;
        },
    function(r2) {
          toastr.warning('No se pudo ordenar',
    'Problema');
          return false;
        });
        return $scope.calcularPorcUnidades();
      };
      $scope.onStartSortUnidades = function($item,
    $part,
    $index,
    $helper) {
        return console.log($item,
    $part);
      };
      $scope.bloquear_animacion = function(elemento) {
        if (!elemento) {
          return;
        }
        return $timeout(function() {
          return elemento.anim_bloqueada = true;
        },
    2000);
      };
      $scope.activar_crear_subunidad = true;
      $scope.onSortSubunidades = function($item,
    $partFrom,
    $partTo,
    $indexFrom,
    $indexTo) {
        var datos,
    hashEntry,
    i,
    index,
    j,
    k,
    len,
    len1,
    len2,
    sortHash,
    sortHash1,
    sortHash2,
    subunidad;
        if ($partFrom === $partTo) {
          sortHash = [];
//subunidades
          for (index = i = 0, len = $partFrom.length; i < len; index = ++i) {
            subunidad = $partFrom[index];
            subunidad.orden = index;
            hashEntry = {};
            hashEntry["" + subunidad.id] = index;
            sortHash.push(hashEntry);
          }
          datos = {
            sortHash: sortHash
          };
          $http.put('::subunidades/update-orden',
    datos).then(function(r) {
            return true;
          },
    function(r2) {
            toastr.warning('No se pudo ordenar',
    'Problema');
            return false;
          });
        } else {
          sortHash1 = [];
          sortHash2 = [];
          datos = {};
//subunidades
// Actualizamos la primera parte
          for (index = j = 0, len1 = $partFrom.length; j < len1; index = ++j) {
            subunidad = $partFrom[index];
            subunidad.orden = index;
            hashEntry = {};
            hashEntry["" + subunidad.id] = index;
            sortHash1.push(hashEntry);
          }
          if (sortHash1.length > 0) {
            datos.unidad1_id = $partFrom.unidad_id;
            datos.sortHash1 = sortHash1;
          }
// Actualizamos la Segunda parte
          for (index = k = 0, len2 = $partTo.length; k < len2; index = ++k) {
            subunidad = $partTo[index];
            subunidad.orden = index;
            hashEntry = {};
            hashEntry["" + subunidad.id] = index;
            sortHash2.push(hashEntry);
          }
          if (sortHash1.length > 0) {
            datos.unidad2_id = $partTo.unidad_id;
            datos.sortHash2 = sortHash2;
          }
          $http.put('::subunidades/update-orden-varias',
    datos).then(function(r) {
            return true;
          },
    function(r2) {
            toastr.warning('No se pudo ordenar',
    'Problema');
            return false;
          });
        }
        return $scope.calcularPorcUnidades();
      };
      $scope.addSubunidad = function(unidad) {
        $scope.activar_crear_subunidad = false;
        if (!unidad.newsubunidad) {
          toastr.warning('Aún debes escribir.');
          $scope.activar_crear_subunidad = true;
          return;
        }
        if (!unidad.newsubunidad.definicion) {
          toastr.warning('Debes escribir la difinición.');
          $scope.activar_crear_subunidad = true;
          return;
        }
        if (!unidad.newsubunidad.porcentaje) {
          unidad.newsubunidad.porcentaje = 0;
        }
        if (!unidad.newsubunidad.nota_default) {
          unidad.newsubunidad.nota_default = 0;
        }
        unidad.newsubunidad.unidad_id = unidad.id;
        unidad.newsubunidad.definicion = unidad.newsubunidad.definicion.trim();
        return $http.post('::subunidades',
    unidad.newsubunidad).then(function(r) {
          var creado;
          r.data.anim_bloqueada = false;
          unidad.subunidades.push(r.data);
          creado = 'creado';
          if ($scope.GENERO_SUB === 'F') {
            creado = 'creada';
          }
          toastr.success($scope.SUBUNIDAD + ' ' + creado + ' con éxito.');
          unidad.newsubunidad.definicion = '';
          $scope.calcularPorcUnidades();
          $scope.activar_crear_subunidad = true;
          return $scope.bloquear_animacion(r.data);
        },
    function(r2) {
          toastr.error('No se pudo crear  ' + ($scope.GENERO_UNI === "M" ? 'el' : 'la') + scope.SUBUNIDAD,
    'Problemas');
          return $scope.activar_crear_subunidad = true;
        });
      };
      $scope.ir_a_notas = function(datos) {
        return $state.go('panel.notas',
    datos);
      };
      $scope.actualizarSubunidad = function(subunidad,
    unidad) {
        var datos;
        datos = {
          definicion: subunidad.definicion,
          porcentaje: subunidad.porcentaje,
          nota_default: subunidad.nota_default,
          orden: subunidad.orden,
          asignatura_id: unidad.asignatura_id,
          periodo_id: $scope.USER.periodo_id,
          num_periodo: $scope.USER.numero_periodo
        };
        return $http.put('::subunidades/update/' + subunidad.id,
    datos).then(function(r) {
          var actualizado;
          actualizado = 'actualizado';
          if ($scope.GENERO_SUB === 'F') {
            actualizado = 'actualizada';
          }
          toastr.success($scope.SUBUNIDAD + ' ' + actualizado + ' con éxito.');
          subunidad.editando = false;
          return $scope.calcularPorcUnidades();
        },
    function(r2) {
          return toastr.error('No se pudo actualizar ' + $scope.SUBUNIDAD,
    'Problemas');
        });
      };
      return $scope.removeSubunidad = function(unidad,
    subunidad) {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: '==unidades/removeSubunidad.tpl.html',
          controller: 'RemoveSubunidadCtrl',
          resolve: {
            subunidad: function() {
              return subunidad;
            },
            unidad: function() {
              return unidad;
            },
            USER: function() {
              return $scope.USER;
            }
          }
        });
        return modalInstance.result.then(function(unid) {
          unidad.subunidades = $filter('filter')(unidad.subunidades,
    {
            id: '!' + subunidad.id
          });
          $scope.calcularPorcUnidades();
          return $timeout(function() {
            return $scope.onSortSubunidades(void 0,
    void 0,
    unidad.subunidades);
          },
    100);
        });
      };
    }
  ]).controller('RemoveUnidadCtrl', [
    '$scope',
    '$uibModalInstance',
    'unidad',
    '$http',
    'toastr',
    'USER',
    function($scope,
    $modalInstance,
    unidad,
    $http,
    toastr,
    USER) {
      $scope.unidad = unidad;
      $scope.ok = function() {
        var datos;
        datos = {
          asignatura_id: unidad.asignatura_id,
          periodo_id: USER.periodo_id,
          num_periodo: USER.numero_periodo
        };
        $http.delete('::unidades/destroy/' + unidad.id,
    {
          params: datos
        }).then(function(r) {
          return toastr.success('Unidad eliminada con éxito.',
    'Eliminada');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar la unidad.',
    'Problema');
        });
        return $modalInstance.close(unidad);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('RemoveSubunidadCtrl', [
    '$scope',
    '$uibModalInstance',
    'subunidad',
    'unidad',
    'USER',
    '$http',
    'toastr',
    function($scope,
    $modalInstance,
    subunidad,
    unidad,
    USER,
    $http,
    toastr) {
      $scope.subunidad = subunidad;
      $scope.ok = function() {
        var datos;
        datos = {
          asignatura_id: unidad.asignatura_id,
          periodo_id: USER.periodo_id,
          num_periodo: USER.numero_periodo
        };
        $http.delete('::subunidades/destroy/' + subunidad.id,
    {
          params: datos
        }).then(function(r) {
          return toastr.success('Subunidad eliminada con éxito.',
    'Eliminada');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar la subunidad.',
    'Problema');
        });
        return $modalInstance.close(subunidad);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('CopiarUnidadModalCtrl', [
    '$scope',
    '$state',
    '$uibModalInstance',
    'asignatura',
    'USER',
    '$http',
    'toastr',
    'App',
    '$filter',
    function($scope,
    $state,
    $modalInstance,
    asignatura,
    USER,
    $http,
    toastr,
    App,
    $filter) {
      $scope.asignatura = asignatura;
      $scope.UNIDAD = USER.unidad_displayname;
      $scope.GENERO_UNI = USER.genero_unidad;
      $scope.SUBUNIDAD = USER.subunidad_displayname;
      $scope.GENERO_SUB = USER.genero_subunidad;
      $scope.UNIDADES = USER.unidades_displayname;
      $scope.SUBUNIDADES = USER.subunidades_displayname;
      $scope.configuracion = {
        copiar_subunidades: true,
        copiar_notas: true
      };
      $scope.views = App.views;
      $http.get('::profesores/conyears').then(function(r) {
        return $scope.profesores = r.data;
      },
    function(r) {
        return toastr.error('No se pudo traer los profes con años',
    r);
      });
      
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
          $scope.unidades = $item.unidades;
        } else {
          $scope.unidades = [];
        }
        return $scope.activar_btn_copiar = true;
      };
      
      // COPIAR
      $scope.copiar = function() {
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
          asignatura_to_id: asignatura.asignatura_id,
          periodo_from_id: $scope.configuracion.periodo_from.id,
          periodo_to_id: asignatura.periodo_id,
          unidades_ids: unidades_ids,
          grupo_from_id: $scope.configuracion.asignatura_from.grupo_id,
          grupo_to_id: asignatura.grupo_id
        };
        return $http.put('::periodos/copiar',
    datos).then(function(r) {
          r = r.data;
          toastr.success('Copiado con éxito');
          $scope.activar_btn_copiar = true;
          $scope.resultado = 'Unidades copiadas: ' + r.unidades_copiadas + ' - Subunidades copiadas: ' + r.subunidades_copiadas + ' - Notas copidas: ' + r.notas_copiadas;
          return $state.go('panel.unidades',
    {
            asignatura_id: asignatura.asignatura_id
          },
    {
            reload: true
          });
        },
    function(r2) {
          toastr.error('No se pudieron copiar los datos');
          return $scope.activar_btn_copiar = true;
        });
      };
      $scope.ok = function() {
        return $modalInstance.close(subunidad);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//UnidadesCtrl.js.map
