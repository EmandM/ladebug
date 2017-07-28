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
        console.log(this.exerciseList);
        if (this.exerciseList.length === 0) {
          // ng-show can be used in html to show things based on a variable (ng-show="this.exercises.length === 0") :D
          document.getElementById("exercisesTitle").innerHTML = "There are currently no available exercises.";
        }
      });
  }

  getExerciseById(id) {
    this.conversionService.getOutputById(id)
      .then((response) => {
        this.$state.go('debug', { outputID: response[_id] })
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
