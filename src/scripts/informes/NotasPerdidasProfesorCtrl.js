(function() {
  angular.module('myvcFrontApp').controller('NotasPerdidasProfesorCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos',
    '$state',
    '$stateParams',
    function($scope,
    App,
    Perfil,
    grupos,
    $state,
    $stateParams) {
      $scope.grupos = grupos.data;
      $scope.periodo_a_calcular = $stateParams.periodo_a_calcular;
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Notas pendientes ');
    }
  ]).controller('NotasPerdidasTodosCtrl', [
    '$scope',
    'App',
    'Perfil',
    'profesores',
    '$state',
    '$stateParams',
    function($scope,
    App,
    Perfil,
    profesores,
    $state,
    $stateParams) {
      $scope.profesores = profesores.data;
      $scope.periodo_a_calcular = $stateParams.periodo_a_calcular;
      $scope.USER = Perfil.User();
      $scope.USER.nota_minima_aceptada = parseInt($scope.USER.nota_minima_aceptada);
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Notas pendientes ');
    }
  ]).controller('VerAusenciasCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_ausencias',
    '$state',
    function($scope,
    App,
    Perfil,
    grupos_ausencias,
    $state) {
      $scope.grupos_ausencias = grupos_ausencias.data;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Ausencias y tardanzas a la institución ');
    }
  ]).controller('VerSimatCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_simat',
    '$state',
    function($scope,
    App,
    Perfil,
    grupos_simat,
    $state) {
      $scope.grupos_simat = grupos_simat.data;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Listado SIMAT ');
    }
  ]).controller('ListasPersonalizadasCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_simat',
    '$state',
    function($scope,
    App,
    Perfil,
    grupos_simat,
    $state) {
      var hay;
      $scope.grupos_simat_copy = grupos_simat.data;
      $scope.grupos_simat = grupos_simat.data;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.titulo_listado = {};
      $scope.show_documento = true;
      $scope.columnas = 2;
      $scope.campos = [
        {
          campo: 'ninguno',
          valor: 'Ninguna'
        },
        {
          campo: 'documento',
          valor: 'Documento'
        },
        {
          campo: 'telefonos',
          valor: 'Teléfonos'
        },
        {
          campo: 'username',
          valor: 'Nombre de usuario'
        },
        {
          campo: 'ciudad_nac_nombre',
          valor: 'Ciudad nacimiento'
        },
        {
          campo: 'es_urbana',
          valor: 'Urbanidad'
        },
        {
          campo: 'direccion',
          valor: 'Dirección'
        },
        {
          campo: 'email',
          valor: 'Email'
        },
        {
          campo: 'fecha_nac',
          valor: 'Fecha nacimiento'
        },
        {
          campo: 'edad',
          valor: 'Edad'
        },
        {
          campo: 'religion',
          valor: 'Religión'
        },
        {
          campo: 'sexo',
          valor: 'Sexo'
        },
        {
          campo: 'eps',
          valor: 'EPS'
        }
      ];
      $scope.columnasDatosTd = [$scope.campos[1]];
      $scope.columnasDatos = ["documento"];
      $scope.columnasArray = new Array($scope.columnas);
      hay = localStorage.txt_titulo_listado;
      if (hay) {
        $scope.titulo_listado.texto = hay;
      } else {
        $scope.titulo_listado.texto = "<b>LISTADO DE ALUMNOS</b><br>";
      }
      $scope.cambia_texto_informativo = function() {
        return localStorage.txt_titulo_listado = $scope.titulo_listado.texto;
      };
      $scope.cambiaColumnas = function(col) {
        //nuevos = new Array(num)
        $scope.columnasArray = new Array(col);
        return localStorage.txt_titulo_listado = $scope.titulo_listado.texto;
      };
      $scope.cambiaColumnasDatos = function(cols) {
        var campo,
    col,
    i,
    j,
    len,
    len1,
    ninguno,
    ref,
    res;
        ninguno = false;
        res = [];
        for (i = 0, len = cols.length; i < len; i++) {
          col = cols[i];
          ref = $scope.campos;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            campo = ref[j];
            if (campo.campo === col) {
              res.push(campo);
            }
          }
        }
        /*
        if col == 'ninguno'
        	ninguno = true
        */
        if (ninguno === true) {
          $scope.columnasDatos = [];
        } else {
          $scope.columnasDatosTd = res;
        }
        return console.log(cols,
    $scope.columnasDatosTd);
      };
      $scope.getNumber = function(num) {
        return new Array(num);
      };
      $scope.todos = function() {
        return $scope.grupos_simat = $scope.grupos_simat_copy;
      };
      $scope.selectGrupo = function(item) {
        var grupo,
    i,
    len,
    ref,
    results;
        ref = $scope.grupos_simat_copy;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (grupo.id === item.id) {
            results.push($scope.grupos_simat = [grupo]);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      return $scope.$emit('cambia_descripcion',
    'Listas personalizadas ');
    }
  ]).controller('VerObservadorVerticalCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_observador',
    '$state',
    '$http',
    '$stateParams',
    function($scope,
    App,
    Perfil,
    grupos_observador,
    $state,
    $http,
    $stateParams) {
      $scope.grupos_observador = grupos_observador.data;
      $scope.editor_options = {
        allowedContent: true,
        entities: false
      };
      $scope.tamanio_hoja = 'oficio';
      $scope.eligirTamanio = function(tamanio) {
        $scope.tamanio_hoja = tamanio;
        return $http.get('::observador/vertical/' + $stateParams.grupo_id + '/' + tamanio).then(function(r) {
          return $scope.grupos_observador = r.data;
        },
    function() {
          return toast.error('No se pudo traer el observador');
        });
      };
      $scope.onEditorReady = function() {
        return console.log('Editor listo');
      };
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Observador del alumno ');
    }
  ]).controller('VerObservadorHorizontalCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_observador',
    '$state',
    '$http',
    '$stateParams',
    function($scope,
    App,
    Perfil,
    grupos_observador,
    $state,
    $http,
    $stateParams) {
      var i,
    imagen,
    img,
    j,
    len,
    len1,
    ref,
    ref1;
      $scope.grupo = grupos_observador.data.grupo;
      $scope.imagenes = grupos_observador.data.imagenes;
      $scope.filasFirst = [1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24];
      $scope.observ = {
        encabezado_margin_top: 150,
        encabezado_margin_left: 200
      };
      if (localStorage.imagen_fondo) {
        $scope.observ.imagen = JSON.parse(localStorage.imagen_fondo);
        ref = $scope.imagenes;
        for (i = 0, len = ref.length; i < len; i++) {
          imagen = ref[i];
          if (imagen === $scope.observ.imagen) {
            $scope.observ.imagen = imagen;
          }
        }
      } else {
        ref1 = $scope.imagenes;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          img = ref1[j];
          if (img.nombre.includes('fondo-observador.png')) {
            $scope.observ.imagen = img;
          }
        }
      }
      $scope.imagenSelect = function($item) {
        return localStorage.imagen_fondo = JSON.stringify($item);
      };
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      return $scope.$emit('cambia_descripcion',
    'Observador del alumno ');
    }
  ]).controller('PlanillasAusenciasAcudientesCtrl', [
    '$scope',
    'App',
    'Perfil',
    'grupos_acud',
    '$state',
    function($scope,
    App,
    Perfil,
    grupos_acud,
    $state) {
      var grup,
    hay,
    i,
    len,
    ref;
      $scope.grupos_acud = grupos_acud.data.grupos_acud;
      $scope.year = grupos_acud.data.year;
      $scope.USER = Perfil.User();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.fecha_hoy = new Date();
      $scope.texto_informativo = {};
      hay = localStorage.txt_informativo_asist_padres;
      if (hay) {
        $scope.texto_informativo.texto = hay;
      } else {
        $scope.texto_informativo.texto = "<b>PLANILLA ASISTENCIA ASAMBLEA DE PADRES</b><br>";
      }
      $scope.cambia_texto_informativo = function() {
        return localStorage.txt_informativo_asist_padres = $scope.texto_informativo.texto;
      };
      $scope.editor_options = {
        allowedContent: true,
        entities: false
      };
      ref = $scope.grupos_acud;
      for (i = 0, len = ref.length; i < len; i++) {
        grup = ref[i];
        grup.alumnos_temp = grup.alumnos;
        if (grup.alumnos_temp.length < 31) {
          grup.alumnos1 = grup.alumnos_temp;
        } else if (grup.alumnos_temp.length < 61) {
          grup.alumnos1 = grup.alumnos_temp.splice(0,
    30);
          grup.alumnos2 = grup.alumnos_temp.splice(0,
    30);
        } else if (asign.alumnos_temp.length < 91) {
          grup.alumnos1 = grup.alumnos_temp.splice(0,
    30);
          grup.alumnos2 = grup.alumnos_temp.splice(0,
    30);
          grup.alumnos3 = grup.alumnos_temp.splice(0,
    30);
        }
      }
      return $scope.$emit('cambia_descripcion',
    'Planilla de asistencia de padres ');
    }
  ]).directive('compile', function($compile, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        return $timeout(function() {
          return $compile(elem.contents())(scope);
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=NotasPerdidasProfesorCtrl.js.map
