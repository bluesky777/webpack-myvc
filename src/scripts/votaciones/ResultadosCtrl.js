(function() {
  angular.module("myvcFrontApp").controller('ResultadosCtrl', [
    '$scope',
    '$http',
    'App',
    'toastr',
    function($scope,
    $http,
    App,
    toastr) {
      $scope.votacion = {
        locked: false,
        is_action: false,
        fecha_inicio: '',
        fecha_fin: ''
      };
      $scope.imagesPath = App.images + 'perfil/';
      $http.put('::votos/show',
    {
        permitir: false
      }).then(function(r) {
        $scope.votaciones = r.data.votaciones;
        return $scope.year = r.data.year;
      },
    function(r2) {
        return toastr.error('Error trayendo las votaciones.');
      });
    }
  ]).controller('TarjetonesCtrl', [
    '$scope',
    '$http',
    'App',
    'toastr',
    function($scope,
    $http,
    App,
    toastr) {
      $scope.votacion = {
        locked: false,
        is_action: false,
        fecha_inicio: '',
        fecha_fin: ''
      };
      $scope.imagesPath = App.images + 'perfil/';
      $http.put('::votos/show',
    {
        permitir: true
      }).then(function(r) {
        $scope.votaciones = r.data.votaciones;
        return $scope.year = r.data.year;
      },
    function(r2) {
        return toastr.error('Error trayendo las votaciones.');
      });
    }
  ]);

  /*
$http.get('::votaciones/actual').then((r)->
	$scope.votacion = r.data
, (r2)->
	toastr.error 'Error trayendo las votaciones.'
)

$http.get('::candidatos/conaspiraciones').then((r)->
	$scope.aspiraciones = r.data
, (r2)->
	toastr.error 'No se pudo traer las aspiraciones', 'Problema'
)
*/

}).call(this);

//ResultadosCtrl.js.map
