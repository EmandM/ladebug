import angular from 'angular';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService) {
    this.exerciseService = exerciseService;
    
    this.exerciseList = {};

    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exerciseList = response;
      });
  }

}

exercisesListController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {},
  });
