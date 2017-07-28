import angular from 'angular';

import template from './choose-file.template.html';
import './choose-file.scss';

class chooseFileController {
  constructor(exerciseService) {
    this.exerciseService = exerciseService;
  }

  /*
   * When a folder is chosen by the user
   * Close the dialog and return the files to the file-viewer component
   */
  submit() {
    if (!this.chosenFile) {
      this.showError();
      return;
    }

    if (!this.chooseFileForm.$valid) {
      return;
    }
    this.submitted = true;
    const reader = new FileReader();
    reader.readAsText(this.chosenFile, 'UTF-8');
    reader.onload = (evt) => {
      this.exerciseService.createExercise(this.name, evt.target.result, this.errorLine)
        .then(() => this.save())
    };
    reader.onerror = this.showError.bind(this);
  }

  showError() {
    this.errorMessage = 'Error Reading File';
    this.submitted = false;
  }
}

chooseFileController.$inject = ['ExerciseService'];

angular.module('debugapp')
  .component('chooseFile', {
    template,
    controller: chooseFileController,
    bindings: {
      cancel: '&',
      save: '&',
    },
  });
