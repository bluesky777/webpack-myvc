(function() {
  angular.module('myvcFrontApp').controller('ListAsignaturasCtrl', [
    '$scope',
    '$http',
    'toastr',
    '$state',
    '$cookies',
    '$rootScope',
    'AuthService',
    'App',
    'resolved_user',
    '$filter',
    '$uibModal',
    function($scope,
    $http,
    toastr,
    $state,
    $cookies,
    $rootScope,
    AuthService,
    App,
    resolved_user,
    $filter,
    $modal) {
      //$scope.$parent.bigLoader 	= true
      $scope.UNIDAD = $scope.USER.unidad_displayname;
      $scope.GENERO_UNI = $scope.USER.genero_unidad;
      $scope.SUBUNIDAD = $scope.USER.subunidad_displayname;
      $scope.GENERO_SUB = $scope.USER.genero_subunidad;
      $scope.UNIDADES = $scope.USER.unidades_displayname;
      $scope.SUBUNIDADES = $scope.USER.subunidades_displayname;
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.dato = {};
      $scope.views = App.views + 'areas/'; // La uso en jade
      $scope.mes = new Date().getMonth();
      $scope.profesor = {};
      if ($state.params.profesor_id) {
        $scope.profesor_id = $state.params.profesor_id;
        $http.get('::asignaturas/listasignaturas/' + $state.params.profesor_id).then(function(r) {
          $scope.asignaturas = r.data.asignaturas;
          $scope.profesor = r.data.info_profesor;
          $scope.gruposcomportamientos = r.data.grados_comp;
          $scope.grupos = r.data.grupos;
          $scope.pedidos = r.data.pedidos;
          return $scope.materias = r.data.materias;
        },
    //$scope.$parent.bigLoader 	= false
    function(r2) {
          return toastr.error('No se pudo traer las asignaturas');
        });
      } else {
        //$scope.$parent.bigLoader 	= false
        $http.get('::asignaturas/listasignaturas').then(function(r) {
          var i,
    len,
    pedido,
    ref,
    results;
          $scope.asignaturas = r.data.asignaturas;
          $scope.gruposcomportamientos = r.data.grados_comp;
          $scope.grupos = r.data.grupos;
          $scope.pedidos = r.data.pedidos;
          $scope.materias = r.data.materias;
          ref = $scope.pedidos;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            pedido = ref[i];
            if (pedido.materia_to_add_accepted === 1 || pedido.asignatura_to_remove_accepted === 1) {
              pedido.estado = ':: APROBADO ::  ';
            }
            if (pedido.materia_to_add_accepted === 0 || pedido.asignatura_to_remove_accepted === 0) {
              results.push(pedido.estado = ':: RECHAZADO ::  ');
            } else {
              results.push(void 0);
            }
          }
          return results;
        },
    //$scope.$parent.bigLoader 		= false
    function(r2) {
          return toastr.error('No se pudo traer tus asignaturas');
        });
      }
      //$scope.$parent.bigLoader 	= false
      $scope.irAComportamiento = function(grupo) {
        if ($state.params.profesor_id) {
          localStorage.profesor_id = $state.params.profesor_id;
        } else {
          localStorage.profesor_id = $scope.USER.persona_id;
        }
        return $state.go('panel.comportamiento',
    {
          grupo_id: grupo.id
        });
      };
      $scope.solicitarMateria = function() {
        if (!$scope.dato.grupo) {
          toastr.warning('Debes seleccionar un grupo.');
          return;
        }
        if (!$scope.dato.materia) {
          toastr.warning('Debes seleccionar una materia.');
          return;
        }
        if (!$scope.dato.creditos > 0) {
          toastr.warning('Debes asignar la intensidad horaria.');
          return;
        }
        return $http.put('::ChangesAskedAssignment/solicitar-materia',
    {
          grupo_id: $scope.dato.grupo.id,
          materia_id: $scope.dato.materia.id,
          creditos: $scope.dato.creditos
        }).then(function(r) {
          $scope.pedidos.push(r.data.pedido);
          return toastr.success('Materia solicitada. Un administrador lo revisará.');
        },
    function(r2) {
          return toastr.error('No se pudo solicitar materia');
        });
      };
      //$scope.$parent.bigLoader 	= false
      $scope.quitarSolicitud = function(pedido) {
        return $http.put('::ChangesAsked/destruir-pedido-asignatura',
    {
          asked_id: pedido.asked_id,
          assignment_id: pedido.assignment_id
        }).then(function(r) {
          $scope.pedidos = $filter('filter')($scope.pedidos,
    {
            asked_id: '!' + pedido.asked_id
          });
          return toastr.success('Solicitada eliminada');
        },
    function(r2) {
          return toastr.error('No se pudo solicitar materia');
        });
      };
      //$scope.$parent.bigLoader 	= false
      $scope.noEsMia = function(asignatura) {
        var i,
    len,
    modalInstance,
    pedido,
    ref;
        ref = $scope.pedidos;
        for (i = 0, len = ref.length; i < len; i++) {
          pedido = ref[i];
          if (pedido.asignatura_to_remove_id === asignatura.asignatura_id && !pedido.asignatura_to_remove_accepted) {
            toastr.info('Ya has hecho esta solicitud');
            return;
          }
        }
        modalInstance = $modal.open({
          templateUrl: '==areas/asignaturaNoEsMia.tpl.html',
          controller: 'AsignaturaNoEsMiaCtrl',
          resolve: {
            asignatura: function() {
              return asignatura;
            }
          }
        });
        return modalInstance.result.then(function(r) {
          toastr.success('Has solicitado remoción de asignatura.');
          return $scope.pedidos.push(r.pedido);
        });
      };
      $scope.irDefinitivas = function(asignatura) {
        localStorage.asignatura_id_def = asignatura.asignatura_id;
        return $state.go('panel.definitivas_periodos',
    {
          profesor_id: $state.params.profesor_id
        });
      };
      return $scope.open = function(asignatura) {
        return $state.go('panel.unidades',
    {
          asignatura_id: asignatura.asignatura_id
        });
      };
    }
  ]).controller('AsignaturaNoEsMiaCtrl', [
    '$scope',
    '$uibModalInstance',
    'asignatura',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    asignatura,
    $http,
    toastr,
    App) {
      $scope.asignatura = asignatura;
      $scope.ok = function() {
        var datos;
        datos = {
          asignatura_id: asignatura.asignatura_id
        };
        return $http.put('::ChangesAskedAssignment/pedir-quitar-asignatura',
    datos).then(function(r) {
          return $modalInstance.close(r.data);
        },
    function(r2) {
          return toastr.error('Problema',
    'No se pudo hacer solicitud.');
        });
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ListAsignaturasCtrl.js.map
