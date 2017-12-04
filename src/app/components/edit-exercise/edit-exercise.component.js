import angular from 'angular';
import map from 'lodash/map';
import template from './edit-exercise.template.html';
import './edit-exercise.scss';

class editExerciseController {
  constructor(exerciseService, $state, $mdToast, $q) {
    this.exerciseService = exerciseService;
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.$q = $q;

    this.errorLines = [];

    this.tests = [{
      input: '',
      expectedOutput: '',
    }];

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
        this.code = response.code_string;
        this.name = response.name;
        this.errorLines = response.errorLines;
        this.description = response.description;
        this.exerciseLoaded = true;
        this.entryFunction = response.entry_function;
        this.tests = map(response.testCases, (testCase) => {
          const input = testCase.input;
          const expectedOutput = testCase.expected_output;
          return { input, expectedOutput };
        });
      });
  }

  $onDestroy() {
    this.$mdToast.hide();
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
    if (this.tests.length <= 0) {
      this.showErrorToast('A test case is required');
      return;
    }

    if (!this.codeEntryForm.$valid) {
      return;
    }
    let testCases;
    this.submitted = true;
    this.exerciseService.validateTests(this.tests)
      .then((tests) => {
        testCases = tests;
        return this.codeHasError(this.code, this.entryFunction, testCases);
      })
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
          entryFunction: this.entryFunction,
          testCases,
        };
        const promise = (this.create) ?
          this.exerciseService.createExercise(data) :
          this.exerciseService.updateExercise(this.exerciseId, data);
        promise.then(() => this.$state.go('admin'));
      })
      .catch((err) => {
        if (err.invalidTypes) {
          this.showErrorToast('Invalid Test\n' + err.message);
        }
        this.submitted = false;
      });
  }

  codeHasError(codeString, entryFunction, testCases) {
    return this.exerciseService.runSandbox(codeString, entryFunction, testCases)
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

  addTest() {
    this.tests.push({
      input: '',
      expectedOutput: '',
    });
  }
  removeTest(index) {
    this.tests.splice(index, 1);
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
