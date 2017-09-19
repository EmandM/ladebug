import angular from 'angular';
import some from 'lodash/some';
import forEach from 'lodash/forEach';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, authService, scoresService, $state, $mdDialog, $scope) {
    this.exerciseService = exerciseService;
    this.authService = authService;
    this.scoresService = scoresService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;

    this.authService.checkSignedIn()
      .then((response) => { this.signedIn = response; });
    this.authServiceKey = 'exercise-list';
    this.authService.addOnSignIn(this.authServiceKey, this.onSignIn.bind(this));
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

  $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  onSignIn(isSignIn) {
    this.signedIn = isSignIn;
    if (!isSignIn) {
      this.scoresLoaded = true;
      this.$scope.$apply();
      return;
    }
    this.getUserScores().then(() => this.$scope.$apply());
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
    if (this.isAdmin) {
      return false;
    }
    this.scoresLoaded = false;
    return this.authService.getCurrentUserId()
      .then(userId => this.scoresService.getAllScores(userId))
      .then((response) => {
        const exerciseScores = {};
        forEach(response, (exerciseScore) => {
          exerciseScores[exerciseScore.exerciseId] = parseInt(exerciseScore.stars, 10);
        });
        forEach(this.exerciseList, (exercise) => {
          exercise.score = exerciseScores[exercise.id] || 0;
        });
        this.scoresLoaded = true;
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
  'ScoresService', '$state', '$mdDialog', '$scope'];

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
