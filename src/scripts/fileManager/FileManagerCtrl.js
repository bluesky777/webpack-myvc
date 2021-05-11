(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('FileManagerCtrl', [
    '$scope',
    'Upload',
    '$timeout',
    '$filter',
    'App',
    '$http',
    'Perfil',
    '$uibModal',
    'resolved_user',
    'toastr',
    'AuthService',
    'ProfesoresServ',
    function($scope,
    $upload,
    $timeout,
    $filter,
    App,
    $http,
    Perfil,
    $modal,
    resolved_user,
    toastr,
    AuthService,
    ProfesoresServ) {
      var fixDato,
    generateThumbAndUpload,
    uploadUsing$upload;
      $scope.USER = resolved_user;
      $scope.subir_intacta = {
        intacta: 'Normal'
      };
      $scope.hasRoleOrPerm = AuthService.hasRoleOrPerm;
      $scope.cantUp = 10; // cantidad de imágenes que pueden subir
      $scope.tabFileManager = 'mis_img'; // 'mis_img' 'imgs_usus'
      $scope.views = App.views;
      $scope.search_alu = '';
      fixDato = function() {
        return $scope.dato = {
          imgUsuario: {
            id: $scope.USER.imagen_id,
            nombre: $scope.USER.imagen_nombre
          },
          imgOficial: {
            id: $scope.USER.foto_id,
            nombre: $scope.USER.foto_nombre
          }
        };
      };
      fixDato();
      $scope.perfilPath = App.images + 'perfil/';
      $scope.imgFiles = [];
      $scope.errorMsg = '';
      //$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
      $scope.fileReaderSupported = window.FileReader !== null && (window.FileAPI === null);
      $scope.dato.usuarioElegido = [];
      $scope.dato.tipo_a_cambiar = 'alumno';
      $scope.usuariosall = [];
      $scope.profesores = [];
      $http.get('::myimages').then(function(r) {
        var grup,
    j,
    len,
    ref,
    results;
        r = r.data;
        $scope.imagenes_privadas = r.imagenes_privadas;
        $scope.imagenes_publicas = r.imagenes_publicas;
        //$scope.imagenes_all 		= r.imagenes_publicas.concat( r.imagenes_privadas )
        $scope.logo = r.logo;
        $scope.dato.imgParaUsuario = r.imagenes_privadas[0];
        $scope.grupos = r.grupos;
        $scope.profesores = r.profesores;
        if (localStorage.grupo_selected_imgs) {
          ref = $scope.grupos;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            grup = ref[j];
            if (grup.id === parseInt(localStorage.grupo_selected_imgs)) {
              $scope.dato.grupo = grup;
              results.push($scope.grupoSelect(grup));
            } else {
              results.push(void 0);
            }
          }
          return results;
        }
      },
    function(r2) {
        return toastr.error('No se trajeron las imágenes.');
      });
      if ($scope.hasRoleOrPerm(['profesor',
    'admin'])) {
        $scope.cantUp = 2;
      }
      if (localStorage.tabFileManager) {
        $scope.tabFileManager = localStorage.tabFileManager;
      } else {
        localStorage.tabFileManager = $scope.tabFileManager;
        $timeout(function() {
          return $scope.tabFileManager = 'mis_img';
        });
      }
      if (localStorage.tipo_img_a_cambiar) {
        $scope.dato.tipo_a_cambiar = localStorage.tipo_img_a_cambiar;
      } else {
        localStorage.tipo_img_a_cambiar = 'alumno';
      }
      $scope.selectTab = function(indice) {
        localStorage.tabFileManager = indice;
        return $scope.tabFileManager = localStorage.tabFileManager;
      };
      $scope.cambiar_tipo_img_a_cambiar = function(tipo) {
        return localStorage.tipo_img_a_cambiar = tipo;
      };
      $scope.select_imagen_item = function(imagen) {
        var img,
    j,
    len,
    ref;
        ref = $scope.imagenes_privadas;
        for (j = 0, len = ref.length; j < len; j++) {
          img = ref[j];
          img.selected = false;
        }
        imagen.selected = true;
        return $scope.dato.selectedImg = imagen;
      };
      //##########################################################
      //############## 	SUBIDA DE IMÁGENES 		###############
      //##########################################################
      $scope.uploadFiles = function(files) {
        var file,
    i,
    j,
    ref,
    results;
        if ($scope.imagenes_privadas.length > 2 && $scope.hasRoleOrPerm(['alumno',
    'acudiente'])) {
          toastr.warning('No tiene permiso para subir más imágenes');
        }
        $scope.imgFiles = files;
        $scope.errorMsg = '';
        if (files && files.length) {
          results = [];
          for (i = j = 0, ref = files.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
            file = files[i];
            results.push(generateThumbAndUpload(file));
          }
          return results;
        }
      };
      generateThumbAndUpload = function(file) {
        $scope.errorMsg = null;
        uploadUsing$upload(file);
        return $scope.generateThumb(file);
      };
      $scope.generateThumb = function(file) {
        if (file !== null) {
          if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            return $timeout(function() {
              var fileReader;
              fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              return fileReader.onload = function(e) {
                return $timeout(function() {
                  return file.dataUrl = e.target.result;
                });
              };
            });
          }
        }
      };
      uploadUsing$upload = function(file) {
        var intactaUrl;
        intactaUrl = $scope.subir_intacta.intacta === 'Intacta' ? '-intacta' : '';
        if ($scope.subir_intacta.intacta === 'Firma') {
          intactaUrl = '-firma';
        }
        if (file.size > 10000000) {
          $scope.errorMsg = 'Archivo excede los 10MB permitidos.';
          return;
        }
        return $upload.upload({
          url: App.Server + 'myimages/store' + intactaUrl,
          //fields: {'username': $scope.username},
          file: file
        }).progress(function(evt) {
          var progressPercentage;
          progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          return file.porcentaje = progressPercentage;
        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name, evt.config)
        }).success(function(data,
    status,
    headers,
    config) {
          var ima,
    j,
    len,
    ref,
    results;
          if ($scope.subir_intacta.intacta === 'Intacta') {
            return $scope.imagenes_publicas.push(data);
          } else if ($scope.subir_intacta.intacta === 'Firma') {
            toastr.success('Ahora elige el docente...');
            $scope.imagenes_privadas.push(data);
            $scope.selectTab('imgs_usus');
            $scope.dato.tipo_a_cambiar = 'profesor';
            ref = $scope.imagenes_privadas;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              ima = ref[j];
              if (ima.id === data.id) {
                results.push($scope.dato.selectedImg = ima);
              } else {
                results.push(void 0);
              }
            }
            return results;
          } else {
            return $scope.imagenes_privadas.push(data);
          }
        }).error(function(r2) {
          return console.log('Falla uploading: ',
    r2);
        }).xhr(function(xhr) {}); //.then((), error, progress)
      };
      
      //##########################################################
      //############## 	PEDIDOS PERSONALES 		###############
      //##########################################################
      //xhr.upload.addEventListener()
      ///* return $http promise then(). Note that this promise does NOT have progress/abort/xhr functions */
      $scope.pedirCambioUsuario = function(imgUsu) {
        if (imgUsu.id) {
          return $http.put('::images-users/cambiar-imagen-perfil/' + $scope.USER.user_id,
    {
            imagen_id: imgUsu.id
          }).then(function(r) {
            r = r.data;
            if ($scope.hasRoleOrPerm('admin')) {
              Perfil.setImagen(r.imagen_id,
    imgUsu.nombre);
              $scope.$emit('cambianImgs',
    {
                image: r
              });
              return toastr.success('Imagen principal cambiada');
            } else {
              return toastr.info('Ahora espera que un administrador acepte tu imagen',
    'Solicitado');
            }
          },
    function(r2) {
            return toastr.error('No se pudo cambiar imagen',
    'Problema');
          });
        } else {
          return toastr.warning('Selecciona una imagen');
        }
      };
      $scope.pedirCambioOficial = function(imgOfi) {
        if (imgOfi.id) {
          return $http.put('::images-users/cambiar-imagen-oficial/' + $scope.USER.user_id,
    {
            foto_id: imgOfi.id
          }).then(function(r) {
            r = r.data;
            if ($scope.hasRoleOrPerm('admin')) {
              Perfil.setOficial(r.foto_id,
    imgOfi.nombre);
              $scope.$emit('cambianImgs',
    {
                foto: r
              });
              return toastr.success('Foto oficial cambiada');
            } else {
              return toastr.info('Ahora espera que un administrador acepte tu imagen',
    'Solicitado');
            }
          },
    function(r2) {
            return toastr.error('No se pudo cambiar foto',
    'Problema');
          });
        } else {
          return toastr.warning('Selecciona una imagen');
        }
      };
      $scope.pedirCambioFirma = function(imgFirmaProfe) {
        var aEnviar;
        if (imgFirmaProfe.id) {
          aEnviar = {
            imgFirmaProfe: imgFirmaProfe.id
          };
          return $http.put('::perfiles/cambiarfirmaunprofe/' + $scope.USER.persona_id,
    aEnviar).then(function(r) {
            toastr.success('Firma cambiada con éxito');
            $scope.USER.firma_id = r.data.id;
            return $scope.USER.firma_nombre = r.data.nombre;
          },
    function(r2) {
            return toastr.error('Error al asignar foto al profesor',
    'Problema');
          });
        } else {
          return toastr.warning('Selecciona una imagen');
        }
      };
      $scope.cambiarLogoColegio = function(imgLogo) {
        return $http.put('::myimages/cambiarlogocolegio',
    {
          logo_id: imgLogo.id
        }).then(function(r) {
          toastr.success('Logo del colegio cambiado');
          $scope.logo.logo = imgLogo.nombre;
          $scope.logo.logo_id = imgLogo.id;
          return console.log($scope.logo,
    imgLogo);
        },
    function(r2) {
          return toastr.error('No se pudo cambiar el logo',
    'Problema');
        });
      };
      $scope.grupoSelect = function(item,
    model) {
        localStorage.grupo_selected_imgs = item.id;
        return $http.get('::grupos/listado/' + item.id).then(function(r) {
          r = r.data;
          $scope.alumnos = r;
          r[0].selected = true;
          $scope.dato.alumnoElegido = r[0];
          return $scope.alumSelect($scope.dato.alumnoElegido);
        },
    function(r2) {
          return toastr.error('No se pudo traer los usuarios');
        });
      };
      $scope.rotarImagen = function(imagen) {
        return $http.put('::images-users/rotarimagen/' + imagen.id).then(function(r) {
          imagen.nombre = '';
          toastr.success('Imagen rotada');
          return imagen.nombre = r.data + '?' + new Date().getTime();
        },
    function(r2) {
          return toastr.error('Imagen no rotada');
        });
      };
      $scope.rotarImagenIzquierda = function(imagen) {
        return $http.put('::images-users/rotar-imagen-izquierda/' + imagen.id).then(function(r) {
          imagen.nombre = '';
          toastr.success('Imagen rotada');
          return imagen.nombre = r.data + '?' + new Date().getTime();
        },
    function(r2) {
          return toastr.error('Imagen no rotada');
        });
      };
      $scope.publicarImagen = function(imagen) {
        return $http.put('::myimages/publicar-imagen/' + imagen.id).then(function(r) {
          toastr.info('Ahora la imagen es pública');
          $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    {
            id: '!' + imagen.id
          });
          return $scope.imagenes_publicas.push(imagen);
        },
    function(r2) {
          return toastr.error('Imagen no publicada');
        });
      };
      $scope.privatizarImagen = function(imagen) {
        return $http.put('::myimages/privatizar-imagen/' + imagen.id).then(function(r) {
          r = r.data;
          if (r.imagen) {
            toastr.warning('No puede ser logo del año ' + r.imagen.is_logo_of_year);
            return;
          }
          toastr.info('Ahora la imagen es privada');
          if (imagen.user_id === $scope.USER.user_id) {
            $scope.imagenes_privadas.push(imagen);
          }
          return $scope.imagenes_publicas = $filter('filter')($scope.imagenes_publicas,
    {
            id: '!' + imagen.id
          });
        },
    function(r2) {
          return toastr.error('Imagen no privatizada');
        });
      };
      $scope.borrarImagen = function(imagen,
    usuario_id,
    de_un_usuario) {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: '==fileManager/removeImage.tpl.html',
          controller: 'RemoveImageCtrl',
          size: 'md',
          resolve: {
            imagen: function() {
              return imagen;
            },
            user_id: function() {
              return usuario_id;
            },
            datos_imagen: function() {
              var codigos;
              codigos = {
                imagen_id: imagen.id,
                user_id: usuario_id
              };
              return $http.put('::myimages/datos-imagen',
    codigos).then(function(r) {
                return $scope.datos_imagen = r.data;
              },
    function(r2) {
                toastr.error('Error al traer datos de imagen',
    'Problema');
                return {};
              });
            }
          }
        });
        return modalInstance.result.then(function(imag) {
          if ($scope.hasRoleOrPerm('admin')) {
            if (de_un_usuario) {
              $scope.imagenes_del_usuario = $filter('filter')($scope.imagenes_del_usuario,
    {
                id: '!' + imag.id
              });
              $scope.dato.selectedImgDelUsuario = void 0;
            } else {
              if (imag.publica) {
                $scope.imagenes_publicas = $filter('filter')($scope.imagenes_publicas,
    {
                  id: '!' + imag.id
                });
              } else {
                $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    {
                  id: '!' + imag.id
                });
              }
            }
            return toastr.success('La imagen ha sido removida.');
          } else {
            if (imag.user_id === $scope.USER.user_id) {
              toastr.success('La imagen ha sido removida.');
              if (imag.publica) {
                return $scope.imagenes_publicas = $filter('filter')($scope.imagenes_publicas,
    {
                  id: '!' + imag.id
                });
              } else {
                return $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    {
                  id: '!' + imag.id
                });
              }
            } else {
              return toastr.info('Un administrador borrará la imagen ya que no fuiste tú quien la subió',
    'Solicitado');
            }
          }
        });
      };
      //##########################################################
      //############## 	CAMBIAR A USUARIOS 		###############
      //##########################################################
      $scope.cambiarImgUnUsuario = function(usuarioElegido,
    imgParaUsuario) {
        var aEnviar,
    confirmando;
        confirmando = false;
        if (imgParaUsuario) {
          confirmando = confirm('Esto quitará la imágen de tu lista. ¿Seguro que deseas cambiar la imagen de este usuario?');
        } else {
          confirmando = confirm('¿Ya no quieres que esta sea su imagen de perfil?');
        }
        if (confirmando) {
          aEnviar = {};
          if (imgParaUsuario) {
            aEnviar.imagen_id = imgParaUsuario.id;
          }
          return $http.put('::images-users/cambiar-imagen-un-usuario/' + usuarioElegido.user_id,
    aEnviar).then(function(r) {
            if (imgParaUsuario) {
              usuarioElegido.imagen_id = imgParaUsuario.id;
              usuarioElegido.imagen_nombre = imgParaUsuario.nombre;
              $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    function(item) {
                return item.id !== imgParaUsuario.id;
              });
              $scope.dato.selectedImg = void 0;
              $scope.imagenes_del_usuario.push(imgParaUsuario);
              return toastr.success('Imagen asignada con éxito');
            } else {
              usuarioElegido.imagen_id = null;
              usuarioElegido.imagen_nombre = 'default_male.png';
              return toastr.success('Imagen quitada con éxito');
            }
          },
    function(r2) {
            return toastr.error('Error al asignar imagen a usuario',
    'Problema');
          });
        }
      };
      $scope.cambiarFotoUnUsuario = function(usuarioElegido,
    imgParaUsuario) {
        var aEnviar,
    confirmando;
        confirmando = false;
        if (imgParaUsuario) {
          confirmando = confirm('Esto quitará la imágen de tu lista. ¿Seguro que deseas cambiar la imagen de este usuario?');
        } else {
          confirmando = confirm('¿Ya no quieres que esta sea su foto oficial?');
        }
        if (confirmando) {
          aEnviar = {};
          if (imgParaUsuario) {
            aEnviar.imagen_id = imgParaUsuario.id;
          }
          return $http.put('::images-users/cambiar-foto-un-usuario/' + usuarioElegido.user_id,
    aEnviar).then(function(r) {
            if (imgParaUsuario) {
              usuarioElegido.imagen_id = imgParaUsuario.id;
              usuarioElegido.foto_nombre = imgParaUsuario.nombre;
              $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    function(item) {
                return item.id !== imgParaUsuario.id;
              });
              $scope.dato.selectedImg = void 0;
              $scope.imagenes_del_usuario.push(imgParaUsuario);
              return toastr.success('Foto asignada con éxito');
            } else {
              usuarioElegido.foto_id = null;
              usuarioElegido.foto_nombre = 'default_male.png';
              return toastr.success('Foto quitada con éxito');
            }
          },
    function(r2) {
            return toastr.error('Error al asignar foto oficial',
    'Problema');
          });
        }
      };
      $scope.cambiarFirmaUnProfe = function(profeElegido,
    imgParaUsuario) {
        var aEnviar,
    confirmando;
        confirmando = false;
        if (imgParaUsuario) {
          confirmando = confirm('Esto quitará la imágen de tu lista. ¿Seguro que deseas asignar firma a este usuario?');
        } else {
          confirmando = confirm('¿Ya no quieres que sea su firma?');
        }
        if (confirmando) {
          aEnviar = {};
          if (imgParaUsuario) {
            aEnviar.imagen_id = imgParaUsuario.id;
          }
        }
        return $http.put('::images-users/cambiar-firma-un-profe/' + profeElegido.profesor_id,
    aEnviar).then(function(r) {
          if (imgParaUsuario) {
            profeElegido.firma_id = imgParaUsuario.id;
            profeElegido.firma_nombre = imgParaUsuario.nombre;
            $scope.imagenes_privadas = $filter('filter')($scope.imagenes_privadas,
    function(item) {
              return item.id !== imgParaUsuario.id;
            });
            $scope.dato.selectedImg = void 0;
            $scope.imagenes_del_usuario.push(imgParaUsuario);
            return toastr.success('Firma asignada con éxito');
          } else {
            profeElegido.firma_id = null;
            profeElegido.firma_nombre = null;
            return toastr.success('Firma quitada con éxito');
          }
        },
    function(r2) {
          return toastr.error('Error al asignar firma',
    'Problema');
        });
      };
      $scope.alumSelect = function($item) {
        var aEnviar,
    alu,
    j,
    len,
    ref;
        ref = $scope.alumnos;
        for (j = 0, len = ref.length; j < len; j++) {
          alu = ref[j];
          alu.selected = false;
        }
        $item.selected = true;
        $scope.dato.alumnoElegido = $item;
        aEnviar = {
          usuario_id: $item.user_id
        };
        return $http.put('::images-users/imagenes-de-usuario',
    aEnviar).then(function(r) {
          $scope.imagenes_del_usuario = r.data;
          return $scope.mostrando_opt_img_de_alum = true;
        },
    function(r2) {
          return toastr.error('Error trayendo imagenes del usuario',
    'Problema');
        });
      };
      $scope.profeSelect = function($item,
    $model) {
        var aEnviar;
        aEnviar = {
          usuario_id: $item.user_id
        };
        return $http.put('::images-users/imagenes-de-usuario',
    aEnviar).then(function(r) {
          $scope.imagenes_del_usuario = r.data;
          return $scope.mostrando_opt_img_de_prof = true;
        },
    function(r2) {
          return toastr.error('Error trayendo imagenes del usuario',
    'Problema');
        });
      };
      $scope.moveImgToMe = function($item,
    $model) {
        var aEnviar;
        if ($scope.dato.selectedImgDelUsuario) {
          aEnviar = {
            img_id: $item.id
          };
          return $http.put('::images-users/move-img-to-me',
    aEnviar).then(function(r) {
            $scope.imagenes_privadas.push($item);
            $scope.imagenes_del_usuario = $filter('filter')($scope.imagenes_del_usuario,
    function(item) {
              return item.id !== $item.id;
            });
            $scope.dato.selectedImgDelUsuario = void 0;
            return toastr.success('Ahora la imagen te pertenece.');
          },
    function(r2) {
            return toastr.error('Error mover imagen',
    'Problema');
          });
        } else {
          return toastr.warning('Seleccione la imagen que quiere tomar.');
        }
      };
    }
  ]).filter('filterByNomApell', [
    'Acentos',
    function(Acentos) {
      return function(alumnos,
    texto) {
        var alum,
    alumnos_response,
    apell,
    j,
    len,
    nomb;
        if (texto) {
          if (texto !== '') {
            alumnos_response = [];
            texto = Acentos.remove(texto);
            for (j = 0, len = alumnos.length; j < len; j++) {
              alum = alumnos[j];
              nomb = Acentos.remove(alum.nombres);
              apell = Acentos.remove(alum.apellidos);
              if ((nomb.indexOf(texto) !== -1) || (apell.toLowerCase().indexOf(texto) !== -1)) {
                alumnos_response.push(alum);
              }
            }
            return alumnos_response;
          } else {
            return alumnos;
          }
        } else {
          return alumnos;
        }
      };
    }
  ]);

}).call(this);

//FileManagerCtrl.js.map
