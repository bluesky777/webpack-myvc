(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('PrematriculasCtrl', [
    '$scope',
    'App',
    '$rootScope',
    '$state',
    '$interval',
    'uiGridConstants',
    'uiGridEditConstants',
    '$uibModal',
    '$filter',
    'AuthService',
    'toastr',
    '$http',
    'DownloadServ',
    'Upload',
    'Acentos',
    function($scope,
    App,
    $rootScope,
    $state,
    $interval,
    uiGridConstants,
    uiGridEditConstants,
    $modal,
    $filter,
    AuthService,
    toastr,
    $http,
    DownloadServ,
    Upload,
    Acentos) {
      var append3,
    appendPopover,
    appendPopover1,
    appendPopover2,
    bt2,
    btCiudadDoc,
    btEditUsername,
    btGrid1,
    btGrid2,
    btIsEgresado,
    btIsNuevo,
    btIsRepitente,
    /* ---------------- ---------------- ---------------- ---------------- ----------------
    Alumnos del año pasado Grid
    ---------------- ---------------- ---------------- ---------------- ---------------- */
    btMatr0,
    btMatr1,
    btMatr2,
    btMatr3,
    btMatrCom,
    btMatricular,
    btPazysalvo,
    btTipoDoc,
    btUsuario,
    gridFooterCartera;
      AuthService.verificar_acceso();
      if (AuthService.hasRoleOrPerm('Profesor') && !$scope.USER.profes_can_edit_alumnos) {
        toastr.warning('No tienes permiso para editar alumnos');
        $state.transitionTo('panel');
      }
      //$scope.$parent.bigLoader			= true
      $scope.dato = {};
      $scope.dato.mostrartoolgrupo = true;
      $scope.gridScope = $scope; // Para getExternalScopes de ui-Grid
      $scope.views = App.views;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.year_ant = $scope.USER.year - 1;
      $scope.gridOptions = {};
      $scope.gridOptionsSinMatricula = {};
      $scope.paises = [];
      $scope.tipos_sangre = App.tipos_sangre;
      $scope.mostrar_pasado = true;
      $scope.mostrar_retirados = false;
      $scope.texto_a_buscar = '';
      $scope.hombresGrupo = 0;
      $scope.mujeresGrupo = 0;
      $scope.parentescos = App.parentescos;
      $scope.dato.grupo = '';
      $http.get('::grupos/con-paises-tipos-next-year').then(function(r) {
        var asiste,
    cant_cupo,
    cant_matr,
    faltan,
    formus,
    grup,
    grupo,
    i,
    j,
    len,
    len1,
    matr_grupo,
    matris,
    ref,
    ref1,
    sin_matr;
        matr_grupo = 0;
        if (localStorage.matr_grupo_premat) {
          matr_grupo = parseInt(localStorage.matr_grupo_premat);
        }
        $scope.grupos = r.data.grupos;
        $scope.paises = r.data.paises;
        $scope.tipos_doc = r.data.tipos_doc;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grupo = ref[i];
          if (parseInt(grupo.id) === parseInt(matr_grupo)) {
            $scope.dato.grupo = grupo;
            $scope.selectGrupo($scope.dato.grupo);
          }
        }
        cant_matr = 0;
        sin_matr = 0;
        cant_cupo = 0;
        faltan = 0;
        formus = 0;
        matris = 0;
        asiste = 0;
        ref1 = $scope.grupos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          grup = ref1[j];
          cant_matr += grup.cantidad;
          sin_matr += grup.sin_matricular;
          cant_cupo += grup.cupo;
          faltan += grup.cant_faltantes;
          formus += grup.cant_formularios;
          matris += grup.cant_matriculados;
          asiste += grup.cant_asistentes;
          grup.active = false;
        }
        $scope.total_prematriculados = cant_matr;
        $scope.total_sin_prematric = sin_matr;
        $scope.total_cupo = cant_cupo;
        $scope.total_taltantes = faltan;
        $scope.total_formularios = formus;
        $scope.total_matriculados = matris;
        return $scope.total_asistentes = asiste;
      });
      //$scope.$parent.bigLoader 	= false
      $scope.selectGrupo = function(grupo) {
        var cant_matr,
    grado_ant_id,
    grup,
    grupos_ant,
    i,
    j,
    len,
    len1,
    ref,
    ref1,
    sin_matr;
        localStorage.matr_grupo_premat = grupo.id;
        $scope.dato.grupo = grupo;
        cant_matr = 0;
        sin_matr = 0;
        ref = $scope.grupos;
        for (i = 0, len = ref.length; i < len; i++) {
          grup = ref[i];
          cant_matr += grup.cantidad;
          sin_matr += grup.sin_matricular;
          grup.active = false;
        }
        $scope.total_prematriculados = cant_matr;
        $scope.total_sin_prematric = sin_matr;
        grupo.active = true;
        // Traer alumnos
        grupos_ant = [];
        ref1 = $scope.grupos;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          grup = ref1[j];
          if (grup.orden_grado === (grupo.orden_grado - 1)) {
            grupos_ant.push(grup);
          }
        }
        // Quería mandar los grupos anteriores, pero solo voy a mandar el grado_id
        if (grupos_ant.length > 0) {
          grado_ant_id = grupos_ant[0].grado_id;
        } else {
          grado_ant_id = null;
        }
        $scope.traerAlumnnosConGradosAnterior = function() {
          return $http.put("::prematriculas/alumnos-con-grado-anterior",
    {
            grupo_actual: grupo,
            grado_ant_id: grado_ant_id,
            year_ant: $scope.year_ant
          }).then(function(r) {
            var alumno,
    k,
    l,
    len2,
    len3,
    len4,
    len5,
    m,
    n,
    pariente,
    ref2,
    ref3,
    ref4,
    ref5,
    results,
    tipo_doc;
            $scope.gridOptions.data = r.data.AlumnosActuales;
            $scope.gridOptionsSinMatricula.data = r.data.AlumnosSinMatricula;
            $scope.AlumnosFormularios = r.data.AlumnosFormularios;
            $scope.AlumnosPrematriculadosA = r.data.AlumnosPrematriculadosA;
            ref2 = $scope.gridOptions.data;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              alumno = ref2[k];
              //console.log alumno.fecha_retiro, new Date(alumno.fecha_retiro.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
              alumno.estado_ant = alumno.estado;
              alumno.fecha_retiro_ant = alumno.fecha_retiro;
              alumno.fecha_retiro = alumno.fecha_retiro ? new Date(alumno.fecha_retiro.replace(/-/g,
    '\/')) : alumno.fecha_retiro;
              alumno.fecha_matricula_ant = alumno.fecha_matricula;
              alumno.fecha_matricula = alumno.fecha_matricula ? new Date(alumno.fecha_matricula.replace(/-/g,
    '\/')) : alumno.fecha_matricula;
              alumno.premarticulado_ant = alumno.prematriculado;
              alumno.prematriculado = alumno.prematriculado ? new Date(alumno.prematriculado.replace(/-/g,
    '\/')) : alumno.prematriculado;
              ref3 = $scope.tipos_doc;
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                tipo_doc = ref3[l];
                if (tipo_doc.id === alumno.tipo_doc) {
                  alumno.tipo_doc = tipo_doc;
                }
              }
              ref4 = alumno.subGridOptions.data;
              for (m = 0, len4 = ref4.length; m < len4; m++) {
                pariente = ref4[m];
                pariente.fecha_nac_ant = pariente.fecha_nac;
                pariente.fecha_nac = pariente.fecha_nac ? new Date(pariente.fecha_nac.replace(/-/g,
    '\/')) : pariente.fecha_nac;
              }
              alumno.subGridOptions.onRegisterApi = function(gridApi) {
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
                  }
                  return $scope.$apply();
                });
              };
            }
            ref5 = $scope.gridOptionsSinMatricula.data;
            results = [];
            for (n = 0, len5 = ref5.length; n < len5; n++) {
              alumno = ref5[n];
              //console.log alumno.fecha_retiro, new Date(alumno.fecha_retiro.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
              alumno.estado_ant = alumno.estado;
              alumno.fecha_retiro_ant = alumno.fecha_retiro;
              alumno.fecha_retiro = alumno.fecha_retiro ? new Date(alumno.fecha_retiro.replace(/-/g,
    '\/')) : alumno.fecha_retiro;
              alumno.fecha_matricula_ant = alumno.fecha_matricula;
              results.push(alumno.fecha_matricula = alumno.fecha_matricula ? new Date(alumno.fecha_matricula.replace(/-/g,
    '\/')) : alumno.fecha_matricula);
            }
            return results;
          });
        };
        return $scope.traerAlumnnosConGradosAnterior();
      };
      $scope.editar = function(row) {
        return $state.go('panel.alumnos.editar',
    {
          alumno_id: row.alumno_id
        });
      };
      $scope.eliminar = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/removeAlumno.tpl.html',
          controller: 'RemoveAlumnoCtrl',
          resolve: {
            alumno: function() {
              return row;
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
      $scope.agregarAcudiente = function(rowAlum) {
        var modalInstance;
        delete $rootScope.acudiente_cambiar;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/newAcudienteModal.tpl.html',
          controller: 'NewAcudienteModalCtrl',
          resolve: {
            alumno: function() {
              return rowAlum;
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
          return rowAlum.subGridOptions.data.splice(rowAlum.subGridOptions.data.length - 1,
    0,
    acud);
        },
    function() {});
      };
      // nada
      $scope.cambiarAcudiente = function(rowAlum,
    acudiente) {
        var modalInstance;
        $rootScope.acudiente_cambiar = acudiente;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/newAcudienteModal.tpl.html',
          controller: 'NewAcudienteModalCtrl',
          resolve: {
            alumno: function() {
              return rowAlum;
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
          ref = rowAlum.subGridOptions.data;
          results = [];
          for (indice = i = 0, len = ref.length; i < len; indice = ++i) {
            pariente = ref[indice];
            if (pariente) {
              if (pariente.id === acudiente.id) {
                results.push(rowAlum.subGridOptions.data.splice(indice,
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
      $scope.restaurar = function(row) {
        $scope.restaurando = true;
        return $http.put('::alumnos/restore/' + row.alumno_id).then(function(r) {
          toastr.success('Alumno restaurado, para verlo, debe recargar la página');
          $scope.restaurando = false;
          return row.restaurado = true;
        },
    function(r2) {
          toastr.error('Alumno no restaurado',
    'Error');
          return $scope.restaurando = false;
        });
      };
      $scope.quitarAcudiente = function(rowAlum,
    acudiente) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/quitarAcudienteModalConfirm.tpl.html',
          controller: 'QuitarAcudienteModalConfirmCtrl',
          resolve: {
            alumno: function() {
              return rowAlum;
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
          ref = rowAlum.subGridOptions.data;
          results = [];
          for (indice = i = 0, len = ref.length; i < len; indice = ++i) {
            pariente = ref[indice];
            if (pariente) {
              if (pariente.id === acud.id) {
                results.push(rowAlum.subGridOptions.data.splice(indice,
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
      // nada
      $scope.cantidadDeudores = function() {
        var alumno,
    hombres,
    i,
    len,
    mujeres,
    ref,
    sum;
        sum = 0;
        hombres = 0;
        mujeres = 0;
        if ($scope.gridOptions.data) {
          ref = $scope.gridOptions.data;
          for (i = 0, len = ref.length; i < len; i++) {
            alumno = ref[i];
            if (!alumno.pazysalvo) {
              sum = sum + 1;
            }
            if (alumno.sexo === 'M') {
              hombres++;
            } else {
              mujeres++;
            }
          }
        }
        $scope.hombresGrupo = hombres;
        $scope.mujeresGrupo = mujeres;
        return sum;
      };
      $scope.crear_alumno = function() {
        $rootScope.grupos_siguientes = $scope.grupos;
        return $state.go('panel.prematriculas.nuevo');
      };
      $scope.cambiarCiudad = function(row,
    tipo_ciudad) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/cambiarCiudadModal.tpl.html',
          controller: 'CambiarCiudadModalCtrl',
          resolve: {
            persona: function() {
              return row;
            },
            paises: function() {
              return $scope.paises;
            },
            tipo_ciudad: function() {
              return tipo_ciudad;
            },
            tipo_persona: function() {
              if (row.subGridOptions) {
                return 'alumno';
              } else {
                return 'acudiente';
              }
            }
          }
        });
        return modalInstance.result.then(function(alum) {
          return row = alum;
        });
      };
      $scope.cambiarPazysalvo = function(fila) {
        var datos;
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
      };
      $scope.toggleNuevo = function(fila) {
        var datos;
        fila.nuevo = !fila.nuevo;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'nuevo',
          valor: fila.nuevo
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
      $scope.toggleRepitente = function(fila) {
        var datos;
        fila.repitente = !fila.repitente;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'repitente',
          valor: fila.repitente
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          fila.repitente = !fila.repitente;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.toggleEgresado = function(fila) {
        var datos;
        fila.egresado = !fila.egresado;
        if (!fila.alumno_id) {
          fila.alumno_id = fila.id;
        }
        datos = {
          alumno_id: fila.alumno_id,
          propiedad: 'egresado',
          valor: fila.egresado
        };
        return $http.put('::alumnos/guardar-valor',
    datos).then(function(r) {
          return console.log('Cambios guardados');
        },
    function(r2) {
          fila.egresado = !fila.egresado;
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.crearUsuario = function(row) {
        if (row.user_id) {
          toastr.warning('Ya tiene usuario');
          return;
        }
        if (row.tipo === 'Acudiente') {
          if (!row.id) {
            toastr.info('Solo con acudientes creados');
            return;
          }
          $http.post('::acudientes/crear-usuario',
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
        }
        if (row.tipo !== 'Acudiente') {
          return toastr.info('Aquí solo puede crear usuario de acudiente',
    'Lo sentimos');
        }
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
      $scope.cambiaUsernameCheck = function(texto) {
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
      $scope.eliminarMatricula = function(row) {
        return $http.delete('::matriculas/destroy/' + row.matricula_id).then(function(r) {
          row.currentyear = 0;
          toastr.success('Alumno desmatriculado');
          return row;
        },
    function(r2) {
          return toastr.error('No se pudo desmatricular',
    'Problema');
        });
      };
      btGrid1 = '<a uib-tooltip="Editar" tooltip-placement="left" class="btn btn-default btn-xs shiny icon-only info" ng-click="grid.appScope.editar(row.entity)"><i class="fa fa-edit "></i></a>';
      btGrid2 = '';
      //btGrid2 = '<a uib-tooltip="X Eliminar" tooltip-placement="right" class="btn btn-default btn-xs shiny icon-only danger" ng-click="grid.appScope.eliminar(row.entity)"><i class="fa fa-trash "></i></a>'
      bt2 = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 + btGrid2 + '</span>';
      btMatricular = "==directives/botonesPrematricularMas.tpl.html";
      btPazysalvo = "==directives/botonPazysalvo.tpl.html";
      btIsNuevo = "==directives/botonIsNuevo.tpl.html";
      btIsRepitente = "==directives/botonIsRepitente.tpl.html";
      btIsEgresado = "==directives/botonIsEgresado.tpl.html";
      btUsuario = "==directives/botonesResetPassword.tpl.html";
      btCiudadDoc = "==directives/botonCiudadDoc.tpl.html";
      btTipoDoc = "==directives/botonTipoDoc.tpl.html";
      btEditUsername = "==alumnos/botonEditUsername.tpl.html";
      appendPopover1 = "'==alumnos/popoverAlumnoGrid.tpl.html'";
      appendPopover2 = "'mouseenter'";
      append3 = "' '";
      appendPopover = 'uib-popover-template="views+' + appendPopover1 + '" popover-trigger="' + appendPopover2 + '" popover-title="{{ row.entity.nombres + ' + append3 + ' + row.entity.apellidos }}" popover-popup-delay="500" popover-append-to-body="true"';
      gridFooterCartera = "==alumnos/gridFooterCartera.tpl.html";
      $scope.gridOptions = {
        showGridFooter: true,
        showColumnFooter: true,
        gridFooterTemplate: gridFooterCartera,
        enableSorting: true,
        enableFiltering: true,
        exporterSuppressColumns: ['edicion'],
        exporterCsvColumnSeparator: ';',
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: "Alumnos - MyVC.csv",
        enableGridMenu: true,
        enebleGridColumnMenu: false,
        enableCellEditOnFocus: true,
        expandableRowTemplate: '==alumnos/expandableRowTemplate.tpl.html',
        expandableRowHeight: 120,
        expandableRowScope: {
          agregarAcudiente: $scope.agregarAcudiente,
          quitarAcudiente: $scope.quitarAcudiente,
          cambiarAcudiente: $scope.cambiarAcudiente,
          crearUsuario: $scope.crearUsuario,
          resetPass: $scope.resetPass,
          cambiarCiudad: $scope.cambiarCiudad,
          cambiaUsernameCheck: $scope.cambiaUsernameCheck
        },
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
            name: 'edicion',
            displayName: 'Edit',
            width: 54,
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: bt2,
            enableCellEdit: false,
            enableColumnMenu: true
          },
          {
            field: 'sexo',
            displayName: 'Sex',
            width: 40
          },
          {
            field: 'grupo_id',
            displayName: 'Matrícula',
            enableCellEdit: false,
            cellTemplate: btMatricular,
            minWidth: 270,
            enableFiltering: false
          },
          {
            field: 'prematriculado',
            displayName: 'Fech prematriculado',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 120
          },
          {
            field: 'fecha_matricula',
            displayName: 'Fecha matrícula',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 100
          },
          {
            field: 'no_matricula',
            displayName: '# matrícula',
            minWidth: 80,
            enableColumnMenu: true
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
            field: 'deuda',
            displayName: 'Deuda',
            type: 'number',
            cellFilter: 'currency:"$":0',
            minWidth: 70
          },
          {
            field: 'pazysalvo',
            displayName: 'A paz?',
            cellTemplate: btPazysalvo,
            minWidth: 60,
            enableCellEdit: false
          },
          {
            field: 'nuevo',
            displayName: 'Nuevo?',
            cellTemplate: btIsNuevo,
            minWidth: 60,
            enableCellEdit: false
          },
          {
            field: 'repitente',
            displayName: 'Repitente?',
            cellTemplate: btIsRepitente,
            minWidth: 60,
            enableCellEdit: false
          },
          {
            field: 'egresado',
            displayName: 'Egresado?',
            cellTemplate: btIsEgresado,
            minWidth: 60,
            enableCellEdit: false
          },
          {
            field: 'tipo_doc',
            displayName: 'Tipo documento',
            minWidth: 120,
            cellTemplate: btTipoDoc,
            enableCellEdit: false
          },
          {
            field: 'documento',
            minWidth: 100,
            cellFilter: 'formatNumberDocumento'
          },
          {
            field: 'ciudad_doc',
            displayName: 'Ciud Docu',
            minWidth: 120,
            cellTemplate: btCiudadDoc,
            enableCellEdit: false
          }
        ],
        multiSelect: false,
        //filterOptions: $scope.filterOptions,
        exporterHeaderFilter: function(displayName) {
          if (displayName === 'A paz?') {
            return 'Paz y salvo';
          } else if (displayName === 'Matrícula') {
            return 'Grupo';
          } else {
            return displayName;
          }
        },
        exporterFieldCallback: function(grid,
    row,
    col,
    input) {
          if (col.name === 'no') {
            return grid.renderContainers.body.visibleRowCache.indexOf(row) + 1;
          }
          if (col.name === 'grupo_id') {
            return $scope.dato.grupo.nombre;
          }
          if (col.name === 'ciudad_nac') {
            return row.entity.ciudad_nac_nombre;
          }
          if (col.name === 'pazysalvo' || col.name === 'nuevo') {
            if (input) {
              return 'Si';
            } else {
              return 'No';
            }
          } else if (col.name === 'tipo_doc') {
            if (input) {
              if (input.tipo) {
                return input.tipo;
              } else {
                return input;
              }
            } else {
              return input;
            }
          } else {
            return input;
          }
        },
        onRegisterApi: function(gridApi) {
          $scope.gridApi = gridApi;
          return gridApi.edit.on.afterCellEdit($scope,
    function(rowEntity,
    colDef,
    newValue,
    oldValue) {
            if (newValue !== oldValue) {
              if (!rowEntity.alumno_id) {
                rowEntity.alumno_id = fila.id;
              }
              if (colDef.field === "sexo") {
                newValue = newValue.toUpperCase();
                if (!(newValue === 'M' || newValue === 'F')) {
                  toastr.warning('Debe usar M o F');
                  rowEntity.sexo = oldValue;
                  return;
                }
              }
              if (colDef.field === "fecha_matricula") {
                return $scope.cambiarFechaMatricula(rowEntity);
              }
              if (colDef.field === "tipo_sangre") {
                newValue = newValue.toUpperCase();
                if (!($scope.tipos_sangre.indexOf(newValue) > -1)) {
                  toastr.warning('Debe usar: ' + $scope.tipos_sangre.join(' '));
                  rowEntity.tipo_sangre = oldValue;
                  return;
                }
              }
              if (colDef.field === "estrato") {
                if (newValue < 0 || newValue > 9) {
                  toastr.warning('Valor no admitido');
                  rowEntity.estrato = oldValue;
                  return;
                }
              }
              if (colDef.field === "documento") {
                if (newValue.length !== 10 && newValue.length !== 0) {
                  toastr.warning('Debe ser de diez dígitos');
                  return;
                }
              }
              //rowEntity.documento = oldValue
              $http.put('::alumnos/guardar-valor',
    {
                alumno_id: rowEntity.alumno_id,
                propiedad: colDef.field,
                valor: newValue
              }).then(function(r) {
                return toastr.success('Alumno(a) actualizado con éxito');
              },
    function(r2) {
                rowEntity[colDef.field] = oldValue;
                return toastr.error('Cambio no guardado',
    'Error');
              });
            }
            return $scope.$apply();
          });
        }
      };
      btMatr0 = '<label ng-click="grid.appScope.setPrematriculado(row.entity)" uib-tooltip="Prematricular" tooltip-append-to-body="true" class="btn btn-success shiny btn-xs">Prem</label>';
      btMatr1 = '<label ng-click="grid.appScope.setNewAsistente(row.entity)" uib-tooltip="Inscribir como asistente" tooltip-append-to-body="true" class="btn btn-success shiny btn-xs">Asis</label>';
      btMatr2 = '<label ng-click="grid.appScope.matricularUno(row.entity, true)" uib-tooltip="Matricular" tooltip-append-to-body="true" tooltip-popup-delay="1000" class="btn btn-success shiny btn-xs">Matric</label>';
      btMatr3 = '<label ng-click="grid.appScope.matricularEn(row.entity)" uib-tooltip="Prematricular en..." tooltip-append-to-body="true" tooltip-placement="right" class="btn btn-success shiny btn-xs">Otro grupo...</label>';
      btMatrCom = '<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btMatr0 + btMatr1 + btMatr2 + btMatr3 + '</span>';
      $scope.gridOptionsSinMatricula = {
        showGridFooter: true,
        enableSorting: true,
        enableFiltering: true,
        columnDefs: [
          {
            field: 'no',
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>',
            width: 40
          },
          {
            field: 'nombres',
            minWidth: 120,
            filter: {
              condition: function(searchTerm,
          cellValue,
          row) {
                var entidad;
                entidad = row.entity;
                return entidad.nombres.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
              }
            },
            enableHiding: false,
            cellTemplate: '<div class="ui-grid-cell-contents" style="padding: 0px;" ' + appendPopover + '><img ng-src="{{grid.appScope.perfilPath + row.entity.foto_nombre}}" style="width: 35px" />{{row.entity.nombres}}</div>'
          },
          {
            field: 'apellidos',
            minWidth: 80,
            filter: {
              condition: uiGridConstants.filter.CONTAINS
            }
          },
          {
            field: 'sexo',
            displayName: 'Sex',
            width: 40
          },
          {
            field: 'grupo_id',
            displayName: 'Matrícula',
            cellTemplate: btMatrCom,
            minWidth: 230,
            enableFiltering: false
          },
          {
            field: 'fecha_matricula',
            displayName: 'Fecha matrícula',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 100
          },
          {
            field: 'no_matricula',
            displayName: '# matrícula',
            minWidth: 80,
            enableColumnMenu: true
          },
          {
            field: 'fecha_nac',
            displayName: 'Nacimiento',
            cellFilter: "date:mediumDate",
            type: 'date',
            minWidth: 100
          }
        ],
        multiSelect: true
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
          year_id: $scope.dato.grupo.year_id
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
          return toastr.error('No se pudo matricular el alumno.',
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
        if (!$scope.dato.grupo.id) {
          toastr.warning('Debes definir el grupo al que vas a matricular.',
    'Falta grupo');
          return;
        }
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
          return toastr.error('No se pudo matricular el alumno.',
    'Error');
        });
      };
      $scope.matricularEn = function(row) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==alumnos/matricularEn.tpl.html',
          controller: 'MatricularEnCtrl',
          resolve: {
            alumno: function() {
              return row;
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
          console.log('Cierra');
          return $scope.traerAlumnnosConGradosAnterior();
        });
      };
      $scope.setAsistente = function(fila) {
        return $http.put('::matriculas/set-asistente',
    {
          matricula_id: fila.matricula_id,
          grupo_id: $scope.dato.grupo.grupo_id
        }).then(function(r) {
          return toastr.success('Guardado como asistente');
        },
    function(r2) {
          return toastr.error('No se pudo guardar como asistente',
    'Error');
        });
      };
      $scope.setPrematriculado = function(fila) {
        return $http.put('::matriculas/prematricular',
    {
          alumno_id: fila.alumno_id,
          grupo_id: $scope.dato.grupo.id
        }).then(function(r) {
          console.log('Cambios guardados');
          return $scope.traerAlumnnosConGradosAnterior();
        },
    function(r2) {
          return toastr.error('No se pudo crear asistente',
    'Error');
        });
      };
      $scope.setNewAsistente = function(fila) {
        return $http.put('::matriculas/set-new-asistente',
    {
          alumno_id: fila.alumno_id,
          grupo_id: $scope.dato.grupo.id
        }).then(function(r) {
          console.log('Cambios guardados');
          return $scope.traerAlumnnosConGradosAnterior();
        },
    function(r2) {
          return toastr.error('No se pudo crear asistente',
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
          return toastr.error('No se pudo guardar la fecha',
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
          return toastr.error('No se pudo guardar la fecha',
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
          return toastr.error('No se pudo desertar',
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
          return toastr.error('No se pudo desmatricular',
    'Problema');
        });
      };
      $scope.buscar_por = function(campo) {
        if ($scope.texto_a_buscar === "") {
          toastr.warning('Escriba término a buscar');
          return;
        }
        return $http.put('::buscar/por-' + campo,
    {
          texto_a_buscar: $scope.texto_a_buscar
        }).then(function(r) {
          return $scope.alumnos_encontrados = r.data;
        },
    function(r2) {
          return toastr.error('No se pudo buscar',
    'Problema');
        });
      };
      $scope.exportarAlumnos = function() {
        return DownloadServ.download('::simat/alumnos-exportar',
    'Alumnos a importar ' + $scope.USER.year + '.xls');
      };
      $scope.importarSimat = function(file,
    errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          file.upload = Upload.upload({
            url: App.Server + 'importar/algo/' + $scope.USER.year,
            data: {
              file: file
            }
          });
          return file.upload.then(function(response) {
            return $timeout(function() {
              return file.result = response.data;
            });
          },
    function(response) {
            if (response.status > 0) {
              return $scope.errorMsg = response.status + ': ' + response.data;
            }
          },
    function(evt) {
            return file.progress = Math.min(100,
    parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      };
      $scope.verObservacionesRequisitos = function() {
        $scope.viendo_requisitos = !$scope.viendo_requisitos;
        if ($scope.viendo_requisitos) {
          return $http.put('::requisitos/listado-observaciones').then(function(r) {
            return $scope.requisitos = r.data.requisitos;
          },
    function() {
            return toastr.error('Error trayendo observaciones de requisitos');
          });
        } else {
          return $scope.viendo_observaciones_requisitos = false;
        }
      };
      $scope.requisitoSeleccionado = function(requisito) {
        $scope.viendo_observaciones_requisitos = true;
        return $scope.alumnos_observaciones = requisito.alumnos_observaciones;
      };
      $scope.guardarCambioRequisito = function(alumno) {
        return $http.post('::requisitos/alumno',
    alumno).then(function(r) {
          return toastr.success('Requisito actualizado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.$on('alumnoguardado',
    function(data,
    alum) {
        return $scope.gridOptions.data.push(alum);
      });
    }
  ]).controller('RemoveAlumnoCtrl', [
    '$scope',
    '$uibModalInstance',
    'alumno',
    '$http',
    'toastr',
    'App',
    function($scope,
    $modalInstance,
    alumno,
    $http,
    toastr,
    App) {
      $scope.alumno = alumno;
      $scope.perfilPath = App.images + 'perfil/';
      $scope.ok = function() {
        $http.delete('::alumnos/destroy/' + alumno.alumno_id).then(function(r) {
          return toastr.success('Alumno enviado a la papelera.',
    'Eliminado');
        },
    function(r2) {
          return toastr.warning('No se pudo enviar a la papelera.',
    'Problema');
        });
        return $modalInstance.close(alumno);
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    }
  ]);

}).call(this);

//PrematriculasCtrl.js.map
