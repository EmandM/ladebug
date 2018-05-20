import * as angular from 'angular';
import { every, parseInt } from 'lodash';

import './number-chips.scss';
import template from './number-chips.template.html';

class NumberChipsController {
  private seperatorKeys: number[];
  private ngModel: string[];
  private form: angular.IFormController;
  private maxChipNum: number;

  constructor(private $timeout: angular.ITimeoutService) {
    // enter: 13, tab: 9, comma: 188
    this.seperatorKeys = [13, 9, 188];
  }

  public $onInit() {
    this.$timeout(() => this.validateErrorLines(), 0);
  }

  public validateErrorLines() {
    const isRequireValid = this.ngModel.length > 0;
    const isChipValid = this.validateChips();
    this.form.errorLines.$setValidity('required', isRequireValid);
    this.form.errorLines.$setValidity('out-of-range', isChipValid);
  }

  public errorLineError(): boolean {
    return ((this.form.$submitted || this.form.errorLines.$dirty) &&
        this.form.errorLines.$invalid);
  }

  public validateChips(): boolean {
    const lineCount = this.maxChipNum;
    return every(this.ngModel, (line) => {
      const lineNum = parseInt(line, 10);
      return (lineCount) ? // if lineCount exists
        (lineNum <= lineCount && lineNum > 0) : // ensure less than lineCount and greater than zero
        (lineNum > 0); // else just greater than zero
    });
  }
}

NumberChipsController.$inject = ['$timeout'];

angular.module('debugapp')
  .component('numberChips', {
    template,
    controller: NumberChipsController,
    bindings: {
      ngModel: '=',
      maxChipNum: '<',
      form: '<',
    },
  });
,
