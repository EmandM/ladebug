import angular from 'angular';
import './exercises-list.scss';

import template from './exercises-list.template.html';

class exercisesListController {
  constructor(conversionService) {
    this.conversionService = conversionService;
    
    this.exerciseList = {};

    this.testData = {};
    for( var i = 0; i < 3; i++) {
      var name = "exercise " + i.toString();
      var data = "json code " + i.toString();
      this.testData[i] = {
        "name": name,
        "data": data
     };
    }
  }

  $onInit() {
    this.conversionService.getAllExercises()
      .then((response) => {
        this.exerciseList = response;
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
