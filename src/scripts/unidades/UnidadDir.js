(function() {
  angular.module('myvcFrontApp').directive('unidadDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}unidades/unidadDir.tpl.html`,
        transclude: true,
        scope: {
          unidad: "=",
          indice: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {},
        // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
        // y eso lo puedo hacer con el ng-if
        controller: function($scope,
    $http,
    toastr,
    $uibModal,
    $filter) {
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
            return $scope.$parent.calcularPorcUnidades();
          };
          $scope.addSubunidad = function(unidad) {
            $scope.activar_crear_subunidad = false;
            unidad.newsubunidad.unidad_id = unidad.id;
            return $http.post('::subunidades',
    unidad.newsubunidad).then(function(r) {
              var creado;
              unidad.subunidades.push(r.data);
              creado = 'creado';
              if ($scope.$parent.GENERO_SUB === 'F') {
                creado = 'creada';
              }
              toastr.success($scope.$parent.SUBUNIDAD + ' ' + creado + ' con éxito.');
              unidad.newsubunidad.definicion = '';
              $scope.$parent.calcularPorcUnidades();
              return $scope.activar_crear_subunidad = true;
            },
    function(r2) {
              toastr.error('No se pudo crear  ' + ($scope.$parent.GENERO_UNI === "M" ? 'el' : 'la') + scope.$parent.SUBUNIDAD,
    'Problemas');
              return $scope.activar_crear_subunidad = true;
            });
          };
          $scope.actualizarSubunidad = function(subunidad) {
            var datos;
            datos = {
              definicion: subunidad.definicion,
              porcentaje: subunidad.porcentaje,
              nota_default: subunidad.nota_default,
              orden: subunidad.orden
            };
            return $http.put('::subunidades/update/' + subunidad.id,
    datos).then(function(r) {
              var actualizado;
              actualizado = 'actualizado';
              if ($scope.$parent.GENERO_SUB === 'F') {
                actualizado = 'actualizada';
              }
              toastr.success($scope.$parent.SUBUNIDAD + ' ' + actualizado + ' con éxito.');
              subunidad.editando = false;
              return $scope.$parent.calcularPorcUnidades();
            },
    function(r2) {
              return toastr.error('No se pudo actualizar ' + $scope.$parent.SUBUNIDAD,
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
                }
              }
            });
            return modalInstance.result.then(function(unid) {
              unidad.subunidades = $filter('filter')(unidad.subunidades,
    {
                id: '!' + subunidad.id
              });
              return $scope.$parent.calcularPorcUnidades();
            });
          };
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=UnidadDir.js.map
