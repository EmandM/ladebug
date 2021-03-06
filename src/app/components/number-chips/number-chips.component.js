import angular from 'angular';
import parseInt from 'lodash/parseInt';
import every from 'lodash/every';
import template from './number-chips.template.html';
import './number-chips.scss';

class numberChipsController {
  constructor($timeout) {
    this.$timeout = $timeout;
    // enter: 13, tab: 9, comma: 188
    this.seperatorKeys = [13, 9, 188];
  }

  $onInit() {
    this.$timeout(() => this.validateErrorLines(), 0);
  }

  validateErrorLines() {
    const isRequireValid = this.ngModel.length > 0;
    const isChipValid = this.validateChips();
    this.form.errorLines.$setValidity('required', isRequireValid);
    this.form.errorLines.$setValidity('out-of-range', isChipValid);
  }

  errorLineError() {
    return ((this.form.$submitted || this.form.errorLines.$dirty) &&
        this.form.errorLines.$invalid);
  }

  validateChips() {
    const lineCount = this.maxChipNum;
    return every(this.ngModel, (line) => {
      const lineNum = parseInt(line);
      return (lineCount) ? // if lineCount exists
      (lineNum <= lineCount && lineNum > 0) : // ensure less than lineCount and greater than zero
        (lineNum > 0); // else just greater than zero
    });
  }
}

numberChipsController.$inject = ['$timeout'];

angular.module('debugapp')
  .component('numberChips', {
    template,
    controller: numberChipsController,
    bindings: {
      ngModel: '=',
      maxChipNum: '<',
      form: '<',
    },
  });
