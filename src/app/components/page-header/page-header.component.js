import angular from 'angular';

import template from './page-header.template.html';
import './page-header.scss';

class headerController {
  // constructor() { }
}

headerController.$inject = [];

angular.module('debugapp')
  .component('pageHeader', {
    template,
    controller: headerController,
    bindings: {},
  });
