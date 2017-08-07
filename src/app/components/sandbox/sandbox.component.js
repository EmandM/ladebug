import angular from 'angular';

import template from './sandbox.template.html';
import './sandbox.scss';

class sandboxController {
  constructor(exerciseService, $state) {
    this.exerciseService = exerciseService;
    this.$state = $state;

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    };
  }

  submit() {
    this.submitted = true;
    this.exerciseService.postRequest(this.code)
      .then((response) => {
        this.$state.go('debugsandbox', { outputID: response.id });
      })
      .catch(() => {
        this.submitted = false;
      });
  }
}

sandboxController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: sandboxController,
    bindings: {},
  });
