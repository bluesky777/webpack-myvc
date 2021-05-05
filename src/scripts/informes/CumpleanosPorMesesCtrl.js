(function() {
  angular.module('myvcFrontApp').controller('CumpleanosPorMesesCtrl', [
    '$scope',
    'App',
    'Perfil',
    'meses_cumple',
    '$state',
    '$filter',
    function($scope,
    App,
    Perfil,
    meses_cumple,
    $state,
    $filter) {
      var alum,
    i,
    j,
    len,
    len1,
    mes,
    ref,
    ref1;
      $scope.meses_cumple = meses_cumple.data;
      $scope.tamanio_letra = 15;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.alinear = 'center';
      $scope.aumentar_letra = function() {
        return $scope.tamanio_letra = $scope.tamanio_letra + 2;
      };
      $scope.disminuir_letra = function() {
        return $scope.tamanio_letra = $scope.tamanio_letra - 2;
      };
      $scope.setAlinear = function(align) {
        return $scope.alinear = align;
      };
      $scope.establecerColumnas = function(mes) {
        if (mes.apretado === true) {
          return;
        }
        mes.apretado = true;
        return mes.alumnos_temp = mes.alumnos.splice(parseInt(mes.alumnos.length / 2),
    mes.alumnos.length);
      };
      $scope.setAlinear2 = function(align) {
        return $scope.alinear2 = align;
      };
      $scope.establecerColumnas2 = function(mes) {
        mes.apretado = false;
        mes.alumnos = mes.alumnos.concat(mes.alumnos_temp);
        return mes.alumnos_temp = [];
      };
      ref = $scope.meses_cumple;
      for (i = 0, len = ref.length; i < len; i++) {
        mes = ref[i];
        ref1 = mes.alumnos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          alum = ref1[j];
          alum.day_nac = alum.fecha_nac.substr(8,
    2);
        }
        mes.alumnos = $filter('orderBy')(mes.alumnos,
    'day_nac');
        mes.alumnos_temp = [];
      }
      $scope.quitar_mes = function(mes) {
        return mes.quitado = true;
      };
      return $scope.$emit('cambia_descripcion',
    'Cumpleaños por meses ');
    }
  ]).directive("draggable", function($document) {
    return function(scope, element, attr) {
      var container, mousemove, mouseup, startX, startY, x, y;
      [x, y, container, startX, startY] = [null, null, null, null, null];
      // Prevent default dragging of selected content
      mousemove = function(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        //console.log "x: " + x + " y: " + y
        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        scope.$apply(function() {
          return scope.$parent.events.push({
            mousemove: {
              x: x,
              y: y,
              pageX: event.pageX,
              pageY: event.pageY,
              startY: startY,
              startX: startX
            }
          });
        });
        //console.log "#{event.pageX}  #{event.pageY} "
        return container.css({
          top: y + "px",
          left: x + "px"
        });
      };
      mouseup = function() {
        $document.unbind("mousemove", mousemove);
        $document.unbind("mouseup", mouseup);
        //debugger
        if (scope.elem) {
          scope.elem.top = y;
          scope.elem.left = x;
        }
        return scope.$apply(function() {
          return scope.$parent.events.push({
            mouseup: {
              x: x,
              y: y
            }
          });
        });
      };
      startX = 0;
      startY = 0;
      if (scope.elem) {
        x = scope.elem.left;
        y = scope.elem.top;
      }
      container = null;
      element.css({
        position: "relative",
        cursor: "pointer"
      });
      return element.on("mousedown", function(event) {
        if (event.which !== 1) {
          return;
        }
        event.preventDefault();
        container = attr.$$element.parent();
        scope.$apply(function() {
          return scope.$parent.events = [
            {
              "mousedown": {
                x: x,
                y: y,
                pageX: event.pageX,
                pageY: event.pageY,
                startY: startY,
                startX: startX
              }
            }
          ];
        });
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on("mousemove", mousemove);
        return $document.on("mouseup", mouseup);
      });
    };
  });

}).call(this);

//# sourceMappingURL=CumpleanosPorMesesCtrl.js.map
