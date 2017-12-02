import angular from 'angular';
import isString from 'lodash/isString';
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
          const input = this.stringify(testCase.input, testCase.input_type);
          const expectedOutput = this.stringify(testCase.expected_output, testCase.output_type);
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

    const testCases = map(this.tests, (testCase) => {
      const input = testCase.input;
      const expectedOutput = testCase.expectedOutput;
      return {
        input,
        expected_output: expectedOutput,
      };
    });

    this.submitted = true;
    this.codeHasError(this.code, this.entryFunction, testCases)
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
      .catch(() => {
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

  parseString(arg) {
    // check length is 2 or greater, and that the outer two characters are matching quote characters
    if (arg.length > 1 &&
      ((arg.substr(0, 1) === '"' && arg.substr(arg.length - 1, arg.length) === '"') ||
      (arg.substr(0, 1) === "'" && arg.substr(arg.length - 1, arg.length) === "'"))) {
      return arg.substr(1, arg.length - 2);
    }
    return JSON.parse(arg);
  }

  stringify(arg) {
    return isString(arg) ? `'${arg}'` : arg;
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
