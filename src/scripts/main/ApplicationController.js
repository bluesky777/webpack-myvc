(function() {
  'use strict';
  angular.module('myvcFrontApp').controller('ApplicationController', [
    '$scope',
    function($scope) {
      $scope.isLoginPage = false;
      return Date.prototype.yyyymmdd = function() {
        var dd,
    mm;
        mm = this.getMonth() + 1;
        dd = this.getDate();
        return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd].join('-');
      };
    }
  ]);

}).call(this);

//ApplicationController.js.map
