import angular from 'angular';
import template from './home.template.html';
import './home.scss';

class homeController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
    this.title = 'Hello World';
    this.fileLoaded = false;
    this.launchFilePicker(false);
  }

  launchFilePicker(canClose, $event) {
    this.$mdDialog.show({
      template: `<choose-file can-close="${canClose}"></choose-file>`,
      targetEvent: $event,
      clickOutsideToClose: canClose,
      escapeToClose: canClose,
    }).then((fileContents) => {
      this.fileLoaded = true;
      this.fileContents = fileContents;
      this.codeString = this.fileContents.code;
    });
  }
}

homeController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('home', {
    template,
    controller: homeController,
    bindings: {},
  });
