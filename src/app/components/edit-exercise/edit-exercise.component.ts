import { StateService } from '@uirouter/core';
import * as angular from 'angular';
import { forEach, map } from 'lodash';
import { ITestCase } from '../../../types';
import { ExerciseService } from '../../services';
import { ICodeMirrorOptions, IExercise } from './../../../types/ladebug.types';

import './edit-exercise.scss';
import template from './edit-exercise.template.html';

class EditExerciseController {
  private errorLines: number[];
  private tests: ITestCase[];
  private opts: ICodeMirrorOptions;
  private exerciseId: string;
  private createId: string;
  private create: boolean;
  private codeString: string;
  private name: string;
  private description: string;
  private entryFunction: string;
  private exerciseLoaded: boolean;
  private editor: CodeMirror.Doc;
  private codeEntryForm: angular.IFormController;
  private submitted: boolean;

  constructor(private exerciseService: ExerciseService, private $state: StateService,
    private $mdToast: angular.material.IToastService) {
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

  public async $onInit() {
    if (!this.exerciseId) {
      this.create = true;
      this.getCreateInfo();
      return;
    }

    const exercise = await this.exerciseService.getOutputById(this.exerciseId);
    forEach(exercise, (fieldValue, fieldName) => {
      this[fieldName] = fieldValue;
    });
    this.exerciseLoaded = true;
  }

  public $onDestroy() {
    this.$mdToast.hide();
  }

  public getCreateInfo() {
    if (!this.createId) {
      return;
    }

    const softCreate = this.exerciseService.getSoftCreate(this.createId);
    if (!softCreate) {
      this.$state.go('admin');
      return;
    }

    this.codeString = softCreate.codeString;
    this.name = softCreate.name;
  }

  public codeMirrorLoaded(editor: CodeMirror.Doc) {
    this.editor = editor;
  }

  public getLineCount() {
    return this.editor.lineCount();
  }

  public async submit() {
    const errorString = this.getErrorMessage();
    if (errorString) {
      this.showErrorToast(errorString);
      return;
    }

    let testCases;
    this.submitted = true;
    try {
      const tests = await this.exerciseService.validateTests(this.tests);
      testCases = tests;
      const hasError = await this.codeHasError(this.codeString, this.entryFunction, testCases);
      if (!hasError) {
        this.showErrorToast('Please ensure your code throws an exception');
        this.submitted = false;
        return;
      }
      const data: IExercise = {
        id: this.exerciseId || this.createId,
        name: this.name,
        description: this.description,
        codeString: this.codeString,
        errorLines: this.errorLines,
        entryFunction: this.entryFunction,
        testCases,
      };

      if (this.create) {
        await this.exerciseService.createExercise(data);
      } else {
        await this.exerciseService.updateExercise(this.exerciseId, data);
      }
      this.$state.go('admin');
    } catch (err) {
      if (err.invalidTypes) {
        this.showErrorToast('Invalid Test\n' + err.message);
      }
      this.submitted = false;
    }
  }

  public async codeHasError(codeString: string, entryFunction: string, testCases: ITestCase[]): Promise<boolean> {
    return !!(await this.exerciseService.runSandbox(codeString, entryFunction, testCases)).error;
  }

  public showErrorToast(errorMessage: string) {
    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent(errorMessage)
        .action('OK')
        .highlightAction(true)
        .highlightClass('md-accent')
        .hideDelay(5000),
    );
  }

  public addTest() {
    this.tests.push({
      input: '',
      expectedOutput: '',
    });
  }
  public removeTest(index: number) {
    this.tests.splice(index, 1);
  }

  private getErrorMessage(): string {
    if (!this.codeString) {
      return 'Some code is required';
    }
    if (this.tests.length <= 0) {
      return 'A test case is required';
    }
    if (!this.codeEntryForm.$valid) {
      return 'The form is invalid';
    }
    return '';
  }
}

EditExerciseController.$inject = ['ExerciseService', '$state', '$mdToast'];

angular.module('debugapp')
  .component('editExercise', {
    template,
    controller: EditExerciseController,
    bindings: {
      exerciseId: '@',
      createId: '@',
    },
  });
