import angular from 'angular';

// based on http://stackoverflow.com/a/14837021
function focusMeDescription($parse, $timeout) {
  return {
    link: (scope, element, attrs) => {
      const model = $parse(attrs.focusMe);
      scope.$watch(model, (value) => {
        if (value === true) {
          $timeout(() => element[0].focus());
        }
      });

      element.bind('blur', () => {
        scope.$apply(model.assign(scope, false));
      });
    },
  };
}

angular.module('debugapp').directive('focusMe', ['$parse', '$timeout', focusMeDescription]);
