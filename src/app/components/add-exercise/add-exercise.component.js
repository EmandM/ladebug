import angular from 'angular';

import template from './add-exercise.template.html';
import './add-exercise.scss';

class addExerciseController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }

  chooseFile() {
    this.choosingFile = true;
  }

  undo() {
    this.choosingFile = false;
  }

  close() {
    this.$mdDialog.cancel();
  }

  save() {
    this.$mdDialog.hide();
  }
}

addExerciseController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('addExercise', {
    template,
    controller: addExerciseController,
    bindings: {},
  });
