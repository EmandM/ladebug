import angular from 'angular';

import template from './variable.template.html';
import './variable.scss';

class variableController {
  // constructor() { }

  $onChanges(changesObj) {
    if (!changesObj.variable || !this.variable) {
      return;
    }
    this.isString = (this.variable.type === 'string');
    this.isPrimitive = this.variable.isPrimitive;
    this.hasName = (this.variable.name !== undefined);
  }

  getClass() {
    if (this.isString) {
      return 'strValue';
    }
    if (this.variable.type === 'boolean') {
      return 'boolValue';
    }
    return 'numValue';
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
      nameAsHeading: '<?',
    },
  });
