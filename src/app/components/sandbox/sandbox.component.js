import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  constructor(conversionService, $state) {
    this.conversionService = conversionService;
    this.$state = $state;

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    }
  }

  submit() {
    this.submitted = true;
    this.conversionService.postRequest(this.code)
      .then((response) => {
        this.$state.go('debug', { outputID: response.id })
      })
      .catch((error) => {
        console.log(error);
        this.submitted = false;
      });
  }
}

sandboxController.$inject = ['ConversionService', '$state'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
