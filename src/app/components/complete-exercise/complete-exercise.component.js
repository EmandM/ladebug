import angular from 'angular';
import parseInt from 'lodash/parseInt';
import FormatTime from '../../helpers/format-time.helper';

import template from './complete-exercise.template.html';
import './complete-exercise.scss';

class completeExerciseController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.numScore = parseInt(this.score);
    this.time = FormatTime.msToHumanReadable(parseInt(this.completeTime));
  }

  close() {
    this.$mdDialog.cancel();
  }
}

completeExerciseController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('completeExercise', {
    template,
    controller: completeExerciseController,
    bindings: {
      completeTime: '@',
      score: '@',
    },
  });
