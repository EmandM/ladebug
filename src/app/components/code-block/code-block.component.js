import angular from 'angular';
import split from 'lodash/split';
import keyBy from 'lodash/keyBy';

import template from './code-block.template.html';
import './code-block.scss';

class codeBlockController {
  constructor() {
    // Object for breakpoints => faster lookup than array.
    this.breakpointObj = {};
  }

  $onChanges(changesObj) {
    if (changesObj.codeString) {
      // Split the code by newline characters to have reference to each line.
      this.codeByLines = split(this.codeString, '\n');
    }
    if (changesObj.breakpoints) {
      // Transform array into obj
      this.breakpointObj = keyBy(this.breakpoints, (line => line));
    }
    if (changesObj.currentLine) {
      this.currentLineIndex = this.currentLine - 1;
    }
  }
}

codeBlockController.$inject = [];

angular.module('debugapp')
  .component('codeBlock', {
    template,
    controller: codeBlockController,
    bindings: {
      codeString: '<', // String representation of executed code
      currentLine: '<', // current execution line
      breakpoints: '<', // Array of breakpoints
      breakpointAction: '&', // callback to toggle breakpoints
    },
  });
