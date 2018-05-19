import * as angular from 'angular';
import { IVariable } from '../../../types';

import './variable.scss';
import template from './variable.template.html';

class VariableController {
  private variable: IVariable;
  private isString: boolean;
  private isPrimitive: boolean;
  private hasName: boolean;
  private visible: boolean;
  // constructor() { }

  public $onChanges(changesObj) {
    if (!changesObj.variable || !this.variable) {
      return;
    }
    this.isString = (this.variable.type === 'string');
    this.isPrimitive = this.variable.isPrimitive;
    this.hasName = (this.variable.name !== undefined);
  }

  public getClass() {
    if (this.isString) {
      return 'strValue';
    }
    if (this.variable.type === 'boolean' || this.variable.type === 'None') {
      return 'boolValue';
    }
    return 'numValue';
  }

  public toggleVisibility() {
    this.visible = !this.visible;
  }
}

VariableController.$inject = [];

angular.module('debugapp')
  .component('variable', {
    template,
    controller: VariableController,
    bindings: {
      variable: '<',
      nameAsHeading: '<?',
    },
  });
