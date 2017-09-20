import angular from 'angular';
import parseInt from 'lodash/parseInt';
import FormatTime from '../../helpers/format-time.helper';

import template from './complete-exercise.template.html';
import './complete-exercise.scss';

class completeExerciseController {
  constructor($mdDialog, authService, $timeout) {
    this.$mdDialog = $mdDialog;
    this.$timeout = $timeout;
    this.authService = authService;

    this.authService.checkSignedIn()
      .then(this.onSignIn.bind(this));

    if (!this.signedIn) {
      this.renderSignInButton();
    }
  }

  $onInit() {
    this.numScore = parseInt(this.score);
    this.time = FormatTime.msToHumanReadable(parseInt(this.completeTime));
  }

  $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  close() {
    this.$mdDialog.cancel();
  }

  renderSignInButton() {
    this.authServiceKey = 'complete-exercise';
    this.authService.addOnSignIn(this.authServiceKey, this.onSignIn.bind(this));

    this.$timeout(() => {
      this.authService.renderSignInButton('modalSignIn');
    }, 0);
  }

  onSignIn(isSignedIn) {
    this.signedIn = isSignedIn;
  }
}

completeExerciseController.$inject = ['$mdDialog', 'AuthService', '$timeout'];

angular.module('debugapp')
  .component('completeExercise', {
    template,
    controller: completeExerciseController,
    bindings: {
      completeTime: '@',
      score: '@',
    },
  });
