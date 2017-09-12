import angular from 'angular';
import template from './edit-exercise.template.html';
import './edit-exercise.scss';

class editExerciseController {
  constructor(exerciseService, $state, $mdToast, $q) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdToast = $mdToast;
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

  submit() {
    if (!this.code) {
      this.showErrorToast('Some code is required');
      return;
    }

    if (!this.codeEntryForm.$valid) {
      return;
    }

    this.submitted = true;
    this.codeHasError(this.code)
      .then((hasError) => {
        if (!hasError) {
          this.showErrorToast('Please ensure your code throws an exception');
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

  showErrorToast(errorMessage) {
    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent(errorMessage)
        .action('OK')
        .highlightAction(true)
        .highlightClass('md-accent')
        .hideDelay(5000),
    );
  }
}

editExerciseController.$inject = ['ExerciseService', '$state', '$mdToast', '$q'];

angular.module('debugapp')
  .component('editExercise', {
    template,
    controller: editExerciseController,
    bindings: {
      exerciseId: '@',
      createId: '@',
    },
  });
