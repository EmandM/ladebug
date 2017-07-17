import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  // constructor() {
  // }
}

sandboxController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
