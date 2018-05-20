import * as angular from 'angular';
import { StatsService } from '../../services';
import { IAverageStats } from './../../../types/ladebug.types';

import './exercise-stats.scss';
import template from './exercise-stats.template.html';

class ExerciseStatsController {
  private exerciseId: string;
  private averageStats: IAverageStats;
  private statsExist: boolean;

  constructor(private statsService: StatsService, private $mdDialog: angular.material.IDialogService) {}

  public async $onInit() {
    const response = await this.statsService.getExerciseStatsById(this.exerciseId);
    this.statsExist = !!response;
    if (this.statsExist) {
      this.averageStats = response;
    }
  }

  public close() {
    this.$mdDialog.cancel();
  }
}

ExerciseStatsController.$inject = ['StatsService', '$mdDialog'];

angular.module('debugapp')
  .component('exerciseStats', {
    template,
    controller: ExerciseStatsController,
    bindings: {
      exerciseId: '@',
      exerciseName: '@',
    },
  });
