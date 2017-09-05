import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  constructor(exerciseService, $state, $mdDialog, $mdToast) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    };
  }

  submit() {
    if (this.code) {
      this.submitted = true;
      this.exerciseService.runSandbox(this.code)
        .then((response) => {
          this.$state.go('debugsandbox', { outputID: response.id });
        })
        .catch(() => {
          this.submitted = false;
        });
    } 
    if (!this.submitted) {
      this.$mdToast.show(
        this.$mdToast.simple()
          .textContent('Please enter some code to debug')
          .action('OK')
          .highlightAction(true)
          .highlightClass('md-accent')
          .hideDelay(3000),
      );
    }
  }

  exit($event) {
    this.$mdDialog.show(
      this.$mdDialog.confirm()
        .title('Are you sure you want to exit?')
        .textContent('Your code will not be saved.')
        .ariaLabel('Exit sandbox?')
        .targetEvent($event)
        .ok('Yes')
        .cancel('Cancel')
    ).then(() => {
      this.$state.go('home');
    });
  }
}

sandboxController.$inject = ['ExerciseService', '$state', '$mdDialog', '$mdToast'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
