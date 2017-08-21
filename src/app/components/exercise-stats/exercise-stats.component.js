import angular from 'angular';

import template from './exercise-stats.template.html';
import './exercise-stats.scss';

class exerciseStatsController {
  constructor($mdDialog) {
    this.$mdDialog = $mdDialog;
  }

  close() {
    this.$mdDialog.cancel();
  }
}

exerciseStatsController.$inject = ['$mdDialog'];

angular.module('debugapp')
  .component('exerciseStats', {
    template,
    controller: exerciseStatsController,
    bindings: {
      exerciseName: '<',
      statistics: '<', // Object containing all stats for display
    },
  });
