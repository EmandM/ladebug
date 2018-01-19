import angular from 'angular';
import isNumber from 'lodash/isNumber';
import VarHelper from '../../helpers/variable.helper';

import template from './current-test.template.html';
import './current-test.scss';

class currentTestController {
  $onChanges(changesObj) {
    if (changesObj.allTests && this.allTests) {
      this.totalTests = this.allTests.length;
    }

    if (!changesObj.currentTest || !this.currentTest) {
      return;
    }

    if (!isNumber(this.currentTest.test_num)) {
      this.currentTest.test_num = -1;
    }
    this.testNum = this.currentTest.test_num + 1;

    this.inputVariable = VarHelper.objToVar(this.currentTest.input, 'Input', this.currentTest.input_type);
    this.outputVariable = VarHelper.objToVar(this.currentTest.expected_output, 'Expected Output', this.currentTest.output_type);
  }
}

currentTestController.$inject = [];

angular.module('debugapp')
  .component('currentTest', {
    template,
    controller: currentTestController,
    bindings: {
      allTests: '<',
      currentTest: '<',
      entryFunction: '@',
    },
  });
