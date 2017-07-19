import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  constructor(conversionService) {
    this.conversionService = conversionService;
    this.text = "hello world";

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    }

    this.focus = true;
  }

  submit() {
    this.conversionService.postRequest(this.code);
  }
}

sandboxController.$inject = ['ConversionService'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
