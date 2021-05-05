(function() {
  angular.module('myvcFrontApp').directive('updateTitle', [
    '$rootScope',
    '$timeout',
    function($rootScope,
    $timeout) {
      return {
        link: function(scope,
    element) {
          /*

          $transitions.onSuccess({}, (transition)->

              title = 'Wissen'
              if transition.to().data and transition.to().data.pageTitle
                  title = transition.to().data.pageTitle

              if transition.to().Params
                  if transition.to().Params.username
                      title = transition.to().Params.username + ' - Wissen'

              $timeout(()->
                  element.text(title)
              , 0, false)
          );

          */
          var listener;
          listener = function(event,
    toState,
    toParams) {
            var title;
            title = 'MyVc';
            if (toState.data && toState.data.pageTitle) {
              title = toState.data.pageTitle;
            }
            if (toParams) {
              if (toParams.username) {
                title = toParams.username + ' - MyVC';
              }
            }
            if (toState.data.pageTitle === 'Boletines periodo - MyVc' || toState.data.pageTitle === 'Boletines finales - MyVc') {
              if (localStorage.grupo_boletines) {
                title = localStorage.grupo_boletines + ' - MyVC';
              } else if (localStorage.alumno_boletin) {
                title = localStorage.alumno_boletin;
              }
            }
            return $timeout(function() {
              return element.text(title);
            },
    0,
    false);
          };
          return $rootScope.$on('$stateChangeSuccess',
    listener);
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=updateTitle.js.map
