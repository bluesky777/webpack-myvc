(function() {
  'use strict';
  angular.module("myvcFrontApp").controller('PaisesCtrl', [
    '$scope',
    function($scope) {
      $scope.gridOptions = {
        enableSorting: true,
        columnDefs: [
          {
            field: 'pais'
          },
          {
            field: 'abreviación'
          },
          {
            field: 'id'
          }
        ],
        onRegisterApi: function(gridApi) {
          return $scope.gridApi = gridApi;
        }
      };
    }
  ]);

  //$scope.gridOptions.data = data;

}).call(this);

//PaisesCtrl.js.map
