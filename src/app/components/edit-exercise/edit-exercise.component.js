import angular from 'angular';
import template from './edit-exercise.template.html';
import './edit-exercise.scss';

class editExerciseController {
  constructor(exerciseService, $state) {
    this.exerciseService = exerciseService;
    this.$state = $state;

    this.errorLines = [];

    this.opts = {
      lineNumbers: true,
      lineWrapping: false,
      mode: 'python',
    };
  }

  $onInit() {
    if (!this.exerciseId) {
      this.create = true;
      return;
    }

    this.exerciseService.getOutputById(this.exerciseId)
      .then((response) => {
        this.code = response.debugInfo.code;
        this.name = response.name;
        this.errorLines = response.errorLines;
        this.exerciseLoaded = true;
      });
  }

  codeMirrorLoaded(editor) {
    this.editor = editor;
  }

  getLineCount() {
    return this.editor.lineCount();
  }

  submit() {
    if (!this.code) {
      this.errorMessage = 'Some code is required';
      return;
    }

    if (!this.codeEntryForm.$valid) {
      return;
    }
    this.submitted = true;
    const promise = (this.create) ?
      this.exerciseService.createExercise(this.name, this.code, this.errorLines) :
      this.exerciseService.updateExercise(this.exerciseId, this.name, this.code, this.errorLines);

    promise.then(() => {
      this.$state.go('admin');
    }).catch(() => {
      this.submitted = false;
    });
  }
}
editExerciseController.$inject = ['ExerciseService', '$state'];

angular.module('debugapp')
  .component('editExercise', {
    template,
    controller: editExerciseController,
    bindings: {
      exerciseId: '@',
    },
  });
