import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  constructor() {
    this.text = "hello world";

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    }

    this.focus = true;
  }
}

sandboxController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
