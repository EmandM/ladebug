import * as angular from 'angular';

import './help-display.scss';
import template from './help-display.template.html';

class HelpDisplayController {
  constructor(private $mdDialog: angular.material.IDialogService) {
    this.$mdDialog = $mdDialog;
  }

  public close() {
    this.$mdDialog.cancel();
  }
}

HelpDisplayController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('helpDisplay', {
    template,
    controller: HelpDisplayController,
    bindings: {},
  });
