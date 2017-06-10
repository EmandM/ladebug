import angular from 'angular';
import split from 'lodash/split';

import template from './code-block.template.html';
import './code-block.scss';

class codeBlockController {
  // constructor() {
  // }

  $onChanges(changesObj) {
    if (changesObj.codeString) {
      // Split the code by newline characters to have reference to each line.
      this.codeByLines = split(this.codeString, '\n');
    }
    if (changesObj.currentLine) {
      this.currentLineIndex = this.currentLine - 1;
    }
  }

  toggleBreakpoint(lineNum) {
    this.breakpointAction({ line: lineNum });
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
