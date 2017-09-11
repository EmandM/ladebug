import angular from 'angular';

import template from './exercise-stats.template.html';
import './exercise-stats.scss';

class exerciseStatsController {
  constructor(statsService, $mdDialog) {
    this.statsService = statsService;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.statsService.getExerciseStatsById(this.exerciseId)
      .then((response) => {
        if (response) {
          this.averageStats = response;
          this.statsExist = true;
        }
      });
  }

  close() {
    this.$mdDialog.cancel();
  }
}

exerciseStatsController.$inject = ['StatsService', '$mdDialog'];

angular.module('debugapp')
  .component('exerciseStats', {
    template,
    controller: exerciseStatsController,
    bindings: {
      exerciseId: '@',
      exerciseName: '@',
    },
  });
