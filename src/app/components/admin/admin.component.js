import angular from 'angular';

import template from './admin.template.html';
import './admin.scss';

class adminController {
  constructor(exerciseService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.exerciseList = [];

    this.loadExercises();
  }

  loadExercises() {
    this.exercisesLoaded = false;
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  addNew($event) {
    this.$mdDialog.show({
      template: `<add-exercise></add-exercise>`,
      targetEvent: $event,
    }).then(() => this.loadExercises());
  }
}

adminController.$inject = ['ExerciseService', '$state', '$mdDialog'];

angular.module('debugapp')
  .component('admin', {
    template,
    controller: adminController,
    bindings: {},
  });
