(function() {
  angular.module('myvcFrontApp').directive('faltasDeLasQueDerivaDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}comportamiento/faltasDeLasQueDerivaDir.tpl.html`
      };
    }
  ]).directive('faltasDeLasQueDerivaNuevoDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}comportamiento/faltasDeLasQueDerivaNuevoDir.tpl.html`
      };
    }
  ]).controller('CrearFaltaCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    'per_num',
    'periodos',
    'config',
    'ordinales',
    'profesores',
    'creando',
    '$http',
    'toastr',
    'App',
    'AuthService',
    function($scope,
    $modalInstance,
    alumno,
    per_num,
    periodos,
    config,
    ordinales,
    profesores,
    creando,
    $http,
    toastr,
    App,
    AuthService) {
      var i,
    len,
    peri,
    ref;
      $scope.alumno = alumno;
      $scope.datos = {};
      $scope.config = config;
      $scope.periodos = periodos;
      $scope.profesores = profesores;
      $scope.ordinales = ordinales;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.falta_new = {};
      $scope.eliminando = false;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      ref = $scope.periodos;
      for (i = 0, len = ref.length; i < len; i++) {
        peri = ref[i];
        peri.activo = false;
        if (peri.numero === per_num) {
          peri.activo = true;
          peri.creando = creando;
          $scope.datos.periodo = peri;
        }
      }
      $scope.toggleVerCrear = function(periodo,
    estado) {
        return periodo.creando = estado;
      };
      $scope.eliminarFalta = function(periodo,
    falta) {
        var res;
        if ($scope.eliminando) {
          return;
        }
        res = confirm('¿Seguro desea eliminar esta falta?');
        if (res) {
          $scope.eliminando = true;
          return $http.put('::disciplina/destroy',
    {
            proceso_id: falta.id,
            alumno_id: alumno.alumno_id
          }).then(function(r) {
            toastr.success('Falta eliminada.');
            $scope.eliminando = false;
            return $scope.reemplazarAlumno(r.data,
    falta.descripcion,
    true);
          },
    function(r2) {
            toastr.error('No se pudo eliminar.',
    'Problema');
            return $scope.eliminando = false;
          });
        }
      };
      $scope.editarFalta = function(periodo,
    falta) {
        var j,
    k,
    len1,
    len2,
    ordinal_original,
    proce_oridinal,
    ref1,
    ref2;
        if (falta.fecha_hora_aprox) {
          if (falta.fecha_hora_aprox.replace) {
            falta.fecha_hora_aprox = new Date(falta.fecha_hora_aprox.replace(/-/g,
    '\/'));
          }
        }
        $scope.falta_edit = falta;
        $scope.falta_edit.selected_ordinales = [];
        ref1 = falta.proceso_ordinales;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          proce_oridinal = ref1[j];
          ref2 = $scope.ordinales;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            ordinal_original = ref2[k];
            if (proce_oridinal.id === ordinal_original.id) {
              $scope.falta_edit.selected_ordinales.push(ordinal_original);
            }
          }
        }
        return periodo.editando = true;
      };
      $scope.cancelarEditarFalta = function(periodo) {
        return periodo.editando = false;
      };
      $scope.seleccionandoOrdinal = function($item) {
        $item.proceso_id = $scope.falta_edit.id;
        return $http.post('::disciplina/asignar-ordinal',
    $item).then(function(r) {
          return toastr.success('Ordinal asignado.');
        },
    function(r2) {
          return toastr.error('No se pudo asignar.',
    'Problema');
        });
      };
      $scope.quitandoOrdinal = function($item) {
        $item.proceso_id = $scope.falta_edit.id;
        return $http.put('::disciplina/quitar-ordinal',
    $item).then(function(r) {
          return toastr.success('Ordinal quitado.');
        },
    function(r2) {
          return toastr.error('No se pudo quitar.',
    'Problema');
        });
      };
      $scope.reemplazarAlumno = function(alumno,
    descripcion,
    eliminado) {
        var descrip,
    found,
    index,
    indice,
    j,
    k,
    len1,
    len2,
    original,
    ref1,
    ref2;
        $scope.alumno = alumno;
        ref1 = $scope.alumnos;
        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
          original = ref1[index];
          if (original) {
            if (original.alumno_id === alumno.alumno_id) {
              $scope.alumnos.splice(index,
    1);
            }
          }
        }
        $scope.alumnos.push(alumno);
        if (descripcion) {
          found = false;
          ref2 = $scope.descripciones_typeahead;
          for (indice = k = 0, len2 = ref2.length; k < len2; indice = ++k) {
            descrip = ref2[indice];
            if (descrip.descripcion === descripcion && eliminado !== true) {
              found = indice;
            }
          }
          if (found) {
            if (eliminado) {
              return $scope.descripciones_typeahead.splice(found,
    1);
            } else {
              return $scope.descripciones_typeahead.push({
                descripcion: descripcion
              });
            }
          }
        }
      };
      $scope.crear_falta = function(periodo) {
        var j,
    k,
    l,
    len1,
    len2,
    len3,
    len4,
    m,
    ref1,
    ref2,
    ref3,
    ref4,
    situac,
    situaciones_depend;
        $scope.guardando_new = true;
        situaciones_depend = [];
        ref1 = alumno.periodo1;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          situac = ref1[j];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref2 = alumno.periodo2;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          situac = ref2[k];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref3 = alumno.periodo3;
        for (l = 0, len3 = ref3.length; l < len3; l++) {
          situac = ref3[l];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref4 = alumno.periodo4;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          situac = ref4[m];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        $scope.falta_new.dependencias = situaciones_depend;
        $scope.falta_new.year_id = periodo.year_id;
        $scope.falta_new.periodo_id = periodo.id;
        $scope.falta_new.alumno_id = $scope.alumno.alumno_id;
        return $http.post('::disciplina/store',
    $scope.falta_new).then(function(r) {
          toastr.success('Falta creada.');
          $scope.guardando_new = false;
          periodo.creando = false;
          $scope.reemplazarAlumno(r.data,
    $scope.falta_new.descripcion);
          if (creando) {
            return $modalInstance.close(r.data);
          }
        },
    function(r2) {
          $scope.guardando_new = false;
          return toastr.error('No se pudo crear.',
    'Problema');
        });
      };
      $scope.clickSituacionDerivante = function(situac) {
        console.log(situac,
    $scope.falta_edit);
        if (situac.seleccionado) {
          situac.become_id = $scope.falta_edit.id;
        } else {
          situac.become_id = null;
        }
        return $http.put('::disciplina/cambiar-situacion-derivante',
    situac).then(function(r) {
          return toastr.success('Cambios guardados.');
        },
    function(r2) {
          $scope.guardando_edit = false;
          return toastr.error('No se pudo guardar.',
    'Problema');
        });
      };
      $scope.guardar_falta = function(periodo) {
        var j,
    k,
    l,
    len1,
    len2,
    len3,
    len4,
    m,
    ref1,
    ref2,
    ref3,
    ref4,
    situac,
    situaciones_depend;
        $scope.guardando_edit = true;
        situaciones_depend = [];
        ref1 = alumno.periodo1;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          situac = ref1[j];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref2 = alumno.periodo2;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          situac = ref2[k];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref3 = alumno.periodo3;
        for (l = 0, len3 = ref3.length; l < len3; l++) {
          situac = ref3[l];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        ref4 = alumno.periodo4;
        for (m = 0, len4 = ref4.length; m < len4; m++) {
          situac = ref4[m];
          if (situac.seleccionado) {
            situaciones_depend.push(situac);
          }
        }
        $scope.falta_edit.alumno_id = $scope.alumno.alumno_id;
        $scope.falta_edit.dependencias = situaciones_depend;
        return $http.put('::disciplina/update',
    $scope.falta_edit).then(function(r) {
          toastr.success('Cambios guardados.');
          $scope.guardando_edit = false;
          periodo.editando = false;
          return $scope.reemplazarAlumno(r.data,
    $scope.falta_edit.descripcion);
        },
    function(r2) {
          $scope.guardando_edit = false;
          return toastr.error('No se pudo guardar.',
    'Problema');
        });
      };
      return $scope.ok = function() {
        return $modalInstance.close($scope.alumno);
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=CrearFaltaCtrl.js.map
