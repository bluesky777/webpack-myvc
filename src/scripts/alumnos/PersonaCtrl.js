(function() {
  'use strict';
  angular.module("myvcFrontApp").directive('personaBasicoDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaBasicoDir.tpl.html`
      };
    }
  ]).directive('personaMatriculasDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaMatriculasDir.tpl.html`
      };
    }
  ]).directive('personaNeeDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaNeeDir.tpl.html`
      };
    }
  ]).directive('personaDatosExtrasDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaDatosExtrasDir.tpl.html`
      };
    }
  ]).directive('personaEnfermeriaDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaEnfermeriaDir.tpl.html`
      };
    }
  ]).directive('personaAcudientesDir', [
    'App',
    function(App) {
      return {
        restrict: 'E',
        templateUrl: `${App.views}alumnos/personaAcudientesDir.tpl.html`
      };
    }
  ]).controller('PersonaCtrl', [
    '$scope',
    '$state',
    '$http',
    'toastr',
    '$uibModal',
    'App',
    '$rootScope',
    '$timeout',
    'AuthService',
    function($scope,
    $state,
    $http,
    toastr,
    $modal,
    App,
    $rootScope,
    $timeout,
    AuthService) {
      var $btEdit,
    $btGrid1,
    $btGrid2,
    $btGrid3,
    bt2,
    btGrid1,
    btGrid2,
    btPresion,
    columna_editable,
    columna_usu,
    editable;
      $scope.data = {}; // Para el popup del Datapicker
      $scope.alumno = {};
      $scope.religiones = App.religiones;
      $scope.tipos_sangre = App.tipos_sangre;
      $scope.dato = {};
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.enfermedia_cargada = false;
      $scope.opciones_programar = App.opciones_programar;
      $scope.sangres = App.sangres;
      $scope.mostrar_mas = false;
      $scope.mostrar_compromisos = false;
      $scope.mostrar_prematricula = true;
      $scope.gridScope = $scope;
      $scope.gridOptions = {};
      $scope.gridOptionsAcudientes = {};
      $scope.parentescos = App.parentescos;
      $scope.new_suceso = {
        fecha_suceso: new Date(),
        signo_fc: 60,
        signo_fr: 12,
        signo_t: 35.5
      };
      if (localStorage.mostrar_mas_deta_alum) {
        $scope.mostrar_mas = localStorage.mostrar_mas_deta_alum === 'true' ? true : false;
      }
      if (localStorage.mostrar_compromisos) {
        $scope.mostrar_compromisos = localStorage.mostrar_compromisos === 'true' ? true : false;
      }
      if (localStorage.mostrar_prematricula) {
        $scope.mostrar_prematricula = localStorage.mostrar_prematricula === 'true' ? true : false;
      }
      if ($state.params.tipo === 'alumno') {
        $http.put('::alumnos/show',
    {
          id: $state.params.persona_id,
          con_grupos: true
        }).then(function(r) {
          var grup,
    i,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    matricu,
    opcion,
    ref,
    ref1,
    ref2,
    ref3,
    results,
    tipo_doc;
          $scope.grupos = r.data.grupos;
          $scope.grupos_siguientes = r.data.grupos_siguientes;
          $scope.tipos_doc = r.data.tipos_doc;
          $scope.alumno = r.data.alumno;
          $scope.matriculas = r.data.matriculas;
          $scope.alum_copy = angular.copy($scope.alumno);
          $scope.alumno.next_year.estado_ant = $scope.alumno.next_year.estado;
          $scope.alumno.ciudad_nac_id = $scope.alumno.ciudad_nac;
          $scope.alumno.ciudad_doc_id = $scope.alumno.ciudad_doc;
          $scope.alumno.fecha_retiro = $scope.alumno.fecha_retiro ? new Date($scope.alumno.fecha_retiro.replace(/-/g,
    '\/')) : $scope.alumno.fecha_retiro;
          $scope.alumno.fecha_matricula = $scope.alumno.fecha_matricula ? new Date($scope.alumno.fecha_matricula.replace(/-/g,
    '\/')) : $scope.alumno.fecha_matricula;
          $scope.alumno.fecha_nac = $scope.alumno.fecha_nac ? new Date($scope.alumno.fecha_nac.replace(/-/g,
    '\/')) : $scope.alumno.fecha_nac;
          $scope.alumno.llevo_formulario = $scope.alumno.llevo_formulario ? new Date($scope.alumno.llevo_formulario) : $scope.alumno.llevo_formulario;
          $scope.alumno.llevo_formulario_bool = $scope.alumno.llevo_formulario ? 'Si' : 'No';
          $scope.cant_compromisos = 0;
          ref = $scope.opciones_programar;
          for (i = 0, len = ref.length; i < len; i++) {
            opcion = ref[i];
            ref1 = $scope.matriculas;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              matricu = ref1[j];
              if (matricu.programar === opcion.opcion) {
                matricu.programar = opcion;
              }
              if (matricu.efectuar_una === opcion.opcion) {
                matricu.efectuar_una = opcion;
              }
            }
            if ($scope.alumno.programar === opcion.opcion) {
              $scope.dato.programar = opcion;
              $scope.cant_compromisos++;
            }
            if ($scope.alumno.efectuar_una === opcion.opcion) {
              $scope.dato.efectuar_una = opcion;
              $scope.cant_compromisos++;
            }
            if ($scope.alumno.next_year.programar === opcion.opcion) {
              $scope.dato.programar_next = opcion;
            }
            if ($scope.alumno.next_year.efectuar_una === opcion.opcion) {
              $scope.dato.efectuar_una_next = opcion;
            }
          }
          if ($scope.alumno.next_year) {
            $scope.alumno.next_year.prematriculado = $scope.alumno.next_year.prematriculado ? new Date($scope.alumno.next_year.prematriculado.replace(/-/g,
    '\/')) : $scope.alumno.next_year.prematriculado;
            $scope.alumno.next_year.fecha_matricula = $scope.alumno.next_year.fecha_matricula ? new Date($scope.alumno.next_year.fecha_matricula.replace(/-/g,
    '\/')) : $scope.alumno.next_year.fecha_matricula;
            ref2 = $scope.grupos_siguientes;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              grup = ref2[k];
              if (grup.id === $scope.alumno.next_year.grupo_id) {
                $scope.dato.grupo_prematr = grup;
              }
            }
          }
          if ($scope.alumno.ciudad_nac === null) {
            $scope.alumno.pais_nac = {
              id: 1,
              pais: 'COLOMBIA',
              abrev: 'CO'
            };
            $scope.paisNacSelect($scope.alumno.pais_nac,
    $scope.alumno.pais_nac);
          } else {
            $http.get('::ciudades/datosciudad/' + $scope.alumno.ciudad_nac).then(function(r2) {
              r2 = r2.data;
              $scope.paises = r2.paises;
              $scope.departamentosNac = r2.departamentos;
              $scope.ciudadesNac = r2.ciudades;
              $scope.alumno.pais_nac = r2.pais;
              $scope.alumno.departamento_nac = r2.departamento;
              return $scope.alumno.ciudad_nac = r2.ciudad;
            });
          }
          if ($scope.alumno.ciudad_doc > 0) {
            $http.get('::ciudades/datosciudad/' + $scope.alumno.ciudad_doc).then(function(r2) {
              r2 = r2.data;
              $scope.paises = r2.paises;
              $scope.departamentos = r2.departamentos;
              $scope.ciudades = r2.ciudades;
              $scope.alumno.pais_doc = r2.pais;
              $scope.alumno.departamento_doc = r2.departamento;
              return $scope.alumno.ciudad_doc = r2.ciudad;
            });
          } else {
            $scope.alumno.pais_doc = {
              id: 1,
              pais: 'COLOMBIA',
              abrev: 'CO'
            };
            $scope.paisSeleccionado($scope.alumno.pais_doc,
    $scope.alumno.pais_doc);
          }
          if ($scope.alumno.ciudad_resid > 0) {
            $http.get('::ciudades/datosciudad/' + $scope.alumno.ciudad_resid).then(function(r2) {
              r2 = r2.data;
              $scope.paises = r2.paises;
              $scope.departamentosResid = r2.departamentos;
              $scope.ciudadesResid = r2.ciudades;
              $scope.alumno.pais_resid = r2.pais;
              $scope.alumno.departamento_resid = r2.departamento;
              return $scope.alumno.ciudad_resid = r2.ciudad;
            });
          } else {
            $scope.alumno.pais_resid = {
              id: 1,
              pais: 'COLOMBIA',
              abrev: 'CO'
            };
            $scope.paisResidSelecionado($scope.alumno.pais_resid,
    $scope.alumno.pais_resid);
          }
          if ($scope.alumno.tipo_doc) {
            ref3 = $scope.tipos_doc;
            results = [];
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              tipo_doc = ref3[l];
              if (tipo_doc.id === $scope.alumno.tipo_doc) {
                results.push($scope.alumno.tipo_doc = tipo_doc);
              } else {
                results.push(void 0);
              }
            }
            return results;
          }
        });
      }
      $scope.openDatePicker = function(data,
    elem) {
        return data[elem] = true;
      };
      $scope.mostarMasDetalle = function() {
        $scope.mostrar_mas = !$scope.mostrar_mas;
        return localStorage.mostrar_mas_deta_alum = $scope.mostrar_mas;
      };
      $scope.toggleNuevoRepite = function(fila,
    campo,
    year_id) {
        var datos;
        if (!year_id) {
          year_id = fila.next_year.year_id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: campo,
          valor: fila.nuevo,
          year_id: fila.next_year.year_id
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          fila.nuevo = !fila.nuevo;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.cerrarEdicionSuceso = function() {
        return $scope.editando_suceso = false;
      };
      $scope.editarSuceso = function(suceso) {
        $scope.act_suceso = suceso;
        return $scope.editando_suceso = true;
      };
      $scope.eliminarSuceso = function(suceso) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/removeSuceso.tpl.html',
          controller: 'RemoveSucesoCtrl',
          resolve: {
            elemento: function() {
              return suceso;
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
      btGrid1 = '<a uib-tooltip="Editar" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editarSuceso(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminarSuceso(row.entity)"><i class="fa fa-trash "></i></a>';
      bt2 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 + btGrid2 + '</span>';
      btPresion = "==directives/botonPresionArterial.tpl.html";
      $scope.gridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        showFooter: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        columnDefs: [
          {
            field: 'no',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40,
            enableCellEdit: false
          },
          {
            name: 'edicion',
            displayName: 'Edit',
            width: 55,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: bt2,
            enableCellEdit: false,
            enableColumnMenu: true
          },
          {
            field: 'fecha_suceso',
            displayName: 'Fecha matrícula',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 100
          },
          {
            field: 'signo_fc',
            displayName: 'Frec cardiaca',
            minWidth: 60,
            enableColumnMenu: true,
            type: 'number'
          },
          {
            field: 'signo_fr',
            displayName: 'Frec respiratoria',
            minWidth: 60,
            type: 'number'
          },
          {
            field: 'signo_t',
            displayName: 'Temperatura',
            minWidth: 60,
            type: 'number'
          },
          {
            field: 'signo_glu',
            displayName: 'Glucometría',
            minWidth: 60,
            type: 'number'
          },
          {
            field: 'signo_spo2',
            displayName: 'SPO2',
            minWidth: 60,
            type: 'number'
          },
          {
            field: 'signo_pa_dia',
            displayName: 'Presión arterial',
            cellTemplate: btPresion,
            minWidth: 60,
            enableCellEdit: false
          },
          {
            field: 'asignatura',
            displayName: 'Asignatura',
            minWidth: 70
          },
          {
            field: 'motivo_consulta',
            displayName: 'Motivo consulta',
            minWidth: 120
          },
          {
            field: 'descripcion_suceso',
            displayName: 'Descripción suceso',
            minWidth: 120
          },
          {
            field: 'tratamiento',
            displayName: 'Tratamiento',
            minWidth: 120
          },
          {
            field: 'observaciones',
            displayName: 'Observaciones',
            minWidth: 120
          },
          {
            field: 'insumos_utilizados',
            displayName: 'insumos_utilizados',
            minWidth: 120
          },
          {
            field: 'created_by_name',
            displayName: 'Creado por',
            minWidth: 90
          },
          {
            field: 'updated_by_name',
            displayName: 'Actualizado por',
            minWidth: 90
          }
        ],
        multiSelect: false,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            if (newValue !== oldValue) {
              $http.put('::enfermeria/guardar-valor-suceso',
    {
                suceso_id: rowEntity.id,
                propiedad: colDef.field,
                valor: newValue
              }).then(function(r) {
                return toastr.success('Suceso actualizado');
              },
    function(r2) {
                rowEntity[colDef.field] = oldValue;
                return toastr.error('Cambio no guardado',
    'Error');
              });
              return $scope.$apply();
            }
          });
        }
      };
      $scope.eliminarAlumno = function() {
        var modalInstance;
        $scope.eliminando = true;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/removeAlumno.tpl.html',
          controller: 'RemoveAlumnoCtrl',
          resolve: {
            alumno: function() {
              return $scope.alumno;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          $state.reload();
          return $scope.eliminando = false;
        },
    function() {
          return $scope.eliminando = false;
        });
      };
      $scope.restaurarAlumno = function() {
        $scope.restaurando = true;
        return $http.put('::alumnos/restore/' + $scope.alumno.alumno_id).then(function(r) {
          return $state.reload();
        },
    function(r2) {
          toastr.error('Alumno no restaurado',
    'Error');
          return $scope.restaurando = false;
        });
      };
      $scope.asignarAOtro = function(acudiente) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/asignarAcudienteAOtro.tpl.html',
          controller: 'AsignarAcudienteAOtroModalCtrl',
          resolve: {
            elemento: function() {
              return acudiente;
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return toastr.success('Asignado.');
        });
      };
      $btGrid1 = '<a uib-tooltip="Cambiar" ng-show="row.entity.nombres" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.cambiarAcudiente(row.entity, row.entity)" tooltip-append-to-body="true"><i class="fa fa-edit "></i></a>';
      $btGrid2 = '<a uib-tooltip="Quitar parentesco" ng-show="row.entity.nombres" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.quitarAcudiente(row.entity, row.entity)" tooltip-append-to-body="true"><i class="fa fa-trash "></i></a>';
      $btGrid3 = '<a uib-tooltip="Asignar también a otro alumno" class="btn btn-default btn-xs shiny" ng-click="grid.appScope.asignarAOtro(row.entity)" tooltip-append-to-body="true" style="height: 24px;">Compartir con...</a>';
      $btEdit = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + $btGrid1 + $btGrid2 + $btGrid3 + '</span>';
      columna_editable = {
        name: 'edicion'
      };
      columna_usu = {
        name: 'usuario'
      };
      editable = !AuthService.hasRoleOrPerm(['psicólogo',
    'enfermero']);
      if (editable) {
        columna_editable = {
          name: 'edicion',
          displayName: 'Edición',
          width: 170,
          enableSorting: false,
          enableFiltering: false,
          cellTemplate: $btEdit,
          enableCellEdit: false
        };
      }
      if (editable) {
        columna_usu = {
          name: "Usuario",
          field: "username",
          minWidth: 135,
          cellTemplate: "==directives/botonesResetPassword.tpl.html",
          editableCellTemplate: "==alumnos/botonEditUsername.tpl.html"
        };
      }
      $scope.gridOptionsAcudientes = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: editable,
        columnDefs: [
          columna_editable,
          {
            name: "Id",
            field: "id",
            'minWidth': 60,
            enableCellEdit: false
          },
          {
            name: "Nombres",
            field: "nombres",
            minWidth: 120
          },
          {
            name: "Apellidos",
            field: "apellidos",
            minWidth: 100
          },
          {
            name: "Sex",
            field: "sexo",
            minWidth: 40
          },
          {
            name: "Parentesco",
            field: "parentesco",
            minWidth: 90
          },
          columna_usu,
          {
            name: "Documento",
            field: "documento",
            minWidth: 100,
            cellFilter: 'formatNumberDocumento'
          },
          {
            name: "Teléfono",
            field: "telefono",
            minWidth: 90
          },
          {
            name: "Celular",
            field: "celular",
            minWidth: 90
          },
          {
            name: "Ocupación",
            field: "ocupacion",
            minWidth: 100
          },
          {
            name: "Fecha nac",
            field: "fecha_nac",
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 120
          }
        ],
        multiSelect: false,
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          if (editable) {
            return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
              var re;
              if (newValue !== oldValue) {
                if (colDef.field === "sexo") {
                  newValue = newValue.toUpperCase();
                  if (!(newValue === 'M' || newValue === 'F')) {
                    toastr.warning('Debe usar M o F');
                    rowEntity.sexo = oldValue;
                    return;
                  }
                }
                if (colDef.field === 'email') {
                  re = /\S+@\S+\.\S+/;
                  if (!re.test(newValue)) {
                    toastr.warning('Email no válido');
                    rowEntity.email = oldValue;
                    return;
                  }
                }
                $http.put('::acudientes/guardar-valor',
    {
                  parentesco_id: rowEntity.parentesco_id,
                  acudiente_id: rowEntity.id,
                  user_id: rowEntity.user_id,
                  propiedad: colDef.field,
                  valor: newValue
                }).then(function(r) {
                  return toastr.success('Acudiente actualizado con éxito');
                },
    function(r2) {
                  rowEntity[colDef.field] = oldValue;
                  return toastr.error('Cambio no guardado',
    'Error');
                });
                return $scope.$apply();
              }
            });
          }
        }
      };
      $scope.$on('alumnoguardado',
    function(data,
    alum) {
        return $state.go('panel.persona',
    {
          persona_id: alum.id,
          tipo: 'alumno'
        });
      });
      $scope.guardar_valor_suceso = function(rowEntity,
    col,
    newValue) {
        return $http.put('::enfermeria/guardar-valor-suceso',
    {
          suceso_id: rowEntity.id,
          propiedad: col,
          valor: newValue
        }).then(function(r) {
          return toastr.success('Suceso actualizado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.crear_alumno = function() {
        $rootScope.grupos_siguientes = $scope.grupos_siguientes;
        return $state.go('panel.persona.nuevo');
      };
      $scope.cargarAcudientes = function() {
        return $http.put('::acudientes/de-persona',
    {
          alumno_id: $scope.alumno.alumno_id
        }).then(function(r) {
          var i,
    len,
    pariente,
    ref;
          ref = r.data.acudientes;
          for (i = 0, len = ref.length; i < len; i++) {
            pariente = ref[i];
            pariente.fecha_nac_ant = pariente.fecha_nac;
            pariente.fecha_nac = pariente.fecha_nac ? new Date(pariente.fecha_nac.replace(/-/g,
    '\/')) : pariente.fecha_nac;
          }
          $scope.gridOptionsAcudientes.data = r.data.acudientes;
          return $scope.acudientes_cargado = true;
        });
      };
      $scope.crearUsuario = function(row) {
        if (row.user_id) {
          toastr.warning('Ya tiene usuario');
          return;
        }
        if (!row.id) {
          toastr.info('Solo con acudientes creados');
          return;
        }
        return $http.post('::acudientes/crear-usuario',
    {
          acudiente: row
        }).then(function(r) {
          $scope.usuario_creado = true;
          row.user_id = r.data.id;
          row.username = r.data.username;
          return toastr.success('Usuario creado');
        },
    function() {
          return toastr.error('No se pudo crear el usuario');
        });
      };
      $scope.crear_suceso = function() {
        return $scope.creando_suceso = true;
      };
      $scope.cargarEnfermeria = function() {
        return $http.put('::enfermeria/datos',
    {
          alumno_id: $scope.alumno.alumno_id
        }).then(function(r) {
          var i,
    j,
    len,
    len1,
    ref,
    ref1,
    regi,
    sangre;
          ref = $scope.sangres;
          for (i = 0, len = ref.length; i < len; i++) {
            sangre = ref[i];
            if ($scope.alumno.tipo_sangre === sangre.sangre) {
              $scope.dato.tipo_sangre = sangre;
            }
          }
          ref1 = r.data.registros_enfermeria;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            regi = ref1[j];
            regi.fecha_suceso = new Date(regi.fecha_suceso);
            regi.signo_t = parseFloat(regi.signo_t);
          }
          $scope.enfermeria = r.data.antecedentes;
          $scope.gridOptions.data = r.data.registros_enfermeria;
          return $scope.enfermedia_cargada = true;
        });
      };
      $scope.guardar_nuevo_suceso = function(new_suceso) {
        $scope.guardando_suceso = true;
        new_suceso.alumno_id = $scope.alumno.alumno_id;
        return $http.post('::enfermeria/crear-suceso',
    new_suceso).then(function(r) {
          $scope.guardando_suceso = false;
          return $scope.gridOptions.data.push(r.data);
        },
    function() {
          toastr.error('Error creando suceso');
          return $scope.guardando_suceso = false;
        });
      };
      $http.get('::paises').then(function(r) {
        return $scope.paises = r.data;
      });
      $scope.toggleMostrarCompromisos = function() {
        $scope.mostrar_compromisos = !$scope.mostrar_compromisos;
        return localStorage.mostrar_compromisos = $scope.mostrar_compromisos;
      };
      // Debería traer datos disciplinarios...
      $scope.toggleMostrarPrematricula = function() {
        $scope.mostrar_prematricula = !$scope.mostrar_prematricula;
        return localStorage.mostrar_prematricula = $scope.mostrar_prematricula;
      };
      // Debería traer datos disciplinarios...
      $scope.religionSelected = function(row,
    evento) {
        if ($scope.religiones.indexOf(row.religion) > -1) {
          return $scope.guardarValor(row,
    'religion',
    row.religion);
        }
      };
      $scope.llevo_formulario = function(alumno) {
        var datos;
        datos = {
          alumno_id: alumno.alumno_id,
          llevo_formulario: null,
          year: $scope.USER.year + 1
        };
        if (!alumno.llevo_formulario) {
          datos.llevo_formulario = new Date();
        }
        return $http.put('::prematriculas/llevo-formulario',
    datos).then(function(r) {
          toastr.success('Dato guardado');
          if (alumno.llevo_formulario) {
            alumno.llevo_formulario_bool = 'No';
            return alumno.llevo_formulario = null;
          } else {
            alumno.llevo_formulario_bool = 'Si';
            return alumno.llevo_formulario = datos.llevo_formulario;
          }
        },
    function() {
          return toastr.error('Error cambiando si llevó formulario');
        });
      };
      $scope.paisNacSelect = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          $scope.departamentosNac = r.data;
          if (typeof $scope.alumno.pais_doc === 'undefined') {
            $scope.alumno.pais_doc = $item;
            return $scope.paisSeleccionado($item);
          }
        });
      };
      $scope.departNacSelect = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          $scope.ciudadesNac = r.data;
          if (typeof $scope.alumno.departamento_doc === 'undefined') {
            $scope.alumno.departamento_doc = $item;
            return $scope.departSeleccionado($item);
          }
        });
      };
      $scope.paisSeleccionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentos = r.data;
        });
      };
      $scope.departSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudades = r.data;
        });
      };
      $scope.paisResidSelecionado = function($item,
    $model) {
        return $http.get("::ciudades/departamentos/" + $item.id).then(function(r) {
          return $scope.departamentosResid = r.data;
        });
      };
      $scope.departResidSeleccionado = function($item) {
        return $http.get("::ciudades/por-departamento/" + $item.departamento).then(function(r) {
          return $scope.ciudadesResid = r.data;
        });
      };
      $scope.ciudadSeleccionada = function($item,
    campo) {
        return $scope.guardarValor($scope.alumno,
    campo,
    $item.id);
      };
      $scope.dateOptions = {
        formatYear: 'yyyy'
      };
      $scope.restarEstrato = function() {
        if ($scope.alumno.estrato > 0) {
          return $scope.alumno.estrato = $scope.alumno.estrato - 1;
        }
      };
      $scope.sumarEstrato = function() {
        if ($scope.alumno.estrato < 10) {
          return $scope.alumno.estrato = parseInt($scope.alumno.estrato) + 1;
        }
      };
      $scope.cambiarGrupo = function() {
        var modalInstance;
        if ($scope.hasRoleOrPerm(['admin',
    'secretario',
    'rector'])) {
          modalInstance = $modal.open({
            templateUrl: '==alumnos/matricularEn.tpl.html',
            controller: 'MatricularEnCtrl',
            resolve: {
              alumno: function() {
                return $scope.alumno;
              },
              grupos: function() {
                return $scope.grupos;
              },
              USER: function() {
                return $scope.USER;
              }
            }
          });
          return modalInstance.result.then(function(alum) {
            var grupo,
    i,
    len,
    ref,
    results;
            ref = $scope.grupos;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              grupo = ref[i];
              if (grupo.id === alum.grupo_id) {
                $scope.alumno.grupo_nombre = grupo.nombre;
                results.push($scope.alumno.grupo_id = grupo.id);
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        } else {

        }
      };
      $scope.persona_buscar = '';
      $scope.templateTypeahead = '==alumnos/personaTemplateTypeahead.tpl.html';
      $scope.personaCheck = function(texto) {
        $scope.verificandoPersona = true;
        return $http.put('::alumnos/personas-check',
    {
          texto: texto,
          todos_anios: $scope.dato.todos_anios
        }).then(function(r) {
          $scope.personas_match = r.data.personas;
          $scope.personas_match.map(function(perso) {
            return perso.perfilPath = $scope.perfilPath;
          });
          $scope.verificandoPersona = false;
          return $scope.personas_match;
        });
      };
      $scope.cambiaEpsCheck = function(texto) {
        $scope.verificandoEps = true;
        return $http.put('::alumnos/eps-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.eps_match = r.data.eps;
          $scope.verificandoEps = false;
          return $scope.eps_match.map(function(item) {
            return item.eps;
          });
        });
      };
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
      $scope.religionEditPressEnter = function(row) {
        return $scope.$broadcast(uiGridEditConstants.events.END_CELL_EDIT);
      };
      $scope.tipoDocSeleccionado = function($item,
    row) {
        var datos,
    person;
        datos = {
          propiedad: 'tipo_doc',
          valor: $item.id
        };
        person = 'acudientes';
        if (row.subGridOptions) {
          person = 'alumnos';
          datos.alumno_id = row.alumno_id;
        } else {
          datos.acudiente_id = row.acudiente_id;
          datos.parentesco_id = row.parentesco_id;
          datos.user_acud_id = row.user_id;
        }
        return $http.put('::' + person + '/guardar-valor',
    datos).then(function(r) {
          return toastr.success('Alumno(a) actualizado con éxito',
    'Actualizado');
        },
    function(r2) {
          row.tipo_doc = oldValue;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.matricularUno = function(row,
    recargar) {
        var datos;
        if (!$scope.dato.grupo.id) {
          toastr.warning('Debes definir el grupo al que vas a matricular.',
    'Falta grupo');
          return;
        }
        datos = {
          alumno_id: row.alumno_id,
          grupo_id: $scope.dato.grupo.id,
          year_id: $scope.USER.year_id
        };
        return $http.post('::matriculas/matricularuno',
    datos).then(function(r) {
          r = r.data;
          row.matricula_id = r.id;
          row.grupo_id = r.grupo_id;
          row.estado = 'MATR';
          row.fecha_matricula_ant = r.fecha_matricula.date;
          row.fecha_matricula = new Date(r.fecha_matricula.date);
          toastr.success('Alumno matriculado con éxito',
    'Matriculado');
          if (recargar) {
            $scope.traerAlumnnosConGradosAnterior();
          }
          return row;
        },
    function(r2) {
          return toastr.error('No se pudo. Tal vez no tienes permiso.',
    'Error');
        });
      };
      $scope.cambiaEpsCheck = function(texto) {
        $scope.verificandoEps = true;
        return $http.put('::alumnos/eps-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.eps_match = r.data.eps;
          $scope.verificandoEps = false;
          return $scope.eps_match.map(function(item) {
            return item.eps;
          });
        });
      };
      $scope.reMatricularUno = function(row) {
        var datos;
        datos = {
          matricula_id: row.matricula_id
        };
        return $http.put('::matriculas/re-matricularuno',
    datos).then(function(r) {
          r = r.data;
          toastr.success('Alumno rematriculado',
    'Matriculado');
          return row;
        },
    function(r2) {
          return toastr.error('No se pudo. Tal vez no tienes permiso.',
    'Error');
        });
      };
      $scope.setAsistente = function(fila) {
        return $http.put('::matriculas/set-asistente',
    {
          matricula_id: fila.matricula_id,
          grupo_id: $scope.alumno.grupo_id
        }).then(function(r) {
          return toastr.success('Guardado como asistente');
        },
    function(r2) {
          return toastr.error('No se pudo. Tal vez no tienes permiso.',
    'Error');
        });
      };
      $scope.cambiarFechaRetiro = function(row) {
        return $http.put('::matriculas/cambiar-fecha-retiro',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Fecha retiro guardada');
        },
    function(r2) {
          row.fecha_retiro = row.fecha_retiro_ant;
          return toastr.error('No se pudo. Tal vez no tienes permiso.',
    'Error');
        });
      };
      $scope.cambiarFechaMatricula = function(row) {
        return $http.put('::matriculas/cambiar-fecha-matricula',
    {
          matricula_id: row.matricula_id,
          fecha_matricula: row.fecha_matricula
        }).then(function(r) {
          return toastr.success('Fecha matrícula guardada');
        },
    function(r2) {
          row.fecha_matricula = row.fecha_matricula_ant;
          return toastr.error('No se pudo. Tal vez no tienes permiso.',
    'Error');
        });
      };
      $scope.desertar = function(row) {
        var fecha;
        fecha = row.fecha_retiro;
        if (row.fecha_retiro_ant === null) {
          fecha = new Date();
          row.fecha_retiro = fecha;
        }
        return $http.put('::matriculas/desertar',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Alumno desertado');
        },
    function(r2) {
          return toastr.error('No se pudo desertar. Tal vez no tienes permiso.',
    'Problema');
        });
      };
      $scope.retirar = function(row) {
        var fecha;
        fecha = row.fecha_retiro;
        if (row.fecha_retiro_ant === null) {
          fecha = new Date();
          row.fecha_retiro = fecha;
        }
        return $http.put('::matriculas/retirar',
    {
          matricula_id: row.matricula_id,
          fecha_retiro: row.fecha_retiro
        }).then(function(r) {
          return toastr.success('Alumno retirado');
        },
    function(r2) {
          return toastr.error('No se pudo desmatricular. Tal vez no tienes permiso.',
    'Problema');
        });
      };
      // ya es inutil
      $scope.prematricular = function(row) {
        var datos;
        if ($scope.prematriculando) {
          return;
        }
        if (!$scope.dato.grupo_prematr) {
          toastr.warning('Debe seleccionar el grupo');
          return;
        }
        $scope.prematriculando = true;
        datos = {
          matricula_id: row.next_year.matricula_id,
          alumno_id: row.alumno_id,
          grupo_id: $scope.dato.grupo_prematr.id,
          year_id: row.next_year.year_id
        };
        return $http.put('::matriculas/prematricular',
    datos).then(function(r) {
          toastr.success('Alumno prematriculado');
          $scope.prematriculando = false;
          r.data.matricula.prematriculado = new Date(r.data.matricula.prematriculado.replace(/-/g,
    '\/'));
          $scope.alumno.next_year = r.data.matricula;
          return $timeout(function() {
            return $scope.$apply();
          },
    100);
        },
    function(r2) {
          toastr.error('Tal vez no existe el ' + ($scope.USER.year + 1),
    'Problema');
          return $scope.prematriculando = false;
        });
      };
      $scope.cambiaUsernameCheck = function(texto) {
        $scope.username_cambiado = true;
        $scope.verificandoUsername = true;
        return $http.put('::users/usernames-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.username_match = r.data.usernames;
          $scope.verificandoUsername = false;
          return $scope.username_match.map(function(item) {
            return item.username;
          });
        });
      };
      $scope.resetPass = function(row) {
        var modalInstance;
        if (!row.user_id) {
          toastr.warning('Aún no tiene usuario');
          return;
        }
        modalInstance = $modal.open({
          templateUrl: App.views + 'usuarios/resetPass.tpl.html',
          controller: 'ResetPassCtrl',
          resolve: {
            usuario: function() {
              return row;
            }
          }
        });
        return modalInstance.result.then(function(user) {});
      };
      //console.log 'Resultado del modal: ', user
      $scope.set_estado_next_matricula = function(row) {
        var datos,
    faltan,
    frase,
    i,
    len,
    ref,
    requisito,
    res;
        if ($scope.matriculando) {
          return;
        }
        if (!$scope.dato.grupo_prematr) {
          toastr.warning('Debe seleccionar el grupo');
          return;
        }
        if (row.next_year.estado === 'MATR') {
          faltan = 0;
          ref = $scope.matriculas[0].requisitos;
          for (i = 0, len = ref.length; i < len; i++) {
            requisito = ref[i];
            if (requisito.estado === 'falta') {
              faltan = faltan + 1;
            }
          }
          if (faltan > 0) {
            frase = faltan === 1 ? faltan + ' requisito.' : faltan + ' requisitos. ';
            res = confirm('A este estudiante aún le falta por cumplir ' + frase + ' ¿Desea matricular de todos modos?');
            if (res) {
              console.log($scope.alumno.next_year.estado,
    $scope.alumno.next_year.estado_ant);
            } else {
              $scope.alumno.next_year.estado = $scope.alumno.next_year.estado_ant;
              return;
            }
          }
        }
        $scope.matriculando = true;
        datos = {
          matricula_id: row.next_year.matricula_id,
          alumno_id: row.alumno_id,
          grupo_id: $scope.dato.grupo_prematr.id,
          year_id: row.next_year.year_id,
          estado: row.next_year.estado
        };
        return $http.put('::matriculas/prematricular',
    datos).then(function(r) {
          toastr.success('Cambios guardados');
          $scope.matriculando = false;
          r.data.matricula.prematriculado = r.data.matricula.prematriculado ? new Date(r.data.matricula.prematriculado.replace(/-/g,
    '\/')) : r.data.matricula.prematriculado;
          $scope.alumno.next_year = r.data.matricula;
          $scope.alumno.next_year.estado_ant = $scope.alumno.next_year.estado;
          return $timeout(function() {
            return $scope.$apply();
          },
    100);
        },
    function(r2) {
          toastr.error('Tal vez no existe el ' + ($scope.USER.year + 1),
    'Problema');
          return $scope.matriculando = false;
        });
      };
      //Ya puedo borrar:
      $scope.quitarPrematricula = function(row) {
        var datos;
        if ($scope.prematriculando) {
          return;
        }
        $scope.prematriculando = true;
        datos = {
          matricula_id: row.next_year.matricula_id
        };
        return $http.put('::matriculas/quitar-prematricula',
    datos).then(function(r) {
          toastr.success('Matrícula quitada');
          $scope.prematriculando = false;
          return $scope.alumno.next_year = {};
        },
    function(r2) {
          toastr.error('No se pudo quitar',
    'Problema');
          return $scope.prematriculando = false;
        });
      };
      $scope.cambiarPazysalvo = function(fila) {
        var datos;
        if ($scope.hasRoleOrPerm(['admin',
    'secretario',
    'rector'])) {
          fila.pazysalvo = !fila.pazysalvo;
          if (!fila.alumno_id) {
            fila.alumno_id = fila.id;
          }
          datos = {
            alumno_id: fila.alumno_id,
            propiedad: 'pazysalvo',
            valor: fila.pazysalvo
          };
          return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
            return console.log('Cambios guardados');
          },
    function(r2) {
            fila.pazysalvo = !fila.pazysalvo;
            return toastr.error('Cambio no guardado',
    'Error');
          });
        }
      };
      $scope.guardarCambioRequisito = function(requisito) {
        //if requisito.estado=='Falta' or requisito.estado=='Ya' or requisito.estado=='N/A'
        return $http.post('::requisitos/alumno',
    requisito).then(function(r) {
          return toastr.success('Requisito actualizado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.guardarValor = function(rowEntity,
    colDef,
    newValue,
    year_id) {
        var datos;
        datos = {};
        if (colDef === 'username') {
          if ($scope.username_cambiado) {
            datos.user_id = rowEntity.user_id;
          } else {
            return;
          }
        }
        if (colDef === 'email') {
          datos.user_id = rowEntity.user_id;
          if (newValue.length > 0) {
            if (!window.validateEmail(newValue)) {
              toastr.warning('No es un correo válido');
              return;
            }
          }
        }
        if (!rowEntity.alumno_id) {
          rowEntity.alumno_id = rowEntity.id;
        }
        if (colDef === "sexo") {
          newValue = newValue.toUpperCase();
          if (!(newValue === 'M' || newValue === 'F')) {
            toastr.warning('Debe usar M o F');
            rowEntity.sexo = $scope.alum_copy['sexo'];
            return;
          }
        }
        /*
        if colDef == "fecha_matricula"
          return $scope.cambiarFechaMatricula(rowEntity)
        */
        if (colDef === "tipo_sangre") {
          newValue = newValue.toUpperCase();
          if (!($scope.tipos_sangre.indexOf(newValue) > -1)) {
            toastr.warning('Debe usar: ' + $scope.tipos_sangre.join(' '));
            rowEntity.tipo_sangre = $scope.alum_copy['tipo_sangre'];
            return;
          }
        }
        if (colDef === "estrato") {
          if (newValue < 0 || newValue > 9) {
            toastr.warning('Valor no admitido');
            rowEntity.estrato = $scope.alum_copy['estrato'];
            return;
          }
        }
        if (colDef === "documento") {
          if (newValue.length !== 10 && newValue.length !== 0) {
            toastr.warning('Debe ser de diez dígitos');
            return;
          }
        }
        //rowEntity.documento = oldValue
        datos.alumno_id = rowEntity.alumno_id;
        datos.propiedad = colDef;
        datos.valor = newValue;
        datos.year_id = rowEntity.year_id;
        if (year_id) {
          datos.year_id = year_id;
        }
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          toastr.success('Alumno(a) actualizado con éxito');
          if (colDef === "tipo_sangre") {
            return $scope.alumno.tipo_sangre = newValue;
          }
        },
    function(r2) {
          rowEntity[colDef] = $scope.alum_copy[colDef];
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.guardarValorEnfermeria = function(enferm,
    propiedad,
    newValue) {
        var datos;
        datos = {};
        datos.antec_id = enferm.id;
        datos.propiedad = propiedad;
        datos.valor = newValue;
        return $http.put('::enfermeria/guardar-valor',
    datos).then(function(r) {
          return toastr.success('Enfermería actualizada');
        },
    function(r2) {
          //rowEntity[colDef] = $scope.alum_copy[colDef]
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.verTodosLosCertificados = function() {
        return $state.go('panel.persona.ver_todos_los_certificados',
    {
          alumno_id: $scope.alumno.alumno_id
        },
    {
          reload: true
        });
      };
      $scope.agregarAcudiente = function() {
        var modalInstance;
        delete $rootScope.acudiente_cambiar;
        $scope.alumno.parientes = $scope.gridOptionsAcudientes.data;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/newAcudienteModal.tpl.html',
          controller: 'NewAcudienteModalCtrl',
          resolve: {
            alumno: function() {
              return $scope.alumno;
            },
            paises: function() {
              return $scope.paises;
            },
            tipos_doc: function() {
              return $scope.tipos_doc;
            },
            parentescos: function() {
              return $scope.parentescos;
            }
          }
        });
        return modalInstance.result.then(function(acud) {
          return $scope.gridOptionsAcudientes.data.splice($scope.alumno.parientes.length - 1,
    0,
    acud);
        },
    function() {});
      };
      // nada
      $scope.cambiarAcudiente = function(acudiente) {
        var modalInstance;
        $rootScope.acudiente_cambiar = acudiente;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/newAcudienteModal.tpl.html',
          controller: 'NewAcudienteModalCtrl',
          resolve: {
            alumno: function() {
              return $scope.alumno;
            },
            paises: function() {
              return $scope.paises;
            },
            tipos_doc: function() {
              return $scope.tipos_doc;
            },
            parentescos: function() {
              return $scope.parentescos;
            }
          }
        });
        return modalInstance.result.then(function(acud) {
          var i,
    indice,
    len,
    pariente,
    ref,
    results;
          ref = $scope.gridOptionsAcudientes.data;
          results = [];
          for (indice = i = 0, len = ref.length; i < len; indice = ++i) {
            pariente = ref[indice];
            if (pariente) {
              if (pariente.id === acudiente.id) {
                results.push($scope.gridOptionsAcudientes.data.splice(indice,
    1,
    acud));
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        },
    function() {});
      };
      // nada
      $scope.quitarAcudiente = function(acudiente) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/quitarAcudienteModalConfirm.tpl.html',
          controller: 'QuitarAcudienteModalConfirmCtrl',
          resolve: {
            alumno: function() {
              return $scope.alumno;
            },
            acudiente: function() {
              return acudiente;
            }
          }
        });
        return modalInstance.result.then(function(acud) {
          var i,
    indice,
    len,
    pariente,
    ref,
    results;
          ref = $scope.gridOptionsAcudientes.data;
          results = [];
          for (indice = i = 0, len = ref.length; i < len; indice = ++i) {
            pariente = ref[indice];
            if (pariente) {
              if (pariente.id === acud.acudiente_id) {
                results.push($scope.gridOptionsAcudientes.data.splice(indice,
    1));
              } else {
                results.push(void 0);
              }
            } else {
              results.push(void 0);
            }
          }
          return results;
        },
    function() {});
      };
    }
  // nada
  ]).controller('RemoveSucesoCtrl', [
    '$scope',
    '$uibModalInstance',
    'elemento',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    elemento,
    $http,
    toastr,
    App) {
      $scope.elemento = elemento;
      //$scope.perfilPath 	= App.images+'perfil/'
      $scope.ok = function() {
        $http.delete('::enfermeria/destroy/' + elemento.id).then(function(r) {
          return toastr.success('Suceso eliminado.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo eliminar.',
    'Problema');
        });
        return $modalInstance.close(elemento);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//PersonaCtrl.js.map
