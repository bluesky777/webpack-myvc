(function() {
  angular.module("myvcFrontApp").directive("contenteditable", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {
        var read;
        read = function() {
          return ngModel.$setViewValue(element.html());
        };
        ngModel.$render = function() {
          return element.html(ngModel.$viewValue || 0);
        };
        return element.bind("blur keyup change", function() {
          return scope.$apply(read);
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=ContentEditableDir.js.map
