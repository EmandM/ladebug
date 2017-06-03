import angular from 'angular';

import template from './choose-file.template.html';
import './choose-file.scss';

class chooseFileController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }

  /*
   * When a folder is chosen by the user
   * Close the dialog and return the files to the file-viewer component
   */
  readFile() {
    if (!this.chosenFile) {
      this.showError();
    }
    const reader = new FileReader();
    reader.readAsText(this.chosenFile, 'UTF-8');
    reader.onload = (evt) => {
      const fileContents = JSON.parse(evt.target.result);
      this.$mdDialog.hide(fileContents);
    };
    reader.onerror = this.showError.bind(this);
  }

  showError() {
    this.errorMessage = 'Error Reading File';
  }

  close() {
    this.$mdDialog.cancel();
  }
}

chooseFileController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('chooseFile', {
    template,
    controller: chooseFileController,
    bindings: {
      canClose: '<',
    },
  });
