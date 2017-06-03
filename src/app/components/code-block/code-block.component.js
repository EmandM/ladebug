import angular from 'angular';
import split from 'lodash/split';

import template from './code-block.template.html';
import './code-block.scss';

class codeBlockController {
  // constructor() {
  // }

  $onChanges() {
    this.codeByLines = split(this.codeString, '\n');
  }
}

codeBlockController.$inject = [];

angular.module('debugapp')
  .component('codeBlock', {
    template,
    controller: codeBlockController,
    bindings: {
      codeString: '<',
    },
  });
