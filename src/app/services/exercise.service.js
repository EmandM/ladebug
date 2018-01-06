import angular from 'angular';
import find from 'lodash/find';
import map from 'lodash/map';
import GuidHelper from '../helpers/guid.helper';

class ExerciseService {
  constructor(restangular, $q) {
    this.restangular = restangular;
    this.$q = $q;

    this.JsonResponses = {};
    this.filesUploaded = {};
    this.exerciseList = undefined;
  }

  runSandbox(pythonString, entryFunction, testCases, outputId) {
    const testCaseJson = JSON.stringify(testCases);
    return this.restangular.one('get-output').customPOST({
      codeString: pythonString,
      entryFunction,
      testCases: testCaseJson,
    }).then((response) => {
      const responseId = GuidHelper.createGuid();
      const cachedOutput = {
        id: outputId || responseId,
        debugInfo: JSON.parse(response.data),
      };
      cachedOutput.error = this.getErrorMessage(cachedOutput.debugInfo.trace);
      this.JsonResponses[responseId] = cachedOutput;
      return cachedOutput;
    });
  }

  getErrorMessage(codeTrace) {
    const errorTrace = find(codeTrace, 'exception_msg');
    return (errorTrace) ? errorTrace.exception_msg : undefined;
  }

  getOutputById(id) {
    return (id in this.JsonResponses) ?
      this.$q.when(this.JsonResponses[id]) :
      this.getExerciseById(id);
  }

  getExerciseById(id) {
    let output;
    return this.restangular.one('exercise', id).get()
      .then((response) => {
        output = JSON.parse(response.data);

        // Parse debugInfo as it is saved in the server as a string
        output.testCases = JSON.parse(output.test_cases);

        if (output.bug_lines) {
          output.errorLines = JSON.parse(output.bug_lines);
        } else if (output.bug_line) {
          output.errorLines = [output.bug_line];
        }
        this.JsonResponses[id] = output;
        return this.runSandbox(output.code_string, output.entry_function, output.testCases, id);
      })
      .then((sandboxOutput) => {
        output.debugInfo = sandboxOutput.debugInfo;
        return output;
      });
  }

  deleteExercise(id) {
    this.clearExerciseListCache();
    return this.restangular.one('exercise', id).remove();
  }

  getAllExercises() {
    return (this.exerciseList) ?
      this.$q.when(this.exerciseList) :
      this.restangular.one('exercises-list').get()
        .then((response) => {
          this.exerciseList = JSON.parse(response.data);
          return this.exerciseList;
        });
  }

  // Format data for sending to server
  getExerciseObj(data) {
    const bugLines = `[${data.errorLines.toString()}]`;
    return {
      name: data.name,
      description: data.description,
      codeString: data.codeString,
      errorLines: bugLines,
      entryFunction: data.entryFunction,
      testCases: JSON.stringify(data.testCases),
    };
  }

  createExercise(data) {
    this.clearExerciseListCache();
    return this.restangular.one('exercise').customPUT(this.getExerciseObj(data));
  }

  updateExercise(id, data) {
    this.clearExerciseListCache();
    this.clearExerciseOutputCache(id);
    return this.restangular.one('exercise', id).customPOST(this.getExerciseObj(data));
  }

  validateTests(tests) {
    const testCases = map(tests, (testCase) => {
      const input = testCase.input;
      const expectedOutput = testCase.expectedOutput;
      return {
        input,
        expected_output: expectedOutput,
      };
    });

    return this.restangular.one('validate-tests').customPOST({ testCases: JSON.stringify(testCases) })
      .then((response) => {
        if (response.valid) {
          return JSON.parse(response.data);
        }
        return this.$q.reject({ invalidTypes: true, message: response.error });
      });
  }

  softCreateExercise(name, codeString) {
    const id = GuidHelper.createGuid();
    this.filesUploaded[id] = {
      name,
      codeString,
    };
    return id;
  }

  getSoftCreate(id) {
    return this.filesUploaded[id];
  }

  clearExerciseListCache() {
    delete this.exerciseList;
  }

  clearExerciseOutputCache(exerciseId) {
    delete this.JsonResponses[exerciseId];
  }
}

ExerciseService.$inject = ['Restangular', '$q'];

angular.module('debugapp')
  .service('ExerciseService', ExerciseService);
