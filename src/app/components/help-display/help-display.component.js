import angular from 'angular';

import template from './help-display.template.html';
import './help-display.scss';

class helpDisplayController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }

  close() {
    this.$mdDialog.cancel();
  }
}

helpDisplayController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('helpDisplay', {
    template,
    controller: helpDisplayController,
    bindings: {},
  });
