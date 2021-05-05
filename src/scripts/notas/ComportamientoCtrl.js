(function() {
  angular.module('myvcFrontApp').controller('ComportamientoCtrl', [
    '$scope',
    '$filter',
    '$state',
    'comportamiento',
    '$uibModal',
    'App',
    '$http',
    'AuthService',
    'toastr',
    'EscalasValorativasServ',
    function($scope,
    $filter,
    $state,
    comportamiento,
    $modal,
    App,
    $http,
    AuthService,
    toastr,
    EscalasValorativasServ) {
      var alumno,
    i,
    len,
    ref;
      AuthService.verificar_acceso();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.profesor_id = localStorage.profesor_id;
      $scope.frases = comportamiento[0];
      $scope.alumnos = comportamiento[1];
      $scope.grupo = comportamiento[2];
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.tipos = [
        {
          tipo_frase: 'Todas'
        },
        {
          tipo_frase: 'Debilidad'
        },
        {
          tipo_frase: 'Amenaza'
        },
        {
          tipo_frase: 'Oportunidad'
        },
        {
          tipo_frase: 'Fortaleza'
        }
      ];
      EscalasValorativasServ.escalas().then(function(r) {
        $scope.escalas = r;
        return $scope.escala_maxima = EscalasValorativasServ.escala_maxima();
      },
    function(r2) {
        return console.log('No se trajeron las escalas valorativas',
    r2);
      });
      $scope.fraseCheck = function(texto) {
        $scope.verificandoFrase = true;
        return $http.put('::nota_comportamiento/frases-check',
    {
          texto: texto
        }).then(function(r) {
          $scope.frases_match = r.data.frases;
          $scope.verificandoFrase = false;
          return $scope.frases_match.map(function(item) {
            return item.frase;
          });
        });
      };
      
      //###############################
      // LIBRO ROJO
      $scope.comprobadorLibro = function(alumno) {
        // para el badge
        alumno.libro.per1_conta = 0;
        alumno.libro.per1_conta = alumno.libro.per1_col1 ? alumno.libro.per1_conta + 1 : alumno.libro.per1_conta;
        alumno.libro.per1_conta = alumno.libro.per1_col2 ? alumno.libro.per1_conta + 1 : alumno.libro.per1_conta;
        alumno.libro.per1_conta = alumno.libro.per1_col3 ? alumno.libro.per1_conta + 1 : alumno.libro.per1_conta;
        alumno.libro.per2_conta = 0;
        alumno.libro.per2_conta = alumno.libro.per2_col1 ? alumno.libro.per2_conta + 1 : alumno.libro.per2_conta;
        alumno.libro.per2_conta = alumno.libro.per2_col2 ? alumno.libro.per2_conta + 1 : alumno.libro.per2_conta;
        alumno.libro.per2_conta = alumno.libro.per2_col3 ? alumno.libro.per2_conta + 1 : alumno.libro.per2_conta;
        alumno.libro.per3_conta = 0;
        alumno.libro.per3_conta = alumno.libro.per3_col1 ? alumno.libro.per3_conta + 1 : alumno.libro.per3_conta;
        alumno.libro.per3_conta = alumno.libro.per3_col2 ? alumno.libro.per3_conta + 1 : alumno.libro.per3_conta;
        alumno.libro.per3_conta = alumno.libro.per3_col3 ? alumno.libro.per3_conta + 1 : alumno.libro.per3_conta;
        alumno.libro.per4_conta = 0;
        alumno.libro.per4_conta = alumno.libro.per4_col1 ? alumno.libro.per4_conta + 1 : alumno.libro.per4_conta;
        alumno.libro.per4_conta = alumno.libro.per4_col2 ? alumno.libro.per4_conta + 1 : alumno.libro.per4_conta;
        return alumno.libro.per4_conta = alumno.libro.per4_col3 ? alumno.libro.per4_conta + 1 : alumno.libro.per4_conta;
      };
      ref = $scope.alumnos;
      for (i = 0, len = ref.length; i < len; i++) {
        alumno = ref[i];
        alumno.periodoLibro = 1; // Cambiar por el USER.periodo
        $scope.comprobadorLibro(alumno);
      }
      $scope.selectPeriodo = function(per,
    alum) {
        return alum.periodoLibro = per;
      };
      $scope.cambiaLibro = function(valor,
    alum,
    campo) {
        return $http.put('::nota_comportamiento/guardar-libro',
    {
          valor: valor,
          campo: campo,
          libro_id: alum.libro.id
        }).then(function(r) {
          $scope.comprobadorLibro(alum);
          return toastr.success('Cambios guardados');
        },
    function(item) {
          return toastr.error('Error guardando libro');
        });
      };
      
      //###############################
      // Comportamiento boletín
      $scope.addFrase = function(alumno) {
        var dato;
        alumno.agregando_frase = true;
        if (alumno.newfrase) {
          dato = {
            comportamiento_id: alumno.nota.id,
            frase_id: alumno.newfrase.id
          };
          return $http.post('::definiciones_comportamiento/store',
    dato).then(function(r) {
            toastr.success('Frase agregada con éxito');
            alumno.newfrase.definicion_id = r.data.id;
            alumno.definiciones.push(alumno.newfrase);
            alumno.newfrase = null;
            return alumno.agregando_frase = false;
          },
    function(r2) {
            toastr.error('No se pudo agregar la frase',
    'Problema');
            return alumno.agregando_frase = false;
          });
        } else {
          toastr.warning('Debe seleccionar frase');
        }
      };
      $scope.addFraseEscrita = function(alumno) {
        var dato;
        alumno.agregando_frase = true;
        if (alumno.newfrase_escrita !== '') {
          dato = {
            comportamiento_id: alumno.nota.id,
            frase: alumno.newfrase_escrita
          };
          return $http.post('::definiciones_comportamiento/store-escrita',
    dato).then(function(r) {
            toastr.success('Frase agregada con éxito');
            alumno.newfrase_escrita = '';
            alumno.definiciones.push(r.data);
            return alumno.agregando_frase = false;
          },
    function(r2) {
            toastr.error('No se pudo agregar la frase',
    'Problema');
            return alumno.agregando_frase = false;
          });
        } else {
          toastr.warning('Debe escribir la frase');
        }
      };
      $scope.cambiaNota = function(nota) {
        var temp;
        temp = nota.nota;
        return $http.put('::nota_comportamiento/update/' + nota.id,
    {
          nota: nota.nota
        }).then(function(r) {
          return toastr.success('Nota cambiada: ' + nota.nota);
        },
    function(r2) {
          toastr.error('No pudimos guardar la nota ' + nota.nota);
          return nota.nota = temp;
        });
      };
      return $scope.quitarFrase = function(definicion,
    alumno) {
        var defin_id;
        defin_id = definicion.definicion_id ? definicion.definicion_id : definicion.id;
        return $http.delete('::definiciones_comportamiento/destroy/' + defin_id).then(function(r) {
          toastr.success('Definicion quitada');
          if (definicion.definicion_id) {
            return alumno.definiciones = $filter('filter')(alumno.definiciones,
    {
              definicion_id: '!' + defin_id
            });
          } else {
            return alumno.definiciones = $filter('filter')(alumno.definiciones,
    {
              id: '!' + defin_id
            });
          }
        },
    function(r2) {
          return toastr.error('No pudimos quitar frase',
    'Problema');
        });
      };
    }
  ]).filter('porTipoFrase', [
    function() {
      return function(input,
    tipo_frase) {
        var frase,
    i,
    len,
    resultado;
        if (tipo_frase === 'Todas' || tipo_frase === void 0) {
          return input;
        }
        resultado = [];
        for (i = 0, len = input.length; i < len; i++) {
          frase = input[i];
          if (tipo_frase === frase.tipo_frase) {
            resultado.push(frase);
          }
        }
        return resultado;
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=ComportamientoCtrl.js.map
