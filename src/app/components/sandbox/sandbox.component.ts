import { StateService } from '@uirouter/angularjs';
import * as angular from 'angular';
import { ExerciseService } from '../../services';

import './sandbox.scss';
import template from './sandbox.template.html';

class SandboxController {
  private opts: {
    lineNumbers: boolean;
    lineWrapping: boolean;
    mode: string;
  };
  private outputId: string;
  private code: string;
  private codeLoaded: boolean;
  private submitted: boolean;

  constructor(private exerciseService: ExerciseService, private $state: StateService,
    private $mdDialog: angular.material.IDialogService, private $mdToast: angular.material.IToastService) {

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    };
  }

  public $onInit() {
    if (!this.outputId) {
      return;
    }
    this.exerciseService.getOutputById(this.outputId)
      .then((response) => {
        this.code = response.debugInfo.code;
        this.codeLoaded = true;
      });
  }

  public $onDestroy() {
    this.$mdToast.hide();
  }

  public async submit() {
    this.submitted = false;
    if (this.code) {
      this.submitted = true;
      try {
        const response = await this.exerciseService.runSandbox(this.code);
        this.$state.go('debugsandbox', { outputID: response.id });
      } catch (err) {
        this.submitted = false;
      }
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

  public async exit($event: MouseEvent) {
    await this.$mdDialog.show(
      this.$mdDialog.confirm()
        .title('Are you sure you want to exit?')
        .textContent('Your code will not be saved.')
        .ariaLabel('Exit sandbox?')
        .targetEvent($event)
        .ok('Yes')
        .cancel('Cancel'),
    );

    this.$state.go('home');
  }
}

SandboxController.$inject = ['ExerciseService', '$state', '$mdDialog', '$mdToast'];

angular.module('debugapp')
  .component('sandbox', {
    template,
    controller: SandboxController,
    bindings: {
      outputId: '@',
    },
  });
