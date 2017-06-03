import angular from 'angular';

function stopPropagationDescription() {
  return {
    link: (scope, element) => {
      element.on('click', ($event) => {
        $event.preventDefault();
        $event.stopPropagation();
      });
    },
  };
}

angular.module('debugapp').directive('stopPropagation', stopPropagationDescription);
