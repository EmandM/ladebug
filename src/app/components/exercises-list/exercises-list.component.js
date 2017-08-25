import angular from 'angular';
import some from 'lodash/some';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, statsService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.statsService = statsService;
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
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getExerciseLink(exercise) {
    return `${this.editState}({ id: ${exercise.id} })`;
  }

  showInfo(exerciseId, exerciseName, $event) {
    this.statsService.getExerciseStatsById(exerciseId)
      .then((response) => {
        this.averageStats = response;
      });

    const averageStatsObj = this.averageStats;
    this.$mdDialog.show({
      template: '<exercise-stats statistics="$ctrl.statistics" exerciseName="$ctrl.exerciseName"></exercise-stats>',
      targetEvent: $event,
      controller: [function () {
        this.exerciseName = exerciseName;
        this.statistics = averageStatsObj;
      }],
      controllerAs: '$ctrl',
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

exercisesListController.$inject = ['ExerciseService', 'StatsService', '$state', '$mdDialog'];

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
