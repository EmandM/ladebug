import angular from 'angular';
import './exercises-list.scss';

import template from './exercises-list.template.html';

class exercisesListController {
  constructor(conversionService) {
    this.conversionService = conversionService;
    
    this.exerciseList = {};
  }

  $onInit() {
    this.conversionService.getAllExercises()
      .then((response) => {
        this.exerciseList = response;
        console.log(this.exerciseList);
        if (this.exerciseList.length == 0) {
          document.getElementById("exercisesTitle").innerHTML = "There are currently no available exercises.";
        }
      });
  }

}

exercisesListController.$inject = ['ConversionService'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {},
  });
