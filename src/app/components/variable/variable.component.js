import angular from 'angular';

import template from './variable.template.html';
import './variable.scss';

class variableController {
  // constructor() { }

  $onInit() {
    this.isString = (this.variable.type === 'string');
    this.isPrimitive = (this.variable.type === 'number' || this.isString);
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
