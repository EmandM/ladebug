import angular from 'angular';
import split from 'lodash/split';
import some from 'lodash/some';

import template from './choose-file.template.html';
import './choose-file.scss';

class chooseFileController {
  constructor(exerciseService, $scope, $state) {
    this.exerciseService = exerciseService;
    this.$scope = $scope;
    this.$state = $state;
    this.errorLines = [];
  }

  applyScope() {
    this.$scope.$apply();
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
      const fileText = evt.target.result;
      const numLines = split(fileText, '\n').length;

      // Check that all the error lines are smaller than the number of lines in the file
      if (some(this.errorLines, (line => line > numLines || line <= 0))) {
        this.chooseFileForm.errorLines.$setValidity('out-of-range', false);
        this.submitted = false;
        this.applyScope(true);
        return;
      }

      const createId = this.exerciseService.softCreateExercise(this.name, fileText);
      this.$state.go('addexercise', { id: createId });
      this.save();
    };
    reader.onerror = this.showError.bind(this);
  }

  showError() {
    this.errorMessage = 'Error Reading File';
    this.submitted = false;
  }
}

chooseFileController.$inject = ['ExerciseService', '$scope', '$state'];

angular.module('debugapp')
  .component('chooseFile', {
    template,
    controller: chooseFileController,
    bindings: {
      cancel: '&',
      save: '&',
    },
  });
