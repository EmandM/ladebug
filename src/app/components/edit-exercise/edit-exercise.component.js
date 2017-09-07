import angular from 'angular';
import template from './edit-exercise.template.html';
import './edit-exercise.scss';

class editExerciseController {
  constructor(exerciseService, $state, $mdDialog, $q) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$q = $q;

    this.errorLines = [];

    this.opts = {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'python',
    };
  }

  $onInit() {
    if (!this.exerciseId) {
      this.create = true;
      this.getCreateInfo();
      return;
    }

    this.exerciseService.getOutputById(this.exerciseId)
      .then((response) => {
        this.code = response.debugInfo.code;
        this.name = response.name;
        this.errorLines = response.errorLines;
        this.description = response.description;
        this.exerciseLoaded = true;
      });
  }

  getCreateInfo() {
    if (!this.createId) {
      return;
    }

    const softCreate = this.exerciseService.getSoftCreate(this.createId);
    if (!softCreate) {
      this.$state.go('admin');
      return;
    }

    this.code = softCreate.codeString;
    this.name = softCreate.name;
  }

  codeMirrorLoaded(editor) {
    this.editor = editor;
  }

  getLineCount() {
    return this.editor.lineCount();
  }

  submit($event) {
    if (!this.code) {
      this.errorMessage = 'Some code is required';
      return;
    }

    if (!this.codeEntryForm.$valid) {
      return;
    }

    this.submitted = true;
    this.codeHasError(this.code)
      .then((hasError) => {
        if (!hasError) {
          this.showNoErrorDialog($event);
          this.submitted = false;
          return;
        }
        const data = {
          name: this.name,
          description: this.description,
          codeString: this.code,
          errorLines: this.errorLines,
        };
        const promise = (this.create) ?
          this.exerciseService.createExercise(data) :
          this.exerciseService.updateExercise(this.exerciseId, data);
        promise.then(() => this.$state.go('admin'));
      })
      .catch(() => {
        this.submitted = false;
      });
  }

  codeHasError(codeString) {
    return this.exerciseService.runSandbox(codeString)
      .then(response => response.error);
  }

  showNoErrorDialog($event) {
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Error')
        .textContent('Please ensure your code throws an exception.')
        .ariaLabel('Error alert')
        .ok('OK')
        .targetEvent($event),
    );
  }
}

editExerciseController.$inject = ['ExerciseService', '$state', '$mdDialog', '$q'];

angular.module('debugapp')
  .component('editExercise', {
    template,
    controller: editExerciseController,
    bindings: {
      exerciseId: '@',
      createId: '@',
    },
  });
