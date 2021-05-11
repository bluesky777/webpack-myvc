(function() {
  angular.module("myvcFrontApp").controller('CertificadosEstudioCtrl', [
    '$scope',
    '$state',
    'alumnosDat',
    'escalas',
    '$cookies',
    '$stateParams',
    '$http',
    'toastr',
    function($scope,
    $state,
    alumnos,
    escalas,
    $cookies,
    $stateParams,
    $http,
    toastr) {
      var alum,
    area,
    asign,
    i,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    recupera,
    ref,
    ref1,
    ref2,
    ref3;
      $scope.grupo = alumnos[0];
      $scope.year = alumnos[1];
      $scope.alumnos = alumnos[2];
      $scope.escalas_val = alumnos[3];
      $scope.$stateParams = $stateParams;
      $scope.escalas = escalas;
      $scope.config = $cookies.getObject('config');
      $scope.requested_alumnos = $cookies.getObject('requested_alumnos');
      $scope.requested_alumno = $cookies.getObject('requested_alumno');
      $scope.$on('change_config',
    function() {
        return $scope.config = $cookies.getObject('config');
      });
      $scope.cambia_contador_certificados = function(contador,
    year_id,
    col) {
        console.log(contador,
    year_id);
        return $http.put('::bolfinales/cambiar-' + col,
    {
          contador: contador,
          year_id: year_id
        }).then(function(r) {
          return toastr.success('Contador guardado');
        },
    function(r2) {
          return toastr.error('Cambio no guardado',
    'Error');
        });
      };
      $scope.espaciado = false;
      if (alumnos[2].length > 0) {
        if (alumnos[2][0].asignaturas.length < 13) {
          $scope.espaciado = true;
        }
      }
      ref = alumnos[2];
      for (i = 0, len = ref.length; i < len; i++) {
        alum = ref[i];
        ref1 = alum.areas;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          area = ref1[j];
          ref2 = area.asignaturas;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            asign = ref2[k];
            ref3 = alum.recuperaciones;
            for (l = 0, len3 = ref3.length; l < len3; l++) {
              recupera = ref3[l];
              if (asign.asignatura_id === recupera.asignatura_id) {
                if ($scope.year.show_subasignaturas_en_finales || $scope.year.cant_asignatura_pierde_year || area.asignaturas.length === 1) {
                  recupera.mostrar_en_certificado = true;
                }
              }
            }
          }
        }
      }
      if ($scope.requested_alumnos) {
        return $scope.$emit('cambia_descripcion',
    'Mostrando ' + $scope.alumnos.length + ' boletines de ' + $scope.grupo.cantidad_alumnos + ' del grupo ' + $scope.grupo.nombre_grupo);
      } else if ($scope.requested_alumno) {
        return $scope.$emit('cambia_descripcion',
    'Mostrando un boletin de ' + $scope.grupo.cantidad_alumnos + ' del grupo ' + $scope.grupo.nombre_grupo);
      } else {
        return $scope.$emit('cambia_descripcion',
    $scope.alumnos.length + ' boletines del grupo ' + $scope.grupo.nombre_grupo);
      }
    }
  ]);

  /*
	$http.get('http://localhost/myvc_server/public/certificados-estudio/certificado-grupo/10', { responseType: 'arraybuffer' })
		.success((response)->
			file = new Blob([response], { type: 'application/pdf' })
			fileURL = URL.createObjectURL(file);
			$scope.pdfContent = $sce.trustAsResourceUrl(fileURL);
		)
		.error((r2)->
			console.log 'Pailaaassss', r2
		);

$http.get('certificados-estudio/certificado-grupo/10', {}, {responseType: 'blob', "X-Auth-Token": 'token'}).then((response)->
	console.log response
	url = (window.URL or window.webkitURL).createObjectURL(response);
	window.open(url);
);
*/

}).call(this);

//CertificadosEstudioCtrl.js.map
