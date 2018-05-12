// Add service files here
import './exercise.service';
import './scores.service';
import './stats.service';

import * as angular from 'angular';
import AuthService from './auth.service';

angular.module('debugapp')
  .service('AuthService', AuthService);
