(function() {
  angular.module('myvcFrontApp').directive('notaRapida', [
    '$rootScope',
    'toastr',
    'EscalasValorativasServ',
    function($rootScope,
    toastr,
    EscalasValorativasServ) {
      return {
        restrict: 'AE',
        transclude: true,
        templateUrl: "==directives/notaRapida.tpl.html",
        //scope:
        //	ngModel: "="
        //require: 'ngModel'
        link: function(scope,
    iElem,
    iAttrs) {
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.valorNotaRapida = 100;
          if ($rootScope.notaRapida.enable) {
            scope.activado = true;
          } else {
            scope.activado = false;
          }
          scope.activar = function() {
            if (!scope.activado) {
              scope.activado = true;
              $rootScope.notaRapida.enable = scope.activado;
              return toastr.info('Nota rápida activada',
    'ACTIVADA');
            }
          };
          scope.desactivar = function() {
            scope.activado = false;
            $rootScope.notaRapida.enable = scope.activado;
            return toastr.info('Nota rápida desactivada',
    'DESACTIVADA');
          };
          scope.clickInput = function() {
            var elem;
            elem = $('#input-nota-rapida');
            if (!elem.is(':focus')) {
              return $('#input-nota-rapida').focus();
            }
          };
          scope.$on('keydown:27',
    function(onEvent,
    keydownEvent) {
            return scope.desactivar();
          });
          EscalasValorativasServ.escalas().then(function(r) {
            return scope.escalas = r;
          },
    function(r2) {
            return console.log('No se trajeron las escalas valorativas',
    r2);
          });
          return scope.setValor = function(n) {
            $rootScope.notaRapida.valorNota = n;
            return scope.activar();
          };
        }
      };
    }
  ]).directive('cambiamodel', [
    '$rootScope',
    function($rootScope) {
      return {
        restrict: 'A',
        link: function(scope,
    element,
    attrs) {
          return scope.$watch(attrs.ngModel,
    function(v) {
            console.log(v);
            return $rootScope.notaRapida.valorNota = v;
          });
        }
      };
    }
  ]).directive('keypressEvents', [
    '$document',
    '$rootScope',
    function($document,
    $rootScope) {
      return {
        restrict: 'A',
        link: function() {
          return $document.bind('keypress keydown',
    function(e) {
            //$rootScope.$broadcast('keypress', e)
            if (e.which === 27) {
              return $rootScope.$broadcast('keydown:27',
    e);
            }
          });
        }
      };
    }
  ]).filter('range', function() {
    return function(input, inicial, total) {
      var i, j, ref, ref1;
      total = parseInt(total);
      inicial = parseInt(inicial);
      for (i = j = ref = inicial, ref1 = total; (ref <= ref1 ? j <= ref1 : j >= ref1); i = ref <= ref1 ? ++j : --j) {
        input.push(i);
      }
      return input;
    };
  }).run([
    '$templateCache',
    function($templateCache) {
      return $templateCache.put('/tmpls/draggable-default',
    '<div ng-transclude></div>');
    }
  ]).directive('draggable', [
    function() {
      return {
        restrict: 'AE',
        transclude: true,
        replace: true,
        scope: {},
        templateUrl: function(el,
    attrs) {
          if (angular.isDefined(attrs.template)) {
            return attrs.template;
          } else {
            return '/tmpls/draggable-default';
          }
        },
        link: function(scope,
    el,
    attrs) {
          var evts,
    options,
    opts;
          el = $(el);
          // draggable object properties
          scope.obj = {
            id: null,
            content: '',
            group: null
          };
          scope.placeholder = false;
          scope.obj.content = el.html();
          if (angular.isDefined(attrs.id)) {
            scope.obj.id = attrs.id;
          }
          if (angular.isDefined(attrs.placeholder)) {
            scope.placeholder = scope.$eval(attrs.placeholder);
          }
          // options for jQuery UI's draggable method
          opts = angular.isDefined(attrs.options) ? scope.$eval(attrs.options) : {};
          if (angular.isDefined(attrs.group)) {
            scope.obj.group = attrs.group;
            opts.stack = '.' + attrs.group;
          }
          // event handlers
          evts = {
            start: function(evt,
    ui) {
              if (scope.placeholder) {
                ui.helper.wrap('<div class="dragging"></div>');
              }
              scope.$apply(function() {
                // emit event in angular context
                scope.$emit('draggable.started',
    {
                  obj: scope.obj
                });
              });
            },
            // end $apply
            drag: function(evt) {
              scope.$apply(function() {
                // emit event in angular context
                scope.$emit('draggable.dragging');
              });
            },
            // end $apply
            stop: function(evt,
    ui) {
              if (scope.placeholder) {
                ui.helper.unwrap();
              }
              scope.$apply(function() {
                // emit event in angular context
                scope.$emit('draggable.stopped');
              });
            }
          };
          // end evts
          // combine options and events
          // end $apply
          options = angular.extend({},
    opts,
    evts);
          return el.draggable(options);
        }
      };
    }
  ]);

  /*
  .directive('keypressListen', ['$rootScope', ($rootScope)->
  	restrict: 'A',
  	link: (scope, el, attrs)->
   * For listening to a keypress event with a specific code
  		scope.$on('keypress:13', (onEvent, keypressEvent)->
  			console.log 'Enter presionado'
  		)
   * For listening to all keypress events
  		scope.$on('keypress', (onEvent, keypressEvent)->
  			if (keypressEvent.which == 120)
  				console.log 'X presionada'
  			else
  				console.log 'Keycode: ' + keypressEvent.which
  		)

  ]);
   */
  // make element draggable

}).call(this);
