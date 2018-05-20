import * as angular from 'angular';
// Add service files here
import AuthService from './auth.service';
import ExerciseService from './exercise.service';
import ScoresService from './scores.service';
import StatsService from './stats.service';

angular.module('debugapp')
  .service('AuthService', AuthService)
  .service('ExerciseService', ExerciseService)
  .service('ScoresService', ScoresService)
  .service('StatsService', StatsService);

export { AuthService, ExerciseService, ScoresService, StatsService };
