import angular from 'angular';

import template from './admin.template.html';
import './admin.scss';

class adminController {
  constructor(exerciseService, $state) {
    this.exerciseService = exerciseService;
    this.$state = $state;


    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exerciseList = response;
      });
  }
}

adminController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('admin', {
    template,
    controller: adminController,
    bindings: {},
  });
