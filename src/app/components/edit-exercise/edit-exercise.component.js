import angular from 'angular';
import template from './edit-exercise.template.html';
import './edit-exercise.scss';

class editExerciseController {
  constructor(exerciseService, $state) {
    this.exerciseService = exerciseService;
    this.$state = $state;

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    }
  }
}

editExerciseController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('editExercise', {
    template,
    controller: editExerciseController,
    bindings: {},
  });
