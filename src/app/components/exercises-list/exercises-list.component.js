import angular from 'angular';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, $state) {
    this.exerciseService = exerciseService;
    this.$state = $state;
  }

  $onInit() {
    if (!this.exerciseList) {
      this.loadExercises();
    }
    this.editState = (this.isAdmin) ? 'editexercise' : 'debugexisting';
  }

  loadExercises() {
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getExerciseLink(exercise) {
    return this.$state.href(this.editState, { id: exercise.id });
  }

}

exercisesListController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {
      isAdmin: '<',
      exercisesLoaded: '<',
      exerciseList: '<'
    },
  });
