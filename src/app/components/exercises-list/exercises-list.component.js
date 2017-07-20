import angular from 'angular';

import template from './exercises-list.template.html';

class exercisesListController {
  // constructor() {
  // }

}

exercisesListController.$inject = [];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {},
  });
