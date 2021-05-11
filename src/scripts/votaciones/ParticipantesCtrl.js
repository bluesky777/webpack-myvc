(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('ParticipantesCtrl', [
    '$scope',
    '$filter',
    '$http',
    'toastr',
    'Acentos',
    function($scope,
    $filter,
    $http,
    toastr,
    Acentos) {
      var append3,
    appendPopover,
    appendPopover1,
    appendPopover2,
    btEditEPS,
    btEditUsername,
    btUsuario,
    btVotos,
    envio;
      $scope.participantes = [];
      $scope.dato = {
        grupo: ''
      };
      $scope.gridOptions = {};
      $scope.votacion = {
        locked: false,
        is_action: false,
        fecha_inicio: '',
        fecha_fin: ''
      };
      envio = {};
      if (localStorage.votacion_actual) {
        envio.votacion_id = localStorage.votacion_actual;
      }
      $http.put('::participantes/datos',
    envio).then(function(data) {
        var grupo,
    i,
    len,
    matr_grupo,
    ref,
    results;
        data = data.data;
        $scope.grupos = data.grupos;
        $scope.votacion = data.votacion;
        matr_grupo = 0;
        if (localStorage.matr_grupo) {
          matr_grupo = parseInt(localStorage.matr_grupo);
        }
        ref = $scope.grupos;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (parseInt(grupo.id) === parseInt(matr_grupo)) {
            $scope.dato.grupo = grupo;
            results.push($scope.selectGrupo($scope.dato.grupo));
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
    function(r2) {
        return toastr.warning('Asegúrate de tener al menos un evento como actual.');
      });
      $scope.traerProfesores = function() {
        delete localStorage.matr_grupo;
        return $http.put('::participantes/profesores',
    {
          votacion_id: $scope.votacion.id
        }).then(function(r) {
          var aspir,
    i,
    j,
    k,
    len,
    len1,
    len2,
    parti,
    ref,
    ref1,
    ref2,
    voto;
          ref = r.data.participantes;
          for (i = 0, len = ref.length; i < len; i++) {
            parti = ref[i];
            ref1 = parti.aspiraciones;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              aspir = ref1[j];
              ref2 = aspir.votos;
              for (k = 0, len2 = ref2.length; k < len2; k++) {
                voto = ref2[k];
                voto.created_at = new Date(voto.created_at.replace(/-/g,
    '\/'));
              }
            }
          }
          $scope.participantes = r.data.participantes;
          return $scope.gridOptions.data = r.data.participantes;
        },
    function(r2) {
          return toastr.error('Error al traer participantes.');
        });
      };
      $scope.selectGrupo = function(grupo) {
        var grup,
    i,
    len,
    ref;
        localStorage.matr_grupo = grupo.id;
        $scope.dato.grupo = grupo;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          grup.active = false;
        }
        grupo.active = true;
        return $http.put('::participantes/votantes',
    {
          grupo_id: grupo.id,
          votacion_id: $scope.votacion.id
        }).then(function(r) {
          var aspir,
    j,
    k,
    l,
    len1,
    len2,
    len3,
    parti,
    ref1,
    ref2,
    ref3,
    voto;
          ref1 = r.data.participantes;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            parti = ref1[j];
            ref2 = parti.aspiraciones;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              aspir = ref2[k];
              ref3 = aspir.votos;
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                voto = ref3[l];
                voto.created_at = new Date(voto.created_at.replace(/-/g,
    '\/'));
              }
            }
          }
          $scope.participantes = r.data.participantes;
          return $scope.gridOptions.data = r.data.participantes;
        },
    function(r2) {
          return toastr.error('Error al traer participantes.');
        });
      };
      $scope.guardarInscripciones = function() {
        $scope.guardando_inscrip = true;
        return $http.put('::participantes/guardar-inscripciones',
    {
          grupos: $scope.grupos
        }).then(function(r) {
          toastr.success('Inscripciones guardadas.');
          return $scope.guardando_inscrip = false;
        },
    function(r2) {
          toastr.error('Error al intentar guardar Inscripciones.');
          return $scope.guardando_inscrip = false;
        });
      };
      btUsuario = "==directives/botonesResetPassword.tpl.html";
      btEditUsername = "==alumnos/botonEditUsername.tpl.html";
      btEditEPS = "==alumnos/botonEditEps.tpl.html";
      btVotos = "==alumnos/botonVotos.tpl.html";
      appendPopover1 = "'==alumnos/popoverAlumnoGrid.tpl.html'";
      appendPopover2 = "'mouseenter'";
      append3 = "' '";
      appendPopover = 'uib-popover-template="views+' + appendPopover1 + '" popover-trigger="' + appendPopover2 + '" popover-title="{{ row.entity.nombres + ' + append3 + ' + row.entity.apellidos }}" popover-popup-delay="500" popover-append-to-body="true"';
      $scope.gridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        showFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enebleGridColumnMenu: false,
        columnDefs: [
          {
            field: 'no',
            pinnedLeft: true,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40,
            enableCellEdit: false
          },
          {
            field: 'nombres',
            minWidth: 130,
            pinnedLeft: true,
            filter: {
              condition: Acentos.buscarEnGrid
            },
            enableHiding: false,
            cellTemplate: '<div class="ui-grid-cell-contents" style="padding: 0px;" ' + appendPopover + '><img ng-src="{{grid.appScope.perfilPath + row.entity.foto_nombre}}" style="width: 35px" />{{row.entity.nombres}}</div>'
          },
          {
            field: 'apellidos',
            minWidth: 110,
            filter: {
              condition: Acentos.buscarEnGrid
            }
          },
          {
            name: 'Votos',
            cellTemplate: btVotos,
            minWidth: 200
          },
          {
            field: 'sexo',
            displayName: 'Sex',
            width: 40
          },
          {
            field: 'username',
            filter: {
              condition: Acentos.buscarEnGrid
            },
            displayName: 'Usuario',
            cellTemplate: btUsuario,
            editableCellTemplate: btEditUsername,
            minWidth: 135
          },
          {
            field: 'documento',
            minWidth: 100,
            cellFilter: 'formatNumberDocumento'
          },
          {
            field: 'celular',
            displayName: 'Celular',
            minWidth: 80
          }
        ],
        multiSelect: false
      };
    }
  ]);

}).call(this);

//ParticipantesCtrl.js.map
