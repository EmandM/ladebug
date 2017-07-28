import angular from 'angular';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(conversionService) {
    this.conversionService = conversionService;
    
    this.exerciseList = {};
  }

  $onInit() {
    this.conversionService.getAllExercises()
      .then((response) => {
        this.exerciseList = response;
        if (this.exerciseList.length == 0) {
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

exercisesListController.$inject = ['ConversionService', '$state'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {},
  });
