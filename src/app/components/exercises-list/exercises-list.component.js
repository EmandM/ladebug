import angular from 'angular';
import some from 'lodash/some';
import forEach from 'lodash/forEach';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;

    this.averageStats = [];
  }

  $onInit() {
    if (!this.exerciseList) {
      this.loadExercises();
    }

    this.editState = (this.isAdmin) ? 'editexercise' : 'debugexisting';
  }

  $onChanges(changesObj) {
    if (changesObj.exerciseList) {
      this.checkExercisesExist();
    }
  }

  loadExercises() {
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
        // response always 'true' and an object even if empty (is not null)
        // therefore check to see if it contains exercises
        this.checkExercisesExist();
        return this.getScores();
      })
      .then((response) => {
        console.log(response);
        // response is the return getScore(); value
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getScores() {
    this.authService.getCurrentUserId()
      .then((userId) => {
        if (userId) {
          forEach(this.exerciseList, (exercise) => {
            console.log('exercise = ' + exercise);
          });
        }
      });
  }

  getExerciseLink(exercise) {
    return `${this.editState}({ id: ${exercise.id} })`;
  }

  showInfo(exerciseId, exerciseName, $event) {
    this.$mdDialog.show({
      template: `<exercise-stats exercise-id="${exerciseId}" exercise-name="${exerciseName}"></exercise-stats>`,
      targetEvent: $event,
      clickOutsideToClose: true,
    });
  }

  delete(exercise) {
    this.exercisesLoaded = false;
    this.exerciseService.deleteExercise(exercise.id)
      .then(() => this.loadExercises());
  }

  checkExercisesExist() {
    this.exercisesExist = some(this.exerciseList);
  }
}

exercisesListController.$inject = ['ExerciseService', '$state', '$mdDialog'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {
      isAdmin: '<',
      exercisesLoaded: '<',
      exerciseList: '<',
    },
  });
