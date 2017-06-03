import angular from 'angular';

function fileInputBehaviour($scope, element, attrs, ngModel) {
  element.on('change', () => {
    const file = element[0].files[0];
    ngModel.$setViewValue(file);
  });
}

function fileInputDefinition() {
  return {
    require: 'ngModel',
    link: fileInputBehaviour,
  };
}

angular.module('debugapp').directive('fileInput', fileInputDefinition);
