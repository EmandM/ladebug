import angular from 'angular';

import template from './variable.template.html';
import './variable.scss';

class variableController {
  // constructor() { }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  makeVariable(key, variable) {
    return {
      name: key,
      type: 'primitive',
      value: variable,
    };
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
