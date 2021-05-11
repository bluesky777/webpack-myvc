(function() {
  angular.module('myvcFrontApp').directive('sidebarMenu', [
    '$rootScope',
    'AuthService',
    '$http',
    '$uibModal',
    'Perfil',
    'toastr',
    'ProfesoresServ',
    '$window',
    '$state',
    '$interval',
    function($rootScope,
    AuthService,
    $http,
    $modal,
    Perfil,
    toastr,
    ProfesoresServ,
    $window,
    $state,
    $interval) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: "==directives/sidebarMenu.tpl.html",
        scope: {
          cargando: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          return scope.$watch(function() {
            return $window.innerWidth;
          },
    function(value) {
            //console.log 'Ancho de la $window en sidebarMenu', value
            if (value > 880) {
              return iElem.removeClass('hide');
            } else {
              return iElem.addClass('hide');
            }
          });
        },
        controller: function($scope,
    $attrs,
    $state,
    App,
    $http) {
          var stop;
          $scope.perfilPath = App.images + 'perfil/';
          // This array keeps track of the accordion groups
          this.groups = [];
          $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
          $scope.mensaje_no_buscar = 'Alumno en este año ';
          stop = $interval(function() {
            if ($scope.USER) {
              $scope.mensaje_no_buscar = 'Alumno en este año ' + $scope.USER.year;
              return $scope.stopInterval();
            } else if ($scope.$parent.USER) {
              $scope.mensaje_no_buscar = 'Alumno en este año ' + $scope.$parent.USER.year;
              return $scope.stopInterval();
            }
          },
    200);
          $scope.stopInterval = function() {
            if (angular.isDefined(stop)) {
              $interval.cancel(stop);
              return stop = void 0;
            }
          };
          $scope.persona_buscar = '';
          $scope.templateTypeahead = '==alumnos/personaTemplateTypeahead.tpl.html';
          $scope.personaCheck = function(texto) {
            $scope.verificandoPersona = true;
            return $http.put('::alumnos/personas-check',
    {
              texto: texto
            }).then(function(r) {
              $scope.personas_match = r.data.personas;
              $scope.personas_match.map(function(perso) {
                return perso.perfilPath = $scope.perfilPath;
              });
              $scope.verificandoPersona = false;
              return $scope.personas_match;
            });
          };
          /*
          return $scope.personas_match.map((item)->
          	return item.nombres + ' ' + item.apellidos
          )
          */
          $scope.$state = $rootScope.$state;
          $scope.persona_id = Perfil.User().persona_id;
          if ($scope.hasRoleOrPerm(['Admin',
    'Profesor'])) {
            $http.get('::grupos').then(function(r) {
              return $scope.grupos = r.data;
            },
    function(r2) {
              return toastr.error('No se pudo traer los grupos del menú');
            });
          }
          $scope.ir_a_persona = function($item,
    $model,
    $label) {
            var datos;
            datos = {
              persona_id: $item.alumno_id,
              tipo: $item.tipo
            };
            return $state.go('panel.persona',
    datos);
          };
          ProfesoresServ.contratos().then(function(r) {
            return $scope.profesores = r;
          },
    //$rootScope.profesores = $scope.profesores
    function(r2) {
            return toastr.error('No se pudo traer los profesores del menú');
          });
          $scope.listarAsignaturas = function() {
            var modalInstance;
            modalInstance = $modal.open({
              templateUrl: '==areas/listasignaturasPop.tpl.html',
              controller: 'ListasignaturasPopCtrl'
            });
            return modalInstance.result.then(function(r) {});
          };
          //console.log 'Resultado del modal: ', r
          $scope.irDefinitivas = function(profesor_id) {
            return $state.go('panel.definitivas_periodos',
    {
              profesor_id: profesor_id
            });
          };
          $scope.ir_a_informes = function() {
            //$scope.$parent.bigLoader 	= true
            return $state.go('panel.informes');
          };
          this.clikeando = function() {};
          //console.log 'Menu compacto', $rootScope.menucompacto

          // Ensure that all the groups in this menu are closed
          this.closeOthers = function(openGroup) {
            return angular.forEach(this.groups,
    function(group) {
              if (group.menuIsOpen === true) {
                return group.menuIsOpen = false;
              }
            });
          };
          // This is called from the accordion-group directive to add itself to the accordion
          this.addGroup = function(groupScope) {
            var that;
            that = this;
            this.groups.push(groupScope);
            return groupScope.$on('$destroy',
    function(event) {
              return that.removeGroup(groupScope);
            });
          };
          // This is called from the accordion-group directive when to remove itself
          this.removeGroup = function(group) {
            var index;
            index = this.groups.indexOf(group);
            if (index !== -1) {
              return this.groups.splice(index,
    1);
            }
          };
          return this;
        }
      };
    }
  ]).directive('subMenu', [
    function() {
      return {
        require: '^sidebarMenu',
        restrict: 'A',
        replace: true,
        scope: true,
        link: function(scope,
    iElem,
    iAttrs,
    sidebarMenuCtrl) {
          scope.menuIsOpen = iAttrs.menuIsOpen ? scope.$eval(iAttrs.menuIsOpen) : false;
          if (iAttrs.hija) {
            if (scope.menuIsOpen === true) {
              iElem.addClass('open');
            }
            return scope.toggleOpen = function() {
              if (scope.menuIsOpen === false) {
                iElem.addClass('open');
                return scope.menuIsOpen = true;
              } else {
                iElem.removeClass('open');
                return scope.menuIsOpen = false;
              }
            };
          } else {
            sidebarMenuCtrl.addGroup(scope);
            scope.$watch('menuIsOpen',
    function(value) {
              if (value === true) {
                return iElem.addClass('open');
              } else {
                return iElem.removeClass('open');
              }
            });
            return scope.toggleOpen = function() {
              if (scope.menuIsOpen === false) {
                sidebarMenuCtrl.closeOthers(scope);
                return scope.menuIsOpen = true;
              } else {
                return scope.menuIsOpen = false;
              }
            };
          }
        }
      };
    }
  ]).directive('myDropDown', [
    '$document',
    function($document) {
      return {
        restrict: 'A',
        replace: true,
        scope: true,
        link: function(scope,
    iElem,
    iAttrs) {
          scope.menuIsOpen = iAttrs.menuIsOpen ? scope.$eval(iAttrs.menuIsOpen) : false;
          if (scope.menuIsOpen === true) {
            iElem.addClass('open');
          }
          scope.toggleOpen = function() {
            if (scope.menuIsOpen === true) {
              iElem.addClass('open');
              scope.menuIsOpen = true;
            } else {
              iElem.removeClass('open');
              scope.menuIsOpen = false;
            }
          };
        }
      };
    }
  ]).directive('stopEvent', [
    function() {
      return {
        restrict: 'A',
        link: function(scope,
    element,
    attr) {
          return element.bind(attr.stopEvent,
    function(e) {
            return e.stopPropagation();
          });
        }
      };
    }
  ]).directive('toggle', function() {
    var addElement, groups, removeElement, setActive, toggleClass;
    toggleClass = 'selected';
    groups = {};
    addElement = function(groupName, elem) {
      groups[groupName] = groups[groupName] || [];
      if (groups[groupName].indexOf(elem) === -1) {
        return groups[groupName].push(elem);
      }
    };
    removeElement = function(groupName, elem) {
      var idx;
      idx = (groups[groupName] || []).indexOf(elem);
      if (idx !== -1) {
        return groups[groupName].splice(idx, 1);
      }
    };
    setActive = function(groupName, elem) {
      angular.forEach(groups[groupName] || [], function(el) {
        return el.removeClass(toggleClass);
      });
      return elem.addClass(toggleClass);
    };
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var groupName;
        groupName = attrs.toggle || 'default';
        addElement(groupName, elem);
        elem.on('click', function() {
          return scope.$apply(function() {
            return setActive(groupName, elem);
          });
        });
        return scope.$on('$destroy', function() {
          elem.off();
          return removeElement(groupName, elem);
        });
      }
    };
  }).controller('ListasignaturasPopCtrl', [
    '$scope',
    '$uibModalInstance',
    '$http',
    'toastr',
    '$state',
    function($scope,
    $modalInstance,
    $http,
    toastr,
    $state) {
      $scope.selectAsignatura = function(asig_id,
    profesor_id) {
        $state.go('panel.notas',
    {
          asignatura_id: asig_id,
          profesor_id: profesor_id
        });
        return $modalInstance.close(asig_id);
      };
      $http.get('::asignaturas/listasignaturas-alone').then(function(r) {
        return $scope.asignaturas = r.data;
      },
    function(r2) {
        return toastr.error('No se pudo traer tus asignaturas');
      });
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//sidebarMenu.js.map
