(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('PanelHeaderCtrl', [
    '$scope',
    'titulo',
    '$state',
    '$stateParams',
    '$rootScope',
    function($scope,
    titu,
    $state,
    $stateParams,
    $rootScope) {
      $scope.titulo = titu;
      $rootScope.reload = function() {
        return $state.go($state.current,
    $stateParams,
    {
          reload: true
        });
      };
    }
  ]);

}).call(this);

//PanelHeaderCtrl.js.map
