import angular from 'angular';
import some from 'lodash/some';
import forEach from 'lodash/forEach';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, authService, scoresService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.authService = authService;
    this.scoresService = scoresService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
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
        if (this.exercisesExist) {
          this.getUserScores();
        }
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getUserScores() {
    return this.authService.getCurrentUserId()
      .then(userId => this.scoresService.getAllScores(userId))
      .then((response) => {
        const exerciseScores = [];
        forEach(response, (exerciseScore) => {
          exerciseScores[exerciseScore.exerciseId] = parseInt(exerciseScore.stars, 10);
        });
        forEach(this.exerciseList, (exercise) => {
          exercise.score = exerciseScores[exercise.id];
        });
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

exercisesListController.$inject = ['ExerciseService', 'AuthService',
  'ScoresService', '$state', '$mdDialog'];

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
