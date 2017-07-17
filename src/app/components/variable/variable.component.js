import angular from 'angular';

import template from './variable.template.html';
import './variable.scss';

class variableController {
  // constructor() { }

  $onInit() {
    this.isPrimitive = (this.variable.type === 'primitive');
    this.hasName = (this.variable.name !== undefined);
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}

variableController.$inject = [];

angular.module('debugapp')
  .component('variable', {
    template,
    controller: variableController,
    bindings: {
      variable: '<',
    },
  });
