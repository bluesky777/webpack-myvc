(function() {
  angular.module('myvcFrontApp').directive('boletinAlumnoDir', [
    'App',
    'Perfil',
    '$filter',
    function(App,
    Perfil,
    $filter) {
      return {
        restrict: 'EA',
        templateUrl: "==informes/boletinAlumnoDir.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          var asignatura,
    i,
    len,
    ref,
    valores;
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          scope.options = {
            chart: {
              type: 'discreteBarChart',
              height: 180,
              width: scope.$parent.ancho_chart, //  En BoletinesPeriodoCtrl.coffee
              margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
              },
              useInteractiveGuideline: true,
              x: function(d) {
                return d.label;
              },
              y: function(d) {
                return d.value;
              },
              showValues: true,
              valueFormat: function(d) {
                return d3.format(',.0f')(d);
              },
              transitionDuration: 500
            },
            title: {
              enable: false,
              text: 'Definitivas por asignaturas'
            }
          };
          valores = [];
          ref = scope.alumno.asignaturas;
          for (i = 0, len = ref.length; i < len; i++) {
            asignatura = ref[i];
            //asignatura.nota_asignatura          = $filter('number')(asignatura.nota_asignatura, 0)
            valores.push({
              label: asignatura.alias_materia,
              value: asignatura.nota_asignatura
            });
          }
          return scope.data = [
            {
              key: "Definitivas de asignaturas",
              values: valores
            }
          ];
        }
      };
    }
  ]).directive('boletinAlumnoDir2', [
    'App',
    'Perfil',
    '$filter',
    function(App,
    Perfil,
    $filter) {
      return {
        restrict: 'EA',
        templateUrl: "==informes2/boletinAlumnoDir2.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          var asignatura,
    i,
    len,
    ref,
    valores;
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          scope.options = {
            chart: {
              type: 'discreteBarChart',
              height: 180,
              width: scope.$parent.ancho_chart, //  En BoletinesPeriodoCtrl.coffee
              margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
              },
              useInteractiveGuideline: true,
              x: function(d) {
                return d.label;
              },
              y: function(d) {
                return d.value;
              },
              showValues: true,
              valueFormat: function(d) {
                return d3.format(',.0f')(d);
              },
              transitionDuration: 500
            },
            title: {
              enable: false,
              text: 'Definitivas por asignaturas'
            }
          };
          valores = [];
          ref = scope.alumno.asignaturas;
          for (i = 0, len = ref.length; i < len; i++) {
            asignatura = ref[i];
            //asignatura.nota_asignatura          = $filter('number')(asignatura.nota_asignatura, 0)
            valores.push({
              label: asignatura.alias_materia,
              value: asignatura.nota_asignatura
            });
          }
          return scope.data = [
            {
              key: "Definitivas de asignaturas",
              values: valores
            }
          ];
        }
      };
    }
  ]).directive('boletinAlumnoDir3', [
    'App',
    'Perfil',
    '$filter',
    function(App,
    Perfil,
    $filter) {
      return {
        restrict: 'EA',
        templateUrl: "==informes2/boletinAlumnoDir3.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          var area,
    asignatura,
    i,
    j,
    len,
    len1,
    ref,
    ref1,
    valores;
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          scope.views = App.views;
          scope.options = {
            chart: {
              type: 'discreteBarChart',
              height: 180,
              width: scope.$parent.ancho_chart, //  En BoletinesPeriodoCtrl.coffee
              margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
              },
              useInteractiveGuideline: true,
              x: function(d) {
                return d.label;
              },
              y: function(d) {
                return d.value;
              },
              showValues: true,
              valueFormat: function(d) {
                return d3.format(',.0f')(d);
              },
              transitionDuration: 500
            },
            title: {
              enable: false,
              text: 'Definitivas por asignaturas'
            }
          };
          valores = [];
          ref = scope.alumno.areas;
          for (i = 0, len = ref.length; i < len; i++) {
            area = ref[i];
            ref1 = area.asignaturas;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              asignatura = ref1[j];
              valores.push({
                label: asignatura.alias_materia,
                value: asignatura['nota_final_per' + scope.USER.numero_periodo]
              });
            }
          }
          return scope.data = [
            {
              key: "Definitivas de asignaturas",
              values: valores
            }
          ];
        }
      };
    }
  ]).directive('boletinAlumnoDir4', [
    'App',
    'Perfil',
    '$filter',
    function(App,
    Perfil,
    $filter) {
      return {
        restrict: 'EA',
        templateUrl: "==informes2/boletinAlumnoDir4.tpl.html",
        scope: {
          grupo: "=",
          year: "=",
          alumno: "=",
          config: "=",
          escalas: "="
        },
        link: function(scope,
    iElem,
    iAttrs) {
          // Debo agregar la clase .loading-inactive para que desaparezca el loader de la pantalla.
          // y eso lo puedo hacer con el ng-if
          scope.USER = Perfil.User();
          scope.USER.nota_minima_aceptada = parseInt(scope.USER.nota_minima_aceptada);
          scope.perfilPath = App.images + 'perfil/';
          return scope.views = App.views;
        }
      };
    }
  /*
  for area in scope.alumno.areas
  	for asignatura in area.asignaturas

  		if asignatura.nota_final_per1 >= scope.USER.nota_minima_aceptada
  			asignatura.desempenio_per1 = 'Alcanzado'
  		else
  			asignatura.desempenio_per1 = 'En proceso'

  		if asignatura.nota_final_per2 >= scope.USER.nota_minima_aceptada
  			asignatura.desempenio_per2 = 'Alcanzado'
  		else if scope.USER.numero_periodo >= 2
  			asignatura.desempenio_per2 = 'En proceso'

  		if asignatura.nota_final_per3 >= scope.USER.nota_minima_aceptada
  			asignatura.desempenio_per3 = 'Alcanzado'
  		else if scope.USER.numero_periodo >= 3
  			asignatura.desempenio_per3 = 'En proceso'

  		if asignatura.nota_final_per4 >= scope.USER.nota_minima_aceptada
  			asignatura.desempenio_per4 = 'Alcanzado'
  		else if scope.USER.numero_periodo >= 4
  			asignatura.desempenio_per4 = 'En proceso'

  		for unidad in asignatura.unidades
  			if unidad.nota_unidad >= scope.USER.nota_minima_aceptada
  				unidad.desempenio = 'Alcanzado'
  			else
  				unidad.desempenio = 'En proceso'
  */
  ]).filter('cantPerdidasPer', [
    function() {
      return function(input,
    periodo_id,
    alum_id) {
        this.suma = 0;
        angular.forEach(input,
    function(periodo,
    key) {
          var per_id;
          periodo_id = parseFloat(periodo_id);
          per_id = parseFloat(periodo.id);
          if (per_id === periodo_id) {
            return this.suma = this.suma + periodo.cantNotasPerdidas;
          }
        });
        if (this.suma === 0) {
          return '';
        }
        return this.suma;
      };
    }
  ]).directive('dynamic', function($compile) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, ele, attrs) {
        return scope.$watch(attrs.dynamic, function(html) {
          ele.html(html);
          return $compile(ele.contents())(scope);
        });
      }
    };
  });

}).call(this);

//BoletinAlumnoDir.js.map
