import angular from 'angular';

import template from './variable.template.html';
import './variable.scss';

class variableController {
  // constructor() { }

  $onChanges() {
    this.variable = this.variable || {};
    this.variable.name = this.variable.name || this.name;
    this.variable.value = this.variable.value || this.value;
    this.variable.type = this.variable.type || this.type;

    this.isString = (this.variable.type === 'string');
    this.isPrimitive = this.isPrimitive || this.variable.isPrimitive;
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
      isPrimitive: '<?',
      nameAsHeading: '<?',
      name: '<?',
      value: '<?',
      type: '<?',
    },
  });
