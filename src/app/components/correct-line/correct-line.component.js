import angular from 'angular';

import template from './correct-line.template.html';
import './correct-line.scss';

class correctLineController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
    
  }
}

correctLineController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('correctLine', {
    template,
    controller: correctLineController,
    bindings: {},
  });
