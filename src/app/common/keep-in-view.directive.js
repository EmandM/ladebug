import angular from 'angular';

function keepInViewDescription() {
  return {
    link: ($scope, element) => {
      const scrollingElement = document.getElementById('codeBlock');

      $scope.$watch(() => $scope.keepInView, (newVal) => {
        if (newVal) {
          const elementOffset = element[0].offsetTop;
          if (elementOffset < scrollingElement.scrollTop ||
            elementOffset > scrollingElement.scrollTop + scrollingElement.offsetHeight) {
            scrollingElement.scrollTop = element[0].offsetTop;
          }
        }
      });
    },
    scope: { keepInView: '<' }, // When this variable is true, scroll element into view
  };
}

angular.module('debugapp').directive('keepInView', keepInViewDescription);
