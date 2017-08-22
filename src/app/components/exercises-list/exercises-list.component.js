import angular from 'angular';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, statsService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.statsService = statsService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    if (!this.exerciseList) {
      this.loadExercises();
    }

    this.editState = (this.isAdmin) ? 'editexercise' : 'debugexisting';
  }

  loadExercises() {
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
        // response always 'true' and an object even if empty (is not null)
        // therefore check to see if it contains exercises
        for (const key in this.exerciseList) {
          this.exercisesExist = true;
          break;
        }
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getExerciseLink(exercise) {
    return `${this.editState}({ id: ${exercise.id} })`;
  }

  showInfo(exerciseId, $event) {
    this.statsService.getExerciseStatsById(exerciseId)
      .then((response) => {
        this.allExerciseStats = response;
      });

    // TODO calculate stats
    // for stats in this.allExerciseStats
    // add to totals of each stat (stored in statsObj)
    // numExerciseStats++
    // end for
    // divide all totals in statsObj by numExerciseStats++

    const statsObj = null;

    this.$mdDialog.show({
      template: '<exercise-stats statistics="$ctrl.statistics"></exercise-stats>',
      targetEvent: $event,
      controller: [function () {
        this.statistics = statsObj;
      }],
      controllerAs: '$ctrl',
    });
  }

  delete(exercise) {
    this.exercisesLoaded = false;
    this.exerciseService.deleteExercise(exercise.id)
      .then(() => this.loadExercises());
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
      exercisesExist: '<',
      exerciseList: '<',
    },
  });
